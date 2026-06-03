/**
 * Schema Validation & Utilities
 * 
 * This file provides validation functions, type guards, and utilities
 * for working with Erniekay Splendor data schemas.
 */

import type {
  Product,
  Course,
  CartItem,
  Order,
  User,
  Service,
  BridalPackage,
  BridalBooking,
  ServiceBooking,
  Enrollment,
  StudentGrade,
  ContactInquiry,
} from "./schemas";

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isProduct(obj: any): obj is Product {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.price === "number" &&
    typeof obj.brand === "string"
  );
}

export function isCourse(obj: any): obj is Course {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.level === "string" &&
    typeof obj.duration === "number"
  );
}

export function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.email === "string" &&
    typeof obj.firstName === "string" &&
    typeof obj.role === "string"
  );
}

export function isOrder(obj: any): obj is Order {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    Array.isArray(obj.items) &&
    typeof obj.total === "number" &&
    typeof obj.status === "string"
  );
}

export function isCartItem(obj: any): obj is CartItem {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.price === "number" &&
    typeof obj.quantity === "number" &&
    obj.quantity > 0
  );
}

export function isBridalBooking(obj: any): obj is BridalBooking {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.packageId === "string" &&
    obj.eventDate instanceof Date
  );
}

export function isServiceBooking(obj: any): obj is ServiceBooking {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.serviceId === "string" &&
    obj.bookingDate instanceof Date
  );
}

export function isEnrollment(obj: any): obj is Enrollment {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.courseId === "string" &&
    typeof obj.userId === "string" &&
    typeof obj.status === "string"
  );
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phone.length >= 10 && phoneRegex.test(phone);
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && Number.isFinite(price);
};

export const validateProductPrice = (product: Partial<Product>): string | null => {
  if (!product.price || !validatePrice(product.price)) {
    return "Price must be a positive number";
  }
  if (product.originalPrice && product.originalPrice <= product.price) {
    return "Original price must be greater than sale price";
  }
  return null;
};

export const validateCourse = (course: Partial<Course>): string[] => {
  const errors: string[] = [];

  if (!course.title || course.title.trim().length === 0) {
    errors.push("Course title is required");
  }

  if (!course.level || course.level.trim().length === 0) {
    errors.push("Course level is required");
  }

  if (!course.duration || course.duration <= 0) {
    errors.push("Course duration must be a positive number");
  }

  if (!course.maxStudents || course.maxStudents <= 0) {
    errors.push("Max students must be a positive number");
  }

  if (course.currentEnrollment && course.currentEnrollment > (course.maxStudents || 0)) {
    errors.push("Current enrollment cannot exceed max students");
  }

  if (!validatePrice(course.price || 0)) {
    errors.push("Course price must be a positive number");
  }

  return errors;
};

export const validateBooking = (booking: Partial<ServiceBooking>): string[] => {
  const errors: string[] = [];

  if (!booking.email || !validateEmail(booking.email)) {
    errors.push("Valid email is required");
  }

  if (!booking.phone || !validatePhone(booking.phone)) {
    errors.push("Valid phone number is required");
  }

  if (!booking.bookingDate || !(booking.bookingDate instanceof Date)) {
    errors.push("Valid booking date is required");
  } else if (booking.bookingDate < new Date()) {
    errors.push("Booking date must be in the future");
  }

  if (!booking.duration || booking.duration <= 0) {
    errors.push("Duration must be a positive number");
  }

  if (!booking.cost || !validatePrice(booking.cost)) {
    errors.push("Cost must be a positive number");
  }

  return errors;
};

export const validateBridalBooking = (booking: Partial<BridalBooking>): string[] => {
  const errors = validateBooking(booking as Partial<ServiceBooking>);

  if (!booking.packageId || booking.packageId.trim().length === 0) {
    errors.push("Package selection is required");
  }

  if (!booking.eventDate || !(booking.eventDate instanceof Date)) {
    errors.push("Valid event date is required");
  } else if (booking.eventDate < new Date()) {
    errors.push("Event date must be in the future");
  }

  if (!booking.totalCost || !validatePrice(booking.totalCost)) {
    errors.push("Total cost must be a positive number");
  }

  return errors;
};

export const validateContactInquiry = (inquiry: Partial<ContactInquiry>): string[] => {
  const errors: string[] = [];

  if (!inquiry.name || inquiry.name.trim().length === 0) {
    errors.push("Name is required");
  }

  if (!inquiry.email || !validateEmail(inquiry.email)) {
    errors.push("Valid email is required");
  }

  if (!inquiry.subject || inquiry.subject.trim().length === 0) {
    errors.push("Subject is required");
  }

  if (!inquiry.message || inquiry.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  }

  if (!inquiry.inquiryType) {
    errors.push("Inquiry type is required");
  }

  return errors;
};

// ============================================================================
// FORMATTING & CONVERSION
// ============================================================================

export const formatPrice = (price: number, currency: string = "USD"): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  });
  return formatter.format(price);
};

export const formatDate = (date: Date, format: "short" | "long" | "full" = "short"): string => {
  const options: Intl.DateTimeFormatOptions =
    format === "short"
      ? { year: "numeric", month: "short", day: "numeric" }
      : format === "long"
        ? { year: "numeric", month: "long", day: "numeric", weekday: "long" }
        : { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };

  return new Date(date).toLocaleDateString("en-US", options);
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export const calculateOrderTotal = (
  subtotal: number,
  taxRate: number = 0.08,
  shippingCost: number = 0
): number => {
  const tax = subtotal * taxRate;
  return subtotal + tax + shippingCost;
};

// ============================================================================
// FILTERING & SORTING
// ============================================================================

export const filterProductsByPrice = (
  products: Product[],
  minPrice: number,
  maxPrice: number
): Product[] => {
  return products.filter((p) => p.price >= minPrice && p.price <= maxPrice);
};

export const filterProductsByCategory = (
  products: Product[],
  category: string
): Product[] => {
  return products.filter((p) => p.category === category);
};

export const sortProductsByPrice = (
  products: Product[],
  order: "asc" | "desc" = "asc"
): Product[] => {
  return [...products].sort((a, b) => (order === "asc" ? a.price - b.price : b.price - a.price));
};

export const sortProductsByRating = (
  products: Product[],
  order: "asc" | "desc" = "desc"
): Product[] => {
  return [...products].sort((a, b) => {
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    return order === "desc" ? ratingB - ratingA : ratingA - ratingB;
  });
};

export const filterCoursesByLevel = (
  courses: Course[],
  level: string
): Course[] => {
  return courses.filter((c) => c.level === level);
};

export const filterCoursesByCategory = (
  courses: Course[],
  category: string
): Course[] => {
  return courses.filter((c) => c.category === category);
};

export const filterAvailableCourses = (courses: Course[]): Course[] => {
  return courses.filter((c) => c.status === "active" && c.currentEnrollment < c.maxStudents);
};

// ============================================================================
// CALCULATIONS
// ============================================================================

export const calculateCartTotal = (items: CartItem[], taxRate: number = 0.08): number => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  return subtotal + tax;
};

export const calculateAverageRating = (products: Product[]): number => {
  if (products.length === 0) return 0;
  const sum = products.reduce((acc, p) => acc + (p.rating || 0), 0);
  return sum / products.length;
};

export const calculateCourseProgress = (
  enrollment: Enrollment,
  totalWeeks: number
): number => {
  if (totalWeeks === 0) return 0;
  return Math.round((enrollment.attendance.length / totalWeeks) * 100);
};

export const calculateGPA = (grades: StudentGrade[]): number => {
  if (grades.length === 0) return 0;
  const gradeValues: Record<string, number> = {
    A: 4.0,
    B: 3.0,
    C: 2.0,
    D: 1.0,
    F: 0.0,
  };
  const sum = grades.reduce((acc, g) => acc + (gradeValues[g.letterGrade] || 0), 0);
  return sum / grades.length;
};

// ============================================================================
// STATUS & STATE CHECKS
// ============================================================================

export const isOrderCompleted = (order: Order): boolean => {
  return order.status === "delivered";
};

export const isOrderCancelled = (order: Order): boolean => {
  return order.status === "cancelled";
};

export const isBookingConfirmed = (booking: ServiceBooking | BridalBooking): boolean => {
  return booking.status === "confirmed" || booking.status === "completed";
};

export const isEnrollmentActive = (enrollment: Enrollment): boolean => {
  return enrollment.status === "active";
};

export const isEnrollmentCompleted = (enrollment: Enrollment): boolean => {
  return enrollment.status === "completed";
};

export const isCourseAvailable = (course: Course): boolean => {
  return course.status === "active" && course.currentEnrollment < course.maxStudents;
};

// ============================================================================
// SEARCH & MATCHING
// ============================================================================

export const searchProducts = (products: Product[], query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(lowercaseQuery) ||
      p.subtitle.toLowerCase().includes(lowercaseQuery) ||
      (p.description && p.description.toLowerCase().includes(lowercaseQuery)) ||
      (p.category && p.category.toLowerCase().includes(lowercaseQuery))
  );
};

export const searchCourses = (courses: Course[], query: string): Course[] => {
  const lowercaseQuery = query.toLowerCase();
  return courses.filter(
    (c) =>
      c.title.toLowerCase().includes(lowercaseQuery) ||
      c.subtitle?.toLowerCase().includes(lowercaseQuery) ||
      c.description.toLowerCase().includes(lowercaseQuery) ||
      (c.category && c.category.toLowerCase().includes(lowercaseQuery))
  );
};

// ============================================================================
// DATA TRANSFORMATION
// ============================================================================

export const cartItemToOrderLineItem = (item: CartItem) => {
  return {
    id: item.id,
    productId: item.productId,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
  };
};

export const productToCartItem = (product: Product, quantity: number = 1): CartItem => {
  return {
    id: `cart-${product.id}-${Date.now()}`,
    productId: product.id,
    title: product.title,
    price: product.price,
    quantity,
    imgSrc: product.imgSrc,
  };
};

// ============================================================================
// CONSTANTS
// ============================================================================

export const PRODUCT_CATEGORIES = [
  "skincare",
  "haircare",
  "tools",
  "accessories",
  "kits",
] as const;

export const COURSE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Certified Level I",
  "Certified Level II",
  "Certified Level III",
] as const;

export const COURSE_CATEGORIES = [
  "bridal",
  "hair",
  "makeup",
  "skincare",
  "nails",
  "business",
] as const;

export const SERVICE_CATEGORIES = [
  "hair",
  "makeup",
  "skincare",
  "nails",
  "bridal",
  "consultation",
] as const;

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no-show",
] as const;

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const ENROLLMENT_STATUSES = [
  "pending",
  "active",
  "completed",
  "dropped",
] as const;

export const LETTER_GRADES = ["A", "B", "C", "D", "F"] as const;

export const INQUIRY_TYPES = [
  "general",
  "bridal",
  "academy",
  "booking",
  "partnership",
  "media",
] as const;

export const USER_ROLES = ["customer", "student", "artist", "admin"] as const;

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const GALLERY_CATEGORIES = [
  "Hair",
  "Makeup",
  "Skincare",
  "Nails",
  "Bridal",
  "Editorial",
] as const;
