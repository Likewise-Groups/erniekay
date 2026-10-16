"use client";

import React from 'react';
import styles from './HeroSection.module.css';
import { mediaSrc, type MediaOverrides } from '@/lib/mediaSlots';

// Three columns of three — a staggered editorial collage. Each position is an
// editable slot; the pictures themselves come from lib/mediaSlots.ts.
const columns = [
  ["home.hero.1", "home.hero.2", "home.hero.3"],
  ["home.hero.4", "home.hero.5", "home.hero.6"],
  ["home.hero.7", "home.hero.8", "home.hero.9"],
];

const stats = [
  { value: "8+", label: "Years of\nExcellence" },
  { value: "5K+", label: "Happy\nClients" },
  { value: "4.9★", label: "Client\nRating" },
];

export default function HeroSection({ media }: { media?: MediaOverrides }) {
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
              {col.map((slot) => (
                <div key={slot} className={styles.imageCard}>
                  <div
                    className={styles.image}
                    // Rendered as a CSS background, so the URL is quoted and any
                    // apostrophe in an uploaded filename is escaped — otherwise
                    // it would terminate the url('…') literal.
                    style={{
                      backgroundImage: `url('${mediaSrc(media, slot).replace(/'/g, "\\'")}')`,
                    }}
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
