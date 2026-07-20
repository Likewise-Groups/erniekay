"use client";

import React from 'react';
import styles from './HeroSection.module.css';

const images = [
  "/makeup.jpg",
  "/MAKEUP10.jpg",
  "/makeup2.jpg",
  "/facial.jpg",
  "/makeup6.jpg",
  "/face.jpg",
  "/face2.jpg",
  "/hair2.jpg",
  "/hair4.jpg",
  "/hair3.jpg",
];

export default function HeroSection() {
  const handleBookClick = () => {
    const el = document.querySelector("#hair");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.heroContainer}>
      <div className={styles.contentWrap}>
        <div className={styles.textContent}>
          <h1 className={`${styles.title} ${styles.slideUp1}`}>
            Discover Your <span>True Beauty</span> With Us
          </h1>
          <p className={`${styles.subtitle} ${styles.slideUp2}`}>
            Experience premium makeup, skin, and hair services tailored just for you.
          </p>
          <button className={`${styles.ctaBtn} ${styles.slideUp3}`} onClick={handleBookClick}>Book Appointment</button>
        </div>
        
        <div className={styles.imageGrid}>
          {images.slice(0, 6).map((url, i) => (
            <div key={i} className={styles.imageCard}>
              <div 
                className={styles.image} 
                style={{ backgroundImage: `url('${url}')` }} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}