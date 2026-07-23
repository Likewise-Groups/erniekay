"use client";

import React from 'react';
import styles from './HeroSection.module.css';

// Three columns of three — a staggered editorial collage.
const columns = [
  ["/makeup.jpg", "/makeup2.jpg", "/hair3.jpg"],
  ["/MAKEUP10.jpg", "/facial.jpg", "/hair4.jpg"],
  ["/makeup6.jpg", "/face-1.jpg", "/hair2.jpg"],
];

const stats = [
  { value: "8+", label: "Years of\nExcellence" },
  { value: "5K+", label: "Happy\nClients" },
  { value: "4.9★", label: "Client\nRating" },
];

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.heroContainer}>
      {/* Ambient glows */}
      <div className={styles.glowA} />
      <div className={styles.glowB} />

      <div className={styles.contentWrap}>
        <div className={styles.textContent}>
          <div className={`${styles.eyebrow} ${styles.slideUp1}`}>
            <span className={styles.eyebrowLine} />
            ERNIEKAY SPLENDOR · BEAUTY REDEFINED
          </div>

          <h1 className={`${styles.title} ${styles.slideUp1}`}>
            Discover Your <span>True Beauty</span> With Us
          </h1>

          <p className={`${styles.subtitle} ${styles.slideUp2}`}>
            Experience premium makeup, skin, and hair services — curated by expert
            artists and tailored just for you.
          </p>

          <div className={`${styles.ctaRow} ${styles.slideUp3}`}>
            <button className={styles.ctaBtn} onClick={() => scrollTo("#hair")}>
              Book Appointment
            </button>
            <button className={styles.ctaGhost} onClick={() => scrollTo("#makeup")}>
              Explore Services
            </button>
          </div>

          <div className={`${styles.stats} ${styles.slideUp3}`}>
            {stats.map((s, i) => (
              <React.Fragment key={s.value}>
                {i > 0 && <span className={styles.statDivider} />}
                <div className={styles.stat}>
                  <strong>{s.value}</strong>
                  <span>
                    {s.label.split("\n").map((line, li) => (
                      <React.Fragment key={li}>
                        {line}
                        {li === 0 && <br />}
                      </React.Fragment>
                    ))}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className={styles.imageGrid}>
          {columns.map((col, ci) => (
            <div
              key={ci}
              className={`${styles.col} ${ci === 1 ? styles.colOffset : ""}`}
            >
              {col.map((url, i) => (
                <div key={i} className={styles.imageCard}>
                  <div
                    className={styles.image}
                    style={{ backgroundImage: `url('${url}')` }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
