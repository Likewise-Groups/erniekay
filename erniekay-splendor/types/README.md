# Data Schemas Documentation

## Overview

This document provides comprehensive documentation for all data schemas used in the Erniekay Splendor application. These schemas define the structure of data across all features:

- **E-Commerce**: Products, Shopping Cart, Orders
- **Academy**: Courses, Enrollments, Student Grades, Portfolio
- **Bridal Services**: Packages, Bookings, Consultations
- **Services**: General service booking system
- **User Management**: Authentication, Profiles, Roles
- **Content**: Gallery, Team, Contact Inquiries
- **Marketing**: Promotions, Newsletter
- **Analytics**: Business Metrics, User Activity

## Files Structure

```
types/
├── index.ts                 # Main export file
├── schemas.ts              # Core TypeScript interfaces
├── validation.ts           # Validation functions & utilities
├── mockData.ts            # Mock data for development/testing
└── api-endpoints.md       # API endpoint documentation
```

## Quick Start

### Import Types

```typescript
import { Product, Course, Order, User, Cart } from "@/types";
import { validateEmail, formatPrice, isProduct } from "@/types";
```

### Use in Components

```typescript
import { Product } from "@/types/schemas";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return <div>{product.title} - {formatPrice(product.price)}</div>;
}
```

### Validate Data

```typescript
import { validateEmail, validateBooking } from "@/types/validation";

const errors = validateBooking({
  email: "user@example.com",
  phone: "+1-555-0100",
  bookingDate: new Date("2024-07-15"),
  duration: 60,
  cost: 150,
});

if (errors.length > 0) {
  console.error("Validation failed:", errors);
}
```

## Schema Categories

### 1. Authentication & Users

#### User
Core user object representing any authenticated user.

**Fields:**
- `id`: Unique identifier
- `email`: User's email address (unique)
- `firstName`, `lastName`: User's name
- `phone`: Optional phone number
- `avatar`: Optional avatar URL
- `role`: One of `"customer"`, `"student"`, `"artist"`, `"admin"`
- `createdAt`, `updatedAt`: Timestamps
- `isActive`: Account status

**Example:**
```typescript
const user: User = {
  id: "user-123",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "customer",
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
};
```

**Related Types:**
- `UserProfile`: Extended user with bio, specializations, social links
- `TeamMember`: Artist-specific profile with certifications

### 2. E-Commerce

#### Product
Represents a beauty/salon product available for purchase.

**Fields:**
- `id`: Unique product identifier
- `brand`, `title`, `subtitle`: Product naming
- `price`: Current price
- `originalPrice`: For sale items
- `category`: One of predefined categories
- `stock`: Available quantity
- `rating`: Customer rating (0-5)
- `badge`: Optional badge (BESTSELLER, NEW, etc.)
- `images`: Product photos
- `reviews`: Array of customer reviews

**Categories:**
- `skincare`
- `haircare`
- `tools`
- `accessories`
- `kits`

**Example:**
```typescript
const product: Product = {
  id: "prod-001",
  brand: "Erniekay Splendor",
  title: "Royal Hydra-Cream",
  price: 120,
  originalPrice: 150,
  category: "skincare",
  stock: 100,
  rating: 4.9,
  badge: "BESTSELLER",
  // ... other fields
};
```

#### Cart & CartItem
Shopping cart management.

**CartItem:**
- `id`: Unique item ID
- `productId`: Reference to Product
- `title`, `price`: Product info
- `quantity`: Number of items
- `imgSrc`: Optional product image

**Cart:**
- `id`: Cart identifier
- `userId`: Owner reference
- `items`: Array of CartItems
- `subtotal`, `tax`, `total`: Price calculations

#### Order
Finalized purchase.

**Status Values:**
- `pending`: Order received, awaiting confirmation
- `confirmed`: Order confirmed
- `shipped`: In transit
- `delivered`: Received by customer
- `cancelled`: Order cancelled

**Includes:**
- Shipping and billing addresses
- Payment information
- Order items and totals
- Tracking information

### 3. Academy (Courses & Training)

#### Course
Professional training program.

**Fields:**
- `title`, `subtitle`, `description`: Course information
- `level`: Certification level (Beginner to Certified Level III)
- `category`: Course type (bridal, hair, makeup, etc.)
- `duration`: Length in weeks
- `price`: Cost of enrollment
- `maxStudents`: Class size limit
- `currentEnrollment`: Current registered students
- `instructor`: Reference to User (instructor)
- `schedule`: CourseSchedule object with meeting times
- `syllabus`: Array of CourseSyllabus (weekly breakdown)

**Levels:**
- Beginner
- Intermediate
- Advanced
- Certified Level I
- Certified Level II
- Certified Level III

**Example:**
```typescript
const course: Course = {
  id: "course-bridal-001",
  title: "Masterclass in Bridal Artistry",
  level: "Certified Level III",
  category: "bridal",
  duration: 12,
  price: 2500,
  maxStudents: 12,
  currentEnrollment: 8,
  instructor: "user-1",
  schedule: {
    frequency: "weekly",
    daysOfWeek: ["Monday", "Wednesday", "Friday"],
    startTime: "10:00",
    endTime: "13:00",
    timezone: "EST",
    format: "in-person",
    location: "Studio, NYC",
  },
  // ... other fields
};
```

#### Enrollment
Student registration in a course.

**Status Values:**
- `pending`: Application submitted
- `active`: Currently enrolled
- `completed`: Course finished
- `dropped`: Student withdrew

**Includes:**
- Attendance records
- Assignment submissions
- Grades
- Certificate information

#### StudentGrade
Grades for a student in a course.

**Letter Grades:** A, B, C, D, F

#### StudentPortfolioItem
Portfolio work submitted by students.

**Categories:**
- hair
- makeup
- skincare
- nails
- bridal
- editorial

### 4. Bridal Services

#### BridalPackage
Pre-designed bridal service packages.

**Fields:**
- `title`: Package name
- `description`: Package description
- `price`: Single price or priceRange
- `duration`: In minutes
- `features`: Array of included services
- `services`: Array of BridalService objects
- `featured`: Highlighted package flag
- `consultationIncluded`: Boolean
- `revision`: Revision policy

**Example:**
```typescript
const package: BridalPackage = {
  id: "pkg-traditional",
  title: "Traditional Splendor",
  description: "Cultural bridal artistry",
  priceRange: { min: 2500, max: 3500 },
  duration: 180,
  features: [
    "Multi-day Styling Support",
    "Detailed Jewelry Setting",
    "Luxury Hair & Face Contour",
  ],
  featured: true,
  consultationIncluded: true,
  revision: { included: true, count: 3 },
  // ... other fields
};
```

#### BridalBooking
Customer booking for bridal services.

**Status Values:**
- `inquiry`: Initial inquiry
- `booked`: Tentatively booked
- `confirmed`: Confirmed appointment
- `completed`: Service delivered
- `cancelled`: Booking cancelled

**Payment Status:**
- `pending`: No payment
- `partial`: Deposit paid
- `paid`: Fully paid

#### BridalConsultation
Pre-service consultation.

**Includes:**
- Scheduled date and format (in-person/virtual)
- Inspiration photo submission
- Artist notes
- Approval status

### 5. Services & Bookings

#### Service
Individual service offering.

**Categories:**
- hair
- makeup
- skincare
- nails
- bridal
- consultation

**Includes:**
- Duration and price
- Availability schedule
- Associated artist (optional)

#### ServiceBooking
General service appointment.

**Status Values:**
- `pending`: Awaiting confirmation
- `confirmed`: Confirmed appointment
- `completed`: Service completed
- `cancelled`: Booking cancelled
- `no-show`: Customer didn't appear

### 6. Gallery & Portfolio

#### GalleryItem
Portfolio work displayed in gallery.

**Fields:**
- `title`, `description`: Item info
- `category`: Type of work
- `tags`: Search tags
- `images`: Array of GalleryImage objects
- `artist`: Reference to artist/user
- `beforeAndAfter`: Boolean for transformations
- `techniques`: Methods used
- `productsUsed`: Products featured
- `featuredInPromo`: Marketing highlight

#### GalleryCategory
Gallery organizational categories.

**Categories:**
- Hair
- Makeup
- Skincare
- Nails
- Bridal
- Editorial

### 7. Team Management

#### TeamMember
Team member profile.

**Fields:**
- `name`, `role`: Member identification
- `bio`: Professional biography
- `specializations`: Areas of expertise
- `certifications`: Professional credentials
- `yearsOfExperience`: Experience level
- `availability`: ServiceAvailability schedule
- `socialLinks`: Social media profiles

**Roles:**
- Founder & Creative Director
- Lead Hair Educator & Colorist
- Lead Skincare & Makeup Specialist
- Hair Stylist
- Makeup Artist
- Skincare Expert
- Educator
- Admin

### 8. Contact & Communication

#### ContactInquiry
Form submission from website.

**Fields:**
- `name`, `email`, `phone`: Contact info
- `subject`, `message`: Inquiry details
- `inquiryType`: Category
- `status`: Response status
- `priority`: Urgency level
- `assignedTo`: Admin assigned to inquiry

**Inquiry Types:**
- general
- bridal
- academy
- booking
- partnership
- media

#### Newsletter
Newsletter subscription.

**Fields:**
- `email`: Subscriber email
- `firstName`: Optional name
- `interests`: Array of interest areas
- `isActive`: Subscription status
- `subscribedAt`, `unsubscribedAt`: Timestamps

### 9. Promotions & Marketing

#### Promotion
Discount code or promotion.

**Types:**
- `percentage`: Percentage discount
- `fixed`: Fixed amount discount
- `free_shipping`: Free shipping offer

**Fields:**
- `code`: Unique promo code
- `value`: Discount amount
- `applicableTo`: Applicable product categories
- `minPurchaseAmount`: Minimum order amount
- `startDate`, `endDate`: Validity period
- `isActive`: Current status

### 10. Analytics & Business

#### UserActivity
User interaction tracking.

**Actions:**
- `view_product`
- `add_to_cart`
- `purchase`
- `enroll_course`
- `complete_course`
- `book_service`
- `view_gallery`

#### BusinessMetrics
Daily/weekly/monthly KPIs.

**Metrics Tracked:**
- Total revenue
- Product sales
- Service sales
- Course enrollments
- Total orders
- Total bookings
- New customers
- Active students

## Validation Functions

### Email Validation
```typescript
import { validateEmail } from "@/types/validation";

const isValid = validateEmail("user@example.com"); // true
```

### Product Validation
```typescript
const product: Partial<Product> = { title: "Serum", price: 45 };
const error = validateProductPrice(product);
if (error) console.error(error);
```

### Booking Validation
```typescript
const booking: Partial<ServiceBooking> = {
  email: "user@example.com",
  phone: "+1-555-0100",
  bookingDate: new Date("2024-07-15"),
  duration: 60,
  cost: 150,
};

const errors = validateBooking(booking);
if (errors.length > 0) {
  console.error("Validation errors:", errors);
}
```

### Course Validation
```typescript
const errors = validateCourse({
  title: "Bridal Masterclass",
  level: "Certified Level III",
  duration: 12,
  maxStudents: 20,
  price: 2500,
});
```

## Utility Functions

### Formatting

```typescript
import { formatPrice, formatDate, formatDuration } from "@/types/validation";

formatPrice(120); // "$120.00"
formatDate(new Date()); // "Jun 3, 2024"
formatDuration(90); // "1h 30m"
```

### Calculations

```typescript
import { calculateCartTotal, calculateCourseProgress, calculateGPA } from "@/types/validation";

const total = calculateCartTotal(cartItems, 0.08); // with tax
const progress = calculateCourseProgress(enrollment, 12); // percentage
const gpa = calculateGPA(grades); // 0-4.0 scale
```

### Search & Filter

```typescript
import { searchProducts, filterProductsByPrice, sortProductsByRating } from "@/types/validation";

const results = searchProducts(products, "serum");
const filtered = filterProductsByPrice(products, 20, 100);
const sorted = sortProductsByRating(products, "desc");
```

### Type Guards

```typescript
import { isProduct, isCourse, isOrder, isUser } from "@/types/validation";

if (isProduct(data)) {
  // data is Product
}
```

## Database Schemas

### SQL Tables

The `mockData.ts` file includes SQL schema definitions for all entities:

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar VARCHAR(255),
  role ENUM('customer', 'student', 'artist', 'admin') NOT NULL,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

### MongoDB Collections

MongoDB schema validators are also provided in `mockData.ts`.

## Mock Data

Use mock data for development and testing:

```typescript
import { MOCK_PRODUCTS, MOCK_COURSES, MOCK_USERS } from "@/types/mockData";

export default function TestPage() {
  return (
    <div>
      {MOCK_PRODUCTS.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## API Integration

See `api-endpoints.md` for complete API endpoint documentation including:

- Request/response formats
- Query parameters
- Authentication requirements
- Error codes
- Example requests/responses

## Best Practices

### 1. Always Import Types
```typescript
import type { Product, Course } from "@/types/schemas";
```

### 2. Validate User Input
```typescript
const errors = validateBooking(userInput);
if (errors.length > 0) {
  // Show validation errors to user
}
```

### 3. Use Type Guards
```typescript
if (isProduct(data)) {
  // Safe to access product-specific properties
  console.log(data.stock);
}
```

### 4. Format for Display
```typescript
<div className="price">{formatPrice(product.price)}</div>
<div className="date">{formatDate(order.createdAt)}</div>
```

### 5. Handle Errors Gracefully
```typescript
try {
  const result = await api.createOrder(orderData);
} catch (error: ApiError) {
  console.error(error.response.data.error.message);
}
```

## Constants

Available constants for common values:

```typescript
import {
  PRODUCT_CATEGORIES,
  COURSE_LEVELS,
  SERVICE_CATEGORIES,
  BOOKING_STATUSES,
  ORDER_STATUSES,
  USER_ROLES,
  LETTER_GRADES,
} from "@/types/validation";
```

## Related Files

- **CartContext.tsx**: Uses CartItem and Cart types
- **ProductGrid.tsx**: Uses Product type
- **CourseCatalog.tsx**: Uses Course type
- **BridalPackages.tsx**: Uses BridalPackage type
- **TeamProfiles.tsx**: Uses TeamMember type

## Contributing

When adding new schemas:

1. Define interface in `schemas.ts`
2. Add validation function in `validation.ts`
3. Add mock data in `mockData.ts`
4. Add SQL/MongoDB schema in `mockData.ts`
5. Document in this README
6. Add type guard function in `validation.ts`
7. Export from `index.ts`

## Questions & Support

For questions about data structures or schema usage, refer to:

1. **Type Definitions**: `schemas.ts`
2. **Validation Logic**: `validation.ts`
3. **API Specs**: `api-endpoints.md`
4. **Example Usage**: Components in `components/`
5. **Mock Data**: `mockData.ts`
