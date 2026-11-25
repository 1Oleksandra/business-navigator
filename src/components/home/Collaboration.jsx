import styles from "../../style/Home/Collaboration.module.css";
import { useEffect, useRef, useState } from "react";

import developerPhoto from "../../img/жінка.jpg";
import designerPhoto from "../../img/жінка2.jpeg";

const specialists = [
  {
    name: "Олена",
    role: "Frontend Developer",
    photo: developerPhoto,
    description: "Шукаю дизайнера, щоб разом створити кабінет користувача для SaaS-платформи.",
    skills: ["React", "TypeScript"],
  },
  {
    name: "Марія",
    role: "UI/UX Designer",
    photo: designerPhoto,
    description: "Проєктую вебінтерфейси й дизайн-системи. Маю понад 5 років досвіду.",
    skills: ["Figma", "Design Systems"],
  },
];

export default function Collaboration() {
  const matchRef = useRef(null);
  const [matchVisible, setMatchVisible] = useState(false);

  useEffect(() => {
    const match = matchRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setMatchVisible(true);
        observer.disconnect();
      }
    });

    observer.observe(match);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`${styles.collaboration} container`} aria-labelledby="collaboration-title">
      <div className={styles.scene}>
        <div className={styles.heading}>
          <h2 id="collaboration-title">Знайдіть свій Business Match</h2>
          <p>
            Опишіть, кого шукаєте, і знайдіть фахівця для спільного проєкту.
          </p>
        </div>

        <div className={styles.cards}>
          {specialists.map((specialist) => (
            <article key={specialist.role} className={styles.card}>
              <img className={styles.image} src={specialist.photo} alt="" loading="lazy" />
              <div className={styles.profile}>
                <h3>{specialist.name}</h3>
                <p className={styles.role}>{specialist.role}</p>
                <p className={styles.description}>{specialist.description}</p>
                <ul className={styles.skills} aria-label="Навички" role="list">
                  {specialist.skills.map((skill) => <li key={skill}>{skill}</li>)}
                </ul>
              </div>
            </article>
          ))}

          <div ref={matchRef} className={styles.match} data-visible={matchVisible}>
            <span className={styles.matchBadge} lang="en">
              <span className={styles.sparkle} aria-hidden="true">✦</span>
              Match!
            </span>
          </div>
        </div>
        <p className={styles.outcome}>Олена й Марія об’єдналися, щоб створити кабінет користувача.</p>
        <a className={styles.guide} href="#match-route-title">Як працює Business Match</a>
      </div>
    </section>
  );
}
