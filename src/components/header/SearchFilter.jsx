import { useEffect, useId, useRef, useState } from "react";
import styles from "./Header.module.css";

export default function SearchFilter({ label, options }) {
  const [value, setValue] = useState(options[0]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    listRef.current.focus({ preventScroll: true });

    function closeOutside(event) {
      if (!rootRef.current.contains(event.target)) setOpen(false);
    }

    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  function show(index) {
    setActiveIndex(index);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    triggerRef.current.focus({ preventScroll: true });
  }

  function choose(index) {
    setValue(options[index]);
    close();
  }

  function handleTriggerKey(event) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    show(event.key === "ArrowUp" && value === options[0] ? options.length - 1 : options.indexOf(value));
  }

  function handleListKey(event) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((index) => Math.min(options.length - 1, Math.max(0, index + step)));
        break;
      }
      case "Home":
        setActiveIndex(0);
        break;
      case "End":
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        choose(activeIndex);
        break;
      case "Escape":
        event.stopPropagation();
        close();
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  return (
    <div className={styles.filter} ref={rootRef} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button
        type="button"
        ref={triggerRef}
        className={styles.filterTrigger}
        aria-label={value === options[0] ? label : `${label}: ${value}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => open ? close() : show(options.indexOf(value))}
        onKeyDown={handleTriggerKey}
      >
        <span>{value}</span>
      </button>
      {open && (
        <div
          id={listId}
          ref={listRef}
          className={styles.filterList}
          role="listbox"
          aria-label={label}
          aria-activedescendant={`${listId}-${activeIndex}`}
          tabIndex={0}
          onKeyDown={handleListKey}
        >
          {options.map((option, index) => (
            <button
              key={option}
              id={`${listId}-${index}`}
              className={styles.filterOption}
              type="button"
              role="option"
              tabIndex={-1}
              aria-selected={option === value}
              data-active={index === activeIndex}
              onClick={() => choose(index)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
