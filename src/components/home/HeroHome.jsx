import { Link } from "react-router-dom";
import { sections } from "../../pages/sections";
import styles from "../../style/Home/HeroHome.module.css";

export default function HeroHome() {
  return (
    <section id="about-platform" className={`${styles.hero} container`} aria-labelledby="hero-title">
      <h1 id="hero-title" className={styles.logo} aria-label="BusinessNavigator">BN</h1>
      <p className={styles.description}>
        Професійна мережа для роботи, бізнесу й співпраці по всьому{" "}
        <strong className={styles.emphasis}>світу</strong>.
      </p>

      <nav className={styles.actions} aria-label="Що можна зробити в BusinessNavigator">
        {sections.map(({ id, label, path, color }) => (
          <Link key={id} to={path} style={{ "--section-color": color }}>{label}</Link>
        ))}
      </nav>
    </section>
  );
}