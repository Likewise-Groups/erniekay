"use client";

import React, { useState } from "react";

export type SubService = {
  name: string;
  price: string | number;
};

export type ServiceCategory = {
  id: string;
  title: string;
  subServices: SubService[];
};

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  category: ServiceCategory | null;
};

const parsePrice = (price: string | number): number => {
  if (typeof price === "number") return price;
  const match = price.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export default function BookingModal({ isOpen, onClose, category }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSubServices, setSelectedSubServices] = useState<SubService[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "visa" | null>(null);

  if (!isOpen || !category) return null;

  const handleClose = () => {
    setStep(1);
    setSelectedSubServices([]);
    setFormData({ name: "", phone: "", date: "", time: "" });
    setPaymentMethod(null);
    onClose();
  };

  const handleNextStep = () => setStep((s) => (s + 1) as 1 | 2 | 3);
  const handlePrevStep = () => setStep((s) => (s - 1) as 1 | 2 | 3);

  const toggleSubService = (sub: SubService) => {
    setSelectedSubServices((prev) => {
      const exists = prev.find((s) => s.name === sub.name);
      if (exists) return prev.filter((s) => s.name !== sub.name);
      return [...prev, sub];
    });
  };

  const totalPrice = selectedSubServices.reduce((acc, sub) => acc + parsePrice(sub.price), 0);

  const handleSubmitBooking = () => {
    // In a real app, this would process payment with Paystack/Hubtel etc.
    const serviceNames = selectedSubServices.map(s => s.name).join(", ");
    alert(`Booking confirmed for ${serviceNames}!\nTotal: ${totalPrice} GH₵\nPayment method: ${paymentMethod}`);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-none border border-majestic-gold shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-royal-navy p-6 flex justify-between items-center text-white">
          <div>
            <h2 className="font-[family-name:var(--font-eb-garamond)] text-2xl font-semibold">
              Book Appointment
            </h2>
            <p className="font-[family-name:var(--font-montserrat)] text-xs tracking-widest uppercase text-champagne-taupe mt-1">
              {category.title}
            </p>
          </div>
          <button onClick={handleClose} className="text-white hover:text-majestic-gold transition-colors text-2xl leading-none">
            &times;
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto">
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-royal-navy mb-4">
                1. Select Services
              </h3>
              <div className="space-y-3">
                {category.subServices.map((sub, idx) => {
                  const isSelected = selectedSubServices.some((s) => s.name === sub.name);
                  return (
                    <label
                      key={idx}
                      className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                        isSelected
                          ? "border-majestic-gold bg-alabaster-white"
                          : "border-outline-variant hover:border-royal-navy"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="accent-majestic-gold w-4 h-4"
                          checked={isSelected}
                          onChange={() => toggleSubService(sub)}
                        />
                        <span className="font-[family-name:var(--font-montserrat)] text-sm font-medium text-royal-navy">
                          {sub.name}
                        </span>
                      </div>
                      <span className="font-[family-name:var(--font-eb-garamond)] font-semibold text-royal-navy">
                        {sub.price}GH₵
                      </span>
                    </label>
                  );
                })}
              </div>
              {selectedSubServices.length > 0 && (
                <div className="mt-4 text-right font-bold text-royal-navy font-[family-name:var(--font-montserrat)]">
                  Total: {totalPrice} GH₵
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Details */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-royal-navy mb-4">
                2. Your Details & Schedule
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-outline-variant p-3 focus:border-majestic-gold focus:outline-none transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="w-full border border-outline-variant p-3 focus:border-majestic-gold focus:outline-none transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1">Date</label>
                    <input
                      type="date"
                      required
                      className="w-full border border-outline-variant p-3 focus:border-majestic-gold focus:outline-none transition-colors"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1">Time</label>
                    <input
                      type="time"
                      required
                      className="w-full border border-outline-variant p-3 focus:border-majestic-gold focus:outline-none transition-colors"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="font-[family-name:var(--font-montserrat)] font-bold text-royal-navy mb-4">
                3. Payment
              </h3>
              
              <div className="bg-alabaster-white p-4 border border-outline-variant mb-6">
                <div className="flex flex-col gap-2 mb-4 border-b border-outline-variant pb-4">
                  <span className="text-on-surface-variant text-sm font-bold">Selected Services:</span>
                  <ul className="text-sm text-royal-navy list-disc list-inside">
                    {selectedSubServices.map((sub, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{sub.name}</span>
                        <span>{sub.price}GH₵</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-sm font-bold">Total to Pay:</span>
                  <span className="font-[family-name:var(--font-eb-garamond)] text-xl font-bold text-royal-navy">{totalPrice} GH₵</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${paymentMethod === "momo" ? "border-majestic-gold bg-alabaster-white" : "border-outline-variant"}`}>
                  <input
                    type="radio"
                    name="payment"
                    className="accent-majestic-gold w-4 h-4"
                    checked={paymentMethod === "momo"}
                    onChange={() => setPaymentMethod("momo")}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-royal-navy text-sm">MTN Mobile Money</span>
                    <span className="text-xs text-on-surface-variant">Pay with your MTN MoMo wallet</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${paymentMethod === "visa" ? "border-majestic-gold bg-alabaster-white" : "border-outline-variant"}`}>
                  <input
                    type="radio"
                    name="payment"
                    className="accent-majestic-gold w-4 h-4"
                    checked={paymentMethod === "visa"}
                    onChange={() => setPaymentMethod("visa")}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-royal-navy text-sm">Credit/Debit Card</span>
                    <span className="text-xs text-on-surface-variant">Pay with Visa or Mastercard</span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-outline-variant p-6 bg-surface flex justify-between gap-4 mt-auto">
          {step > 1 ? (
            <button
              onClick={handlePrevStep}
              className="px-6 py-3 border border-royal-navy text-royal-navy font-[family-name:var(--font-montserrat)] text-[12px] tracking-[0.15em] uppercase font-bold hover:bg-alabaster-white transition-colors"
            >
              Back
            </button>
          ) : (
            <div /> // placeholder for spacing
          )}

          {step < 3 ? (
            <button
              onClick={handleNextStep}
              disabled={step === 1 && selectedSubServices.length === 0}
              className="px-6 py-3 bg-royal-navy text-white font-[family-name:var(--font-montserrat)] text-[12px] tracking-[0.15em] uppercase font-bold hover:bg-majestic-gold hover:text-royal-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmitBooking}
              disabled={!paymentMethod}
              className="px-6 py-3 bg-majestic-gold text-royal-navy border border-majestic-gold font-[family-name:var(--font-montserrat)] text-[12px] tracking-[0.15em] uppercase font-bold hover:bg-royal-navy hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              Pay & Confirm
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
