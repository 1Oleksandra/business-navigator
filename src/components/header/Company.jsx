import styles from "../../style/Home/Company.module.css";
import forbes from "../../img/partners/forbes.jpg";
import sense from "../../img/partners/sense.png";
import vidi from "../../img/partners/vidi.svg";
import ciklum from "../../img/partners/ciklum.svg";
import ajax from "../../img/partners/ajax.jpg";
import mirs from "../../img/partners/mirs.svg";
import kse from "../../img/partners/kse.svg";

const partners = [
  { name: "Forbes", logo: forbes },
  { name: "Sense Bank", logo: sense, format: "square" },
  { name: "VIDI", logo: vidi, format: "square" },
  { name: "SO VA" },
  { name: "TABURET" },
  { name: "Ciklum", logo: ciklum },
  { name: "Ajax Systems", logo: ajax },
  { name: "MHP" },
  { name: "MIRS", logo: mirs },
  { name: "KSE", logo: kse, format: "light" },
];

export default function Company() {
  return (
    <section className={`${styles.partners} container`} aria-labelledby="partners-title">
      <div className={styles.panel}>
        <h2 id="partners-title">Компанії та бренди</h2>
        <ul className={styles.grid} role="list">
          {partners.map(({ name, logo, format }) => (
            <li key={name} className={styles.card}>
              {logo ? (
                <img className={styles.logo} data-format={format} src={logo} alt={name} loading="lazy" decoding="async" />
              ) : (
                <span className={styles.name}>{name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
