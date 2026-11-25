import { Link } from "react-router-dom";
import styles from "./SectionPage.module.css";

export default function SectionPage({ section, children }) {
  return (
    <div className={styles.page} style={{ "--section-color": section.color }}>
      <div className="container">
        <div className={styles.intro}>
          <Link className={styles.home} to="/">На головну</Link>
          <h1>{section.title}</h1>
          <p>{section.description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}