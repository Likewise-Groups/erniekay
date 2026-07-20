"use client";

import React, { useMemo, useState } from "react";

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

type PaymentMethod = "momo" | "card";
type ModalStep = 1 | 2 | 3 | 4;

type PaymentResult = {
  referenceId: string;
  status: string;
  mode: "live" | "sandbox";
  message: string;
};

const parsePrice = (price: string | number): number => {
  if (typeof price === "number") return price;
  const match = price.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const currency = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  maximumFractionDigits: 0,
});

const today = new Date().toISOString().split("T")[0];

export default function BookingModal({ isOpen, onClose, category }: BookingModalProps) {
  const [step, setStep] = useState<ModalStep>(1);
  const [selectedSubServices, setSelectedSubServices] = useState<SubService[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("momo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  const totalPrice = useMemo(
    () => selectedSubServices.reduce((acc, sub) => acc + parsePrice(sub.price), 0),
    [selectedSubServices]
  );

  if (!isOpen || !category) return null;

  const selectedNames = selectedSubServices.map((service) => service.name).join(", ");
  const canContinueToDetails = selectedSubServices.length > 0;
  const canContinueToPayment = formData.name && formData.email && formData.phone && formData.date && formData.time;

  const reset = () => {
    setStep(1);
    setSelectedSubServices([]);
    setFormData({ name: "", email: "", phone: "", date: "", time: "", notes: "" });
    setPaymentMethod("momo");
    setIsSubmitting(false);
    setError("");
    setPaymentResult(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleSubService = (sub: SubService) => {
    setSelectedSubServices((prev) => {
      const exists = prev.find((service) => service.name === sub.name);
      if (exists) return prev.filter((service) => service.name !== sub.name);
      return [...prev, sub];
    });
  };

  const submitBooking = async (payment?: PaymentResult) => {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceId: category.id,
        serviceName: category.title,
        category: category.title,
        selectedServices: selectedNames,
        totalPrice,
        date: formData.date,
        time: formData.time,
        notes: [
          formData.notes,
          `Selected services: ${selectedNames}`,
          `Payment method: ${paymentMethod === "momo" ? "MTN Mobile Money" : "Card"}`,
          payment ? `Payment reference: ${payment.referenceId} (${payment.status})` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    });

    if (!response.ok) {
      throw new Error("Booking could not be saved. Please try again.");
    }
  };

  const requestMomoPayment = async () => {
    const response = await fetch("/api/payments/mtn/request-to-pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalPrice,
        phone: formData.phone,
        customerName: formData.name,
        serviceName: category.title,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "MTN Mobile Money payment could not be started.");
    }

    return data as PaymentResult;
  };

  const handleSubmitBooking = async () => {
    if (!canContinueToPayment) return;

    setIsSubmitting(true);
    setError("");

    try {
      const payment =
        paymentMethod === "momo"
          ? await requestMomoPayment()
          : {
              referenceId: `CARD-${Date.now()}`,
              status: "PENDING",
              mode: "sandbox" as const,
              message: "Card checkout is recorded as pending until a card processor is connected.",
            };

      await submitBooking(payment);
      setPaymentResult(payment);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-ink/70 px-4 py-6 backdrop-blur-md">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden border border-majestic-gold/40 bg-white shadow-2xl">
        <div className="bg-royal-navy px-6 py-5 text-white md:px-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-label-caps font-label-caps text-majestic-gold">Secure appointment</p>
              <h2 className="mt-1 font-headline-md text-3xl">{category.title}</h2>
            </div>
            <button
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-majestic-gold hover:text-majestic-gold"
              aria-label="Close booking modal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-2">
            {["Services", "Details", "Payment", "Receipt"].map((label, index) => {
              const active = step >= index + 1;
              return (
                <div key={label}>
                  <div className={`h-1 ${active ? "bg-majestic-gold" : "bg-white/20"}`} />
                  <p className={`mt-2 text-[10px] font-bold uppercase tracking-[0.12em] ${active ? "text-white" : "text-white/45"}`}>
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-y-auto p-6 md:p-8">
          {error && (
            <div className="mb-5 border border-error/30 bg-error/10 px-4 py-3 text-sm font-medium text-error">
              {error}
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="font-headline-md text-headline-md text-royal-navy">Choose your services</h3>
              <div className="mt-5 grid gap-3">
                {category.subServices.map((sub) => {
                  const selected = selectedSubServices.some((service) => service.name === sub.name);

                  return (
                    <button
                      key={sub.name}
                      onClick={() => toggleSubService(sub)}
                      className={`flex min-h-[72px] items-center justify-between border px-4 py-3 text-left transition-all ${
                        selected ? "border-majestic-gold bg-majestic-gold/10" : "border-outline-variant hover:border-royal-navy"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`flex h-6 w-6 items-center justify-center border ${selected ? "border-majestic-gold bg-majestic-gold" : "border-outline"}`}>
                          {selected && <span className="material-symbols-outlined text-[16px] text-royal-navy">check</span>}
                        </span>
                        <span className="font-body-bold text-royal-navy">{sub.name}</span>
                      </span>
                      <span className="font-body-bold text-royal-navy">{currency.format(parsePrice(sub.price))}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="font-headline-md text-headline-md text-royal-navy">Client details</h3>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" className="border border-outline-variant px-4 py-3 font-body-base" />
                <input required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email address" type="email" className="border border-outline-variant px-4 py-3 font-body-base" />
                <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="MTN MoMo phone number" type="tel" className="border border-outline-variant px-4 py-3 font-body-base" />
                <div className="grid grid-cols-2 gap-3">
                  <input required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} min={today} type="date" className="border border-outline-variant px-4 py-3 font-body-base" />
                  <input required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} type="time" className="border border-outline-variant px-4 py-3 font-body-base" />
                </div>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Notes or special requests" rows={4} className="border border-outline-variant px-4 py-3 font-body-base md:col-span-2" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div>
                <h3 className="font-headline-md text-headline-md text-royal-navy">Payment method</h3>
                <div className="mt-5 space-y-3">
                  <button
                    onClick={() => setPaymentMethod("momo")}
                    className={`flex w-full items-center gap-4 border p-4 text-left ${paymentMethod === "momo" ? "border-majestic-gold bg-majestic-gold/10" : "border-outline-variant"}`}
                  >
                    <span className="material-symbols-outlined text-premium-green">phone_iphone</span>
                    <span>
                      <span className="block font-body-bold text-royal-navy">MTN Mobile Money</span>
                      <span className="text-sm text-warm-slate">A payment prompt is sent to the customer phone.</span>
                    </span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex w-full items-center gap-4 border p-4 text-left ${paymentMethod === "card" ? "border-majestic-gold bg-majestic-gold/10" : "border-outline-variant"}`}
                  >
                    <span className="material-symbols-outlined text-royal-navy">credit_card</span>
                    <span>
                      <span className="block font-body-bold text-royal-navy">Card</span>
                      <span className="text-sm text-warm-slate">Recorded as pending until a card processor is connected.</span>
                    </span>
                  </button>
                </div>
              </div>
              <div className="border border-outline-variant bg-surface p-5">
                <p className="text-label-caps font-label-caps text-warm-slate">Booking summary</p>
                <div className="mt-4 space-y-3 text-sm text-warm-slate">
                  {selectedSubServices.map((service) => (
                    <div key={service.name} className="flex justify-between gap-3">
                      <span>{service.name}</span>
                      <span className="font-body-bold text-royal-navy">{currency.format(parsePrice(service.price))}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 border-t border-outline-variant pt-4">
                  <div className="flex justify-between">
                    <span className="font-body-bold text-royal-navy">Total</span>
                    <span className="font-headline-md text-2xl text-royal-navy">{currency.format(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && paymentResult && (
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-premium-green/10 text-premium-green">
                <span className="material-symbols-outlined text-[38px]">check_circle</span>
              </div>
              <p className="mt-5 text-label-caps font-label-caps text-champagne-taupe">Booking received</p>
              <h3 className="mt-2 font-headline-md text-4xl text-royal-navy">Receipt issued</h3>
              <p className="mt-3 font-body-base text-warm-slate">{paymentResult.message}</p>
              <div className="mt-7 border border-outline-variant bg-surface p-5 text-left">
                <div className="flex justify-between border-b border-outline-variant pb-3">
                  <span className="text-sm text-warm-slate">Client</span>
                  <span className="font-body-bold text-royal-navy">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant py-3">
                  <span className="text-sm text-warm-slate">Services</span>
                  <span className="max-w-[60%] text-right font-body-bold text-royal-navy">{selectedNames}</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant py-3">
                  <span className="text-sm text-warm-slate">Reference</span>
                  <span className="font-body-bold text-royal-navy">{paymentResult.referenceId}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="font-body-bold text-royal-navy">Total</span>
                  <span className="font-headline-md text-2xl text-royal-navy">{currency.format(totalPrice)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-outline-variant bg-surface px-6 py-5 md:px-8">
          <button
            onClick={() => (step === 1 ? handleClose() : setStep((current) => (current - 1) as ModalStep))}
            className="border border-royal-navy px-5 py-3 text-label-caps font-label-caps text-royal-navy transition-colors hover:bg-royal-navy hover:text-white"
          >
            {step === 1 || step === 4 ? "Close" : "Back"}
          </button>

          {step < 3 && (
            <button
              onClick={() => setStep((current) => (current + 1) as ModalStep)}
              disabled={step === 1 ? !canContinueToDetails : !canContinueToPayment}
              className="bg-royal-navy px-6 py-3 text-label-caps font-label-caps text-majestic-gold transition-colors hover:bg-midnight-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleSubmitBooking}
              disabled={isSubmitting || !canContinueToPayment}
              className="bg-majestic-gold px-6 py-3 text-label-caps font-label-caps text-royal-navy transition-colors hover:bg-royal-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : paymentMethod === "momo" ? "Send MoMo Prompt" : "Confirm Booking"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
