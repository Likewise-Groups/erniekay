export default function AcademyAdminDashboard() {
  return (
    <div className="min-h-screen bg-alabaster-white p-10 flex flex-col items-center justify-center">
      <div className="bg-white border border-majestic-gold p-12 text-center max-w-2xl shadow-lg">
        <span className="material-symbols-outlined text-majestic-gold text-5xl mb-4">
          admin_panel_settings
        </span>
        <h1 className="font-[family-name:var(--font-eb-garamond)] text-4xl text-royal-navy mb-4 font-bold">
          Admin Dashboard
        </h1>
        <p className="font-[family-name:var(--font-montserrat)] text-warm-slate mb-8">
          Welcome to the Academy Administration Portal. This is a secure area for managing admissions, courses, and student records.
        </p>
        <a href="/academy/portal" className="px-6 py-3 bg-royal-navy text-majestic-gold text-[12px] font-bold tracking-[0.1em] uppercase hover:bg-midnight-ink transition-colors">
          Logout
        </a>
      </div>
    </div>
  );
}
