/**
 * Database Schema Documentation & Mock Data
 * 
 * This file provides:
 * - SQL/Database schema definitions
 * - MongoDB collection schemas
 * - Mock data for testing and development
 */

import type {
  Product,
  Course,
  User,
  Service,
  BridalPackage,
  TeamMember,
  GalleryItem,
} from "./schemas";

// ============================================================================
// SQL TABLE SCHEMAS (for reference)
// ============================================================================

export const SQL_SCHEMAS = {
  users: `
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
  `,

  products: `
    CREATE TABLE products (
      id VARCHAR(36) PRIMARY KEY,
      brand VARCHAR(100) NOT NULL,
      title VARCHAR(200) NOT NULL,
      subtitle VARCHAR(200),
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      originalPrice DECIMAL(10, 2),
      badge VARCHAR(50),
      category VARCHAR(50) NOT NULL,
      imgSrc TEXT NOT NULL,
      imgAlt VARCHAR(255),
      sku VARCHAR(100) UNIQUE,
      stock INT DEFAULT 0,
      rating DECIMAL(3, 2),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_category (category),
      INDEX idx_price (price),
      FULLTEXT idx_search (title, subtitle, description)
    );
  `,

  cart: `
    CREATE TABLE cart (
      id VARCHAR(36) PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      items JSON NOT NULL,
      subtotal DECIMAL(10, 2) NOT NULL,
      tax DECIMAL(10, 2) NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_userId (userId)
    );
  `,

  orders: `
    CREATE TABLE orders (
      id VARCHAR(36) PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      items JSON NOT NULL,
      subtotal DECIMAL(10, 2) NOT NULL,
      tax DECIMAL(10, 2) NOT NULL,
      shipping DECIMAL(10, 2),
      total DECIMAL(10, 2) NOT NULL,
      status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') NOT NULL,
      shippingAddress JSON NOT NULL,
      billingAddress JSON NOT NULL,
      paymentMethod JSON NOT NULL,
      deliveryDate DATETIME,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_userId (userId),
      INDEX idx_status (status),
      INDEX idx_createdAt (createdAt)
    );
  `,

  courses: `
    CREATE TABLE courses (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      subtitle VARCHAR(200),
      description TEXT NOT NULL,
      level VARCHAR(50) NOT NULL,
      category VARCHAR(50) NOT NULL,
      duration INT NOT NULL,
      schedule JSON NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      maxStudents INT NOT NULL,
      currentEnrollment INT DEFAULT 0,
      instructor VARCHAR(36) NOT NULL,
      instructorName VARCHAR(100),
      syllabus JSON,
      imgSrc TEXT NOT NULL,
      imgAlt VARCHAR(255),
      status ENUM('active', 'full', 'archived') DEFAULT 'active',
      startDate DATETIME NOT NULL,
      endDate DATETIME NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (instructor) REFERENCES users(id) ON DELETE RESTRICT,
      INDEX idx_category (category),
      INDEX idx_level (level),
      INDEX idx_status (status),
      INDEX idx_startDate (startDate)
    );
  `,

  enrollments: `
    CREATE TABLE enrollments (
      id VARCHAR(36) PRIMARY KEY,
      courseId VARCHAR(36) NOT NULL,
      userId VARCHAR(36) NOT NULL,
      status ENUM('pending', 'active', 'completed', 'dropped') NOT NULL,
      enrollmentDate DATETIME NOT NULL,
      completionDate DATETIME,
      certificateIssued BOOLEAN DEFAULT false,
      certificateUrl VARCHAR(255),
      amountPaid DECIMAL(10, 2) NOT NULL,
      finalGrade INT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_enrollment (courseId, userId),
      INDEX idx_userId (userId),
      INDEX idx_courseId (courseId),
      INDEX idx_status (status)
    );
  `,

  bridal_packages: `
    CREATE TABLE bridal_packages (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10, 2),
      priceMin DECIMAL(10, 2),
      priceMax DECIMAL(10, 2),
      duration INT NOT NULL,
      features JSON,
      featured BOOLEAN DEFAULT false,
      image JSON NOT NULL,
      consultationIncluded BOOLEAN DEFAULT true,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_featured (featured)
    );
  `,

  bridal_bookings: `
    CREATE TABLE bridal_bookings (
      id VARCHAR(36) PRIMARY KEY,
      packageId VARCHAR(36) NOT NULL,
      userId VARCHAR(36) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      eventDate DATETIME NOT NULL,
      eventType VARCHAR(50) NOT NULL,
      status ENUM('inquiry', 'booked', 'confirmed', 'completed', 'cancelled') NOT NULL,
      artistAssigned VARCHAR(36),
      consultationDate DATETIME,
      totalCost DECIMAL(10, 2) NOT NULL,
      depositPaid DECIMAL(10, 2) DEFAULT 0,
      balanceDue DECIMAL(10, 2),
      paymentStatus ENUM('pending', 'partial', 'paid') NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (packageId) REFERENCES bridal_packages(id) ON DELETE RESTRICT,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (artistAssigned) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_userId (userId),
      INDEX idx_eventDate (eventDate),
      INDEX idx_status (status)
    );
  `,

  services: `
    CREATE TABLE services (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      category VARCHAR(50) NOT NULL,
      duration INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      artistId VARCHAR(36),
      availability JSON NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (artistId) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_category (category),
      INDEX idx_artistId (artistId)
    );
  `,

  service_bookings: `
    CREATE TABLE service_bookings (
      id VARCHAR(36) PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      serviceId VARCHAR(36) NOT NULL,
      artistId VARCHAR(36),
      bookingDate DATETIME NOT NULL,
      timeSlot VARCHAR(10) NOT NULL,
      duration INT NOT NULL,
      status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no-show') NOT NULL,
      notes TEXT,
      cost DECIMAL(10, 2) NOT NULL,
      paid BOOLEAN DEFAULT false,
      paymentId VARCHAR(100),
      cancelledAt DATETIME,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE RESTRICT,
      FOREIGN KEY (artistId) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_userId (userId),
      INDEX idx_bookingDate (bookingDate),
      INDEX idx_status (status)
    );
  `,

  gallery_items: `
    CREATE TABLE gallery_items (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      category VARCHAR(50) NOT NULL,
      artistId VARCHAR(36),
      images JSON NOT NULL,
      beforeAndAfter BOOLEAN DEFAULT false,
      techniques JSON,
      featuredInPromo BOOLEAN DEFAULT false,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (artistId) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_category (category),
      INDEX idx_artistId (artistId),
      INDEX idx_featured (featuredInPromo)
    );
  `,

  contact_inquiries: `
    CREATE TABLE contact_inquiries (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      subject VARCHAR(200) NOT NULL,
      message TEXT NOT NULL,
      inquiryType VARCHAR(50) NOT NULL,
      status ENUM('new', 'in-progress', 'responded', 'resolved') DEFAULT 'new',
      priority ENUM('low', 'normal', 'high') DEFAULT 'normal',
      assignedTo VARCHAR(36),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      respondedAt DATETIME,
      FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_status (status),
      INDEX idx_inquiryType (inquiryType),
      INDEX idx_createdAt (createdAt)
    );
  `,

  newsletter: `
    CREATE TABLE newsletter (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      firstName VARCHAR(100),
      interests JSON,
      subscribedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      unsubscribedAt DATETIME,
      isActive BOOLEAN DEFAULT true,
      INDEX idx_email (email),
      INDEX idx_isActive (isActive)
    );
  `,
};

// ============================================================================
// MONGODB COLLECTION SCHEMAS (for reference)
// ============================================================================

export const MONGODB_SCHEMAS = {
  users: `
    db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["email", "firstName", "lastName", "role", "createdAt"],
          properties: {
            _id: { bsonType: "objectId" },
            email: { bsonType: "string", pattern: "^[^@]+@[^@]+\\.[^@]+$" },
            firstName: { bsonType: "string" },
            lastName: { bsonType: "string" },
            phone: { bsonType: "string" },
            avatar: { bsonType: "string" },
            role: { enum: ["customer", "student", "artist", "admin"] },
            isActive: { bsonType: "bool" },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
          }
        }
      }
    });
    db.users.createIndex({ email: 1 }, { unique: true });
    db.users.createIndex({ role: 1 });
  `,

  products: `
    db.createCollection("products", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title", "brand", "price", "category", "stock"],
          properties: {
            _id: { bsonType: "objectId" },
            title: { bsonType: "string" },
            brand: { bsonType: "string" },
            price: { bsonType: "decimal" },
            originalPrice: { bsonType: "decimal" },
            category: { enum: ["skincare", "haircare", "tools", "accessories", "kits"] },
            stock: { bsonType: "int" },
            rating: { bsonType: "decimal" },
            reviews: { bsonType: "array" },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
          }
        }
      }
    });
    db.products.createIndex({ category: 1 });
    db.products.createIndex({ price: 1 });
    db.products.createIndex({ "title": "text", "description": "text" });
  `,

  courses: `
    db.createCollection("courses", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title", "level", "category", "duration", "price", "instructor"],
          properties: {
            _id: { bsonType: "objectId" },
            title: { bsonType: "string" },
            level: { enum: ["Beginner", "Intermediate", "Advanced", "Certified Level I", "Certified Level II", "Certified Level III"] },
            category: { enum: ["bridal", "hair", "makeup", "skincare", "nails", "business"] },
            duration: { bsonType: "int" },
            price: { bsonType: "decimal" },
            instructor: { bsonType: "objectId" },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
          }
        }
      }
    });
    db.courses.createIndex({ category: 1 });
    db.courses.createIndex({ level: 1 });
    db.courses.createIndex({ instructor: 1 });
  `,

  orders: `
    db.createCollection("orders", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["userId", "items", "total", "status"],
          properties: {
            _id: { bsonType: "objectId" },
            userId: { bsonType: "objectId" },
            items: { bsonType: "array" },
            total: { bsonType: "decimal" },
            status: { enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"] },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
          }
        }
      }
    });
    db.orders.createIndex({ userId: 1 });
    db.orders.createIndex({ status: 1 });
    db.orders.createIndex({ createdAt: -1 });
  `,

  enrollments: `
    db.createCollection("enrollments", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["courseId", "userId", "status", "enrollmentDate"],
          properties: {
            _id: { bsonType: "objectId" },
            courseId: { bsonType: "objectId" },
            userId: { bsonType: "objectId" },
            status: { enum: ["pending", "active", "completed", "dropped"] },
            enrollmentDate: { bsonType: "date" },
            completionDate: { bsonType: "date" },
            certificateIssued: { bsonType: "bool" },
            amountPaid: { bsonType: "decimal" }
          }
        }
      }
    });
    db.enrollments.createIndex({ courseId: 1, userId: 1 }, { unique: true });
    db.enrollments.createIndex({ userId: 1 });
    db.enrollments.createIndex({ status: 1 });
  `,
};

// ============================================================================
// MOCK DATA FOR TESTING
// ============================================================================

export const MOCK_USERS: User[] = [
  {
    id: "user-1",
    email: "erniekay@splendor.com",
    firstName: "Erniekay",
    lastName: "Splendor",
    phone: "+1-555-0001",
    avatar: "https://lh3.googleusercontent.com/...",
    role: "admin",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-06-01"),
    isActive: true,
  },
  {
    id: "user-2",
    email: "beatrice.kay@splendor.com",
    firstName: "Beatrice",
    lastName: "Kay",
    phone: "+1-555-0002",
    avatar: "https://lh3.googleusercontent.com/...",
    role: "artist",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2024-06-01"),
    isActive: true,
  },
  {
    id: "user-3",
    email: "celine.vance@splendor.com",
    firstName: "Celine",
    lastName: "Vance",
    phone: "+1-555-0003",
    avatar: "https://lh3.googleusercontent.com/...",
    role: "artist",
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2024-06-01"),
    isActive: true,
  },
  {
    id: "customer-1",
    email: "customer@example.com",
    firstName: "Jane",
    lastName: "Doe",
    phone: "+1-555-0100",
    role: "customer",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-06-01"),
    isActive: true,
  },
  {
    id: "student-1",
    email: "student@example.com",
    firstName: "Alex",
    lastName: "Johnson",
    phone: "+1-555-0200",
    role: "student",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-06-01"),
    isActive: true,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "signature-gloss-serum",
    brand: "Erniekay Splendor",
    title: "Signature Gloss Serum",
    subtitle: "for editorial shine",
    description: "Professional-grade hair serum for editorial and runway looks",
    price: 45,
    badge: undefined,
    category: "haircare",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuANcB0d3HSWvO1CDJJEDV9A6FlwGqDFeDJ4ac5xZTjvjCM9Ebi8jdrzR6wFsi_rjR-tXJBYywIcHk7O7lNjXHqohndHP3N9o7CpHQvRUpNTfoNitBn5ANc9P48T7qIP-vvwZYqoRD_52Gx4fi_j9VExtvznJr7sD4x2N6bb5ezpPQlTEdEn0c_DADt24ahwrIe-Q-6y0WRm20Hd0yGdJ43-HnT3tnVpGUyRZLMJ2r4wVJe_aijbs0dtfOuTj1RlpcvGl9tgd8UT3bQ",
    imgAlt: "Sleek glass serum bottle on a warm champagne taupe background",
    sku: "SES-001",
    stock: 150,
    rating: 4.8,
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: "royal-hydra-cream",
    brand: "Erniekay Splendor",
    title: "Royal Hydra-Cream",
    subtitle: "deep skin rejuvenation",
    description: "Luxury hydrating cream for professional skin preparation",
    price: 120,
    badge: "BESTSELLER",
    category: "skincare",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-LWBck45ZVdY60gGbIfFpZOVUaa_Q2i3IUeK_57WWaHeQbb3LrjT4mNNRnvRgvAk1hwPamwnGVp7SXgvhX38yZMVKxMiebFgnQo5RSML3BCfowAEyPBU5BGFiDzHoCZIKISfjoEnQfp1q_fgiw0SHDi9AkCt2JwKWhxfTasgpGO9oKdhYzWfaO0_J2r1PMV8tFtxXrZHyH36pd0J8iQhbUSkCPEYAz-dmjUqEEt7xJ_QxTje7qk9l-u_jCw3lMtTFlEd0eNpFfiM",
    imgAlt: "Frosted white glass cream jar with metallic gold lid on white marble",
    sku: "RHC-001",
    stock: 200,
    rating: 4.9,
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2024-06-01"),
  },
];

export const MOCK_COURSES: Course[] = [
  {
    id: "masterclass-bridal",
    title: "Masterclass in Bridal Artistry",
    subtitle: "Certified Level III",
    description: "Comprehensive training on cultural bridal looks, long-wear techniques, and business management for bridal artists.",
    level: "Certified Level III",
    category: "bridal",
    duration: 12,
    schedule: {
      frequency: "weekly",
      daysOfWeek: ["Monday", "Wednesday", "Friday"],
      startTime: "10:00",
      endTime: "13:00",
      timezone: "EST",
      format: "in-person",
      location: "Erniekay Splendor Studio, NYC",
    },
    price: 2500,
    maxStudents: 12,
    currentEnrollment: 8,
    instructor: "user-1",
    instructorName: "Erniekay Splendor",
    syllabus: [
      {
        week: 1,
        title: "Bridal Foundation & Consultation Skills",
        topics: ["Client psychology", "Cultural traditions", "Design planning"],
      },
    ],
    imgSrc: "https://lh3.googleusercontent.com/...",
    imgAlt: "Bridal makeup application in progress",
    status: "active",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2024-11-24"),
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2024-06-01"),
  },
];

export const MOCK_BRIDAL_PACKAGES: BridalPackage[] = [
  {
    id: "civil-elegance",
    title: "The Civil Elegance",
    description: "Minimalist sophistication for the modern bride. Perfect for registry weddings and intimate elopements.",
    price: undefined,
    priceRange: {
      min: 1200,
      max: 1500,
    },
    duration: 90,
    features: [
      "90-min Consultation",
      "One Bridal Hair & Makeup Look",
      "Premium Product Kit",
    ],
    services: [],
    featured: false,
    image: {
      src: "https://lh3.googleusercontent.com/...",
      alt: "A minimalist bridal styling session with a clean low bun and natural dewy makeup",
    },
    consultationIncluded: true,
    revision: {
      included: true,
      count: 1,
    },
    createdAt: new Date("2023-07-01"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: "traditional-splendor",
    title: "Traditional Splendor",
    description: "Celebrating cultural heritage with high-impact, radiant artistry that glows from morning to night.",
    price: undefined,
    priceRange: {
      min: 2500,
      max: 3500,
    },
    duration: 180,
    features: [
      "Multi-day Styling Support",
      "Detailed Jewelry Setting",
      "Luxury Hair & Face Contour",
    ],
    services: [],
    featured: true,
    image: {
      src: "https://lh3.googleusercontent.com/...",
      alt: "A stunning bride with vibrant, high-impact traditional bridal artistry with gold accents",
    },
    consultationIncluded: true,
    revision: {
      included: true,
      count: 3,
    },
    createdAt: new Date("2023-07-01"),
    updatedAt: new Date("2024-06-01"),
  },
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm-1",
    userId: "user-1",
    name: "Erniekay",
    role: "Founder & Creative Director",
    bio: "Obsessed with symmetry and editorial polish, Erniekay directs all hair, makeup, and education campaigns.",
    specializations: ["bridal", "editorial", "commercial"],
    certifications: ["NAHA Certified", "International Makeup Academy"],
    yearsOfExperience: 15,
    imgSrc: "https://lh3.googleusercontent.com/...",
    imgAlt: "Erniekay portrait",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: "tm-2",
    userId: "user-2",
    name: "Beatrice Kay",
    role: "Lead Hair Educator & Colorist",
    bio: "Specializing in couture balayages and editorial sculpting, Beatrice bridges the gap between precision cut and runway style.",
    specializations: ["hair", "color", "editorial"],
    certifications: ["Master Colorist", "Olaplex Certified"],
    yearsOfExperience: 12,
    imgSrc: "https://lh3.googleusercontent.com/...",
    imgAlt: "Beatrice Kay portrait",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2024-06-01"),
  },
];

export const MOCK_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gallery-1",
    title: "Editorial Bridal Collection",
    description: "High-fashion bridal looks for magazine features",
    category: "bridal",
    tags: ["editorial", "bridal", "luxury"],
    images: [
      { src: "https://example.com/image1.jpg", alt: "Bridal look 1", position: 1 },
      { src: "https://example.com/image2.jpg", alt: "Bridal look 2", position: 2 },
    ],
    artist: "user-1",
    artistName: "Erniekay",
    beforeAndAfter: false,
    techniques: ["airbrush", "contouring", "highlighting"],
    featuredInPromo: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-01"),
  },
];
