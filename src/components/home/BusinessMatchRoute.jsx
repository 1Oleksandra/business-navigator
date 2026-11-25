import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../style/Home/BusinessMatchRoute.module.css";

const steps = [
  {
    label: "Знайомство",
    title: "Дивіться, хто поруч",
    description: "Знайдіть компанії та фахівців у своєму місті або в новій для вас локації.",
    link: { label: "Переглянути міста", href: "/#world-cities-title" },
  },
  {
    label: "Збіг",
    title: "Знайдіть збіг",
    description: "Порівняйте інтереси, цілі та бажаний формат співпраці, щоб знайти людину для спільного проєкту.",
    link: { label: "Подивитися приклад Match", href: "#collaboration-title" },
  },
  {
    label: "Розмова",
    title: "Почніть розмову",
    description: "Збережіть контакт, напишіть напряму й запропонуйте перший крок до спільного проєкту.",
    link: { label: "Переглянути фахівців", href: "/#network-people-title" },
  },
];

export default function BusinessMatchRoute() {
  const [activeIndex, setActiveIndex] = useState(0);
  const firstStopRef = useRef(null);
  const step = steps[activeIndex];
  const isLastStep = activeIndex === steps.length - 1;

  function startRoute() {
    setActiveIndex(0);
    firstStopRef.current.focus();
  }

  return (
    <section className={`${styles.route} container`} aria-labelledby="match-route-title">
      <div className={styles.intro}>
        <h2 id="match-route-title">Від знайомства до спільної справи</h2>
        <p>
          BusinessNavigator допомагає знайти людей і компанії поруч,
          побачити спільні інтереси та перейти до розмови.
        </p>
        <button type="button" className={styles.start} onClick={startRoute}>
          Почати з Business Match
        </button>
      </div>

      <div className={styles.map}>
        <nav className={styles.stops} aria-label="Кроки Business Match">
          <ol style={{ "--progress": `${activeIndex / (steps.length - 1) * 100}%` }}>
            {steps.map(({ label }, index) => (
              <li key={label}>
                <button
                  type="button"
                  ref={index === 0 ? firstStopRef : null}
                  className={styles.stop}
                  aria-current={index === activeIndex ? "step" : undefined}
                  aria-controls="match-route-step"
                  data-reached={index <= activeIndex}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className={styles.marker}>{index + 1}</span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div id="match-route-step" className={styles.stepPanel} aria-live="polite" aria-atomic="true">
          <div key={step.label} className={styles.stepContent}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            {step.link && (
              <Link className={styles.stepLink} to={step.link.href}>{step.link.label}</Link>
            )}
          </div>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.back}
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex(activeIndex - 1)}
          >
            Назад
          </button>
          <button
            type="button"
            className={styles.next}
            onClick={() => setActiveIndex(isLastStep ? 0 : activeIndex + 1)}
          >
            {isLastStep ? "Почати спочатку" : "Далі"}
          </button>
        </div>
      </div>
    </section>
  );
}
