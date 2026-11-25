import { useRef } from "react";
import styles from "../../style/Home/UkrainianCompanies.module.css";

const companies = [
  {
    name: "Нова пошта",
    initials: "НП",
    category: "Логістика",
    city: "Київ",
    domain: "novaposhta.ua",
    tone: "peach",
    description: "Доставка посилок і вантажів Україною та за кордон.",
    profile: "Відправлення можна оформити через відділення, поштомат або кур’єра. На сайті можна розрахувати вартість доставки й відстежити посилку.",
  },
  {
    name: "monobank",
    initials: "mono",
    category: "Фінтех",
    city: "Київ",
    domain: "monobank.ua",
    tone: "lilac",
    description: "Мобільний банкінг для щоденних платежів, переказів і заощаджень.",
    profile: "У застосунку можна керувати картками, відкривати депозити та створювати «Банки» для заощаджень і зборів.",
  },
  {
    name: "ПриватБанк",
    initials: "ПБ",
    category: "Банк",
    city: "Київ",
    domain: "privatbank.ua",
    tone: "mint",
    description: "Банківські послуги для фізичних осіб і бізнесу.",
    profile: "Приват24 дає змогу керувати рахунками, оплачувати послуги та переказувати гроші онлайн.",
  },
  {
    name: "ROZETKA",
    initials: "RZ",
    category: "E-commerce",
    city: "Київ",
    domain: "rozetka.com.ua",
    tone: "mint",
    description: "Український інтернет-магазин і маркетплейс.",
    profile: "На платформі можна замовити електроніку, одяг, товари для дому та інші товари від ROZETKA й продавців маркетплейсу.",
  },
  {
    name: "Київстар",
    initials: "КС",
    category: "Телеком",
    city: "Київ",
    domain: "kyivstar.ua",
    tone: "blue",
    description: "Мобільний зв’язок і домашній інтернет по Україні.",
    profile: "Оператор пропонує мобільні тарифи, eSIM, домашній інтернет і послуги зв’язку для бізнесу.",
  },
  {
    name: "MacPaw",
    initials: "MP",
    category: "ПЗ",
    city: "Київ",
    domain: "macpaw.com",
    tone: "lilac",
    description: "Команда, що створює застосунки для Mac та iPhone.",
    profile: "Серед продуктів MacPaw — CleanMyMac для догляду за комп’ютером і Setapp, сервіс із добіркою застосунків за підпискою.",
  },
  {
    name: "Ajax Systems",
    initials: "AJ",
    category: "Безпека",
    city: "Київ",
    domain: "ajax.systems",
    path: "/ua/",
    tone: "yellow",
    description: "Розробник і виробник систем безпеки для дому та бізнесу.",
    profile: "Системи Ajax об’єднують хаби, бездротові датчики та застосунок. Наприклад, датчики можуть сповіщати про рух або відкриття дверей.",
  },
  {
    name: "Readdle",
    initials: "RD",
    category: "ПЗ",
    city: "Одеса",
    domain: "readdle.com",
    tone: "blue",
    description: "Застосунки для продуктивності на iPhone, iPad і Mac.",
    profile: "Readdle створює Spark для електронної пошти, PDF Expert для роботи з PDF та Documents для керування файлами.",
  },
];

function CompanyCard({ company }) {
  const dialogRef = useRef(null);
  const profileId = `company-profile-${company.domain}`;
  const website = `https://${company.domain}${company.path ?? "/"}`;

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.monogram} data-tone={company.tone} aria-hidden="true">
          {company.initials}
        </span>
        <span className={styles.category}>{company.category}</span>
      </div>

      <h3>{company.name}</h3>
      <p className={styles.city}>{company.city}</p>
      <p className={styles.description}>{company.description}</p>

      <div className={styles.cardFooter}>
        <a href={website} aria-label={`Сайт компанії ${company.name}`}>
          {company.domain}
        </a>
        <button
          type="button"
          aria-label={`Профіль компанії ${company.name}`}
          aria-haspopup="dialog"
          onClick={() => dialogRef.current.showModal()}
        >
          Профіль
        </button>
      </div>

      <dialog className={styles.dialog} ref={dialogRef} aria-labelledby={profileId}>
        <form method="dialog" className={styles.closeForm}>
          <button type="submit" aria-label="Закрити профіль">×</button>
        </form>
        <span className={styles.category}>{company.category}</span>
        <h3 id={profileId}>{company.name}</h3>
        <p className={styles.city}>{company.city}</p>
        <p className={styles.description}>{company.profile}</p>
        <a className={styles.website} href={website}>
          Відкрити сайт
        </a>
      </dialog>
    </article>
  );
}

export default function UkrainianCompanies() {
  return (
    <section className={`${styles.companies} container`} aria-labelledby="ukrainian-companies-title">
      <h2 id="ukrainian-companies-title">Українські компанії, якими пишаємося</h2>
      <p className={styles.intro}>
        Від логістики й банкінгу до технологій та електронної торгівлі.
        Знайомтеся з компаніями, чиїми продуктами й послугами користуються в Україні та за її межами.
      </p>

      <div className={styles.grid}>
        {companies.map((company) => <CompanyCard key={company.domain} company={company} />)}
      </div>
    </section>
  );
}
