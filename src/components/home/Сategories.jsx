import { useState } from "react";
import styles from "../../style/Home/Categories.module.css";

const categories = [
  "Юридичні послуги",
  "Фінанси",
  "Бухгалтерія",
  "Маркетинг",
  "Продажі",
  "IT та розробка",
  "Дизайн",
  "Логістика",
  "Будівництво",
  "Нерухомість",
  "Освіта",
  "Консалтинг",
  "HR",
  "Виробництво",
  "Медицина",
  "E-commerce",
];

export default function Categories() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="container" aria-label="Напрями роботи й бізнесу">
      <div className={styles.slider}>
        <div className={styles.viewport} id="business-categories" tabIndex={0}>
          <div className={styles.track} data-paused={paused}>
            <ul className={styles.list} role="list">
              {categories.map((category) => <li key={category}>{category}</li>)}
            </ul>
            <ul className={`${styles.list} ${styles.repeat}`} aria-hidden="true">
              {categories.map((category) => <li key={category}>{category}</li>)}
            </ul>
          </div>
        </div>
        <button
          type="button"
          className={styles.toggle}
          aria-label={paused ? "Продовжити гортання напрямів" : "Призупинити гортання напрямів"}
          aria-controls="business-categories"
          onClick={() => setPaused(!paused)}
        >
          <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
        </button>
      </div>
    </section>
  );
}
