/**
 * QUICK REFERENCE GUIDE
 * 
 * Fast lookup for common data schema tasks
 */

# Data Schemas - Quick Reference

## Import Everything You Need

```typescript
// All types and utilities in one import
import {
  // Main types
  Product,
  Course,
  Order,
  Cart,
  User,
  Service,
  BridalBooking,
  Enrollment,
  
  // Validation
  validateEmail,
  validateBooking,
  validateCourse,
  isProduct,
  isCourse,
  
  // Formatting
  formatPrice,
  formatDate,
  formatDuration,
  
  // Calculations
  calculateCartTotal,
  calculateCourseProgress,
  
  // Search/Filter
  searchProducts,
  filterProductsByPrice,
  
  // Constants
  PRODUCT_CATEGORIES,
  COURSE_LEVELS,
  BOOKING_STATUSES,
  ORDER_STATUSES,
  
  // Mock data
  MOCK_PRODUCTS,
  MOCK_COURSES,
  MOCK_USERS,
} from "@/types";
```

## Most Common Data Structures

### Product
```typescript
const product: Product = {
  id: "prod-1",
  brand: "Erniekay Splendor",
  title: "Signature Serum",
  price: 45,
  category: "haircare",
  stock: 100,
  imgSrc: "...",
  imgAlt: "...",
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Course
```typescript
const course: Course = {
  id: "course-1",
  title: "Bridal Masterclass",
  level: "Certified Level III",
  category: "bridal",
  duration: 12,
  price: 2500,
  maxStudents: 12,
  currentEnrollment: 8,
  instructor: "user-1",
  schedule: {
    frequency: "weekly",
    daysOfWeek: ["Monday", "Wednesday"],
    startTime: "10:00",
    endTime: "13:00",
    timezone: "EST",
    format: "in-person",
  },
  syllabus: [],
  imgSrc: "...",
  imgAlt: "...",
  status: "active",
  startDate: new Date("2024-09-01"),
  endDate: new Date("2024-11-24"),
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Order
```typescript
const order: Order = {
  id: "order-1",
  userId: "user-1",
  items: [
    { id: "li-1", productId: "prod-1", title: "Serum", price: 45, quantity: 1 }
  ],
  subtotal: 45,
  tax: 3.60,
  shipping: 10,
  total: 58.60,
  status: "confirmed",
  shippingAddress: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
  },
  billingAddress: { /* same structure */ },
  paymentMethod: { type: "credit_card", last4: "4242" },
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### BridalBooking
```typescript
const booking: BridalBooking = {
  id: "booking-1",
  packageId: "pkg-1",
  userId: "user-1",
  email: "bride@example.com",
  phone: "+1-555-0100",
  eventDate: new Date("2025-06-15"),
  eventType: "wedding",
  serviceType: "bridal",
  status: "confirmed",
  artistAssigned: "artist-1",
  totalCost: 2500,
  depositPaid: 500,
  balanceDue: 2000,
  paymentStatus: "partial",
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

## Validation Patterns

### Validate Email
```typescript
if (!validateEmail(email)) {
  setError("Invalid email address");
}
```

### Validate Booking
```typescript
const errors = validateBooking({
  email: userEmail,
  phone: userPhone,
  bookingDate: selectedDate,
  duration: 60,
  cost: 150,
});

if (errors.length > 0) {
  setErrors(errors); // Show to user
  return;
}
```

### Validate Course
```typescript
const courseErrors = validateCourse({
  title: courseTitle,
  level: courseLevel,
  duration: courseDuration,
  maxStudents: maxStudents,
  price: coursePrice,
});
```

### Check Type Safety
```typescript
if (isProduct(data)) {
  // Safe to use product-specific properties
  console.log(data.stock);
  console.log(data.category);
}

if (isCourse(data)) {
  console.log(data.level);
  console.log(data.duration);
}
```

## Formatting for Display

```typescript
// Price
<span>{formatPrice(product.price, "USD")}</span>
// Output: "$45.00"

// Date
<span>{formatDate(order.createdAt, "long")}</span>
// Output: "June 3, 2024, Monday"

// Duration
<span>{formatDuration(90)}</span>
// Output: "1h 30m"
```

## Calculations

```typescript
// Cart total with tax
const total = calculateCartTotal(cartItems, 0.08); // 8% tax

// Course progress
const progress = calculateCourseProgress(enrollment, 12); // percent complete

// Student GPA
const gpa = calculateGPA(studentGrades); // 0-4.0 scale

// Order total
const orderTotal = calculateOrderTotal(subtotal, 0.08, 10); // with tax & shipping
```

## Search & Filter

```typescript
// Search products
const results = searchProducts(products, "serum");

// Filter by price
const affordable = filterProductsByPrice(products, 20, 100);

// Filter by category
const hairProducts = filterProductsByCategory(products, "haircare");

// Filter available courses
const openCourses = filterAvailableCourses(courses);

// Sort products
const cheapest = sortProductsByPrice(products, "asc");
const topRated = sortProductsByRating(products, "desc");
```

## Constants Reference

```typescript
// Product categories
["skincare", "haircare", "tools", "accessories", "kits"]

// Course levels
["Beginner", "Intermediate", "Advanced", "Certified Level I", "Certified Level II", "Certified Level III"]

// Service types
["hair", "makeup", "skincare", "nails", "bridal", "consultation"]

// Booking statuses
["pending", "confirmed", "completed", "cancelled", "no-show"]

// Order statuses
["pending", "confirmed", "shipped", "delivered", "cancelled"]

// Enrollment statuses
["pending", "active", "completed", "dropped"]

// Letter grades
["A", "B", "C", "D", "F"]

// User roles
["customer", "student", "artist", "admin"]

// Days of week
["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
```

## Cart Management

```typescript
import { useCart } from "@/context/CartContext";

// In component
const { items, count, total, addItem, removeItem, updateQuantity, clearCart } = useCart();

// Add item to cart
addItem({
  productId: "prod-1",
  title: "Serum",
  price: 45,
  quantity: 1,
  imgSrc: "...",
});

// Update quantity
updateQuantity("cart-item-1", 3);

// Remove item
removeItem("cart-item-1");

// Get cart info
console.log(`Items: ${count}, Total: $${total}`);

// Clear entire cart
clearCart();
```

## Common Workflows

### Product Listing with Filters
```typescript
const [products, setProducts] = useState<Product[]>([]);
const [category, setCategory] = useState<string>("skincare");
const [priceRange, setPriceRange] = useState([20, 100]);

const filtered = products
  .filter((p) => p.category === category)
  .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
  .sort((a, b) => a.price - b.price);
```

### Course Enrollment
```typescript
const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

const handleEnroll = async () => {
  if (!selectedCourse || !isCourse(selectedCourse)) return;
  if (!validateCourse(selectedCourse)) return;
  
  // Call API to create enrollment
  const newEnrollment = await enrollCourse(selectedCourse.id);
  setEnrollment(newEnrollment);
};
```

### Booking Management
```typescript
const [bookingData, setBookingData] = useState<Partial<ServiceBooking>>({});

const handleBookingSubmit = () => {
  const errors = validateBooking(bookingData);
  
  if (errors.length > 0) {
    showErrors(errors);
    return;
  }
  
  // Submit to API
  submitBooking(bookingData);
};
```

## Type Safety Tips

### Use `type` for imports
```typescript
// Good
import type { Product, Course } from "@/types";

// Less efficient at runtime
import { Product, Course } from "@/types";
```

### Always check before accessing
```typescript
// Safe
if (data.category === "haircare") { }

// Better (with type guard)
if (isProduct(data) && data.category === "haircare") { }
```

### Handle optional fields
```typescript
// For optional fields
product.originalPrice || product.price

// Or with nullish coalescing
product.originalPrice ?? product.price

// Or with optional chaining
order.tracking?.number
```

## Error Handling Pattern

```typescript
interface ValidationError {
  field: string;
  errors: string[];
}

try {
  const errors = validateBooking(formData);
  
  if (errors.length > 0) {
    throw new ValidationError("Booking validation failed", errors);
  }
  
  const result = await submitBooking(formData);
  return result;
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors
    displayFieldErrors(error.errors);
  } else {
    // Handle API errors
    displayErrorMessage(error.message);
  }
}
```

## Testing with Mock Data

```typescript
import { MOCK_PRODUCTS, MOCK_COURSES, MOCK_USERS } from "@/types";

describe("ProductCard", () => {
  it("renders product correctly", () => {
    const product = MOCK_PRODUCTS[0];
    render(<ProductCard product={product} />);
    expect(screen.getByText(product.title)).toBeInTheDocument();
  });
});
```

## Database Schema Reference

### For SQL (MySQL/PostgreSQL)
See `types/mockData.ts` for complete CREATE TABLE statements

### For MongoDB
See `types/mockData.ts` for collection validators

### Key Tables/Collections
- users
- products
- orders
- cart
- courses
- enrollments
- services
- service_bookings
- bridal_packages
- bridal_bookings
- gallery_items
- contact_inquiries
- newsletter

## Useful Enums for Switches

```typescript
// Product filtering
switch (category) {
  case "skincare":
    return skincarePage();
  case "haircare":
    return haircarePage();
  // ...
}

// Order status
switch (order.status) {
  case "pending":
    return <PendingOrderView />;
  case "shipped":
    return <ShippedOrderView />;
  case "delivered":
    return <DeliveredOrderView />;
  // ...
}

// Course levels
const coursesByLevel = courses.reduce((acc, course) => {
  acc[course.level] = (acc[course.level] || []).concat(course);
  return acc;
}, {} as Record<string, Course[]>);
```

## Performance Tips

### Memoization
```typescript
import { useMemo } from "react";

const filteredProducts = useMemo(
  () => filterProductsByPrice(products, min, max),
  [products, min, max]
);
```

### Debounce search
```typescript
import { useCallback, useRef } from "react";

const handleSearch = useCallback(
  debounce((query: string) => {
    const results = searchProducts(products, query);
    setResults(results);
  }, 300),
  [products]
);
```

## Common Status Checks

```typescript
// Is order completed?
if (isOrderCompleted(order)) { }

// Is booking confirmed?
if (isBookingConfirmed(booking)) { }

// Is student active in course?
if (isEnrollmentActive(enrollment)) { }

// Is course available?
if (isCourseAvailable(course)) { }
```

---

**For complete documentation**, see:
- `types/schemas.ts` - Type definitions
- `types/validation.ts` - Validation functions
- `types/README.md` - Full guide
- `types/api-endpoints.md` - API documentation
