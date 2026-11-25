import { useRef, useState } from "react";
import styles from "../../style/Home/ProductsServices.module.css";

const storageKey = "business-navigator-offers";
const offerTypes = { product: "Товар", service: "Послуга" };

const examples = [
  { id: "example-1", type: "product", name: "Пакування для інтернет-магазинів", description: "Картонні коробки та паперові пакети для відправлень." },
  { id: "example-2", type: "service", name: "Дизайн сайту", description: "Прототип і дизайн сторінок для малого бізнесу." },
  { id: "example-3", type: "service", name: "Бухгалтерський супровід ФОП", description: "Допомога з обліком, податками та звітністю." },
];

function readOffers() {
  try {
    const offers = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(offers) ? offers : [];
  } catch {
    return [];
  }
}

export default function ProductsServices() {
  const addDialog = useRef(null);
  const catalogDialog = useRef(null);
  const [offers, setOffers] = useState(readOffers);
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("");
  const visibleOffers = [...offers, ...examples].filter(
    (offer) => filter === "all" || offer.type === filter,
  );

  function addOffer(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get("name").trim();
    const description = data.get("description").trim();

    if (!name || !description) {
      const field = form.elements.namedItem(name ? "description" : "name");
      field.setCustomValidity("Введіть текст.");
      field.reportValidity();
      return;
    }

    const offer = { id: crypto.randomUUID?.() ?? String(Date.now()) + Math.random(), type: data.get("type"), name, description };
    const updatedOffers = [offer, ...offers];
    setOffers(updatedOffers);
    setFilter("all");

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedOffers));
      setStatus(`«${name}» додано до добірки в цьому браузері.`);
    } catch {
      setStatus(`«${name}» додано до добірки до перезавантаження сторінки.`);
    }

    form.reset();
    addDialog.current.close();
  }

  return (
    <section className={`${styles.section} container`} aria-labelledby="products-services-title">
      <h2 id="products-services-title">Товар / Послуга</h2>

      <div className={styles.grid}>
        <article className={`${styles.card} ${styles.addCard}`}>
          <div className={styles.illustration} aria-hidden="true">
            <span className={`${styles.illustrationObject} ${styles.parcel}`} />
            <span className={styles.illustrationBadge}>+</span>
          </div>
          <h3>Запропонуйте своє</h3>
          <p>Розкажіть про товар, який виробляєте, або послугу, яку надаєте.</p>
          <button type="button" className={styles.action} onClick={() => addDialog.current.showModal()}>
            Додати товар / послугу
          </button>
        </article>

        <article className={`${styles.card} ${styles.chooseCard}`}>
          <div className={styles.illustration} aria-hidden="true">
            <span className={`${styles.illustrationObject} ${styles.bag}`} />
            <span className={`${styles.illustrationBadge} ${styles.search}`} />
          </div>
          <h3>Знайдіть потрібне</h3>
          <p>Перегляньте пропозиції й оберіть товар або послугу для своєї справи.</p>
          <button type="button" className={styles.action} onClick={() => catalogDialog.current.showModal()}>
            Вибрати товар / послугу
          </button>
        </article>
      </div>

      <p className={styles.status} role="status">{status}</p>

      <dialog ref={addDialog} className={styles.dialog} aria-labelledby="add-offer-title">
        <form className={styles.closeForm} method="dialog">
          <button type="submit" className={styles.close} aria-label="Закрити форму">×</button>
        </form>
        <h3 id="add-offer-title">Додати товар / послугу</h3>
        <p className={styles.dialogIntro}>Ваша пропозиція зберігатиметься в цьому браузері.</p>
        <form className={styles.fields} onSubmit={addOffer}>
          <label>
            Тип пропозиції
            <select name="type">
              <option value="product">Товар</option>
              <option value="service">Послуга</option>
            </select>
          </label>
          <label>
            Назва
            <input name="name" required maxLength={80} onInput={(event) => event.currentTarget.setCustomValidity("")} />
          </label>
          <label>
            Короткий опис
            <textarea name="description" required rows={3} maxLength={280} onInput={(event) => event.currentTarget.setCustomValidity("")} />
          </label>
          <button className={styles.action} type="submit">Додати до добірки</button>
        </form>
      </dialog>

      <dialog ref={catalogDialog} className={styles.dialog} aria-labelledby="offers-catalog-title">
        <form className={styles.closeForm} method="dialog">
          <button type="submit" className={styles.close} aria-label="Закрити добірку">×</button>
        </form>
        <h3 id="offers-catalog-title">Вибрати товар / послугу</h3>
        <p className={styles.dialogIntro}>Тут є приклади та пропозиції, які ви додали в цьому браузері.</p>
        <div className={styles.fields}>
          <label>
            Показати
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">Усі пропозиції</option>
              <option value="product">Товари</option>
              <option value="service">Послуги</option>
            </select>
          </label>
        </div>
        <ul className={styles.offers} role="list">
          {visibleOffers.map((offer) => (
            <li key={offer.id} className={styles.offer}>
              <span>{offerTypes[offer.type]}</span>
              <h4>{offer.name}</h4>
              <p>{offer.description}</p>
            </li>
          ))}
        </ul>
      </dialog>
    </section>
  );
}
