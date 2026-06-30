"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  category: "Hair" | "Makeup" | "Bridal" | "Aesthetics" | "Home Services";
  price: string;
  duration: string;
  description: string;
}

const servicesData: Service[] = [
  {
    id: "facial",
    name: "Signature Glow Facial",
    category: "Aesthetics",
    price: "$185",
    duration: "60 MINUTES",
    description: "A deep-cleansing ritual using premium clinical actives to restore radiance and youthful elasticity to tired skin.",
  },
  {
    id: "makeup",
    name: "Red Carpet Makeup",
    category: "Makeup",
    price: "$250",
    duration: "90 MINUTES",
    description: "Our most prestigious makeup experience. Includes luxury skin prep, custom lash application, and high-definition finish.",
  },
  {
    id: "brows",
    name: "Sculpted Brow Design",
    category: "Makeup",
    price: "$95",
    duration: "45 MINUTES",
    description: "Architectural brow shaping using custom mapping techniques to frame the eyes and enhance facial symmetry.",
  },
  {
    id: "hair",
    name: "Masterclass Balayage",
    category: "Hair",
    price: "$320",
    duration: "120 MINUTES",
    description: "Bespoke hand-painted highlights performed by our Academy instructors for a multidimensional, sun-kissed finish.",
  },
  {
    id: "vitc",
    name: "Vitamin C Infusion",
    category: "Aesthetics",
    price: "$210",
    duration: "75 MINUTES",
    description: "A high-potency antioxidant treatment designed to brighten the complexion and defend against environmental stressors.",
  },
  {
    id: "home-bridal",
    name: "Premium Home Bridal Styling",
    category: "Home Services",
    price: "$450",
    duration: "180 MINUTES",
    description: "Our elite artists travel to your location. Includes comprehensive bridal hair and makeup with luxury touch-up kit.",
  },
  {
    id: "home-glam",
    name: "At-Home Event Glamour",
    category: "Home Services",
    price: "$300",
    duration: "90 MINUTES",
    description: "Professional hair styling and makeup application in the comfort of your home or hotel suite.",
  },
];

interface Artist {
  id: string;
  name: string;
  role: string;
  specializations: string[];
  quote: string;
  rating: string;
  reviews: number;
  image: string;
}

const artistsData: Artist[] = [
  {
    id: "alexandra",
    name: "Alexandra Thorne",
    role: "Master Stylist",
    specializations: ["Bridal Couture", "Precision Cutting", "Luxe Treatments"],
    quote: "Sculpting hair to mirror the inner radiance of every individual. Precision is my language, beauty is the result.",
    rating: "4.9",
    reviews: 124,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBD9-RzB00WuXK9XwlDRworNBZQzSu5ioGQx9k67K6gdlTDnilItaUsnHuWazovLpRKTAFjB5xT-h8svDkza0ILFClMDVEhRxNFEkYXNSdNLU8FUDwNxznR-zcFA0vvB7FHR6OiINIctlnIY4bTFt3bVvrlfoFLr0MPH_ZCh00ox9bVJIidr3xc7jM6UnnjnZaeRwDEwRhkEjSiDJbm1exJQvAPllj_vQimk4gvTS4yca0-Cjr-Ky9luNZ1ZzTOedNkxRntM5thwMY",
  },
  {
    id: "julianna",
    name: "Julianna Vane",
    role: "Senior Colorist",
    specializations: ["Editorial Color", "Luxe Treatments"],
    quote: "Color is an emotion. I specialize in bespoke palettes that enhance natural depth and editorial brilliance.",
    rating: "5.0",
    reviews: 89,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6_wJ0PSNsJ3y3KKcfOCJwP2bWZoYYAUCJbF-U-P5N1A0rYrwLiDIUvcEPc4BOzqaonJ8Z9KXBY-fYd-gRgqM3qltqQN_0R2fhsV4XCAlc4IkDm4u8nnUfFPz4bU-Fz0iN9p4K0CjzkXe7lTYTZBhAOqEgv7e_1Zpmfix_FufoM5VKKt2yFKp9vkk_MGqXjwCNNwaZi3f0BsORyKXAJwjaAihTJR9qE0ewxDa2meqAK9Gl2cMnUePxp0VYbdpyqinHMbR1vpmeMxA",
  },
  {
    id: "marcus",
    name: "Marcus Chen",
    role: "Artistic Director",
    specializations: ["Precision Cutting", "Editorial Color"],
    quote: "Bridging the gap between runway aesthetics and wearable luxury. Transforming hair into architectural art.",
    rating: "4.8",
    reviews: 215,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfR7TR0NHGkv6Epfa1-t63nxmYveFqSUbCsBEYFFy3j-vaiHyX2Wwnx-DAXzEFe5mt7cOnyigMtp2fvKraibAz1VU9IePko65R_NVNlEHbqMqdGkfe3TE1ymmyd4V_Y9gPdjls0vr8q2bwvJcQY1b4gh1oAgK-KWJwcSVvwX05tvH67ToSdme9Oi4lASIPmDn2pwv1WeYXsejsIfbd2dVWRA0uiE9vhmFYZDJJmYZx-OHGXXXxL3a8c0g73xdtc26cvmEJAN7WWMs",
  },
  {
    id: "elena",
    name: "Elena Rossi",
    role: "Bridal Specialist",
    specializations: ["Bridal Couture", "Luxe Treatments"],
    quote: "Your wedding day is a timeless ritual. I specialize in creating bridal looks that are as enduring as they are radiant.",
    rating: "5.0",
    reviews: 56,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAD3KmZ22QAfxlEDugcAJ2GffoXp8RuPkD6IrEgC8ZtIOYfhan-7MGZdDYhaYkO9dWi8h-sOq6eQ_cuX5damzlstfJyVxIFF5q8cneyAK5avvYVA2Nzqn2EXT0QZHU-_6M5b9oBcJa_yrfCk3nmEcJAEko2JyLNvbB3Le1GXqsaLIl_NlqJvFl9OvyiMRjzvpJJ9hgRXGiVApMf3KNlTh-FcZIBmiSObEfY2UZbkK5xTkkJscq8rHNIQEkUb8l4cIP1HHjUVd0Bjgo",
  },
];

export default function BookingPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [isBridalBespokeSelected, setIsBridalBespokeSelected] = useState<boolean>(false);

  // Form Inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter services
  const filteredServices = servicesData.filter((service) => {
    if (selectedCategory === "All") return true;
    return service.category === selectedCategory;
  });

  // Filter artists
  const filteredArtists = artistsData.filter((artist) => {
    if (selectedSpecializations.length === 0) return true;
    return artist.specializations.some((spec) => selectedSpecializations.includes(spec));
  });

  const toggleSpecialization = (spec: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((item) => item !== spec) : [...prev, spec]
    );
  };

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setIsBridalBespokeSelected(false);
  };

  const handleSelectBespokeBridal = () => {
    setIsBridalBespokeSelected(true);
    setSelectedService(null);
  };

  const handleNextStep = () => {
    if (step === 1 && (selectedService || isBridalBespokeSelected)) {
      setStep(2);
    } else if (step === 2 && selectedArtist) {
      setStep(3);
    } else if (step === 3 && selectedDate && selectedTimeSlot) {
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedArtist(null);
    setSelectedDate("");
    setSelectedTimeSlot("");
    setIsBridalBespokeSelected(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setNotes("");
    setAgreeTerms(false);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          address,
          notes,
          serviceId: isBridalBespokeSelected ? "bespoke-bridal" : selectedService?.id,
          artistId: selectedArtist?.id,
          date: selectedDate,
          time: selectedTimeSlot,
        }),
      });

      if (response.ok) {
        setStep(5);
      } else {
        alert("There was an error securing your booking. Please try again.");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert("There was a network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:00 PM", "04:30 PM", "06:00 PM"];
  
  // 10-day date generator
  const getDates = () => {
    const dates = [];
    const options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    for (let i = 1; i <= 10; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        raw: d.toISOString().split("T")[0],
        formatted: d.toLocaleDateString("en-US", options),
        short: d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }),
      });
    }
    return dates;
  };

  const datesList = getDates();
  const activeDateObj = datesList.find((d) => d.raw === selectedDate);

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 max-w-[1280px] mx-auto px-6 md:px-[64px]">
        {/* Sophisticated Progress Stepper */}
        <div className="flex justify-center items-center mb-16 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep(1)}
              className="w-8 h-8 rounded-full border border-royal-navy flex items-center justify-center bg-royal-navy text-majestic-gold"
            >
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check
              </span>
            </button>
            <span className="text-label-caps font-label-caps text-royal-navy">Service</span>
          </div>
          <div className={`w-12 h-[1px] ${step > 1 ? "bg-royal-navy" : "bg-outline-variant"}`}></div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => (selectedService || isBridalBespokeSelected) && setStep(2)}
              disabled={!selectedService && !isBridalBespokeSelected}
              className={`w-8 h-8 rounded-full border border-royal-navy flex items-center justify-center ${
                step > 2 ? "bg-royal-navy text-majestic-gold" : "bg-surface"
              }`}
            >
              {step > 2 ? (
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
              ) : (
                <div className={`rounded-full ${step === 2 ? "w-2 h-2 bg-majestic-gold" : "w-1.5 h-1.5 bg-champagne-taupe"}`}></div>
              )}
            </button>
            <span className={`text-label-caps font-label-caps ${step >= 2 ? "text-royal-navy" : "text-warm-slate"}`}>Artist</span>
          </div>
          <div className={`w-12 h-[1px] ${step > 2 ? "bg-royal-navy" : "bg-outline-variant"}`}></div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => selectedArtist && setStep(3)}
              disabled={!selectedArtist}
              className={`w-8 h-8 rounded-full border border-royal-navy flex items-center justify-center ${
                step > 3 ? "bg-royal-navy text-majestic-gold" : "bg-surface"
              }`}
            >
              {step > 3 ? (
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
              ) : (
                <div className={`rounded-full ${step === 3 ? "w-2 h-2 bg-majestic-gold" : "w-1.5 h-1.5 bg-champagne-taupe"}`}></div>
              )}
            </button>
            <span className={`text-label-caps font-label-caps ${step >= 3 ? "text-royal-navy" : "text-warm-slate"}`}>Time</span>
          </div>
          <div className={`w-12 h-[1px] ${step > 3 ? "bg-royal-navy" : "bg-outline-variant"}`}></div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-royal-navy flex items-center justify-center bg-surface">
              <div className={`rounded-full ${step >= 4 ? "w-2 h-2 bg-majestic-gold" : "w-1.5 h-1.5 bg-champagne-taupe"}`}></div>
            </div>
            <span className={`text-label-caps font-label-caps ${step >= 4 ? "text-royal-navy" : "text-warm-slate"}`}>Confirm</span>
          </div>
        </div>

        {/* STEP 1: SERVICE SELECTION */}
        {step === 1 && (
          <div className="flex flex-col md:flex-row gap-gutter-desktop items-start">
            {/* Left Side: Category Navigation */}
            <aside className="md:w-1/4 w-full">
              <div className="sticky top-40 space-y-8">
                <h2 className="text-headline-md font-headline-md text-royal-navy">Select Category</h2>
                <ul className="flex flex-col gap-6">
                  {["All", "Hair", "Makeup", "Bridal", "Aesthetics", "Home Services"].map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <li key={cat}>
                        <button
                          onClick={() => setSelectedCategory(cat)}
                          className={`group flex items-center justify-between w-full text-left transition-all border-b border-champagne-taupe/20 pb-4 ${
                            isActive ? "text-royal-navy" : "text-warm-slate hover:text-royal-navy"
                          }`}
                        >
                          <span className={`text-label-caps font-label-caps ${isActive ? "text-majestic-gold" : ""}`}>
                            {cat === "Aesthetics" ? "Aesthetics" : cat}
                          </span>
                          <span className={`material-symbols-outlined transition-all ${isActive ? "text-majestic-gold opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                            arrow_right_alt
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-12 p-6 border border-champagne-taupe/30 bg-alabaster-white">
                  <p className="text-body-bold font-body-bold text-royal-navy mb-2">Need Assistance?</p>
                  <p className="text-body-base font-body-base text-warm-slate text-sm mb-4">
                    Our concierge is available for bespoke bridal consultations and academy inquiries.
                  </p>
                  <a className="text-label-caps font-label-caps text-royal-navy underline decoration-majestic-gold underline-offset-4" href="#">
                    Contact Us
                  </a>
                </div>
              </div>
            </aside>

            {/* Right Side: Grid of Service Cards */}
            <section className="md:w-3/4 w-full space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-desktop">
                {filteredServices.map((service) => {
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => handleSelectService(service)}
                      className={`bg-white border p-8 flex flex-col group cursor-pointer transition-colors duration-300 ${
                        isSelected
                          ? "border-majestic-gold ring-1 ring-majestic-gold bg-alabaster-white/20"
                          : "border-surface-variant hover:border-majestic-gold"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-label-caps font-label-caps text-champagne-taupe uppercase">
                          {service.duration}
                        </span>
                        <span className="text-body-bold font-body-bold text-royal-navy">
                          {service.price}
                        </span>
                      </div>
                      <h3 className="text-headline-md font-headline-md text-royal-navy mb-4 group-hover:text-majestic-gold transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-body-base font-body-base text-warm-slate mb-8 flex-grow">
                        {service.description}
                      </p>
                      <button
                        className={`w-full py-4 text-label-caps font-label-caps border transition-all ${
                          isSelected
                            ? "bg-premium-green text-white border-premium-green"
                            : "bg-royal-navy text-majestic-gold border-majestic-gold hover:bg-midnight-ink"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select Service"}
                      </button>
                    </div>
                  );
                })}

                {/* Service Card 6 (Bento Style Shift / Bespoke Bridal) */}
                {(selectedCategory === "All" || selectedCategory === "Bridal") && (
                  <div
                    onClick={handleSelectBespokeBridal}
                    className={`relative bg-royal-navy p-8 flex flex-col overflow-hidden min-h-[320px] cursor-pointer border transition-all ${
                      isBridalBespokeSelected ? "border-majestic-gold ring-2 ring-majestic-gold" : "border-transparent"
                    }`}
                  >
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <Image
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZjRrAZGT1t25miQsUATEQ73vn-gwEC_4ce-RwNdJ26pvEizy2ZpNInJWfzqlldqrNmI0eZVKW9pev7_Gw0GWwD5x9N4vSfSyiVmY2EDVXPC6vZWex5Tp8dUguEpWtIVQAJ_stgIjHrCJv40TMKbvEWGvTaMKhDXHHiMMdYcNFkB1d_A8gxh42VgaRHaT9G8N1trlBUhw4ubQRViO553c0GLPUf3xaIK8ygb5oEAhEGN3UsfEsjxmwAQnCwuxy0vvRC17hw0DOUSM"
                        alt="Prestige bridal luxury"
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        unoptimized
                      />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="text-headline-md font-headline-md text-majestic-gold mb-4">
                          Bespoke Bridal Package
                        </h3>
                        <p className="text-body-base font-body-base text-alabaster-white/80 mb-8">
                          Consult with our creative director for a personalized bridal experience tailored to your unique wedding vision.
                        </p>
                      </div>
                      <div className="mt-auto">
                        <button
                          className={`w-full py-4 text-label-caps font-label-caps transition-all ${
                            isBridalBespokeSelected
                              ? "bg-premium-green text-white border border-premium-green"
                              : "bg-majestic-gold text-royal-navy hover:bg-white"
                          }`}
                        >
                          {isBridalBespokeSelected ? "Selected Couture Package" : "Enquire Today"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Continue Action */}
              <div className="flex justify-end pt-6">
                <button
                  onClick={handleNextStep}
                  disabled={!selectedService && !isBridalBespokeSelected}
                  className={`flex items-center gap-2 px-8 py-4 font-bold font-label-caps text-[13px] tracking-[0.15em] uppercase border transition-all ${
                    selectedService || isBridalBespokeSelected
                      ? "bg-royal-navy text-majestic-gold border-majestic-gold hover:bg-majestic-gold hover:text-royal-navy"
                      : "bg-surface-variant text-outline border-surface-variant cursor-not-allowed"
                  }`}
                >
                  Continue to Artisans <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* STEP 2: ARTIST SELECTION */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Filter Sidebar */}
            <aside className="md:col-span-3 space-y-8 sticky top-28">
              <div>
                <h3 className="text-[12px] leading-[16px] tracking-[0.15em] font-bold font-label-caps text-royal-navy mb-4 border-b border-champagne-taupe/30 pb-2 uppercase">
                  Specialization
                </h3>
                <div className="space-y-3">
                  {["Bridal Couture", "Precision Cutting", "Editorial Color", "Luxe Treatments"].map((spec) => (
                    <label key={spec} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedSpecializations.includes(spec)}
                        onChange={() => toggleSpecialization(spec)}
                        className="form-checkbox w-4 h-4 text-royal-navy border-champagne-taupe rounded-sm focus:ring-majestic-gold cursor-pointer"
                      />
                      <span className="text-[14px] font-[family-name:var(--font-montserrat)] text-warm-slate group-hover:text-royal-navy transition-colors">
                        {spec}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-alabaster-white border border-champagne-taupe/20">
                <h4 className="text-[12px] leading-[16px] tracking-[0.15em] font-bold font-label-caps text-royal-navy mb-2 uppercase">
                  Need Guidance?
                </h4>
                <p className="text-[13px] leading-relaxed text-warm-slate mb-4">
                  Unsure who best fits your hair goals? Take our 2-minute Artisan Matchmaker quiz.
                </p>
                <button className="w-full py-2 border border-royal-navy text-royal-navy text-[12px] font-bold tracking-[0.1em] font-label-caps uppercase hover:bg-royal-navy hover:text-white transition-all">
                  Start Quiz
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="md:col-span-9 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {filteredArtists.map((artist) => {
                  const isSelected = selectedArtist?.id === artist.id;
                  return (
                    <div
                      key={artist.id}
                      onClick={() => setSelectedArtist(artist)}
                      className={`artist-card group relative bg-white border p-6 transition-all duration-500 cursor-pointer hover:-translate-y-1 ${
                        isSelected
                          ? "border-majestic-gold bg-alabaster-white"
                          : "border-surface-variant hover:border-majestic-gold"
                      }`}
                    >
                      <div className="aspect-[4/5] overflow-hidden mb-6 bg-alabaster-white relative">
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 30vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          unoptimized
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[12px] font-bold font-label-caps tracking-[0.15em] text-champagne-taupe uppercase">
                          {artist.role}
                        </span>
                        <h3 className="font-[family-name:var(--font-eb-garamond)] text-[24px] md:text-[28px] font-semibold text-royal-navy leading-tight">
                          {artist.name}
                        </h3>
                        <p className="font-[family-name:var(--font-montserrat)] text-[14px] leading-[22px] text-warm-slate italic line-clamp-2">
                          &ldquo;{artist.quote}&rdquo;
                        </p>
                      </div>
                      <div className="mt-6 flex justify-between items-center pt-4 border-t border-champagne-taupe/10">
                        <div className="flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-majestic-gold text-[18px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          <span className="text-[11px] font-bold tracking-[0.1em] font-label-caps text-royal-navy">
                            {artist.rating} ({artist.reviews})
                          </span>
                        </div>
                        <button
                          className={`text-[12px] font-bold font-label-caps tracking-[0.1em] uppercase transition-all flex items-center gap-2 ${
                            isSelected ? "text-premium-green font-semibold" : "text-royal-navy group-hover:text-majestic-gold"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              Selected{" "}
                              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                  check
                              </span>
                            </>
                          ) : (
                            <>
                              Select Artist{" "}
                              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6">
                <button
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 px-6 py-3 font-bold font-label-caps text-[12px] tracking-[0.1em] uppercase border border-royal-navy text-royal-navy hover:bg-royal-navy hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!selectedArtist}
                  className={`flex items-center gap-2 px-8 py-4 font-bold font-label-caps text-[13px] tracking-[0.15em] uppercase border transition-all ${
                    selectedArtist
                      ? "bg-royal-navy text-majestic-gold border-majestic-gold hover:bg-majestic-gold hover:text-royal-navy"
                      : "bg-surface-variant text-outline border-surface-variant cursor-not-allowed"
                  }`}
                >
                  Choose Time Slot <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SCHEDULE RESERVE */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto bg-white border border-surface-variant p-6 md:p-10 shadow-sm">
            <h3 className="font-[family-name:var(--font-eb-garamond)] text-[28px] text-royal-navy font-bold mb-6 pb-2 border-b border-champagne-taupe/20">
              Select Appointment Slot
            </h3>

            {/* Date Selection */}
            <div className="mb-8">
              <span className="text-[12px] font-bold font-label-caps tracking-[0.15em] text-royal-navy block mb-4 uppercase">
                1. Choose Date
              </span>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-royal-navy scrollbar-track-alabaster-white">
                {datesList.map((dt) => {
                  const isDateSelected = selectedDate === dt.raw;
                  return (
                    <button
                      key={dt.raw}
                      onClick={() => setSelectedDate(dt.raw)}
                      className={`flex flex-col items-center justify-center p-4 border min-w-[120px] transition-all cursor-pointer ${
                        isDateSelected
                          ? "border-majestic-gold bg-royal-navy text-majestic-gold"
                          : "border-surface-variant hover:border-royal-navy/40 text-royal-navy"
                      }`}
                    >
                      <span className="text-[11px] font-bold tracking-[0.1em] font-label-caps block mb-1 uppercase opacity-80">
                        {dt.short.split(" ")[0]}
                      </span>
                      <span className="text-[20px] font-[family-name:var(--font-eb-garamond)] font-bold block">
                        {dt.short.split(" ")[1]}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                        {dt.short.split(" ")[2]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div className="mb-10">
              <span className="text-[12px] font-bold font-label-caps tracking-[0.15em] text-royal-navy block mb-4 uppercase">
                2. Choose Time
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {timeSlots.map((time) => {
                  const isTimeSelected = selectedTimeSlot === time;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTimeSlot(time)}
                      className={`py-3 px-4 text-center border font-[family-name:var(--font-montserrat)] text-[14px] font-medium transition-all ${
                        isTimeSelected
                          ? "bg-royal-navy text-majestic-gold border-majestic-gold font-semibold"
                          : "border-surface-variant hover:border-royal-navy text-royal-navy"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 px-6 py-3 font-bold font-label-caps text-[12px] tracking-[0.1em] uppercase border border-royal-navy text-royal-navy hover:bg-royal-navy hover:text-white transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back
              </button>
              <button
                onClick={handleNextStep}
                disabled={!selectedDate || !selectedTimeSlot}
                className={`flex items-center gap-2 px-8 py-4 font-bold font-label-caps text-[13px] tracking-[0.15em] uppercase border transition-all ${
                  selectedDate && selectedTimeSlot
                    ? "bg-royal-navy text-majestic-gold border-majestic-gold hover:bg-majestic-gold hover:text-royal-navy"
                    : "bg-surface-variant text-outline border-surface-variant cursor-not-allowed"
                }`}
              >
                Continue to details <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CUSTOMER DETAILS FORM & SUMMARY SPLIT */}
        {step === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-desktop items-start">
            {/* Left: Booking Summary */}
            <div className="md:col-span-5 bg-white border border-[#EBEBEB] p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-alabaster-white -mr-16 -mt-16 rotate-45"></div>
              <h2 className="font-headline-md text-headline-md text-royal-navy mb-8">Booking Summary</h2>
              
              <div className="space-y-8 relative z-10">
                <div className="group">
                  <p className="text-label-caps font-label-caps text-champagne-taupe mb-2">SERVICE</p>
                  <p className="font-body-bold text-body-bold text-royal-navy">
                    {isBridalBespokeSelected ? "Bespoke Bridal Styling & Trial" : selectedService?.name}
                  </p>
                  <p className="text-body-base text-warm-slate mt-1">
                    {isBridalBespokeSelected ? "120 Minutes" : selectedService?.duration} • {isBridalBespokeSelected ? "$250.00" : selectedService?.price}
                  </p>
                  <div className="h-[1px] bg-gradient-to-r from-[#8E7A5A] to-transparent mt-4 w-1/4 group-hover:w-full transition-all duration-500"></div>
                </div>

                <div className="group">
                  <p className="text-label-caps font-label-caps text-champagne-taupe mb-2">ARTIST</p>
                  <div className="flex items-center gap-4">
                    {selectedArtist && (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#EBEBEB]">
                        <Image
                          className="object-cover"
                          src={selectedArtist.image}
                          alt={selectedArtist.name}
                          fill
                          unoptimized
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-body-bold text-body-bold text-royal-navy">{selectedArtist?.name}</p>
                      <p className="text-body-base text-warm-slate">{selectedArtist?.role}</p>
                    </div>
                  </div>
                  <div className="h-[1px] bg-gradient-to-r from-[#8E7A5A] to-transparent mt-4 w-1/4 group-hover:w-full transition-all duration-500"></div>
                </div>

                <div className="group">
                  <p className="text-label-caps font-label-caps text-champagne-taupe mb-2">DATE &amp; TIME</p>
                  <p className="font-body-bold text-body-bold text-royal-navy">
                    {activeDateObj ? activeDateObj.formatted : selectedDate}
                  </p>
                  <p className="text-body-base text-warm-slate mt-1">
                    {selectedTimeSlot}
                  </p>
                  <div className="h-[1px] bg-gradient-to-r from-[#8E7A5A] to-transparent mt-4 w-1/4 group-hover:w-full transition-all duration-500"></div>
                </div>

                <div className="group">
                  <p className="text-label-caps font-label-caps text-champagne-taupe mb-2">LOCATION</p>
                  <p className="font-body-bold text-body-bold text-royal-navy">
                    {selectedService?.category === "Home Services" ? "Home Visit" : "Erniekay Flagship Salon"}
                  </p>
                  <p className="text-body-base text-warm-slate mt-1">
                    {selectedService?.category === "Home Services"
                      ? (address ? address : "Address required in next step")
                      : "128 Luxury Plaza, Victoria Island, Lagos"}
                  </p>
                  <div className="h-[1px] bg-gradient-to-r from-[#8E7A5A] to-transparent mt-4 w-1/4 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-[#EBEBEB] flex justify-between items-end">
                <div>
                  <p className="text-label-caps font-label-caps text-warm-slate">ESTIMATED TOTAL</p>
                  <p className="font-headline-md text-headline-md text-royal-navy">
                    {isBridalBespokeSelected ? "$250.00" : selectedService?.price}
                  </p>
                </div>
                <span className="text-label-caps font-label-caps text-premium-green flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> SECURE BOOKING
                </span>
              </div>
            </div>

            {/* Right: Customer Info Form */}
            <div className="md:col-span-7 bg-white border border-[#EBEBEB] p-10">
              <h2 className="font-headline-md text-headline-md text-royal-navy mb-4">Personal Information</h2>
              <p className="text-body-base text-warm-slate mb-10">
                Please provide your details to finalize the appointment. Your information is handled with the utmost discretion.
              </p>
              
              <form onSubmit={handleSubmitForm} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <label className="text-label-caps font-label-caps text-champagne-taupe absolute -top-4 left-0">Full Name</label>
                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border-b border-champagne-taupe py-4 font-body-base text-royal-navy placeholder:text-[#D1D1D1] focus:outline-none focus:border-b-royal-navy"
                      placeholder="e.g. Adanna Okoro"
                      type="text"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-label-caps font-label-caps text-champagne-taupe absolute -top-4 left-0">Email Address</label>
                    <input
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border-b border-champagne-taupe py-4 font-body-base text-royal-navy placeholder:text-[#D1D1D1] focus:outline-none focus:border-b-royal-navy"
                      placeholder="adanna.okoro@example.com"
                      type="email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <label className="text-label-caps font-label-caps text-champagne-taupe absolute -top-4 left-0">Phone Number</label>
                    <input
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border-b border-champagne-taupe py-4 font-body-base text-royal-navy placeholder:text-[#D1D1D1] focus:outline-none focus:border-b-royal-navy"
                      placeholder="+234 --- --- ----"
                      type="tel"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-label-caps font-label-caps text-champagne-taupe absolute -top-4 left-0">Service Type</label>
                    <div className="w-full bg-white border-b border-champagne-taupe py-4 font-body-base text-royal-navy">
                      Selected: {isBridalBespokeSelected ? "Bridal Styling Suite" : selectedService?.name}
                    </div>
                  </div>
                </div>

                {selectedService?.category === "Home Services" && (
                  <div className="relative">
                    <label className="text-label-caps font-label-caps text-champagne-taupe absolute -top-4 left-0">Home Address</label>
                    <input
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white border-b border-champagne-taupe py-4 font-body-base text-royal-navy placeholder:text-[#D1D1D1] focus:outline-none focus:border-b-royal-navy"
                      placeholder="Enter your full residential address"
                      type="text"
                    />
                  </div>
                )}

                <div className="relative">
                  <label className="text-label-caps font-label-caps text-champagne-taupe absolute -top-4 left-0">Special Notes or Inquiries</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white border-b border-champagne-taupe py-4 font-body-base text-royal-navy placeholder:text-[#D1D1D1] resize-none focus:outline-none focus:border-b-royal-navy"
                    placeholder="Share any specific requests or hair concerns with your stylist..."
                    rows={3}
                  ></textarea>
                </div>

                <div className="flex items-start gap-3 pt-4">
                  <input
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 border-champagne-taupe rounded-sm text-royal-navy focus:ring-royal-navy cursor-pointer"
                    id="terms"
                    type="checkbox"
                  />
                  <label className="text-body-base text-warm-slate text-sm cursor-pointer" htmlFor="terms">
                    I agree to the <a className="text-royal-navy underline font-body-bold" href="#">Terms of Service</a> and acknowledge the 24-hour cancellation policy.
                  </label>
                </div>

                <div className="pt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <button
                    onClick={handlePrevStep}
                    type="button"
                    className="text-label-caps font-label-caps text-warm-slate hover:text-royal-navy flex items-center gap-2 group transition-colors"
                  >
                    <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Back to Calendar
                  </button>
                  <button
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-majestic-gold text-royal-navy px-12 py-5 text-label-caps font-label-caps uppercase tracking-[0.2em] font-bold shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
                    type="submit"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS / CONFIRMATION RECEIPT */}
        {step === 5 && (
          <div className="max-w-2xl mx-auto bg-white border border-majestic-gold p-8 md:p-12 text-center shadow-lg space-y-8">
            <div className="w-16 h-16 rounded-full bg-premium-green/10 border border-premium-green flex items-center justify-center mx-auto text-premium-green">
              <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[12px] font-bold font-label-caps tracking-[0.2em] text-champagne-taupe uppercase block">
                Reservation Confirmed
              </span>
              <h2 className="font-[family-name:var(--font-eb-garamond)] text-[32px] md:text-[40px] text-royal-navy font-bold">
                Your Luxury Ritual is Locked
              </h2>
              <p className="text-warm-slate text-[15px] font-[family-name:var(--font-montserrat)] leading-[24px]">
                Thank you! Your booking for {isBridalBespokeSelected ? "Bespoke Bridal Styling & Trial" : selectedService?.name} has been confirmed. A verification invoice and digital calendar invitation have been dispatched to your email address.
              </p>
            </div>

            {/* Invoice card */}
            <div className="border border-champagne-taupe/20 bg-alabaster-white/50 p-6 text-left space-y-4">
              <h4 className="text-[12px] font-bold font-label-caps tracking-[0.15em] text-royal-navy border-b border-champagne-taupe/20 pb-2 uppercase">
                Reservation Receipt Details
              </h4>
              <div className="space-y-2 text-[14px] font-[family-name:var(--font-montserrat)] text-warm-slate">
                <div className="flex justify-between">
                  <span>Guest Name</span>
                  <span className="font-bold text-royal-navy">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Service</span>
                  <span className="font-bold text-royal-navy">
                    {isBridalBespokeSelected ? "Bespoke Bridal Styling & Trial" : selectedService?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Specialist Artisan</span>
                  <span className="font-bold text-royal-navy">{selectedArtist?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date &amp; Time</span>
                  <span className="font-semibold text-royal-navy">
                    {activeDateObj ? activeDateObj.formatted : selectedDate} at {selectedTimeSlot}
                  </span>
                </div>
                <div className="flex justify-between border-t border-dashed border-champagne-taupe/30 pt-3 text-[16px]">
                  <span className="font-bold text-royal-navy">Total Est. Price</span>
                  <span className="font-bold text-royal-navy">
                    {isBridalBespokeSelected ? "$250.00" : selectedService?.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Back button or restart */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 text-royal-navy border border-royal-navy font-bold font-label-caps text-[12px] tracking-[0.1em] uppercase hover:bg-royal-navy hover:text-white transition-all text-center"
              >
                Return to Salon
              </Link>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-royal-navy text-majestic-gold border border-majestic-gold font-bold font-label-caps text-[12px] tracking-[0.1em] uppercase hover:bg-majestic-gold hover:text-royal-navy transition-all active:scale-95"
              >
                Book Another treatment
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
