const testimonials = [
  {
    id: "catherine",
    quote:
      "Erniekay didn't just do my makeup; she created a feeling. I felt like the most sophisticated version of myself. My photos are proof of her incredible talent.",
    author: "Catherine D.",
    date: "June 2023",
  },
  {
    id: "priya",
    quote:
      "For our traditional ceremony, I wanted something bold yet clean. Erniekay exceeded every expectation. The glow lasted for 14 hours straight!",
    author: "Priya M.",
    date: "September 2023",
  },
  {
    id: "amara",
    quote:
      "From the first consultation to the last touch-up, every detail was considered. I have never felt more beautiful or more like myself on any day of my life.",
    author: "Amara O.",
    date: "February 2024",
  },
];

function StarRating() {
  return (
    <div className="text-majestic-gold mb-6 flex justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-[20px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-[112px] bg-surface-bright">
      <div className="max-w-[1280px] mx-auto px-6 md:px-[64px]">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.3em] uppercase text-majestic-gold block mb-4">
            Reviews
          </span>
          <h2 className="font-[family-name:var(--font-eb-garamond)] text-[36px] md:text-[42px] leading-tight font-semibold text-primary">
            Brides of Splendor
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-[#EBEBEB] p-10 md:p-12 text-center flex flex-col items-center"
            >
              <StarRating />
              <p className="font-[family-name:var(--font-eb-garamond)] text-[22px] leading-[32px] font-semibold text-primary mb-8 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <h5 className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-[0.15em] uppercase font-bold text-royal-navy">
                — {t.author}, {t.date}
              </h5>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-4 mt-12">
          <button
            id="testimonial-dot-1"
            aria-label="Testimonial page 1"
            className="w-8 h-1 bg-royal-navy"
          />
          <button
            id="testimonial-dot-2"
            aria-label="Testimonial page 2"
            className="w-8 h-1 bg-outline-variant hover:bg-majestic-gold transition-colors"
          />
          <button
            id="testimonial-dot-3"
            aria-label="Testimonial page 3"
            className="w-8 h-1 bg-outline-variant hover:bg-majestic-gold transition-colors"
          />
        </div>
      </div>
    </section>
  );
}
