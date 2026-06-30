"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function StudentPortalPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dummy Routing Logic
    const normalizedEmail = email.toLowerCase().trim();
    
    if (normalizedEmail.includes("admin")) {
      router.push("/academy/admin");
    } else if (normalizedEmail.includes("student")) {
      router.push("/academy/portal/dashboard");
    } else {
      alert("Invalid credentials. Try 'admin@test.com' or 'student@test.com'.");
    }
  };

  return (
    <div className="bg-alabaster-white text-on-background min-h-screen flex flex-col font-[family-name:var(--font-montserrat)] antialiased overflow-x-hidden">
      {/* TopAppBar Component */}
      <header className="fixed top-0 w-full bg-surface z-50 border-b border-champagne-taupe/30 flex items-center justify-between px-6 md:px-[64px] h-20">
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-royal-navy active:opacity-80 transition-opacity">
            menu
          </button>
          <div className="relative w-56 h-20 -ml-4">
            <Image 
              src="/erniekayacademy logo.jpeg" 
              alt="Erniekay Academy Logo" 
              fill 
              className="object-contain object-left" 
              unoptimized
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="font-[family-name:var(--font-montserrat)] text-[14px] text-on-surface-variant hover:text-majestic-gold transition-colors duration-300">
              Main Site
            </Link>
            <Link href="/academy" className="font-[family-name:var(--font-montserrat)] text-[14px] text-on-surface-variant hover:text-majestic-gold transition-colors duration-300">
              Programs
            </Link>
            <a href="#" className="font-[family-name:var(--font-montserrat)] text-[14px] text-on-surface-variant hover:text-majestic-gold transition-colors duration-300">
              Help
            </a>
          </nav>
          <button className="material-symbols-outlined text-royal-navy active:opacity-80 transition-opacity">
            account_circle
          </button>
        </div>
      </header>

      <main className="pt-20 min-h-screen flex flex-col">
        {/* Hero Section - Crafting Excellence */}
        <section className="relative h-[353px] w-full overflow-hidden">
          <Image
            alt="Professional Makeup Artistry"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSKS-F47BQuM1QNHDxLnGR57RqUigjPKDYrv4Bmz9-mptN-Ib-6xCS4IXOmrurt4oE6FJP-__X35DwR7IChhagSK593AgLWUMRRENF1vxcoyBP-O-MIe3-3rKdHFhRZAPhhStvKwaEwMrsD7S6YKoVC3R9NvOAood8VyeaJDbjBo23Xu7P8ZAcCSfC9y4uNSpPrdFy0Geci5vdbaOJ9l0CLnruY6iiskj6o9DZxQO9RidUsC05B74RaNYFE3pYqDfFZEAWlbuxKwc"
            fill
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-royal-navy/40 to-alabaster-white/90 flex flex-col justify-end p-6 md:p-[64px]">
            <div className="mb-4">
              <span className="font-[family-name:var(--font-montserrat)] text-[11px] font-bold text-majestic-gold bg-royal-navy px-3 py-1.5 tracking-[0.2em] uppercase">
                CRAFTING EXCELLENCE
              </span>
            </div>
          </div>
        </section>

        {/* Login Card Section */}
        <section className="flex-grow px-6 md:px-[64px] -mt-8 relative z-10 flex justify-center">
          <div className="w-full max-w-[500px] bg-surface-container-lowest border border-champagne-taupe/20 p-8 shadow-md">
            <div className="text-center mb-10">
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[28px] leading-[36px] font-semibold text-royal-navy mb-2">
                Welcome Back, Artist
              </h2>
              <p className="font-[family-name:var(--font-montserrat)] text-warm-slate text-sm">
                Access your curriculum and creative portfolio.
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Email / ID Input */}
              <div className="relative border-b border-champagne-taupe focus-within:border-royal-navy transition-colors duration-300 py-2">
                <input
                  className="block w-full px-0 py-2 bg-transparent border-none outline-none focus:ring-0 text-royal-navy font-[family-name:var(--font-montserrat)]"
                  id="email"
                  name="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  required
                />
                <label
                  className={`absolute left-0 transition-all duration-300 origin-left pointer-events-none ${
                    emailFocused || email !== ""
                      ? "-translate-y-5 scale-[0.85] text-royal-navy font-bold"
                      : "top-3 text-warm-slate"
                  }`}
                  htmlFor="email"
                >
                  Email or Student ID
                </label>
              </div>

              {/* Password Input */}
              <div className="relative border-b border-champagne-taupe focus-within:border-royal-navy transition-colors duration-300 py-2">
                <input
                  className="block w-full px-0 py-2 bg-transparent border-none outline-none focus:ring-0 text-royal-navy font-[family-name:var(--font-montserrat)]"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                />
                <label
                  className={`absolute left-0 transition-all duration-300 origin-left pointer-events-none ${
                    passwordFocused || password !== ""
                      ? "-translate-y-5 scale-[0.85] text-royal-navy font-bold"
                      : "top-3 text-warm-slate"
                  }`}
                  htmlFor="password"
                >
                  Password
                </label>
                <button
                  className="absolute right-0 top-3 font-[family-name:var(--font-montserrat)] text-[10px] text-royal-navy hover:text-majestic-gold transition-colors tracking-widest uppercase"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className="w-4 h-4 border border-champagne-taupe bg-transparent group-active:scale-95 transition-transform flex items-center justify-center">
                      {rememberMe && (
                        <span className="material-symbols-outlined text-[12px] text-royal-navy font-bold leading-none">
                          check
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 font-[family-name:var(--font-montserrat)] text-[11px] text-warm-slate tracking-wider uppercase font-bold">
                    Remember Me
                  </span>
                </label>
                <a
                  className="font-[family-name:var(--font-montserrat)] text-[11px] text-royal-navy hover:text-majestic-gold transition-colors tracking-wider uppercase font-bold border-b border-transparent hover:border-majestic-gold"
                  href="#"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Action Button */}
              <button
                className="w-full h-12 bg-majestic-gold text-royal-navy font-[family-name:var(--font-montserrat)] text-sm font-bold tracking-widest uppercase hover:brightness-105 active:scale-[0.98] transition-all duration-300 mt-4 border border-majestic-gold"
                type="submit"
              >
                Sign In to Portal
              </button>
            </form>

            {/* Secondary Actions */}
            <div className="mt-8 text-center">
              <p className="text-[12px] font-[family-name:var(--font-montserrat)] text-warm-slate opacity-80 mb-4 bg-alabaster-white p-3 border border-champagne-taupe/30">
                <span className="font-bold text-royal-navy uppercase tracking-widest text-[10px] block mb-1">Demo Environment</span>
                Login with <strong className="text-royal-navy">admin@test.com</strong> or <strong className="text-royal-navy">student@test.com</strong>
              </p>
            </div>

            <div className="mt-6 space-y-4 text-center">
              <p className="font-[family-name:var(--font-montserrat)] text-sm text-warm-slate">
                Don&apos;t have an account? <br />
                <Link className="text-royal-navy font-bold hover:text-majestic-gold transition-colors" href="/contact">
                  Contact Admissions
                </Link>
              </p>
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="h-[1px] w-8 bg-champagne-taupe/30" />
                <span className="font-[family-name:var(--font-montserrat)] text-[10px] text-champagne-taupe tracking-widest font-bold">
                  OR
                </span>
                <div className="h-[1px] w-8 bg-champagne-taupe/30" />
              </div>
              <Link
                className="inline-block font-[family-name:var(--font-montserrat)] text-[12px] text-royal-navy border border-royal-navy px-8 py-3 hover:bg-royal-navy hover:text-white transition-all tracking-[0.2em] uppercase font-bold"
                href="/academy"
              >
                Explore Programs
              </Link>
            </div>
          </div>
        </section>

        {/* Decorative Quote */}
        <section className="py-[64px] text-center px-6">
          <span className="material-symbols-outlined text-majestic-gold opacity-50 text-4xl mb-4">
            format_quote
          </span>
          <p className="font-[family-name:var(--font-eb-garamond)] text-xl italic text-royal-navy px-4">
            &ldquo;Beauty begins the moment you decide to be yourself.&rdquo;
          </p>
        </section>
      </main>

      {/* Footer Component */}
      <footer className="bg-alabaster-white border-t border-champagne-taupe/20 flex flex-col items-center py-8 px-6 space-y-4 w-full">
        <div className="relative w-64 h-32 mb-2">
          <Image 
            src="/erniekayacademy logo.jpeg" 
            alt="Erniekay Academy Logo" 
            fill 
            className="object-contain" 
            unoptimized
          />
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-widest uppercase font-bold text-warm-slate hover:text-royal-navy transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-widest uppercase font-bold text-warm-slate hover:text-royal-navy transition-colors" href="#">
            Terms of Service
          </a>
          <a className="font-[family-name:var(--font-montserrat)] text-[12px] leading-[16px] tracking-widest uppercase font-bold text-warm-slate hover:text-royal-navy transition-colors" href="#">
            Cookie Policy
          </a>
        </div>
        <p className="font-[family-name:var(--font-montserrat)] text-[10px] text-warm-slate opacity-80 mt-4 tracking-wider text-center uppercase font-bold">
          © 2024 Luxury Beauty Academy. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
