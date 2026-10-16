"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { MediaSlot, ResolvedMedia } from "@/lib/mediaSlots";

import { resetMediaSlot, updateMediaAlt } from "./actions";

/**
 * One editable position on the public site.
 *
 * ── Why the upload is an XHR ────────────────────────────────────────────────
 * Videos here run to tens of megabytes over mobile connections. A plain form
 * post gives no feedback for however long that takes, and a staff member with
 * no progress bar will press the button again. XMLHttpRequest is used rather
 * than fetch() for the one thing fetch still cannot do: report upload progress.
 *
 * ── Why previews are plain <img>/<video> ────────────────────────────────────
 * Not next/image: these point at Supabase Storage on a project-specific host,
 * and a preview that 400s because the optimiser has not been told about the
 * hostname would look exactly like a failed upload. The public site is where
 * image optimisation matters; this is a thumbnail in a tool.
 */
export default function MediaSlotCard({
  slot,
  resolved,
  updatedBy,
  updatedAt,
  uploadsEnabled,
}: {
  slot: MediaSlot;
  resolved: ResolvedMedia;
  updatedBy?: string | null;
  updatedAt?: string | null;
  uploadsEnabled: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function upload(file: File) {
    setError(null);
    setProgress(0);

    const body = new FormData();
    body.set("slot", slot.id);
    body.set("file", file);

    const request = new XMLHttpRequest();
    request.open("POST", "/api/media/upload");

    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100));
    });

    request.addEventListener("load", () => {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";

      if (request.status >= 200 && request.status < 300) {
        // Re-renders the server component with the new row, so the preview
        // below updates without a full page reload.
        router.refresh();
        return;
      }

      try {
        setError(JSON.parse(request.responseText).error ?? "Upload failed.");
      } catch {
        setError(`Upload failed (${request.status}).`);
      }
    });

    request.addEventListener("error", () => {
      setProgress(null);
      setError("Upload failed — check the connection and try again.");
    });

    request.send(body);
  }

  const busy = progress !== null;

  return (
    // The slot id is the anchor the activity log links a media change to.
    <div
      id={slot.id}
      className="scroll-mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand/5 target:ring-2 target:ring-gold transition-all duration-300 hover:shadow-md"
    >
      <div
        className="mb-3 overflow-hidden rounded-lg bg-slate-100"
        style={{ aspectRatio: slot.aspect ?? "4 / 3" }}
      >
        {resolved.kind === "video" ? (
          <video
            key={resolved.url}
            src={resolved.url}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            controls
            preload="metadata"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- see the note above.
          <img
            key={resolved.url}
            src={resolved.url}
            alt={resolved.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      <div className="mb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-brand-ink/80">{slot.label}</h3>
          <span
            className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ring-1 ring-inset ${
              resolved.isOverridden
                ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                : "bg-brand-ink/5 text-brand-ink/50 ring-brand-ink/10"
            }`}
          >
            <span className="inline-block h-1 w-1 rounded-full bg-current opacity-60" />
            {resolved.isOverridden ? "Custom" : "Default"}
          </span>
        </div>
        {slot.note ? <p className="mt-1 text-xs text-brand-ink/50">{slot.note}</p> : null}
        <p className="mt-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-brand-ink/35">
          {slot.kind === "video" ? "Video" : "Image"} slot
          {slot.aspect ? ` · ${slot.aspect.replace(/\s/g, "")}` : ""}
          {resolved.isOverridden && updatedBy ? ` · by ${updatedBy}` : ""}
          {resolved.isOverridden && updatedAt ? ` · ${updatedAt}` : ""}
        </p>
      </div>

      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          disabled={!uploadsEnabled || busy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
          }}
          aria-label={`Replace ${slot.label}`}
          className="block w-full text-xs text-brand-ink/60 file:mr-2.5 file:cursor-pointer file:rounded-xl file:border-0 file:bg-brand file:px-3.5 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-brand-soft disabled:opacity-50"
        />

        {busy ? (
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-soft transition-[width]"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress ?? 0}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        ) : null}

        {error ? (
          <p role="alert" className="rounded-xl border border-rose-500/10 bg-rose-500/5 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        ) : null}

        {resolved.isOverridden ? (
          <div className="flex flex-wrap items-center gap-2">
            <form action={updateMediaAlt} className="flex flex-1 gap-1.5">
              <input type="hidden" name="slot" value={slot.id} />
              <input type="hidden" name="group" value={slot.group} />
              <input
                name="alt"
                defaultValue={resolved.alt}
                placeholder="Describe this picture"
                aria-label={`Alt text for ${slot.label}`}
                className="min-w-0 flex-1 rounded-xl border border-brand/10 bg-white px-2.5 py-1.5 text-xs outline-none transition-all duration-200 placeholder:text-brand-ink/30 focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
              />
              <button
                type="submit"
                className="rounded-xl border border-brand/10 bg-white px-2.5 py-1.5 text-xs font-semibold text-brand transition-all duration-200 hover:bg-cream hover:border-brand/20"
              >
                Save
              </button>
            </form>

            <form action={resetMediaSlot}>
              <input type="hidden" name="slot" value={slot.id} />
              <input type="hidden" name="group" value={slot.group} />
              <button
                type="submit"
                className="rounded-xl border border-rose-200/50 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition-all duration-200 hover:bg-rose-50"
              >
                Reset
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
