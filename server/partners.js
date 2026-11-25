import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { listingTypes, workFormats } from "../shared/partners.js";

const prefix = "/api/partners";
const cookieName = "bn_partners_session";
const examples = [
  ["seeking", "Команда SaaS-проєкту", "Дизайнер для SaaS-платформи", "Берлін", "hybrid",
    "Шукаємо дизайнера, який допоможе спростити перші кроки в кабінеті користувача. Почнемо з прототипу та кількох інтерв’ю.", ["UI/UX", "Figma"]],
  ["offering", "Анна Коваль", "Дизайн для фінтех-команд", "Торонто", "remote",
    "Пропоную допомогу з прототипуванням, тестуванням гіпотез і дизайн-системою для фінтех-продукту.", ["Figma", "Fintech"]],
  ["seeking", "Команда освітнього проєкту", "Партнер для запуску освітнього сервісу", "Київ", "onsite",
    "Шукаємо технічного партнера для першої версії платформи онлайн-курсів. Готові поділитися результатами інтерв’ю з учнями.", ["React", "Node.js"]],
  ["offering", "Максим Руденко", "Допомога з виходом на ринок Канади", "Ванкувер", "remote",
    "Допоможу перевірити попит, скласти список потенційних клієнтів і підготуватися до перших B2B-переговорів.", ["B2B", "Продажі"]],
];

function apiError(status, message) {
  return Object.assign(new Error(message), { status });
}

function writeJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(data));
}

function getSession(request) {
  return request.headers.cookie?.match(/(?:^|;\s*)bn_partners_session=([a-f0-9]{64})(?:;|$)/)?.[1] ?? null;
}

function issueSession(request, response) {
  const token = randomBytes(32).toString("hex");
  const flags = request.socket.encrypted ? "; Secure" : "";
  response.setHeader("Set-Cookie", `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=31536000${flags}`);
  return token;
}

async function readJson(request) {
  if (request.headers["content-type"]?.split(";")[0] !== "application/json") {
    throw apiError(415, "Потрібен запит у форматі JSON.");
  }

  const chunks = [];
  let bytes = 0;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes <= 16000) chunks.push(chunk);
  }
  if (bytes > 16000) throw apiError(413, "Запит завеликий.");

  try {
    const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (value && typeof value === "object" && !Array.isArray(value)) return value;
  } catch {
    // Invalid JSON receives the same response as a non-object payload.
  }
  throw apiError(400, "Перевірте дані форми.");
}

function requiredText(value, label, maxLength) {
  const result = typeof value === "string" ? value.trim() : "";
  if (!result || result.length > maxLength) {
    throw apiError(400, `Поле «${label}» має містити від 1 до ${maxLength} символів.`);
  }
  return result;
}

function validateListing(input) {
  if (!Object.hasOwn(listingTypes, input.type) || !Object.hasOwn(workFormats, input.format)) {
    throw apiError(400, "Оберіть тип співпраці та формат роботи.");
  }

  const skills = requiredText(input.skills, "Навички", 180)
    .split(",").map((skill) => skill.trim()).filter(Boolean);
  if (!skills.length || skills.length > 8 || skills.some((skill) => skill.length > 32)) {
    throw apiError(400, "Вкажіть до 8 навичок, до 32 символів кожна.");
  }

  return [
    input.type,
    requiredText(input.author, "Ім’я або команда", 64),
    requiredText(input.title, "Назва", 100),
    requiredText(input.city, "Місто", 64),
    input.format,
    requiredText(input.description, "Опис", 700),
    JSON.stringify([...new Set(skills)]),
  ];
}

export function createPartnersApi(databasePath = process.env.BN_PARTNERS_DB || resolve(".data/partners.sqlite")) {
  if (databasePath !== ":memory:") mkdirSync(dirname(databasePath), { recursive: true });
  const db = new DatabaseSync(databasePath);
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS partner_posts (
      id INTEGER PRIMARY KEY,
      owner TEXT,
      example_key INTEGER UNIQUE,
      type TEXT NOT NULL,
      author TEXT NOT NULL,
      title TEXT NOT NULL,
      city TEXT NOT NULL,
      format TEXT NOT NULL,
      description TEXT NOT NULL,
      skills TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS partner_messages (
      id INTEGER PRIMARY KEY,
      post_id INTEGER NOT NULL REFERENCES partner_posts(id),
      sender TEXT NOT NULL,
      recipient TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS partner_messages_recipient ON partner_messages(recipient);
  `);

  const seed = db.prepare(`
    INSERT OR IGNORE INTO partner_posts
      (example_key, type, author, title, city, format, description, skills)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  examples.forEach(([type, author, title, city, format, description, skills], index) =>
    seed.run(index, type, author, title, city, format, description, JSON.stringify(skills)));

  const readPosts = db.prepare(`
    SELECT id, owner, type, author, title, city, format, description, skills
    FROM partner_posts ORDER BY owner IS NULL, id DESC
  `);
  const insertPost = db.prepare(`
    INSERT INTO partner_posts (owner, type, author, title, city, format, description, skills)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const postById = db.prepare("SELECT owner FROM partner_posts WHERE id = ?");
  const readInbox = db.prepare(`
    SELECT m.id, m.sender_name AS senderName, m.body, m.created_at AS createdAt, p.title
    FROM partner_messages m JOIN partner_posts p ON p.id = m.post_id
    WHERE m.recipient = ? ORDER BY m.id DESC
  `);
  const replyTarget = db.prepare("SELECT post_id AS postId, sender, recipient FROM partner_messages WHERE id = ?");
  const insertMessage = db.prepare(`
    INSERT INTO partner_messages (post_id, sender, recipient, sender_name, body, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  function snapshot(session) {
    const posts = readPosts.all().map(({ owner, skills, ...post }) => ({
      ...post,
      skills: JSON.parse(skills),
      example: owner === null,
      own: owner !== null && owner === session,
    }));
    return { posts, inbox: session ? readInbox.all(session) : [] };
  }

  async function handle(request, response, pathname) {
    let session = getSession(request);
    if (request.method === "GET" && pathname === prefix) {
      writeJson(response, 200, snapshot(session));
      return;
    }

    if (request.method === "POST" && pathname === `${prefix}/posts`) {
      const listing = validateListing(await readJson(request));
      session ??= issueSession(request, response);
      insertPost.run(session, ...listing);
      writeJson(response, 201, snapshot(session));
      return;
    }

    if (request.method === "POST" && pathname === `${prefix}/messages`) {
      const input = await readJson(request);
      const senderName = requiredText(input.senderName, "Ваше ім’я", 64);
      const body = requiredText(input.body, "Повідомлення", 1200);
      let postId;
      let recipient;

      if (Number.isSafeInteger(input.replyTo)) {
        const message = replyTarget.get(input.replyTo);
        if (!message || message.recipient !== session) {
          throw apiError(404, "Повідомлення не знайдено.");
        }
        ({ postId, sender: recipient } = message);
      } else {
        if (!Number.isSafeInteger(input.postId)) throw apiError(400, "Оберіть оголошення.");
        postId = input.postId;
        const post = postById.get(postId);
        if (!post?.owner) throw apiError(404, "Це оголошення не приймає повідомлень.");
        if (post.owner === session) throw apiError(400, "Ви є автором цього оголошення.");
        recipient = post.owner;
      }

      session ??= issueSession(request, response);
      insertMessage.run(postId, session, recipient, senderName, body, new Date().toISOString());
      writeJson(response, 201, snapshot(session));
      return;
    }

    throw apiError(404, "Сторінку не знайдено.");
  }

  function middleware(request, response, next) {
    const pathname = new URL(request.url, "http://localhost").pathname;
    if (pathname !== prefix && !pathname.startsWith(`${prefix}/`)) return next();
    handle(request, response, pathname).catch((error) => {
      if (!error.status) console.error(error);
      if (!response.headersSent && !response.destroyed) {
        writeJson(response, error.status ?? 500, {
          error: error.status ? error.message : "Спробуйте ще раз. Сервер не зміг завершити дію.",
        });
      }
    });
  }

  return { middleware, close: () => db.close() };
}