/**
 * Erniekay Splendor - Core Data Schemas
 * 
 * This file contains all TypeScript interfaces and types for:
 * - E-commerce (Products, Cart, Orders)
 * - Academy (Courses, Enrollments, Students, Grades)
 * - Bridal Services (Packages, Bookings, Consultations)
 * - User Management (Profiles, Authentication)
 * - Content Management (Gallery, Team, Services)
 * - Transactions & Analytics
 */

// ============================================================================
// AUTHENTICATION & USER MANAGEMENT
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: "customer" | "student" | "artist" | "admin";
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface UserProfile extends User {
  bio?: string;
  specializations?: string[]; // For artists
  socialLinks?: {
    instagram?: string;
    portfolio?: string;
  };
  preferredServices?: string[]; // Service IDs
  bookingHistory?: string[]; // Booking IDs
}

// ============================================================================
// E-COMMERCE: PRODUCTS & SHOPPING
// ============================================================================

export interface Product {
  id: string;
  brand: string;
  title: string;
  subtitle: string;
  description?: string;
  price: number;
  originalPrice?: number;
  badge?: "BESTSELLER" | "NEW" | "LIMITED" | "SALE";
  category: "skincare" | "haircare" | "tools" | "accessories" | "kits";
  imgSrc: string;
  imgAlt: string;
  images?: string[]; // Additional product images
  sku?: string;
  stock: number;
  ingredients?: string[];
  benefits?: string[];
  rating?: number;
  reviews?: ProductReview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imgSrc?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderLineItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
  deliveryDate?: Date;
}

export interface OrderLineItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: "credit_card" | "debit_card" | "paypal";
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

// ============================================================================
// ACADEMY: COURSES & EDUCATION
// ============================================================================

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Certified Level I" | "Certified Level II" | "Certified Level III";
  category: "bridal" | "hair" | "makeup" | "skincare" | "nails" | "business";
  duration: number; // in weeks
  schedule: CourseSchedule;
  price: number;
  maxStudents: number;
  currentEnrollment: number;
  instructor: string; // User ID
  instructorName?: string;
  syllabus: CourseSyllabus[];
  requirements?: string[];
  certification?: {
    type: string;
    issuedBy: string;
  };
  imgSrc: string;
  imgAlt: string;
  status: "active" | "full" | "archived";
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseSchedule {
  frequency: "weekly" | "biweekly" | "monthly";
  daysOfWeek: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[];
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  timezone: string;
  format: "in-person" | "online" | "hybrid";
  location?: string;
}

export interface CourseSyllabus {
  week: number;
  title: string;
  topics: string[];
  assignments?: string[];
  resources?: {
    type: "video" | "document" | "link";
    title: string;
    url: string;
  }[];
}

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  status: "pending" | "active" | "completed" | "dropped";
  enrollmentDate: Date;
  completionDate?: Date;
  certificateIssued: boolean;
  certificateUrl?: string;
  amountPaid: number;
  attendance: AttendanceRecord[];
  assignments: AssignmentSubmission[];
  finalGrade?: number;
}

export interface AttendanceRecord {
  date: Date;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentTitle: string;
  submissionDate: Date;
  dueDate: Date;
  status: "submitted" | "graded" | "resubmitted";
  score?: number;
  feedback?: string;
  submissionUrl?: string;
}

export interface StudentGrade {
  id: string;
  enrollmentId: string;
  courseId: string;
  userId: string;
  weeklyScores?: Record<number, number>; // week number -> score
  midtermScore?: number;
  finalScore: number;
  letterGrade: "A" | "B" | "C" | "D" | "F";
  comments?: string;
  updatedAt: Date;
}

export interface StudentPortfolioItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: "hair" | "makeup" | "skincare" | "nails" | "bridal" | "editorial";
  images: string[];
  beforeAndAfter?: {
    before: string;
    after: string;
  };
  techniques?: string[];
  products?: string[]; // Product IDs used
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// BRIDAL SERVICES
// ============================================================================

export interface BridalPackage {
  id: string;
  title: string;
  description: string;
  /** Fixed price; omit when the package is priced by `priceRange` instead. */
  price?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  duration: number; // in minutes
  features: string[];
  services: BridalService[];
  featured: boolean;
  image: {
    src: string;
    alt: string;
  };
  consultationIncluded: boolean;
  revision?: {
    included: boolean;
    count?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface BridalService {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  category: "hair" | "makeup" | "skincare" | "nails" | "consultation";
  includes?: string[];
}

export interface BridalBooking {
  id: string;
  packageId: string;
  userId: string;
  email: string;
  phone: string;
  eventDate: Date;
  eventType: "wedding" | "engagement" | "pre-wedding" | "other";
  serviceType: "bridal" | "bridal-party" | "groom" | "guest";
  weddingTheme?: string;
  venueName?: string;
  notes?: string;
  status: "inquiry" | "booked" | "confirmed" | "completed" | "cancelled";
  artistAssigned?: string; // User ID
  consultationDate?: Date;
  totalCost: number;
  depositPaid: number;
  balanceDue: number;
  paymentStatus: "pending" | "partial" | "paid";
  attachments?: {
    inspirationPhotos?: string[];
    designSketch?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  confirmationDate?: Date;
}

export interface BridalConsultation {
  id: string;
  bookingId: string;
  userId: string;
  artistId: string;
  scheduledDate: Date;
  durationMinutes: number;
  format: "in-person" | "virtual";
  notes?: string;
  inspirationSubmitted?: boolean;
  inspirationPhotos?: string[];
  outcome?: "approved" | "revision_needed" | "pending";
  revisions?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// BOOKING & APPOINTMENTS
// ============================================================================

export interface ServiceBooking {
  id: string;
  userId: string;
  email: string;
  phone: string;
  serviceId: string;
  artistId?: string;
  bookingDate: Date;
  timeSlot: string; // "HH:mm"
  duration: number; // in minutes
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show";
  notes?: string;
  cost: number;
  paid: boolean;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: "hair" | "makeup" | "skincare" | "nails" | "bridal" | "consultation";
  duration: number; // in minutes
  price: number;
  availability: ServiceAvailability;
  artist?: string; // User ID - if service-specific
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceAvailability {
  schedule: DaySchedule[];
  blackoutDates?: Date[];
  bookingWindowDays: number; // How many days in advance can be booked
}

export interface DaySchedule {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  isOpen: boolean;
  breakTimes?: {
    start: string;
    end: string;
  }[];
}

// ============================================================================
// GALLERY & PORTFOLIO
// ============================================================================

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: "hair" | "makeup" | "skincare" | "nails" | "bridal" | "editorial" | "transformation";
  tags?: string[];
  images: GalleryImage[];
  artist?: string; // User ID
  artistName?: string;
  beforeAndAfter?: boolean;
  techniques?: string[];
  productsUsed?: string[]; // Product IDs
  featuredInPromo?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  src: string;
  alt: string;
  position: number;
}

export interface GalleryCategory {
  id: string;
  name: "Hair" | "Makeup" | "Skincare" | "Nails" | "Bridal" | "Editorial";
  description?: string;
  icon?: string;
  itemCount: number;
  featured: boolean;
}

// ============================================================================
// TEAM & ARTIST MANAGEMENT
// ============================================================================

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  role: "Founder & Creative Director" | "Lead Hair Educator & Colorist" | "Lead Skincare & Makeup Specialist" | "Hair Stylist" | "Makeup Artist" | "Skincare Expert" | "Educator" | "Admin";
  bio: string;
  specializations: string[]; // ["bridal", "editorial", "commercial", etc.]
  certifications?: string[];
  yearsOfExperience: number;
  imgSrc: string;
  imgAlt: string;
  portfolio?: string; // Portfolio URL or ID
  socialLinks?: {
    instagram?: string;
    portfolio?: string;
  };
  availability?: ServiceAvailability;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CONTACT & INQUIRIES
// ============================================================================

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: "general" | "bridal" | "academy" | "booking" | "partnership" | "media";
  status: "new" | "in-progress" | "responded" | "resolved";
  priority?: "low" | "normal" | "high";
  attachments?: string[];
  createdAt: Date;
  respondedAt?: Date;
  assignedTo?: string; // User ID
}

export interface Newsletter {
  id: string;
  email: string;
  firstName?: string;
  interests?: ("products" | "courses" | "bridal" | "gallery" | "news")[];
  subscribedAt: Date;
  unsubscribedAt?: Date;
  isActive: boolean;
}

// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

export interface UserActivity {
  id: string;
  userId: string;
  action: "view_product" | "add_to_cart" | "purchase" | "enroll_course" | "complete_course" | "book_service" | "view_gallery";
  resourceId?: string;
  resourceType?: "product" | "course" | "service" | "gallery";
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface BusinessMetrics {
  id: string;
  period: "daily" | "weekly" | "monthly";
  date: Date;
  metrics: {
    totalRevenue: number;
    productSales: number;
    serviceSales: number;
    courseEnrollments: number;
    totalOrders: number;
    totalBookings: number;
    newCustomers: number;
    activeStudents: number;
  };
}

// ============================================================================
// PROMOTIONAL & MARKETING
// ============================================================================

export interface Promotion {
  id: string;
  code: string;
  description?: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  minPurchaseAmount?: number;
  maxUsageCount?: number;
  currentUsageCount: number;
  applicableTo: ("products" | "courses" | "services")[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
}

// ============================================================================
// SETTINGS & CONFIGURATION
// ============================================================================

export interface BusinessSettings {
  id: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: Address;
  operatingHours: DaySchedule[];
  socialLinks: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
  currency: string; // "USD", "GBP", etc.
  timezone: string;
  taxRate: number;
  shippingRates?: {
    domestic: number;
    international: number;
  };
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    routingNumber?: string;
  };
  updatedAt: Date;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    timestamp: Date;
    requestId?: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// ============================================================================
// FILTER & SEARCH TYPES
// ============================================================================

export interface ProductFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  badge?: string;
  rating?: number;
  inStock?: boolean;
}

export interface CourseFilters {
  level?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  startDate?: Date;
  availability?: "available" | "full" | "archived";
}

export interface GalleryFilters {
  category?: string;
  tags?: string[];
  artist?: string;
  featured?: boolean;
}
