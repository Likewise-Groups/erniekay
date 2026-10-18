"use client";

import React, { useMemo, useState } from "react";

import BookingCalendar from "@/components/BookingCalendar";
import { formatLongDate, formatSlot } from "@/lib/availability";
import { subServiceRows, type ServiceCategory, type SubService } from "@/lib/serviceCatalog";

export type { ServiceCategory, SubService };

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  category: ServiceCategory | null;
};

type PaymentMethod = "momo" | "card";
type ModalStep = "services" | "options" | "details" | "payment" | "receipt";

const STEP_LABELS: Record<ModalStep, string> = {
  services: "Services",
  options: "Options",
  details: "Details",
  payment: "Payment",
  receipt: "Receipt",
};

/** A sub-service that needs a follow-up step: a tier to pick or questions to answer. */
const needsOptions = (sub: SubService) => Boolean(sub.tiers?.length || sub.questions?.length);

type PaymentResult = {
  referenceId: string;
  status: string;
  mode: "live" | "sandbox";
  message: string;
};

type BookingResult = {
  id: string;
  status: string;
  amountDue: number;
  currency: string;
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

/** "400-1000" → "GH₵400 – 1,000"; a single figure formats as itself. */
const formatPriceRange = (price: string | number): string => {
  if (typeof price === "number") return currency.format(price);
  const [low, high] = (price.match(/\d+/g) ?? []).map(Number);
  if (low === undefined) return price;
  if (high === undefined) return currency.format(low) + (price.includes("+") ? "+" : "");
  return `${currency.format(low)} – ${high.toLocaleString("en-GH")}`;
};

// The opening hours, the slot grid and the "is this free" rule all live in
// lib/availability.ts now — they were previously declared here and, differently
// again, in the /booking wizard.

export default function BookingModal({ isOpen, onClose, category }: BookingModalProps) {
  const [step, setStep] = useState<ModalStep>("services");
  const [selectedSubServices, setSelectedSubServices] = useState<SubService[]>([]);
  /** Chosen tier per tiered sub-service, keyed by the parent's name. */
  const [tierChoices, setTierChoices] = useState<Record<string, SubService>>({});
  /** Follow-up answers, keyed by `${sub.name}:${question.id}`. */
  const [answers, setAnswers] = useState<Record<string, string>>({});
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
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [isAwaitingPayment, setIsAwaitingPayment] = useState(false);
  // Separate from `error`: the booking succeeded, only the payment did not.
  const [paymentError, setPaymentError] = useState("");

  /**
   * What is actually being booked: each tiered sub-service replaced by the tier
   * chosen for it. This is what is priced and sent — the server cannot price a
   * tiered parent on its own.
   */
  const bookedServices = useMemo(
    () => selectedSubServices.map((sub) => (sub.tiers ? tierChoices[sub.name] ?? sub : sub)),
    [selectedSubServices, tierChoices]
  );

  const totalPrice = useMemo(
    () => bookedServices.reduce((acc, sub) => acc + parsePrice(sub.price), 0),
    [bookedServices]
  );

  if (!isOpen || !category) return null;

  const optionServices = selectedSubServices.filter(needsOptions);
  const steps: ModalStep[] = [
    "services",
    ...(optionServices.length ? (["options"] as const) : []),
    "details",
    "payment",
    "receipt",
  ];
  const stepIndex = steps.indexOf(step);
  const goNext = () => setStep(steps[stepIndex + 1]);
  const goBack = () => setStep(steps[stepIndex - 1]);

  const selectedNames = bookedServices.map((service) => service.name).join(", ");
  const optionsSummary = optionServices.flatMap((sub) =>
    (sub.questions ?? []).map((question) => `${question.title}: ${answers[`${sub.name}:${question.id}`]}`)
  );
  const optionsComplete = optionServices.every(
    (sub) =>
      (!sub.tiers || tierChoices[sub.name]) &&
      (sub.questions ?? []).every((question) => answers[`${sub.name}:${question.id}`])
  );
  const canContinueToPayment = formData.name && formData.email && formData.phone && formData.date && formData.time;
  const canContinue =
    step === "services"
      ? selectedSubServices.length > 0
      : step === "options"
        ? optionsComplete
        : Boolean(canContinueToPayment);

  const reset = () => {
    setStep("services");
    setSelectedSubServices([]);
    setTierChoices({});
    setAnswers({});
    setFormData({ name: "", email: "", phone: "", date: "", time: "", notes: "" });
    setPaymentMethod("momo");
    setIsSubmitting(false);
    setError("");
    setPaymentResult(null);
    setBookingResult(null);
    setIsAwaitingPayment(false);
    setPaymentError("");
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

  /**
   * Creates the booking as an unpaid intent and returns its id.
   *
   * Runs BEFORE any payment. The server prices the appointment from the
   * catalogue and stores what is owed; the payment is then raised against that
   * appointment, so the browser never gets to say which payment covers which
   * booking. It also means a MoMo outage no longer discards the booking.
   */
  const submitBooking = async (): Promise<BookingResult> => {
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
        // Sent as an array: joining and re-splitting on "," shatters the two
        // catalogue names that contain commas, e.g. "Closure (2*6, 4*4)".
        selectedServices: bookedServices.map((sub) => sub.name),
        date: formData.date,
        time: formData.time,
        notes: [
          formData.notes,
          `Selected services: ${selectedNames}`,
          ...optionsSummary,
          `Payment method: ${paymentMethod === "momo" ? "MTN Mobile Money" : "Card"}`,
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // 409 means the slot went while this customer was choosing how to pay.
      // Flagged so the caller can send them back to the calendar, which will
      // have refreshed by the time they get there.
      const failure = new Error(data.error || "Booking could not be saved. Please try again.");
      if (response.status === 409) failure.name = "SlotUnavailable";
      throw failure;
    }

    return data.booking as BookingResult;
  };

  const requestMomoPayment = async (appointmentId: string) => {
    const response = await fetch("/api/payments/mtn/request-to-pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Identifies the booking, nothing more. No amount and no service list —
      // the server reads both from the appointment it already stored.
      body: JSON.stringify({
        appointmentId,
        phone: formData.phone,
        customerName: formData.name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "MTN Mobile Money payment could not be started.");
    }

    return data as PaymentResult;
  };

  /**
   * Waits for the customer to approve the prompt on their phone.
   *
   * Without this nothing ever resolves the payment: MTN's callback only fires
   * against a registered production URL, so a booking would sit PENDING
   * forever even after the money arrived. The status endpoint writes through to
   * both the payment and the appointment, so polling it is what moves the
   * booking to CONFIRMED.
   */
  const waitForPaymentOutcome = async (referenceId: string): Promise<PaymentResult | null> => {
    // MoMo prompts expire after roughly a minute; poll a little past that.
    const deadline = Date.now() + 90_000;

    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 3_000));

      try {
        const response = await fetch(`/api/payments/mtn/status/${referenceId}`);
        if (!response.ok) continue;

        const data = (await response.json()) as PaymentResult;
        if (data.status === "SUCCESSFUL" || data.status === "FAILED") return data;
      } catch {
        // Transient network error — keep waiting rather than declaring failure.
      }
    }

    return null;
  };

  /** Raises the MoMo prompt for a saved booking and waits for the outcome. */
  const startMomoPayment = async (appointmentId: string) => {
    setPaymentError("");
    setIsSubmitting(true);

    try {
      const payment = await requestMomoPayment(appointmentId);
      setPaymentResult(payment);
      setStep("receipt");

      if (payment.status === "PENDING") {
        setIsAwaitingPayment(true);
        try {
          const settled = await waitForPaymentOutcome(payment.referenceId);
          if (settled) setPaymentResult(settled);
        } finally {
          setIsAwaitingPayment(false);
        }
      }
    } catch (err) {
      // The booking is already saved, so this is recoverable — surface it on the
      // receipt step with a retry rather than discarding everything the
      // customer entered, which is what the old ordering did.
      setPaymentError(err instanceof Error ? err.message : "Payment could not be started.");
      setStep("receipt");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitBooking = async () => {
    if (!canContinueToPayment) return;

    setIsSubmitting(true);
    setError("");
    setPaymentError("");

    let booking: BookingResult;
    try {
      // Booking first. The appointment is what the payment is raised against,
      // and saving it before taking money means a payment failure never costs
      // the customer their booking.
      booking = await submitBooking();
      setBookingResult(booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);

      // Nothing on the payment step can fix a slot that has gone. Send them
      // back to the calendar with the time cleared, so the fix is one click.
      if (err instanceof Error && err.name === "SlotUnavailable") {
        setFormData((current) => ({ ...current, time: "" }));
        setStep("details");
      }

      return;
    }

    if (paymentMethod !== "momo") {
      // Card has no processor yet. The booking stands as unpaid — deliberately
      // no synthetic reference, so nothing can mistake it for a real payment.
      setPaymentResult(null);
      setStep("receipt");
      setIsSubmitting(false);
      return;
    }

    await startMomoPayment(booking.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-ink/70 px-4 py-6 backdrop-blur-md">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden border border-majestic-gold/40 bg-card shadow-2xl">
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

          <div className={`mt-6 grid gap-2 ${steps.length === 5 ? "grid-cols-5" : "grid-cols-4"}`}>
            {steps.map((id, index) => {
              const active = stepIndex >= index;
              const label = STEP_LABELS[id];
              return (
                <div key={id}>
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

          {step === "services" && (
            <div>
              <h3 className="font-headline-md text-headline-md text-ink">Choose your services</h3>
              {category.note && (
                <p className="mt-4 border-l-2 border-majestic-gold bg-majestic-gold/10 px-4 py-3 text-sm text-ink">
                  <span className="font-body-bold">Please note: </span>
                  {category.note}
                </p>
              )}
              <div className="mt-5 grid gap-3">
                {subServiceRows(category.subServices).map((row) => {
                  if (row.kind === "heading") {
                    return (
                      <p
                        key={row.key}
                        className="text-label-caps font-label-caps mt-3 text-warm-slate first:mt-0"
                      >
                        {row.title}
                      </p>
                    );
                  }

                  const { sub } = row;
                  const selected = selectedSubServices.some((service) => service.name === sub.name);

                  return (
                    <button
                      key={row.key}
                      onClick={() => toggleSubService(sub)}
                      className={`flex min-h-[72px] items-center justify-between border px-4 py-3 text-left transition-all ${
                        selected ? "border-majestic-gold bg-majestic-gold/10" : "border-outline-variant hover:border-ink"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`flex h-6 w-6 items-center justify-center border ${selected ? "border-majestic-gold bg-majestic-gold" : "border-outline"}`}>
                          {selected && <span className="material-symbols-outlined text-[16px] text-ink">check</span>}
                        </span>
                        <span className="font-body-bold text-ink">{row.label}</span>
                      </span>
                      <span className="font-body-bold text-ink">
                        {sub.tiers ? `From ${currency.format(parsePrice(sub.price))}` : currency.format(parsePrice(sub.price))}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === "options" && (
            <div className="space-y-8">
              {optionServices.map((sub) => (
                <div key={sub.name} className="space-y-8">
                  {sub.tiers && (
                    <fieldset>
                      <legend className="font-headline-md text-headline-md text-ink">{sub.tierTitle ?? `Choose your ${sub.name.toLowerCase()}`}
                      </legend>
                      {sub.tiers.some((tier) => typeof tier.price === "string" && /\d\D+\d/.test(tier.price)) && (
                        <p className="mt-2 text-sm text-warm-slate">
                          Your deposit is the starting price. The final price depends on your hair and is confirmed in the salon.
                        </p>
                      )}
                      <div className={`mt-5 grid gap-3 ${sub.tiers.length > 3 ? "sm:grid-cols-2" : ""}`}>
                        {sub.tiers.map((tier) => {
                          const selected = tierChoices[sub.name]?.name === tier.name;
                          return (
                            <button
                              key={tier.name}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onClick={() => setTierChoices((prev) => ({ ...prev, [sub.name]: tier }))}
                              className={`flex min-h-[64px] items-center justify-between border px-4 py-3 text-left transition-all ${
                                selected ? "border-majestic-gold bg-majestic-gold/10" : "border-outline-variant hover:border-ink"
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-majestic-gold" : "border-outline"}`}>
                                  {selected && <span className="h-2.5 w-2.5 rounded-full bg-majestic-gold" />}
                                </span>
                                <span className="font-body-bold text-ink">{tier.label ?? tier.name}</span>
                              </span>
                              <span className="font-body-bold text-ink">{formatPriceRange(tier.price)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  )}

                  {(sub.questions ?? []).map((question, index) => {
                    const key = `${sub.name}:${question.id}`;
                    return (
                      <fieldset key={key}>
                        <legend className="text-label-caps font-label-caps text-warm-slate">
                          {index + 1}. {question.title}
                        </legend>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {question.options.map((option) => {
                            const selected = answers[key] === option.label;
                            return (
                              <button
                                key={option.label}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => setAnswers((prev) => ({ ...prev, [key]: option.label }))}
                                className={`border px-4 py-2 text-left text-sm transition-all ${
                                  selected
                                    ? "border-majestic-gold bg-majestic-gold/10 text-ink"
                                    : "border-outline-variant text-ink hover:border-ink"
                                }`}
                              >
                                <span className="font-body-bold">{option.label}</span>
                                {option.hint && <span className="block text-xs text-warm-slate">{option.hint}</span>}
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {step === "details" && (
            <div>
              <h3 className="font-headline-md text-headline-md text-ink">Client details</h3>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" className="border border-outline-variant px-4 py-3 font-body-base" />
                <input required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email address" type="email" className="border border-outline-variant px-4 py-3 font-body-base" />
                <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="MTN MoMo phone number" type="tel" className="border border-outline-variant px-4 py-3 font-body-base" />
                <div className="md:col-span-2">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-ink">
                    Appointment
                  </span>
                  <BookingCalendar
                    value={{ date: formData.date, time: formData.time }}
                    onChange={(selection) =>
                      setFormData({ ...formData, date: selection.date, time: selection.time })
                    }
                  />
                  <p className="mt-2 text-xs text-warm-slate">
                    {formData.date && formData.time
                      ? `Selected: ${formatLongDate(formData.date)} at ${formatSlot(formData.time)}.`
                      : "Open Monday to Saturday, 9:00 AM – 4:00 PM. Greyed-out days are closed or fully booked."}
                  </p>
                </div>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Notes or special requests" rows={4} className="border border-outline-variant px-4 py-3 font-body-base md:col-span-2" />
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div>
                <h3 className="font-headline-md text-headline-md text-ink">Payment method</h3>
                <div className="mt-5 space-y-3">
                  <button
                    onClick={() => setPaymentMethod("momo")}
                    className={`flex w-full items-center gap-4 border p-4 text-left ${paymentMethod === "momo" ? "border-majestic-gold bg-majestic-gold/10" : "border-outline-variant"}`}
                  >
                    <span className="material-symbols-outlined text-premium-green">phone_iphone</span>
                    <span>
                      <span className="block font-body-bold text-ink">MTN Mobile Money</span>
                      <span className="text-sm text-warm-slate">A payment prompt is sent to the customer phone.</span>
                    </span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex w-full items-center gap-4 border p-4 text-left ${paymentMethod === "card" ? "border-majestic-gold bg-majestic-gold/10" : "border-outline-variant"}`}
                  >
                    <span className="material-symbols-outlined text-ink">credit_card</span>
                    <span>
                      <span className="block font-body-bold text-ink">Card</span>
                      <span className="text-sm text-warm-slate">Recorded as pending until a card processor is connected.</span>
                    </span>
                  </button>
                </div>
              </div>
              <div className="border border-outline-variant bg-surface p-5">
                <p className="text-label-caps font-label-caps text-warm-slate">Booking summary</p>
                <div className="mt-4 space-y-3 text-sm text-warm-slate">
                  {bookedServices.map((service) => (
                    <div key={service.name} className="flex justify-between gap-3">
                      <span>{service.name}</span>
                      <span className="font-body-bold text-ink">{currency.format(parsePrice(service.price))}</span>
                    </div>
                  ))}
                  {optionsSummary.map((line) => (
                    <p key={line} className="text-xs">{line}</p>
                  ))}
                </div>
                <div className="mt-5 border-t border-outline-variant pt-4">
                  <div className="flex justify-between">
                    <span className="font-body-bold text-ink">Total</span>
                    <span className="font-headline-md text-2xl text-ink">{currency.format(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "receipt" && bookingResult && (
            <div className="mx-auto max-w-xl text-center">
              {/* Reflects the real payment state. A green tick regardless of
                  status would tell a customer their booking is paid while the
                  prompt is still unanswered — or after they declined it. The
                  booking itself is always saved by this point. */}
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  paymentResult?.status === "SUCCESSFUL"
                    ? "bg-premium-green/10 text-premium-green"
                    : paymentResult?.status === "FAILED" || paymentError
                      ? "bg-red-100 text-red-600"
                      : "bg-majestic-gold/15 text-majestic-gold"
                }`}
              >
                <span className={`material-symbols-outlined text-[38px] ${isAwaitingPayment ? "animate-pulse" : ""}`}>
                  {paymentResult?.status === "SUCCESSFUL"
                    ? "check_circle"
                    : paymentResult?.status === "FAILED" || paymentError
                      ? "error"
                      : "hourglass_top"}
                </span>
              </div>
              <p className="mt-5 text-label-caps font-label-caps text-champagne-taupe">Booking received</p>
              <h3 className="mt-2 font-headline-md text-4xl text-ink">
                {paymentResult?.status === "SUCCESSFUL"
                  ? "Payment confirmed"
                  : paymentResult?.status === "FAILED"
                    ? "Payment not completed"
                    : paymentError
                      ? "Booking saved, payment not started"
                      : isAwaitingPayment
                        ? "Awaiting approval"
                        : "Booking saved"}
              </h3>
              <p className="mt-3 font-body-base text-warm-slate">
                {isAwaitingPayment
                  ? "Approve the prompt on your phone. This page updates automatically."
                  : paymentError
                    ? `${paymentError} Your booking is saved — you can try again below.`
                    : paymentResult?.status === "FAILED"
                      ? "The Mobile Money payment did not go through. Your booking is saved — contact us to settle payment."
                      : paymentResult?.status === "PENDING"
                        ? "We did not get confirmation in time. If you approved the prompt, your payment may still be processing — contact us with the reference below."
                        : paymentResult?.message ||
                          "Your booking is saved. Payment will be settled at the salon."}
              </p>

              {/* The booking survived a failed payment, so offer the retry
                  rather than making the customer start over. */}
              {paymentError && !isAwaitingPayment && (
                <button
                  onClick={() => startMomoPayment(bookingResult.id)}
                  disabled={isSubmitting}
                  className="mt-5 bg-majestic-gold px-6 py-3 text-label-caps font-label-caps text-royal-navy transition-colors hover:bg-royal-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Starting..." : "Try MoMo again"}
                </button>
              )}
              <div className="mt-7 border border-outline-variant bg-surface p-5 text-left">
                <div className="flex justify-between border-b border-outline-variant pb-3">
                  <span className="text-sm text-warm-slate">Client</span>
                  <span className="font-body-bold text-ink">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant py-3">
                  <span className="text-sm text-warm-slate">Services</span>
                  <span className="max-w-[60%] text-right font-body-bold text-ink">{selectedNames}</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant py-3">
                  <span className="text-sm text-warm-slate">Reference</span>
                  <span className="font-body-bold text-ink">
                    {paymentResult?.referenceId ?? bookingResult.id}
                  </span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="font-body-bold text-ink">Total</span>
                  {/* The server's figure, not the browser's — this is what was
                      actually charged. They agree today; if they ever diverge,
                      the customer should see the authoritative one. */}
                  <span className="font-headline-md text-2xl text-ink">
                    {currency.format(bookingResult.amountDue || totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-outline-variant bg-surface px-6 py-5 md:px-8">
          <button
            onClick={() => (step === "services" || step === "receipt" ? handleClose() : goBack())}
            className="border border-ink px-5 py-3 text-label-caps font-label-caps text-ink transition-colors hover:bg-royal-navy hover:text-white"
          >
            {step === "services" || step === "receipt" ? "Close" : "Back"}
          </button>

          {stepIndex < steps.indexOf("payment") && (
            <button
              onClick={goNext}
              disabled={!canContinue}
              className="bg-royal-navy px-6 py-3 text-label-caps font-label-caps text-majestic-gold transition-colors hover:bg-midnight-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          )}

          {step === "payment" && (
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
