import { useEffect, useRef, useState } from "react";
import styles from "./CardSlider.module.css";

export default function CardSlider({ id, heading, previousLabel, nextLabel, children }) {
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const track = trackRef.current;

    function updateEdges() {
      const start = track.scrollLeft < 2;
      const end = track.scrollWidth - track.clientWidth - track.scrollLeft < 2;
      setEdges((current) => current.start === start && current.end === end ? current : { start, end });
    }

    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(track);
    track.addEventListener("scroll", updateEdges, { passive: true });
    updateEdges();

    return () => {
      resizeObserver.disconnect();
      track.removeEventListener("scroll", updateEdges);
    };
  }, []);

  function move(direction) {
    if (direction < 0 ? edges.start : edges.end) return;
    const track = trackRef.current;
    const [first, second] = track.children;
    if (second) {
      track.scrollBy({ left: direction * (second.offsetLeft - first.offsetLeft) });
    }
  }

  return (
    <>
      <div className={styles.heading}>
        <div>{heading}</div>
        <div className={styles.controls}>
          <button
            type="button"
            aria-label={previousLabel}
            aria-controls={id}
            aria-disabled={edges.start}
            onClick={() => move(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            aria-controls={id}
            aria-disabled={edges.end}
            onClick={() => move(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <div className={styles.track} id={id} ref={trackRef}>{children}</div>
    </>
  );
}
