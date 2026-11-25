import { useRef, useState } from "react";
import CardSlider from "../shared/CardSlider";
import styles from "../../style/Home/NetworkPeople.module.css";
import anna from "../../img/people/anna.jpg";
import dmytro from "../../img/people/dmytro.jpg";
import olena from "../../img/people/olena.jpg";
import maksym from "../../img/people/maksym.jpg";

const people = [
  {
    id: "anna",
    name: "Анна Коваль",
    role: "Product Designer",
    city: "Торонто",
    image: anna,
    skills: ["Figma", "Fintech"],
    pitch: "Пропоную дизайн фінтех-продуктів командам у Торонто.",
    bio: "Проєктує цифрові продукти для фінтеху. Допомагає командам перевіряти ідеї на прототипах і створювати зрозумілі інтерфейси.",
  },
  {
    id: "dmytro",
    name: "Дмитро Мельник",
    role: "Backend Engineer",
    city: "Берлін",
    image: dmytro,
    skills: ["Node.js", "AWS"],
    pitch: "Шукаю співпрацю з продуктовою командою в Берліні над API та хмарною інфраструктурою.",
    bio: "Розробляє API та серверну частину продуктів. Працює з Node.js і допомагає командам розгортати сервіси в AWS.",
  },
  {
    id: "olena",
    name: "Олена Савчук",
    role: "Project Manager",
    city: "Київ",
    image: olena,
    skills: ["Agile", "SaaS"],
    pitch: "Пропоную супровід запуску SaaS-продуктів командам у Києві.",
    bio: "Координує роботу команд над SaaS-продуктами. Допомагає узгоджувати пріоритети й планувати запуск нових функцій.",
  },
  {
    id: "maksym",
    name: "Максим Руденко",
    role: "Sales Lead",
    city: "Ванкувер",
    image: maksym,
    skills: ["B2B", "Growth"],
    pitch: "Шукаю партнерів у Ванкувері для розвитку B2B-продажів.",
    bio: "Розвиває B2B-продажі й допомагає командам виходити на нові ринки, знаходити клієнтів і будувати відносини з партнерами.",
  },
];

function PersonCard({ person }) {
  const profileRef = useRef(null);
  const messageRef = useRef(null);
  const titleId = `network-person-${person.id}`;
  const messageTitleId = `message-person-${person.id}`;
  const storageKey = `bn-message-draft-${person.id}`;
  const [draft, setDraft] = useState(() => {
    try {
      return localStorage.getItem(storageKey) ?? "";
    } catch {
      return "";
    }
  });
  const [notice, setNotice] = useState("");

  function saveDraft(event) {
    event.preventDefault();
    try {
      localStorage.setItem(storageKey, draft);
      setNotice("Чернетку збережено в цьому браузері.");
    } catch {
      setNotice("Чернетка доступна, поки відкрита ця сторінка.");
    }
  }

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.open}
        aria-label={`Відкрити профіль — ${person.name}`}
        aria-haspopup="dialog"
        onClick={() => profileRef.current.showModal()}
      />
      <img className={styles.portrait} src={person.image} alt="" loading="lazy" decoding="async" />
      <div className={styles.details}>
        <h3>{person.name}</h3>
        <p className={styles.meta}><span lang="en">{person.role}</span> · {person.city}</p>
        <p className={styles.pitch}>{person.pitch}</p>
        <ul className={styles.skills} aria-label="Навички" role="list">
          {person.skills.map((skill) => <li key={skill}>{skill}</li>)}
        </ul>
        <button
          type="button"
          className={styles.write}
          aria-label={`Написати: ${person.name}`}
          aria-haspopup="dialog"
          onClick={() => messageRef.current.showModal()}
        >
          Написати
        </button>
      </div>

      <dialog className={styles.dialog} ref={profileRef} aria-labelledby={titleId}>
        <form className={styles.closeForm} method="dialog">
          <button type="submit" className={styles.close} aria-label="Закрити профіль">×</button>
        </form>
        <h3 id={titleId}>{person.name}</h3>
        <p className={styles.meta}><span lang="en">{person.role}</span> · {person.city}</p>
        <p className={styles.bio}>{person.bio}</p>
      </dialog>

      <dialog className={styles.dialog} ref={messageRef} aria-labelledby={messageTitleId}>
        <form className={styles.closeForm} method="dialog">
          <button type="submit" className={styles.close} aria-label="Закрити чернетку">×</button>
        </form>
        <h3 id={messageTitleId}>Написати: {person.name}</h3>
        <p className={styles.bio}>Для демонстраційного профілю можна зберегти чернетку в цьому браузері.</p>
        <form className={styles.messageForm} onSubmit={saveDraft}>
          <label>
            Повідомлення
            <textarea
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setNotice("");
              }}
              rows={4}
              maxLength={600}
              required
            />
          </label>
          <button className={styles.save} type="submit" disabled={!draft.trim()}>Зберегти чернетку</button>
          <p className={styles.notice} role="status">{notice}</p>
        </form>
      </dialog>
    </article>
  );
}

export default function NetworkPeople() {
  return (
    <section className={`${styles.section} container`} aria-labelledby="network-people-title">
      <CardSlider
        id="network-people-track"
        previousLabel="Попередній профіль"
        nextLabel="Наступний профіль"
        heading={
          <>
            <h2 id="network-people-title">Знайомтеся: люди з мережі</h2>
            <p className={styles.intro}>
              Перегляньте, яку співпрацю шукають або пропонують фахівці з різних міст.
            </p>
          </>
        }
      >
        {people.map((person) => <PersonCard key={person.id} person={person} />)}
      </CardSlider>
    </section>
  );
}
