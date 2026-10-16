"use client";

import { useState } from "react";

import { createCourse, updateCourse } from "./actions";

/**
 * Add or edit one programme.
 *
 * A client component for the slug preview alone. Course.slug is uniquely
 * indexed and is what a programme is addressed by, so it is the one field where
 * seeing the result before saving actually prevents a mistake — the server
 * derives it from the title when the field is left blank, and an operator who
 * cannot see that happening tends to type a title into it.
 */

const slugPreview = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export type CourseRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  durationWeeks: number;
  level: string | null;
};

const field =
  "w-full rounded-xl border border-brand/10 bg-white px-3.5 py-2 text-sm outline-none transition-all duration-200 placeholder:text-brand-ink/30 focus:border-gold/40 focus:ring-2 focus:ring-gold/10";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-ink/50";

export default function CourseForm({
  course,
  onCancelHref,
}: {
  course?: CourseRow;
  onCancelHref?: string;
}) {
  const [title, setTitle] = useState(course?.title ?? "");
  const [slug, setSlug] = useState(course?.slug ?? "");

  const effectiveSlug = slugPreview(slug || title);

  return (
    <form action={course ? updateCourse : createCourse} className="space-y-4 p-4">
      {course ? <input type="hidden" name="id" value={course.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={label}>
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={160}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Bridal Artistry Masterclass"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="slug" className={label}>
            Web address
          </label>
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="Derived from the title"
            className={`${field} font-mono text-xs`}
          />
          <p className="mt-1 truncate text-xs text-brand-ink/40">
            {effectiveSlug ? `/academy/${effectiveSlug}` : "Add a title first"}
          </p>
        </div>

        <div>
          <label htmlFor="price" className={label}>
            Price (GHS)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={course?.price ?? 0}
            className={field}
          />
        </div>

        <div>
          <label htmlFor="durationWeeks" className={label}>
            Duration (weeks)
          </label>
          <input
            id="durationWeeks"
            name="durationWeeks"
            type="number"
            min="1"
            max="520"
            step="1"
            required
            defaultValue={course?.durationWeeks ?? 4}
            className={field}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="level" className={label}>
            Level
          </label>
          <input
            id="level"
            name="level"
            maxLength={80}
            defaultValue={course?.level ?? ""}
            placeholder="Beginner · Intermediate · Professional"
            className={field}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className={label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            maxLength={2000}
            defaultValue={course?.description ?? ""}
            placeholder="What the programme covers, and who it is for."
            className={field}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-soft"
        >
          {course ? "Save changes" : "Add programme"}
        </button>

        {onCancelHref ? (
          <a
            href={onCancelHref}
            className="rounded-xl border border-brand/10 bg-white px-4 py-2 text-sm font-semibold text-brand transition-all duration-200 hover:bg-cream"
          >
            Cancel
          </a>
        ) : null}
      </div>
    </form>
  );
}
