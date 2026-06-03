/**
 * Integration Guide: Admissions System with Data Schemas
 * 
 * This guide shows how to connect the admissions components
 * with the TypeScript schemas and validation utilities.
 */

// ============================================================================
// USING SCHEMAS WITH THE ADMISSIONS SYSTEM
// ============================================================================

// 1. TYPE THE PROGRAM SELECTION WITH COURSE SCHEMA
// ============================================================================

import type { Course, Enrollment, User } from "@/types/schemas";
import {
  validateEmail,
  validatePhone,
  formatDate,
  isEnrollmentActive,
} from "@/types/validation";

// Convert Course to ProgramOption for UI
function courseToProgramOption(course: Course): ProgramCardProps["program"] {
  return {
    id: course.id,
    level: course.level,
    title: course.title,
    duration: course.duration,
    certification: course.certification?.type || "Certification",
    highlights: course.syllabus?.[0]?.topics || [],
    facultyLead: {
      name: course.instructorName || "Faculty Lead",
      image: course.imgSrc,
      imageAlt: course.imgAlt,
    },
    isFeatured: false,
  };
}

// ============================================================================
// 2. TYPE THE ADMISSIONS FORM DATA WITH SCHEMAS
// ============================================================================

interface AdmissionsFormData {
  // Step 1: Selection
  selectedCourseId: string;

  // Step 2: Personal Information (User Profile)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string; // City/Country from Address schema

  // Step 3: Professional Background
  currentRole: string;
  yearsOfExperience: number;
  specialization: string;
  motivation: string;
  portfolioUrl?: string;

  // Additional fields
  agreeToTerms: boolean;
  createdAt: Date;
}

// Create Enrollment from form data
function formDataToEnrollment(
  formData: AdmissionsFormData,
  userId: string
): Partial<Enrollment> {
  return {
    courseId: formData.selectedCourseId,
    userId: userId,
    status: "pending",
    enrollmentDate: new Date(),
    amountPaid: 0,
  };
}

// ============================================================================
// 3. VALIDATION WITH SCHEMA VALIDATORS
// ============================================================================

function validateAdmissionsPersonalStep(
  data: Partial<AdmissionsFormData>
): string[] {
  const errors: string[] = [];

  if (!data.firstName?.trim()) {
    errors.push("First name is required");
  }

  if (!data.lastName?.trim()) {
    errors.push("Last name is required");
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push("Valid email is required");
  }

  if (!data.phone || !validatePhone(data.phone)) {
    errors.push("Valid phone number is required");
  }

  if (!data.location?.trim()) {
    errors.push("Location is required");
  }

  return errors;
}

function validateAdmissionsProfessionalStep(
  data: Partial<AdmissionsFormData>
): string[] {
  const errors: string[] = [];

  if (!data.currentRole?.trim()) {
    errors.push("Current role is required");
  }

  if (!data.yearsOfExperience || data.yearsOfExperience < 0) {
    errors.push("Valid years of experience is required");
  }

  if (!data.specialization?.trim()) {
    errors.push("Specialization is required");
  }

  if (!data.motivation?.trim() || data.motivation!.length < 20) {
    errors.push("Please provide a detailed motivation (min 20 characters)");
  }

  return errors;
}

function validateAdmissionsReviewStep(
  data: Partial<AdmissionsFormData>
): string[] {
  const errors: string[] = [];

  if (!data.selectedCourseId) {
    errors.push("Program selection is required");
  }

  if (!data.agreeToTerms) {
    errors.push("You must agree to the terms and conditions");
  }

  // Run all previous validations
  errors.push(...validateAdmissionsPersonalStep(data));
  errors.push(...validateAdmissionsProfessionalStep(data));

  return errors;
}

// ============================================================================
// 4. COMPLETE COMPONENT EXAMPLE WITH SCHEMAS
// ============================================================================

"use client";

import { useState } from "react";
import { Course } from "@/types/schemas";
import ProgramCard from "@/components/academy/ProgramCard";

interface AdmissionsSelectionWithTypesProps {
  courses: Course[];
  onSelectProgram: (courseId: string) => void;
}

export function AdmissionsSelectionWithTypes({
  courses,
  onSelectProgram,
}: AdmissionsSelectionWithTypesProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const handleSelect = (programId: string) => {
    setSelectedCourse(programId);
    onSelectProgram(programId);
  };

  // Convert courses to program options
  const programs = courses.map(courseToProgramOption);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          isSelected={selectedCourse === program.id}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}

// ============================================================================
// 5. SAVE ADMISSIONS TO DATABASE WITH TYPED DATA
// ============================================================================

async function submitAdmission(
  formData: AdmissionsFormData,
  userId: string
): Promise<Enrollment> {
  // Validate all steps
  const personalErrors = validateAdmissionsPersonalStep(formData);
  const professionalErrors = validateAdmissionsProfessionalStep(formData);
  const reviewErrors = validateAdmissionsReviewStep(formData);

  const allErrors = [...personalErrors, ...professionalErrors, ...reviewErrors];
  if (allErrors.length > 0) {
    throw new Error(`Validation failed: ${allErrors.join(", ")}`);
  }

  // Create enrollment from form data
  const enrollment = formDataToEnrollment(formData, userId);

  // Save to API
  const response = await fetch("/api/enrollments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enrollment),
  });

  if (!response.ok) {
    throw new Error("Failed to submit application");
  }

  return response.json();
}

// ============================================================================
// 6. USAGE IN COMPONENT
// ============================================================================

import { useRouter } from "next/navigation";

export default function AdmissionsFlowWithSchemas() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<AdmissionsFormData>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const handlePersonalStepSubmit = (data: Partial<AdmissionsFormData>) => {
    const stepErrors = validateAdmissionsPersonalStep(data);

    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }

    setFormData((prev) => ({ ...prev, ...data }));
    setErrors([]);
    router.push("/academy/admissions/professional");
  };

  const handleProfessionalStepSubmit = (data: Partial<AdmissionsFormData>) => {
    const stepErrors = validateAdmissionsProfessionalStep(data);

    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }

    setFormData((prev) => ({ ...prev, ...data }));
    setErrors([]);
    router.push("/academy/admissions/review");
  };

  const handleFinalSubmit = async () => {
    const reviewErrors = validateAdmissionsReviewStep(formData);

    if (reviewErrors.length > 0) {
      setErrors(reviewErrors);
      return;
    }

    try {
      const enrollment = await submitAdmission(formData as AdmissionsFormData, "user-123");
      console.log("Application submitted:", enrollment);
      router.push("/academy/admissions/success");
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Submission failed"]);
    }
  };

  return (
    <div>
      {errors.length > 0 && (
        <div className="bg-error-container p-4 rounded mb-4">
          <ul>
            {errors.map((error, i) => (
              <li key={i} className="text-error">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Render form steps */}
    </div>
  );
}

// ============================================================================
// 7. FETCH COURSES FROM API WITH TYPING
// ============================================================================

import { Course } from "@/types/schemas";

async function fetchCourses(): Promise<Course[]> {
  const response = await fetch("/api/courses?category=academy");

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  const { data }: { data: Course[] } = await response.json();
  return data;
}

// ============================================================================
// 8. MIDDLEWARE FOR APPLICATION STATE MANAGEMENT
// ============================================================================

import { useReducer } from "react";

type AdmissionsAction =
  | { type: "SET_STEP"; step: "selection" | "personal" | "professional" | "review" }
  | { type: "UPDATE_DATA"; data: Partial<AdmissionsFormData> }
  | { type: "SET_ERRORS"; errors: string[] }
  | { type: "CLEAR_ERRORS" };

interface AdmissionsState {
  currentStep: "selection" | "personal" | "professional" | "review";
  data: Partial<AdmissionsFormData>;
  errors: string[];
  isLoading: boolean;
  isSubmitted: boolean;
}

const initialState: AdmissionsState = {
  currentStep: "selection",
  data: {},
  errors: [],
  isLoading: false,
  isSubmitted: false,
};

function admissionsReducer(
  state: AdmissionsState,
  action: AdmissionsAction
): AdmissionsState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step };
    case "UPDATE_DATA":
      return { ...state, data: { ...state.data, ...action.data } };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "CLEAR_ERRORS":
      return { ...state, errors: [] };
    default:
      return state;
  }
}

export function useAdmissionsFlow() {
  const [state, dispatch] = useReducer(admissionsReducer, initialState);

  return {
    currentStep: state.currentStep,
    data: state.data,
    errors: state.errors,
    setStep: (step: AdmissionsState["currentStep"]) =>
      dispatch({ type: "SET_STEP", step }),
    updateData: (data: Partial<AdmissionsFormData>) =>
      dispatch({ type: "UPDATE_DATA", data }),
    setErrors: (errors: string[]) => dispatch({ type: "SET_ERRORS", errors }),
    clearErrors: () => dispatch({ type: "CLEAR_ERRORS" }),
  };
}

// ============================================================================
// 9. ENVIRONMENT VARIABLES
// ============================================================================

/**
 * Add to .env.local:
 * 
 * NEXT_PUBLIC_API_URL=http://localhost:3000/api
 * DATABASE_URL=your_database_url
 * EMAIL_SERVICE_API_KEY=your_api_key
 */

// ============================================================================
// 10. TESTING WITH MOCK DATA
// ============================================================================

import { MOCK_COURSES, MOCK_USERS } from "@/types/mockData";

export function getAdmissionsMockData() {
  return {
    courses: MOCK_COURSES,
    users: MOCK_USERS,
    defaultFormData: {
      selectedCourseId: MOCK_COURSES[0]?.id || "",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "+1-555-0123",
      location: "New York, USA",
      currentRole: "Makeup Artist",
      yearsOfExperience: 3,
      specialization: "makeup",
      motivation: "I want to advance my skills in bridal makeup artistry.",
      agreeToTerms: false,
      createdAt: new Date(),
    } as AdmissionsFormData,
  };
}

// ============================================================================
// SUMMARY
// ============================================================================

/**
 * INTEGRATION CHECKLIST:
 * 
 * ✅ Import schemas from @/types
 * ✅ Use validation functions from @/types/validation
 * ✅ Type all form data with AdmissionsFormData
 * ✅ Convert Course to ProgramOption for display
 * ✅ Validate at each step before proceeding
 * ✅ Save enrollment to database with typed data
 * ✅ Use state management (useReducer or Context)
 * ✅ Add error handling and user feedback
 * ✅ Connect to API endpoints
 * ✅ Add email notifications on submission
 * 
 * Related Files:
 * - components/academy/AdmissionsTopNav.tsx
 * - components/academy/AdmissionsSideNav.tsx
 * - components/academy/ProgramCard.tsx
 * - app/academy/admissions/selection/page.tsx
 * - types/schemas.ts
 * - types/validation.ts
 * - types/mockData.ts
 */
