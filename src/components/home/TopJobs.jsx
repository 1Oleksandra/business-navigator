import styles from "../../style/Home/TopJobs.module.css";

const jobs = [
  {
    title: "Senior QA Automation Engineer",
    company: "Українська аутсорсинг компанія",
    description: "Шукаємо Operations Support Specialist, який/-а поєднає організаційні та аналітичні навички, уважність до деталей і здатність самостійно вирішувати операційні задачі.",
    tags: ["QA", "Remote"],
  },
  {
    title: "Project Manager",
    company: "Nova Venture",
    description: "міжнародна компанія та один із світових лідерів у сфері енергетичних технологій і автоматизації. Ми створюємо рішення, які допомагають підприємствам, будівлям, дата-центрам та інфраструктурі ефективніше й безпечніше використовувати енергію.",
    tags: ["PM", "Hybrid"],
  },
  {
    title: "Frontend Engineer React",
    company: "Astra",
    description: "компанія допомагає бізнесу працювати ефективніше, лідер у комплексних IT-рішеннях для бізнесу. Вже 27 років ми успішно працюємо на українському ринку, підтримуємо 37 200+ компаній і постійно розширюємось.",
    tags: ["React", "Remote"],
  },
  {
    title: "Business Development Manager",
    company: "UA Export Hub",
description: "міжнародна інноваційна біофармацевтична компанія, представлена у 100+ країнах. Наразі в ми пошуках IT-фахівця з досвідом підтримки Windows-користувачів і базовим системним адмініструванням.",
    tags: ["Sales", "English"],
  },
];

export default function TopJobs() {
  return (
    <section className={`${styles.jobs} container`}>
      <div className={styles.header}>
        <h2 id="top-jobs-title">ТОПОВІ ВАКАНСІЇ</h2>
        <p>
          Найкращі пропозиції для пошуку роботи, кар'єрного
          розвитку та нових можливостей.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.list}>
          {jobs.map((job, index) => (
            <article key={index} className={styles.job}>
              <h3>{job.title}</h3>

              <h4>{job.company}</h4>
              <p>{job.description}</p>

              <div className={styles.tags}>
                {job.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.resumeCard}>
            <span className={styles.actionTitle}>Знайти роботу</span>
            <span className={styles.actionDescription}>
              Перегляньте вакансії та знайдіть роботу, яка вам підходить.
            </span>
          </button>

          <button type="button" className={styles.vacancyCard}>
            <span className={styles.actionTitle}>Додай вакансію</span>
            <span className={styles.actionDescription}>
              Знайди свого ідеального співробітника.
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}