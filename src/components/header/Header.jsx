import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SearchFilter from "./SearchFilter";
import styles from "./Header.module.css";

const categories = ["Категорія", "Партнер", "Працівник", "Кар’єра", "Товар", "Послуга"];
const countries = ["Країна", "Україна", "Туреччина", "Польща", "Німеччина", "США"];

const menuGroups = [
  {
    title: "Explore",
    items: [
      { label: "Люди", href: "#network-people-title" },
      { label: "Бізнеси", href: "#ukrainian-companies-title" },
      { label: "Мапа бізнесу", href: "#world-cities-title" },
    ],
  },
  {
    title: "Можливості",
    items: [
      { label: "Вакансії", href: "#top-jobs-title" },
      { label: "Стажування" },
      { label: "Погодинно / контракт" },
      { label: "Гранти" },
      { label: "Послуги", href: "#products-services-title" },
      { label: "Партнерства", href: "/partners" },
    ],
  },
  {
    title: "Стартапи",
    items: [
      { label: "Огляд" },
      { label: "Приєднатися до команди" },
      { label: "Інвестувати" },
    ],
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    function closeOnOutsideClick(event) {
      if (!menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        burgerRef.current.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header id="site-top" className={`${styles.header} container`}>
      <Link className={styles.logo} to="/" aria-label="BusinessNavigator — головна">BN</Link>

      <div className={styles.searchBar}>
        <input type="search" placeholder="Пошук…" aria-label="Пошук" className={styles.input} />
        <SearchFilter label="Категорія пошуку" options={categories} />
        <SearchFilter label="Країна" options={countries} />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.login}>Увійти</button>
        <button type="button" className={styles.register}>Реєстрація</button>
      </div>

      <div className={styles.menu} ref={menuRef}>
        <button
          type="button"
          className={styles.burger}
          ref={burgerRef}
          aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
          aria-expanded={menuOpen}
          aria-controls="header-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={styles.menuIcon} aria-hidden="true"><span /></span>
        </button>

        <nav id="header-navigation" className={styles.panel} aria-label="Головна навігація" hidden={!menuOpen}>
          {menuOpen && (
            <>
              <Link className={styles.menuLink} to="/" onClick={closeMenu}>Головна</Link>
              <Link className={styles.menuLink} to="/#about-platform" onClick={closeMenu}>Про платформу</Link>

              {menuGroups.map(({ title, items }) => (
                <details className={styles.group} key={title} name="header-menu-group">
                  <summary>{title}</summary>
                  <ul className={styles.submenu} role="list">
                    {items.map(({ label, href }) => (
                      <li key={label}>
                        {href ? (
                          <Link to={href.startsWith("#") ? "/" + href : href} onClick={closeMenu}>{label}</Link>
                        ) : (
                          <span className={styles.unavailable}>
                            {label} <span className={styles.status}>Незабаром</span>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
