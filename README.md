# erniekay Splendor

This set of Mermaid diagrams is suitable for your project's **README, system documentation, software requirements document (SRD), and developer onboarding materials**. It clearly separates the **Salon**, **Bridal**, and **Academy** business processes while keeping everything under a single beautician business.
# Complete System Workflow

```mermaid
flowchart TD

    A[Visitor Lands on Website]

    A --> B[Salon Services]
    A --> C[Bridal Services]
    A --> D[Beauty Academy]

    %% SALON FLOW
    B --> B1[Browse Services]
    B1 --> B2[Select Service]
    B2 --> B3[Choose Date & Time]
    B3 --> B4[Choose Location]
    B4 --> B5[Submit Booking]
    B5 --> B6[Admin Reviews Booking]
    B6 --> B7[Payment]
    B7 --> B8[Booking Confirmed]
    B8 --> B9[Service Delivered]

    %% BRIDAL FLOW
    C --> C1[View Bridal Packages]
    C1 --> C2[Submit Bridal Inquiry]
    C2 --> C3[Wedding Details]
    C3 --> C4[Admin Review]
    C4 --> C5[Quotation Generated]
    C5 --> C6[Deposit Payment]
    C6 --> C7[Bridal Booking Confirmed]
    C7 --> C8[Wedding Service Delivered]

    %% ACADEMY FLOW
    D --> D1[Browse Courses]
    D1 --> D2[Select Course]
    D2 --> D3[Submit Application]
    D3 --> D4[Admin Review]
    D4 --> D5[Pay Enrollment Fee]
    D5 --> D6[Student Enrollment]
    D6 --> D7[Access Student Portal]
    D7 --> D8[Training]
    D8 --> D9[Certification]
```

---

# User Roles Workflow

```mermaid
flowchart LR

    Admin((Admin))
    Customer((Customer))
    Student((Student))
    Instructor((Instructor))

    Customer -->|Book Appointment| Salon
    Customer -->|Book Bridal Package| Bridal

    Student -->|Enroll Course| Academy
    Student -->|Access Materials| Academy

    Instructor -->|Manage Students| Academy
    Instructor -->|Upload Materials| Academy

    Admin -->|Manage Services| Salon
    Admin -->|Manage Bridal Requests| Bridal
    Admin -->|Manage Courses| Academy
    Admin -->|Manage Payments| Payments
```

---

# Appointment Booking Flow

```mermaid
sequenceDiagram

    participant Customer
    participant Website
    participant Admin
    participant Payment

    Customer->>Website: Select Service
    Customer->>Website: Choose Date & Time
    Customer->>Website: Submit Booking

    Website->>Admin: New Appointment

    Admin->>Website: Approve Booking

    Website->>Customer: Payment Request

    Customer->>Payment: Pay

    Payment->>Website: Payment Confirmation

    Website->>Customer: Booking Confirmed
```

---

# Academy Enrollment Flow

```mermaid
sequenceDiagram

    participant Student
    participant Website
    participant Admin
    participant Payment

    Student->>Website: Apply For Course

    Website->>Admin: New Application

    Admin->>Website: Approve Application

    Website->>Student: Enrollment Invoice

    Student->>Payment: Pay Fees

    Payment->>Website: Payment Successful

    Website->>Student: Student Account Created

    Student->>Website: Access Learning Materials
```

---

# System Architecture

```mermaid
flowchart TB

    User[Customer / Student]

    Frontend[Next.js Frontend]

    API[Node.js / Express API]

    Auth[JWT Authentication]

    DB[(PostgreSQL)]

    Storage[Cloudinary]

    Payment[Paystack / Flutterwave]

    Admin[Admin Dashboard]

    User --> Frontend

    Frontend --> API

    API --> Auth
    API --> DB
    API --> Storage
    API --> Payment

    Admin --> Frontend
```

---

# Admin Dashboard Modules

```mermaid
mindmap
  root((Admin Dashboard))

    Salon
      Services
      Appointments
      Customers
      Gallery

    Bridal
      Packages
      Inquiries
      Quotations

    Academy
      Courses
      Students
      Instructors
      Certificates

    Finance
      Payments
      Revenue
      Reports

    Settings
      Website Content
      Social Media
      Business Information
```


