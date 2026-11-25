import { useRef } from "react";
import CardSlider from "../shared/CardSlider";
import styles from "../../style/Home/WorldCities.module.css";
import kyiv from "../../img/cities/kyiv.jpg";
import warsaw from "../../img/cities/warsaw.jpg";
import toronto from "../../img/cities/toronto.jpg";
import berlin from "../../img/cities/berlin.jpg";

const commons = "https://commons.wikimedia.org/wiki/File:";
const shareAlike = { label: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" };

const cities = [
  {
    id: "kyiv",
    name: "Київ",
    country: "Україна",
    image: kyiv,
    focus: ["Робота", "Товари", "Партнерства"],
    description: "Пошукайте нову команду, виконавця для проєкту або місцевого виробника.",
    photographer: "Віктор Полянко",
    photoFile: "Kyiv_-_Landscape_with_Dnipro.jpg",
    license: shareAlike,
  },
  {
    id: "warsaw",
    name: "Варшава",
    country: "Польща",
    image: warsaw,
    focus: ["Кар’єра", "Послуги", "Співпраця"],
    description: "Знайдіть фахівця для роботи в Польщі, запропонуйте свої послуги або познайомтеся з потенційними партнерами.",
    photographer: "Quintin Soloviev",
    photoFile: "Warsaw_skyline.jpg",
    license: { label: "CC BY 4.0", href: "https://creativecommons.org/licenses/by/4.0/" },
  },
  {
    id: "toronto",
    name: "Торонто",
    country: "Канада",
    image: toronto,
    focus: ["Робота", "Послуги", "Нові ринки"],
    description: "Шукайте роботу, знайомтеся з фахівцями та перевіряйте, кому може бути цікава ваша пропозиція в Канаді.",
    photographer: "TheWxResearcher",
    photoFile: "Toronto_Skyline_viewed_from_Centre_Island.jpg",
    license: { label: "CC0 1.0", href: "https://creativecommons.org/publicdomain/zero/1.0/" },
  },
  {
    id: "berlin",
    name: "Берлін",
    country: "Німеччина",
    image: berlin,
    focus: ["Стартапи", "Товари", "Співпраця"],
    description: "Пошукайте команду для спільного продукту, запропонуйте свій товар або знайдіть виконавця.",
    photographer: "Malis",
    photoFile: "Brandenburger_Tor_in_Berlin.jpg",
    license: { label: "Суспільне надбання" },
  },
];

const destinations = [
  { label: "Вакансії", href: "#top-jobs-title" },
  { label: "Товари й послуги", href: "#products-services-title" },
  { label: "Співпраця", href: "#match-route-title" },
];

function CityCard({ city }) {
  const dialogRef = useRef(null);
  const titleId = `city-${city.id}-title`;

  return (
    <article className={styles.card} data-city={city.id}>
      <button
        type="button"
        className={styles.cityButton}
        aria-haspopup="dialog"
        aria-label={`Дослідити місто ${city.name}`}
        onClick={() => dialogRef.current.showModal()}
      >
        <img src={city.image} alt="" className={styles.photo} loading="lazy" decoding="async" />
        <span className={styles.cityContent}>
          <span className={styles.country}>{city.country}</span>
          <span className={styles.cityName}>{city.name}</span>
          <span className={styles.focus}>{city.focus.join(" · ")}</span>
          <span className={styles.explore}>Дослідити місто</span>
        </span>
      </button>
      <dialog className={styles.dialog} ref={dialogRef} aria-labelledby={titleId}>
        <form className={styles.closeForm} method="dialog">
          <button type="submit" className={styles.close} aria-label="Закрити профіль міста">×</button>
        </form>
        <p className={styles.dialogCountry}>{city.country}</p>
        <h3 id={titleId}>{city.name}</h3>
        <p className={styles.description}>{city.description}</p>
        <nav className={styles.links} aria-label="Розділи BusinessNavigator">
          {destinations.map(({ label, href }) => (
            <a key={href} href={href} onClick={() => dialogRef.current.close()}>{label}</a>
          ))}
        </nav>
        <p className={styles.credit}>
          Фото: <a href={commons + city.photoFile}>{city.photographer}</a>
          {" · "}
          {city.license.href ? <a href={city.license.href}>{city.license.label}</a> : city.license.label}
          {" · кадрування для картки"}
        </p>
      </dialog>
    </article>
  );
}

export default function WorldCities() {
  return (
    <section className={`${styles.section} container`} aria-labelledby="world-cities-title">
      <CardSlider
        id="world-cities-track"
        previousLabel="Попереднє місто"
        nextLabel="Наступне місто"
        heading={
          <>
            <h2 id="world-cities-title">Можливості в будь-якому куточку світу</h2>
            <p className={styles.intro}>
              Знаходьте роботу, товари, послуги та людей для спільних проєктів.
              Оберіть місто, з якого хочете почати.
            </p>
          </>
        }
      >
        {cities.map((city) => <CityCard key={city.id} city={city} />)}
      </CardSlider>
    </section>
  );
}
