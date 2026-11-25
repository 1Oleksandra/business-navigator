import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const footerLinks = [
  { label: "Вакансії", href: "#top-jobs-title" },
  { label: "Компанії", href: "#ukrainian-companies-title" },
  { label: "Business Match", href: "#match-route-title" },
  { label: "Товари й послуги", href: "#products-services-title" },
  { label: "Міста", href: "#world-cities-title" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.calloutWrap} container`}>
        <section className={styles.callout} aria-labelledby="footer-callout-title">
          <div>
            <h2 id="footer-callout-title">Створіть свій професійний простір</h2>
            <p>Знайдіть роботу, партнерів для спільного проєкту або запропонуйте свої товари й послуги.</p>
          </div>
          <div className={styles.actions}>
            <Link className={styles.primary} to="/#world-cities-title">Знайти можливості</Link>
            <Link className={styles.secondary} to="/#products-services-title">Додати пропозицію</Link>
          </div>
        </section>
      </div>

      <div className={styles.bottom}>
        <div className={`${styles.bottomContent} container`}>
          <p>BusinessNavigator — український професійний простір для кар’єри та співпраці.</p>
          <nav aria-label="Навігація у футері">
            <ul className={styles.links} role="list">
              {footerLinks.map(({ label, href }) => <li key={href}><Link to={"/" + href}>{label}</Link></li>)}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
