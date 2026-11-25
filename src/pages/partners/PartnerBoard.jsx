import { useCallback, useEffect, useRef, useState } from "react";
import { listingTypes, workFormats } from "../../../shared/partners.js";
import styles from "./PartnerBoard.module.css";

const initialFilters = { type: "", city: "", skill: "", format: "" };
const dateFormat = new Intl.DateTimeFormat("uk-UA", { dateStyle: "medium", timeStyle: "short" });

async function requestBoard(path = "", data) {
  const response = await fetch(`/api/partners${path}`, data && {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error("Сервіс співпраці недоступний. Спробуйте пізніше.");
  }
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Не вдалося завершити дію.");
  return result;
}

function Options({ values }) {
  return Object.entries(values).map(([value, label]) => <option key={value} value={value}>{label}</option>);
}

function Filter({ label, value, onChange, children }) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Усі</option>
        {children}
      </select>
    </label>
  );
}

function Dialog({ dialogRef, id, title, children }) {
  return (
    <dialog className={styles.dialog} ref={dialogRef} aria-labelledby={id}>
      <form className={styles.closeForm} method="dialog">
        <button className={styles.close} type="submit" aria-label="Закрити">×</button>
      </form>
      <h3 id={id}>{title}</h3>
      {children}
    </dialog>
  );
}

function ListingCard({ post, onWrite }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.type} data-type={post.type}>{listingTypes[post.type]}</span>
        {post.example && <span className={styles.meta}>Приклад</span>}
        {post.own && <span className={styles.meta}>Ваше оголошення</span>}
      </div>
      <h3>{post.title}</h3>
      <p className={styles.meta}>{post.city} · {workFormats[post.format]}</p>
      <p className={styles.description}>{post.description}</p>
      <ul className={styles.skills} aria-label="Навички" role="list">
        {post.skills.map((skill) => <li key={skill}>{skill}</li>)}
      </ul>
      <div className={styles.cardBottom}>
        <span>{post.author}</span>
        {!(post.example || post.own) && (
          <button type="button" className={styles.action} onClick={() => onWrite(post)}>
            Написати автору
          </button>
        )}
      </div>
    </article>
  );
}

export default function PartnerBoard() {
  const [board, setBoard] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);
  const [compose, setCompose] = useState(null);
  const refreshVersion = useRef(0);
  const publishRef = useRef(null);
  const messageRef = useRef(null);
  const inboxRef = useRef(null);

  const refresh = useCallback(async () => {
    const version = ++refreshVersion.current;
    try {
      const data = await requestBoard();
      if (version === refreshVersion.current) {
        setBoard(data);
        setLoadError("");
      }
    } catch (error) {
      if (version === refreshVersion.current) setLoadError(error.message);
    }
  }, []);

  useEffect(() => {
    const pendingRefresh = window.setTimeout(refresh, 0);
    return () => window.clearTimeout(pendingRefresh);
  }, [refresh]);

  const posts = board?.posts ?? [];
  const inbox = board?.inbox ?? [];
  const cities = [...new Set(posts.map((post) => post.city))].sort((a, b) => a.localeCompare(b, "uk"));
  const skills = [...new Set(posts.flatMap((post) => post.skills))].sort((a, b) => a.localeCompare(b, "uk"));
  const visible = posts.filter((post) =>
    (!filters.type || post.type === filters.type)
    && (!filters.city || post.city === filters.city)
    && (!filters.skill || post.skills.includes(filters.skill))
    && (!filters.format || post.format === filters.format));

  function setFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function open(dialogRef) {
    setFormError("");
    dialogRef.current.showModal();
  }

  function writeTo(post) {
    setCompose({ id: `post-${post.id}`, target: { postId: post.id }, title: post.title, name: post.author });
    open(messageRef);
  }

  function replyTo(message) {
    inboxRef.current.close();
    setCompose({ id: `reply-${message.id}`, target: { replyTo: message.id }, title: message.title, name: message.senderName });
    open(messageRef);
  }

  async function submit(event, path, dialogRef) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const isPublishing = path === "/posts";
    setFormError("");
    setSending(true);
    try {
      const result = await requestBoard(path, isPublishing ? data : { ...data, ...compose.target });
      refreshVersion.current += 1;
      setBoard(result);
      setLoadError("");
      if (isPublishing) setFilters(initialFilters);
      form.reset();
      setNotice(isPublishing ? "Оголошення опубліковано." : "Повідомлення надіслано.");
      dialogRef.current.close();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className={`${styles.board} container`} aria-labelledby="partner-board-title">
      <div className={styles.heading}>
        <h2 id="partner-board-title">Оголошення про співпрацю</h2>
        <div className={styles.actions}>
          <button type="button" className={styles.action} onClick={() => open(publishRef)}>Додати оголошення</button>
          <button type="button" className={styles.secondary} onClick={() => {
            open(inboxRef);
            refresh();
          }}>Вхідні{inbox.length > 0 && ` (${inbox.length})`}</button>
        </div>
      </div>
      <div className={styles.filters} role="group" aria-label="Фільтри оголошень">
        <Filter label="Тип співпраці" value={filters.type} onChange={(value) => setFilter("type", value)}>
          <Options values={listingTypes} />
        </Filter>
        <Filter label="Місто" value={filters.city} onChange={(value) => setFilter("city", value)}>
          {cities.map((city) => <option key={city}>{city}</option>)}
        </Filter>
        <Filter label="Навичка" value={filters.skill} onChange={(value) => setFilter("skill", value)}>
          {skills.map((skill) => <option key={skill}>{skill}</option>)}
        </Filter>
        <Filter label="Формат роботи" value={filters.format} onChange={(value) => setFilter("format", value)}>
          <Options values={workFormats} />
        </Filter>
      </div>

      <p className={styles.notice} role="status">{notice}</p>
      {loadError && (
        <div className={styles.empty}>
          <p role="alert">{loadError}</p>
          <button type="button" className={styles.secondary} onClick={refresh}>Спробувати ще раз</button>
        </div>
      )}
      {!loadError && !board && <p className={styles.empty} role="status">Завантажуємо оголошення…</p>}
      {board && visible.length === 0 && (
        <div className={styles.empty}>
          <p>За вибраними фільтрами оголошень немає.</p>
          <button type="button" className={styles.secondary} onClick={() => setFilters(initialFilters)}>Скинути фільтри</button>
        </div>
      )}
      <div className={styles.grid}>
        {visible.map((post) => <ListingCard key={post.id} post={post} onWrite={writeTo} />)}
      </div>

      <Dialog dialogRef={publishRef} id="partner-publish-title" title="Додати оголошення">
        <p className={styles.meta}>Повідомлення надійдуть у «Вхідні» цього браузера.</p>
        <form className={styles.fields} onSubmit={(event) => submit(event, "/posts", publishRef)}>
          <label>Тип співпраці<select name="type"><Options values={listingTypes} /></select></label>
          <label>Ваше ім’я або назва команди<input name="author" maxLength={64} required /></label>
          <label>Назва оголошення<input name="title" maxLength={100} required /></label>
          <div className={styles.fieldPair}>
            <label>Місто<input name="city" maxLength={64} required /></label>
            <label>Формат роботи<select name="format"><Options values={workFormats} /></select></label>
          </div>
          <label>Навички через кому<input name="skills" maxLength={180} placeholder="Наприклад, Figma, UI/UX" required /></label>
          <label>Короткий опис<textarea name="description" rows={4} maxLength={700} required /></label>
          {formError && <p className={styles.error} role="alert">{formError}</p>}
          <button className={styles.action} type="submit" disabled={sending}>{sending ? "Публікуємо…" : "Опублікувати"}</button>
        </form>
      </Dialog>

      <Dialog dialogRef={messageRef} id="partner-message-title" title="Написати повідомлення">
        {compose && <p className={styles.meta}>{compose.name} · {compose.title}</p>}
        <form key={compose?.id} className={styles.fields} onSubmit={(event) => submit(event, "/messages", messageRef)}>
          <label>Ваше ім’я<input name="senderName" maxLength={64} required /></label>
          <label>Повідомлення<textarea name="body" rows={5} maxLength={1200} required /></label>
          {formError && <p className={styles.error} role="alert">{formError}</p>}
          <button className={styles.action} type="submit" disabled={sending}>{sending ? "Надсилаємо…" : "Надіслати"}</button>
        </form>
      </Dialog>

      <Dialog dialogRef={inboxRef} id="partner-inbox-title" title="Вхідні повідомлення">
        <div className={styles.inboxHeader}>
          <p className={styles.meta}>Вхідні доступні в браузері, з якого ви опублікували оголошення або написали автору.</p>
          <button type="button" className={styles.secondary} onClick={refresh}>Оновити</button>
        </div>
        {loadError && <p className={styles.error} role="alert">{loadError}</p>}
        {!loadError && inbox.length === 0 && <p className={styles.empty}>Поки що повідомлень немає.</p>}
        <ul className={styles.inbox} role="list">
          {inbox.map((message) => (
            <li key={message.id}>
              <strong>{message.senderName}</strong>
              <p className={styles.meta}>{message.title} · {dateFormat.format(new Date(message.createdAt))}</p>
              <p className={styles.description}>{message.body}</p>
              <button type="button" className={styles.secondary} onClick={() => replyTo(message)}>Відповісти</button>
            </li>
          ))}
        </ul>
      </Dialog>
    </section>
  );
}