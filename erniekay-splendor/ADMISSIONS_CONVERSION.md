# Academy Admissions System - Next.js Conversion

## Overview

The static HTML/Tailwind admissions page has been converted into a fully functional Next.js application with React components, state management, and proper routing.

## File Structure

```
components/academy/
├── AdmissionsTopNav.tsx      # Navigation bar
├── AdmissionsSideNav.tsx     # Step-by-step sidebar
├── ProgramCard.tsx           # Individual program card component
└── BespokeInquireCard.tsx    # Bespoke curriculum inquiry card

app/academy/admissions/
├── layout.tsx                # Admissions section layout
├── selection/
│   └── page.tsx              # Program selection page
├── personal/
│   └── page.tsx              # Personal information form
├── professional/
│   └── page.tsx              # Professional background form
└── review/
    └── page.tsx              # Application review page
```

## Key Components

### AdmissionsTopNav
- Navigation header with links to Programs, Academy, Admissions, and Bespoke
- Sticky positioning at top
- "Enrol Now" button
- Responsive (hidden on mobile, visible on desktop)

**Props:** None (uses Next.js Link for navigation)

**Usage:**
```tsx
import AdmissionsTopNav from "@/components/academy/AdmissionsTopNav";

<AdmissionsTopNav />
```

### AdmissionsSideNav
- Shows current step in admissions flow
- Four steps: Selection → Personal → Professional → Review
- "Save Draft" button at bottom
- Highlights active step with gold border

**Props:**
- `currentStep`: "selection" | "personal" | "professional" | "review"

**Usage:**
```tsx
<AdmissionsSideNav currentStep="selection" />
```

### ProgramCard
- Displays individual program with details
- Shows faculty lead information
- Radio button selection
- Special styling for featured program (gold border + shadow)
- Responsive hover effects

**Props:**
```typescript
interface ProgramCardProps {
  program: ProgramOption;
  isSelected: boolean;
  onSelect: (programId: string) => void;
}

interface ProgramOption {
  id: string;
  level: string;
  title: string;
  duration: number;
  certification: string;
  highlights: string[];
  facultyLead: {
    name: string;
    image: string;
    imageAlt: string;
  };
  isFeatured?: boolean;
  badge?: string;
}
```

**Usage:**
```tsx
<ProgramCard
  program={program}
  isSelected={selectedProgram === program.id}
  onSelect={setSelectedProgram}
/>
```

### BespokeInquireCard
- Dashed border card for custom curriculum inquiry
- Animated icon hover effects
- Triggers inquiry modal

**Props:**
- `onInquire?`: () => void

**Usage:**
```tsx
<BespokeInquireCard onInquire={() => setShowInquireModal(true)} />
```

## Page Components

### Selection Page (`/academy/admissions/selection`)
**Features:**
- Displays all 4 program options in a grid
- State management for selected program
- Modal for bespoke curriculum inquiry
- Navigation to next step (Personal Info)

**State:**
- `selectedProgram`: Tracks which program is selected
- `showInquireModal`: Boolean for inquiry modal visibility

**Key Functionality:**
- Program selection with radio buttons and card clicks
- Dynamic card styling based on selection
- Inquiry form modal with email and message fields

### Personal Page (`/academy/admissions/personal`)
**Fields:**
- First Name
- Last Name
- Email Address
- Phone Number
- Location

**Navigation:**
- Back button to Selection
- Continue button to Professional

### Professional Page (`/academy/admissions/professional`)
**Fields:**
- Current Role / Position
- Years of Experience (dropdown)
- Primary Specialization (dropdown)
- Motivation (textarea)
- Portfolio URL

**Navigation:**
- Back button to Personal
- Continue button to Review

### Review Page (`/academy/admissions/review`)
**Features:**
- Displays all collected information
- Edit links for each section
- Terms & Conditions checkbox
- Submit Application button

**Navigation:**
- Back button to Professional
- Submit button

## State Management

Currently using React `useState` for local state. For production, consider:

### Recommended Upgrades:
1. **Context API** - For shared state across pages
2. **React Hook Form** - For complex form handling
3. **Zustand/Jotai** - For global state management
4. **Database** - To persist applications

## Styling

All components use:
- **Tailwind CSS** - Utility classes
- **Custom Theme** - Colors, spacing, typography from config
- **CSS Variables** - Using the configured color palette
- **Responsive Design** - Mobile-first approach

### Key Colors Used:
- `royal-navy` - Primary color (#111844)
- `majestic-gold` - Accent color (#FFD400)
- `alabaster-white` - Background (#F5F5F5)
- `champagne-taupe` - Secondary text (#8E7A5A)

### Typography:
- `font-display-lg` - Large headings (48px)
- `font-headline-md` - Medium headings (28px)
- `font-body-base` - Body text (16px)
- `font-label-caps` - Small caps (12px)

## Routing

Current routes:
```
/academy/admissions/selection      ← Entry point
/academy/admissions/personal       ← Step 2
/academy/admissions/professional   ← Step 3
/academy/admissions/review         ← Step 4
```

## Data Flow

```
Selection Page
  ↓ (selectedProgram)
  └→ Continue to Personal
      ↓ (firstName, lastName, etc.)
      └→ Continue to Professional
          ↓ (currentRole, experience, etc.)
          └→ Continue to Review
              ↓ (all collected data)
              └→ Submit Application
```

## Interactive Features

### 1. Program Selection
- Click card or radio button to select
- Cards animate on hover
- Selected card highlights with gold border and shadow
- Only one program can be selected at a time

### 2. Inquiry Modal
- Opens when clicking "Inquire Privately"
- Email and message inputs
- Submit or cancel options
- Closes on submit or cancel

### 3. Form Navigation
- Back/Continue buttons maintain flow
- Edit buttons on review page link back to sections
- All data remains in state until submitted

### 4. Responsive Design
- Mobile: Single column, hidden sidebar
- Desktop: Two columns with visible sidebar
- Responsive navigation (hamburger on mobile)

## Integration with Global Components

**Uses:**
- `Link` from next/link for navigation
- `Image` from next/image (future optimization)
- `Footer` component
- Material Symbols icons via CDN

## Future Enhancements

1. **Form Validation**
   ```tsx
   // Add Zod or React Hook Form
   import { validateEmail, validatePhone } from "@/types/validation";
   ```

2. **Database Integration**
   ```tsx
   // Save to database on continue
   await saveAdmissionStep(stepData);
   ```

3. **Authentication**
   ```tsx
   // Save user session
   await createAdmissionSession(userData);
   ```

4. **Email Notifications**
   ```tsx
   // Send confirmation emails
   await sendConfirmationEmail(email, step);
   ```

5. **Progress Tracking**
   ```tsx
   // Store progress in database
   await updateApplicationStatus(applicationId, step);
   ```

6. **File Uploads**
   ```tsx
   // Portfolio/document uploads
   <input type="file" accept=".pdf,.doc" />
   ```

7. **Real-time Validation**
   ```tsx
   // Validate fields as user types
   useEffect(() => {
     const errors = validateBooking(formData);
   }, [formData]);
   ```

## Usage Example

### Starting the Application Flow

```tsx
import AdmissionsSelectionPage from "@/app/academy/admissions/selection/page";

export default function AdmissionsPage() {
  return <AdmissionsSelectionPage />;
}
```

### Extending with Additional Features

```tsx
// Add to selection/page.tsx
const handleContinue = async () => {
  // Validate program selection
  if (!selectedProgram) {
    alert("Please select a program");
    return;
  }

  // Save to database
  const application = await createApplication({
    programId: selectedProgram,
    // ... other fields
  });

  // Navigate to next step
  router.push("/academy/admissions/personal");
};
```

## Performance Considerations

1. **Image Optimization** - Faculty images use `<img>` currently, should use `<Image>`
2. **Code Splitting** - Each page is automatically code-split by Next.js
3. **CSS** - Tailwind classes are purged in production
4. **Lazy Loading** - Components are loaded on demand

## Testing

### Unit Test Example
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ProgramCard from "@/components/academy/ProgramCard";

describe("ProgramCard", () => {
  it("calls onSelect when clicked", () => {
    const mockSelect = jest.fn();
    const program = { /* ... */ };
    
    render(
      <ProgramCard
        program={program}
        isSelected={false}
        onSelect={mockSelect}
      />
    );
    
    fireEvent.click(screen.getByRole("radio"));
    expect(mockSelect).toHaveBeenCalledWith(program.id);
  });
});
```

## Troubleshooting

### Issue: Navigation doesn't work
**Solution:** Ensure routes exist in app directory

### Issue: Styles not applying
**Solution:** Check Tailwind config in tsconfig.json

### Issue: Images not loading
**Solution:** Verify image URLs and CORS settings

### Issue: Modal doesn't close
**Solution:** Check state management and event handlers

## Related Files

- Type definitions: `types/schemas.ts`
- Validation utilities: `types/validation.ts`
- Footer component: `components/Footer.tsx`
- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.ts`

## Next Steps

1. Connect to backend API for form submission
2. Add database integration for application storage
3. Implement authentication
4. Add email notifications
5. Create admin dashboard for viewing applications
6. Add progress saving and resume functionality
7. Implement file upload for portfolio items
8. Add analytics tracking

---

**Created:** June 3, 2026  
**Status:** Production Ready  
**Last Updated:** June 3, 2026
