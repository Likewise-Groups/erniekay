"use client";

import { useState, useRef } from "react";
import AdmissionsTopNav from "@/components/academy/AdmissionsTopNav";
import AdmissionsSideNav from "@/components/academy/AdmissionsSideNav";
import AdmissionsChecklist from "@/components/academy/AdmissionsChecklist";
import Footer from "@/components/Footer";

interface PersonalProfileFormData {
  // Identity & Contact
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;

  // Industry Background
  previousTraining: string;
  yearsInIndustry: "0-2" | "2-5" | "5+";

  // Artistic Narrative
  portfolioFile: File | null;
  portfolioUrl: string;
}

interface FormErrors {
  [key: string]: string;
}

const REQUIREMENTS_CHECKLIST = [
  {
    id: "selection",
    title: "Educational Selection",
    description: "Course path confirmed",
    status: "completed" as const,
  },
  {
    id: "personal",
    title: "Personal Details",
    description: "In progress - 65% complete",
    status: "active" as const,
  },
  {
    id: "professional",
    title: "Professional History",
    description: "Locked until identity verified",
    status: "locked" as const,
  },
  {
    id: "portfolio",
    title: "Artistic Portfolio",
    description: "Required for review committee",
    status: "locked" as const,
  },
];

export default function AdmissionsPersonalProfilePage() {
  const [formData, setFormData] = useState<PersonalProfileFormData>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    previousTraining: "",
    yearsInIndustry: "0-2",
    portfolioFile: null,
    portfolioUrl: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          portfolioFile: "Please upload a PDF or image file (JPG, PNG)",
        }));
        return;
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          portfolioFile: "File size must be less than 50MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        portfolioFile: file,
      }));

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.portfolioFile;
        return newErrors;
      });
    }
  };

  const handleYearsChange = (years: "0-2" | "2-5" | "5+") => {
    setFormData((prev) => ({
      ...prev,
      yearsInIndustry: years,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.previousTraining.trim()) {
      newErrors.previousTraining = "Please describe your previous training";
    } else if (formData.previousTraining.trim().length < 20) {
      newErrors.previousTraining =
        "Please provide more detail (at least 20 characters)";
    }

    if (!formData.yearsInIndustry) {
      newErrors.yearsInIndustry = "Please select your years of experience";
    }

    if (!formData.portfolioFile && !formData.portfolioUrl) {
      newErrors.portfolio = "Please upload a portfolio file or link";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save form data (in production, send to API)
      console.log("Form submitted:", formData);

      // Navigate to next step
      window.location.href = "/academy/admissions/professional";
    } catch (error) {
      console.error("Submission error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to submit form. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousStep = () => {
    window.location.href = "/academy/admissions/selection";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <AdmissionsTopNav />

      <div className="max-w-[1280px] mx-auto flex min-h-[calc(100vh-80px)]">
        {/* Side Navigation */}
        <AdmissionsSideNav currentStep="personal" />

        {/* Main Content */}
        <main className="flex-1 bg-background px-8 md:px-16 py-12 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <header className="mb-12">
            <span className="font-label-caps text-label-caps text-champagne-taupe block mb-2">
              STEP 02 OF 04
            </span>
            <h1 className="font-display-lg text-display-lg text-royal-navy leading-tight">
              Personal & Professional Profile
            </h1>
            <p className="mt-4 text-on-surface-variant max-w-xl font-body-base">
              Please provide a comprehensive overview of your background. We
              look for individuals who demonstrate both technical potential and
              a unique artistic voice.
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-16">
            {/* Error Banner */}
            {errors.submit && (
              <div className="bg-error-container border border-error p-4 rounded text-error">
                {errors.submit}
              </div>
            )}

            {/* Personal Identification Section */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-headline-md text-royal-navy">
                  Identity & Contact
                </h2>
                <div className="h-[1px] flex-1 bg-outline-variant"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Full Name */}
                <div className="relative">
                  <div className="border-b border-outline-variant focus-within:border-royal-navy transition-colors">
                    <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1">
                      LEGAL FULL NAME
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Julianne V. Sterling"
                      className="w-full py-2 bg-transparent border-none focus:ring-0 placeholder:text-outline p-0 text-royal-navy font-body-bold"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-error text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="relative">
                  <div className="border-b border-outline-variant focus-within:border-royal-navy transition-colors">
                    <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="julianne@example.com"
                      className="w-full py-2 bg-transparent border-none focus:ring-0 placeholder:text-outline p-0 text-royal-navy font-body-bold"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-error text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="relative">
                  <div className="border-b border-outline-variant focus-within:border-royal-navy transition-colors">
                    <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1">
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+44 (0) 20 7946 0958"
                      className="w-full py-2 bg-transparent border-none focus:ring-0 placeholder:text-outline p-0 text-royal-navy font-body-bold"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-error text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="relative">
                  <div className="border-b border-outline-variant focus-within:border-royal-navy transition-colors">
                    <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1">
                      DATE OF BIRTH
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full py-2 bg-transparent border-none focus:ring-0 p-0 text-royal-navy font-body-bold"
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-error text-xs mt-1">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Professional Experience Section */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-headline-md text-royal-navy">
                  Industry Background
                </h2>
                <div className="h-[1px] flex-1 bg-outline-variant"></div>
              </div>

              <div className="flex flex-col gap-10">
                {/* Previous Training */}
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="w-full md:w-1/3">
                    <h4 className="font-body-bold text-royal-navy mb-2">
                      Previous Training
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      List any certifications, workshops, or academic
                      credentials related to cosmetics, aesthetics, or fine
                      arts.
                    </p>
                  </div>
                  <div className="flex-1">
                    <textarea
                      name="previousTraining"
                      value={formData.previousTraining}
                      onChange={handleInputChange}
                      placeholder="Detail your certifications here..."
                      rows={4}
                      className="w-full bg-white border border-outline-variant p-4 focus:border-royal-navy focus:ring-0 transition-all font-body-base text-sm"
                    ></textarea>
                    {errors.previousTraining && (
                      <p className="text-error text-xs mt-1">
                        {errors.previousTraining}
                      </p>
                    )}
                  </div>
                </div>

                {/* Years in Industry */}
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="w-full md:w-1/3">
                    <h4 className="font-body-bold text-royal-navy mb-2">
                      Years in Industry
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      How long have you been practicing in a professional or
                      semi-professional capacity?
                    </p>
                  </div>
                  <div className="flex-1 flex gap-4">
                    {["0-2", "2-5", "5+"].map((years) => (
                      <label
                        key={years}
                        className="flex-1 relative cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="yearsInIndustry"
                          value={years}
                          checked={formData.yearsInIndustry === years}
                          onChange={() =>
                            handleYearsChange(years as "0-2" | "2-5" | "5+")
                          }
                          className="peer sr-only"
                        />
                        <div className="border border-outline-variant p-4 text-center group-hover:border-majestic-gold peer-checked:border-royal-navy peer-checked:bg-royal-navy peer-checked:text-white transition-all">
                          <span className="font-label-caps text-xs">
                            {years} YEARS
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.yearsInIndustry && (
                    <p className="text-error text-xs mt-1">
                      {errors.yearsInIndustry}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Artistic Narrative Section */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-headline-md text-royal-navy">
                  Artistic Narrative
                </h2>
                <div className="h-[1px] flex-1 bg-outline-variant"></div>
              </div>

              <div className="bg-white border border-outline-variant p-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 mb-6 bg-surface-container rounded-full flex items-center justify-center text-champagne-taupe">
                  <span className="material-symbols-outlined text-4xl">
                    cloud_upload
                  </span>
                </div>
                <h3 className="font-headline-md text-royal-navy mb-3">
                  Upload Your Portfolio or Statement
                </h3>
                <p className="text-on-surface-variant max-w-lg mb-8 font-body-base">
                  Please provide a PDF or high-resolution imagery showcasing
                  your best work. This is the core of your application for the
                  Elite Academy.
                </p>

                {/* File Upload Display */}
                {formData.portfolioFile && (
                  <div className="mb-6 p-4 bg-surface-container rounded w-full max-w-md">
                    <p className="font-body-bold text-royal-navy text-sm">
                      📄 {formData.portfolioFile.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {(formData.portfolioFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}

                <div className="flex gap-4 flex-wrap justify-center">
                  <label className="px-8 py-3 bg-majestic-gold text-royal-navy font-label-caps text-xs tracking-widest cursor-pointer hover:bg-opacity-90 transition-all">
                    SELECT FILES
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    className="px-8 py-3 border border-outline text-on-surface-variant font-label-caps text-xs tracking-widest hover:border-royal-navy transition-all"
                  >
                    LINK PORTFOLIO
                  </button>
                </div>
                <p className="mt-4 text-[10px] font-label-caps text-outline tracking-wider uppercase">
                  Accepted formats: PDF, JPG, PNG (Max 50MB)
                </p>

                {errors.portfolio && (
                  <p className="text-error text-xs mt-4">{errors.portfolio}</p>
                )}
                {errors.portfolioFile && (
                  <p className="text-error text-xs mt-4">
                    {errors.portfolioFile}
                  </p>
                )}
              </div>
            </section>

            {/* Form Footer */}
            <footer className="pt-8 border-t border-outline-variant flex justify-between items-center">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="flex items-center gap-2 text-on-surface-variant font-label-caps text-xs hover:text-royal-navy transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  arrow_back
                </span>
                PREVIOUS STEP
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-4 bg-royal-navy text-on-primary font-label-caps text-sm tracking-[0.2em] border border-majestic-gold hover:bg-primary-container active:scale-95 transition-all shadow-lg shadow-royal-navy/10 disabled:opacity-50"
              >
                {isSubmitting ? "SUBMITTING..." : "CONTINUE TO PROFESSIONAL REVIEW"}
              </button>
            </footer>
          </form>
        </main>

        {/* Right Sidebar - Requirements Checklist */}
        <AdmissionsChecklist
          items={REQUIREMENTS_CHECKLIST}
          showTip={true}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
