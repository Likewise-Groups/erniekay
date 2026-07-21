export const salonUrl = process.env.NEXT_PUBLIC_SALON_APP_URL || "http://localhost:3001";

export const money = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
});

export const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export const dayLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

export const getStatusClass = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "COMPLETED":
      return "border-slate-200 bg-slate-50 text-slate-800";
    case "CANCELLED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
};

export const statusOptions = ["CONFIRMED", "COMPLETED", "CANCELLED"];

export const parseFeatures = (features: string | null) => {
  if (!features) return [];

  try {
    const parsed = JSON.parse(features);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return features
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

export const formatDate = (date: Date) => dateTime.format(date);
