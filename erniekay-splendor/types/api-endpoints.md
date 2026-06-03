/**
 * API Endpoints & Routes Documentation
 * 
 * This file documents all REST API endpoints, their request/response structures,
 * and how they interact with the data schemas.
 * 
 * Base URL: /api/v1
 * Authentication: Bearer Token (JWT)
 * Response Format: JSON
 */

// ============================================================================
// ENDPOINT STRUCTURE DOCUMENTATION
// ============================================================================

/**
 * AUTHENTICATION ENDPOINTS
 */

// POST /auth/register
// Register a new user
// Request:
// {
//   email: string (required, unique)
//   password: string (required, min 8 chars)
//   firstName: string (required)
//   lastName: string (required)
//   phone?: string
//   role: "customer" | "student" | "artist"
// }
// Response: { success: true, data: User, token: string }

// POST /auth/login
// Login existing user
// Request:
// {
//   email: string (required)
//   password: string (required)
// }
// Response: { success: true, data: User, token: string }

// POST /auth/logout
// Logout user (requires auth)
// Response: { success: true }

// POST /auth/refresh-token
// Refresh JWT token (requires auth)
// Response: { success: true, token: string }

// POST /auth/forgot-password
// Request password reset email
// Request: { email: string }
// Response: { success: true, message: "Reset email sent" }

// POST /auth/reset-password
// Reset password with token
// Request: { token: string, newPassword: string }
// Response: { success: true, message: "Password reset successful" }

// ============================================================================
// USER MANAGEMENT ENDPOINTS
// ============================================================================

// GET /users/profile
// Get current user profile (requires auth)
// Response: { success: true, data: UserProfile }

// PUT /users/profile
// Update current user profile (requires auth)
// Request: { firstName?: string, lastName?: string, phone?: string, bio?: string }
// Response: { success: true, data: UserProfile }

// GET /users/:userId
// Get user by ID (public for artists)
// Response: { success: true, data: User }

// GET /users
// List users with pagination (admin only)
// Query: page=1&limit=20&role=artist
// Response: { success: true, data: User[], pagination: PaginationInfo }

// PUT /users/:userId
// Update user (admin only)
// Request: { email?: string, firstName?: string, role?: string }
// Response: { success: true, data: User }

// DELETE /users/:userId
// Delete user (admin only)
// Response: { success: true, message: "User deleted" }

// ============================================================================
// PRODUCT ENDPOINTS (E-COMMERCE)
// ============================================================================

// GET /products
// List all products with filtering and pagination
// Query: category=haircare&minPrice=20&maxPrice=100&page=1&limit=20&sort=price_asc
// Response: { success: true, data: Product[], pagination: PaginationInfo }

// GET /products/:productId
// Get single product
// Response: { success: true, data: Product }

// POST /products
// Create product (admin only)
// Request: { title, brand, price, category, imgSrc, stock, ... }
// Response: { success: true, data: Product }

// PUT /products/:productId
// Update product (admin only)
// Request: { title?: string, price?: number, stock?: number, ... }
// Response: { success: true, data: Product }

// DELETE /products/:productId
// Delete product (admin only)
// Response: { success: true, message: "Product deleted" }

// POST /products/:productId/reviews
// Add product review (requires auth)
// Request: { rating: 1-5, title: string, comment: string }
// Response: { success: true, data: ProductReview }

// GET /products/:productId/reviews
// Get product reviews
// Query: page=1&limit=10&sort=newest
// Response: { success: true, data: ProductReview[], pagination: PaginationInfo }

// ============================================================================
// CART ENDPOINTS
// ============================================================================

// GET /cart
// Get current user's cart (requires auth)
// Response: { success: true, data: Cart }

// POST /cart/items
// Add item to cart (requires auth)
// Request: { productId: string, quantity?: number }
// Response: { success: true, data: Cart }

// PUT /cart/items/:cartItemId
// Update cart item quantity (requires auth)
// Request: { quantity: number }
// Response: { success: true, data: Cart }

// DELETE /cart/items/:cartItemId
// Remove item from cart (requires auth)
// Response: { success: true, data: Cart }

// DELETE /cart
// Clear entire cart (requires auth)
// Response: { success: true, message: "Cart cleared" }

// ============================================================================
// ORDER ENDPOINTS
// ============================================================================

// POST /orders
// Create order from cart (requires auth)
// Request: {
//   shippingAddress: Address,
//   billingAddress?: Address,
//   paymentMethod: PaymentMethod
// }
// Response: { success: true, data: Order }

// GET /orders
// Get user's orders (requires auth)
// Query: page=1&limit=20&status=delivered
// Response: { success: true, data: Order[], pagination: PaginationInfo }

// GET /orders/:orderId
// Get order details (requires auth - owner or admin)
// Response: { success: true, data: Order }

// PUT /orders/:orderId
// Update order (admin only - status, tracking, etc.)
// Request: { status?: string, trackingNumber?: string }
// Response: { success: true, data: Order }

// POST /orders/:orderId/cancel
// Cancel order (requires auth - owner or admin)
// Request: { reason?: string }
// Response: { success: true, data: Order }

// ============================================================================
// COURSE ENDPOINTS (ACADEMY)
// ============================================================================

// GET /courses
// List all courses with filtering
// Query: level=Beginner&category=bridal&page=1&limit=20
// Response: { success: true, data: Course[], pagination: PaginationInfo }

// GET /courses/:courseId
// Get course details
// Response: { success: true, data: Course }

// POST /courses
// Create course (admin only)
// Request: { title, level, category, duration, price, ... }
// Response: { success: true, data: Course }

// PUT /courses/:courseId
// Update course (admin only)
// Request: { title?: string, price?: number, status?: string, ... }
// Response: { success: true, data: Course }

// DELETE /courses/:courseId
// Delete course (admin only)
// Response: { success: true, message: "Course deleted" }

// ============================================================================
// ENROLLMENT ENDPOINTS
// ============================================================================

// POST /enrollments
// Enroll in course (requires auth)
// Request: { courseId: string }
// Response: { success: true, data: Enrollment }

// GET /enrollments
// Get user's enrollments (requires auth)
// Query: page=1&limit=20&status=active
// Response: { success: true, data: Enrollment[], pagination: PaginationInfo }

// GET /enrollments/:enrollmentId
// Get enrollment details (requires auth - owner or admin)
// Response: { success: true, data: Enrollment }

// PUT /enrollments/:enrollmentId
// Update enrollment (admin only)
// Request: { status?: string, finalGrade?: number, certificateIssued?: boolean }
// Response: { success: true, data: Enrollment }

// POST /enrollments/:enrollmentId/attendance
// Record attendance (instructor only)
// Request: { date: Date, status: "present" | "absent" | "late" }
// Response: { success: true, data: AttendanceRecord }

// POST /enrollments/:enrollmentId/assignments
// Submit assignment (requires auth - student)
// Request: { assignmentTitle: string, submissionUrl?: string }
// Response: { success: true, data: AssignmentSubmission }

// PUT /enrollments/:enrollmentId/assignments/:assignmentId
// Grade assignment (instructor only)
// Request: { score: number, feedback?: string }
// Response: { success: true, data: AssignmentSubmission }

// ============================================================================
// GRADES ENDPOINTS
// ============================================================================

// GET /grades
// Get student's grades (requires auth)
// Response: { success: true, data: StudentGrade[] }

// GET /grades/:enrollmentId
// Get grade for specific enrollment (requires auth - owner or admin)
// Response: { success: true, data: StudentGrade }

// POST /grades
// Create/update grade (admin only)
// Request: { enrollmentId: string, finalScore: number, letterGrade: string }
// Response: { success: true, data: StudentGrade }

// ============================================================================
// PORTFOLIO ENDPOINTS
// ============================================================================

// GET /portfolio
// Get current user's portfolio (requires auth - student)
// Response: { success: true, data: StudentPortfolioItem[] }

// POST /portfolio
// Add portfolio item (requires auth - student)
// Request: {
//   title: string,
//   category: string,
//   description: string,
//   images: string[],
//   techniques?: string[]
// }
// Response: { success: true, data: StudentPortfolioItem }

// PUT /portfolio/:itemId
// Update portfolio item (requires auth - owner)
// Request: { title?: string, description?: string, images?: string[] }
// Response: { success: true, data: StudentPortfolioItem }

// DELETE /portfolio/:itemId
// Delete portfolio item (requires auth - owner)
// Response: { success: true, message: "Item deleted" }

// ============================================================================
// BRIDAL PACKAGE ENDPOINTS
// ============================================================================

// GET /bridal/packages
// List bridal packages
// Response: { success: true, data: BridalPackage[] }

// GET /bridal/packages/:packageId
// Get package details
// Response: { success: true, data: BridalPackage }

// POST /bridal/packages
// Create bridal package (admin only)
// Request: { title, description, price, features, duration, ... }
// Response: { success: true, data: BridalPackage }

// PUT /bridal/packages/:packageId
// Update bridal package (admin only)
// Request: { price?: number, features?: string[], ... }
// Response: { success: true, data: BridalPackage }

// DELETE /bridal/packages/:packageId
// Delete bridal package (admin only)
// Response: { success: true, message: "Package deleted" }

// ============================================================================
// BRIDAL BOOKING ENDPOINTS
// ============================================================================

// GET /bridal/bookings
// Get user's bridal bookings (requires auth)
// Query: page=1&limit=20&status=confirmed
// Response: { success: true, data: BridalBooking[], pagination: PaginationInfo }

// GET /bridal/bookings/:bookingId
// Get booking details (requires auth - owner or admin)
// Response: { success: true, data: BridalBooking }

// POST /bridal/bookings
// Create bridal booking inquiry (requires auth or email)
// Request: {
//   packageId: string,
//   eventDate: Date,
//   email: string,
//   phone: string,
//   eventType: string,
//   notes?: string
// }
// Response: { success: true, data: BridalBooking }

// PUT /bridal/bookings/:bookingId
// Update bridal booking (requires auth - owner or admin)
// Request: { status?: string, artistAssigned?: string, ... }
// Response: { success: true, data: BridalBooking }

// POST /bridal/bookings/:bookingId/consultation
// Schedule consultation (requires auth - owner or admin)
// Request: { consultationDate: Date, format: "in-person" | "virtual" }
// Response: { success: true, data: BridalConsultation }

// ============================================================================
// SERVICE ENDPOINTS
// ============================================================================

// GET /services
// List available services
// Query: category=bridal&page=1&limit=20
// Response: { success: true, data: Service[], pagination: PaginationInfo }

// GET /services/:serviceId
// Get service details
// Response: { success: true, data: Service }

// POST /services
// Create service (admin only)
// Request: { name, category, duration, price, availability, ... }
// Response: { success: true, data: Service }

// PUT /services/:serviceId
// Update service (admin only)
// Request: { price?: number, availability?: ServiceAvailability, ... }
// Response: { success: true, data: Service }

// DELETE /services/:serviceId
// Delete service (admin only)
// Response: { success: true, message: "Service deleted" }

// ============================================================================
// SERVICE BOOKING ENDPOINTS
// ============================================================================

// GET /bookings
// Get user's service bookings (requires auth)
// Query: page=1&limit=20&status=confirmed
// Response: { success: true, data: ServiceBooking[], pagination: PaginationInfo }

// GET /bookings/:bookingId
// Get booking details (requires auth - owner or admin)
// Response: { success: true, data: ServiceBooking }

// POST /bookings
// Create service booking (requires auth or email)
// Request: {
//   serviceId: string,
//   bookingDate: Date,
//   timeSlot: string,
//   email: string,
//   phone: string,
//   notes?: string
// }
// Response: { success: true, data: ServiceBooking }

// PUT /bookings/:bookingId
// Update service booking (requires auth - owner or admin)
// Request: { status?: string, artistId?: string, ... }
// Response: { success: true, data: ServiceBooking }

// POST /bookings/:bookingId/cancel
// Cancel booking (requires auth - owner or admin)
// Request: { reason?: string }
// Response: { success: true, data: ServiceBooking }

// GET /bookings/:bookingId/availability
// Get available time slots for a service
// Query: serviceId=xxx&date=2024-06-15&artistId=optional
// Response: { success: true, data: string[] }

// ============================================================================
// TEAM ENDPOINTS
// ============================================================================

// GET /team
// List team members
// Query: specialization=bridal&page=1&limit=20
// Response: { success: true, data: TeamMember[], pagination: PaginationInfo }

// GET /team/:teamMemberId
// Get team member profile
// Response: { success: true, data: TeamMember }

// POST /team
// Create team member (admin only)
// Request: { name, role, bio, specializations, ... }
// Response: { success: true, data: TeamMember }

// PUT /team/:teamMemberId
// Update team member (admin only)
// Request: { bio?: string, specializations?: string[], ... }
// Response: { success: true, data: TeamMember }

// DELETE /team/:teamMemberId
// Delete team member (admin only)
// Response: { success: true, message: "Team member removed" }

// ============================================================================
// GALLERY ENDPOINTS
// ============================================================================

// GET /gallery
// List gallery items with filtering
// Query: category=bridal&artist=xxx&featured=true&page=1&limit=20
// Response: { success: true, data: GalleryItem[], pagination: PaginationInfo }

// GET /gallery/:itemId
// Get gallery item details
// Response: { success: true, data: GalleryItem }

// POST /gallery
// Create gallery item (admin or artist)
// Request: { title, category, description, images, artist, ... }
// Response: { success: true, data: GalleryItem }

// PUT /gallery/:itemId
// Update gallery item (admin or artist owner)
// Request: { title?: string, description?: string, images?: string[] }
// Response: { success: true, data: GalleryItem }

// DELETE /gallery/:itemId
// Delete gallery item (admin or artist owner)
// Response: { success: true, message: "Item deleted" }

// GET /gallery/categories
// Get gallery categories
// Response: { success: true, data: GalleryCategory[] }

// ============================================================================
// CONTACT ENDPOINTS
// ============================================================================

// POST /contact
// Submit contact form inquiry
// Request: {
//   name: string,
//   email: string,
//   subject: string,
//   message: string,
//   inquiryType: string,
//   phone?: string
// }
// Response: { success: true, message: "Inquiry submitted" }

// GET /contact/inquiries
// List inquiries (admin only)
// Query: status=new&page=1&limit=20
// Response: { success: true, data: ContactInquiry[], pagination: PaginationInfo }

// GET /contact/inquiries/:inquiryId
// Get inquiry details (admin only)
// Response: { success: true, data: ContactInquiry }

// PUT /contact/inquiries/:inquiryId
// Update inquiry (admin only)
// Request: { status?: string, assignedTo?: string }
// Response: { success: true, data: ContactInquiry }

// ============================================================================
// NEWSLETTER ENDPOINTS
// ============================================================================

// POST /newsletter/subscribe
// Subscribe to newsletter
// Request: { email: string, firstName?: string, interests?: string[] }
// Response: { success: true, message: "Subscribed" }

// POST /newsletter/unsubscribe
// Unsubscribe from newsletter
// Request: { email: string }
// Response: { success: true, message: "Unsubscribed" }

// ============================================================================
// SEARCH ENDPOINTS
// ============================================================================

// GET /search/products
// Search products
// Query: q=serum&limit=20
// Response: { success: true, data: Product[] }

// GET /search/courses
// Search courses
// Query: q=bridal&limit=20
// Response: { success: true, data: Course[] }

// GET /search/global
// Global search across all content
// Query: q=bridal&limit=20
// Response: { success: true, data: { products: Product[], courses: Course[], gallery: GalleryItem[] } }

// ============================================================================
// PROMOTIONS ENDPOINTS
// ============================================================================

// POST /promotions/validate
// Validate promo code
// Request: { code: string }
// Response: { success: true, data: Promotion }

// GET /promotions
// List active promotions (admin only)
// Response: { success: true, data: Promotion[] }

// POST /promotions
// Create promotion (admin only)
// Request: { code, type, value, startDate, endDate, ... }
// Response: { success: true, data: Promotion }

// ============================================================================
// ANALYTICS ENDPOINTS (ADMIN ONLY)
// ============================================================================

// GET /analytics/metrics
// Get business metrics
// Query: period=monthly&date=2024-06-01
// Response: { success: true, data: BusinessMetrics }

// GET /analytics/activity
// Get user activity log
// Query: userId=xxx&action=purchase&page=1&limit=20
// Response: { success: true, data: UserActivity[], pagination: PaginationInfo }

// ============================================================================
// SETTINGS ENDPOINTS (ADMIN ONLY)
// ============================================================================

// GET /settings
// Get business settings
// Response: { success: true, data: BusinessSettings }

// PUT /settings
// Update business settings
// Request: { businessName?: string, timezone?: string, ... }
// Response: { success: true, data: BusinessSettings }

// ============================================================================
// COMMON QUERY PARAMETERS
// ============================================================================

/**
 * Pagination:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 *
 * Sorting:
 * - sort: string (e.g., "price_asc", "date_desc", "rating_desc")
 *
 * Filtering:
 * - Various filters depending on endpoint
 *
 * Search:
 * - q: search query string
 */

// ============================================================================
// COMMON RESPONSE CODES
// ============================================================================

/**
 * 200 OK: Successful request
 * 201 Created: Resource created successfully
 * 204 No Content: Successful request with no content
 * 400 Bad Request: Invalid request parameters
 * 401 Unauthorized: Missing or invalid authentication
 * 403 Forbidden: User lacks permission
 * 404 Not Found: Resource not found
 * 409 Conflict: Resource conflict (e.g., duplicate entry)
 * 422 Unprocessable Entity: Validation error
 * 500 Internal Server Error: Server error
 * 503 Service Unavailable: Service temporarily unavailable
 */

// ============================================================================
// ERROR RESPONSE FORMAT
// ============================================================================

/**
 * {
 *   success: false,
 *   error: {
 *     code: "ERROR_CODE",
 *     message: "Human readable message",
 *     details: {
 *       field: ["error message"]
 *     }
 *   },
 *   meta: {
 *     timestamp: "2024-06-03T10:30:00Z",
 *     requestId: "req-xxx"
 *   }
 * }
 */
