/**
 * Creates the Supabase Storage bucket that uploaded site media lives in.
 *
 * Run once per environment:  npm run storage:init
 *
 * ── Why the bucket is public ────────────────────────────────────────────────
 * The public site renders an uploaded picture by putting its URL in an <img>.
 * Signed URLs would mean the Worker minting one per image per page render, and
 * they expire — a cached HTML page would then reference URLs that no longer
 * work. Everything in here is a photograph intended for the shopfront; nothing
 * private is ever uploaded through the admin.
 *
 * Writes still require the service-role key, which never leaves the admin
 * server. Public means readable, not writable.
 *
 * Idempotent: an existing bucket is reported and left alone.
 */
const url = (process.env.SUPABASE_URL ?? "").replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_MEDIA_BUCKET || "site-media";

if (!url || !key) {
  console.error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. " +
      "Run through npm so --env-file=.env.local is applied.",
  );
  process.exit(1);
}

// Kept in step with lib/storage.ts. The bucket enforces them as well as the
// route handler does: a limit checked only in application code is a limit that
// stops applying the moment anything else writes to the bucket.
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];
const FILE_SIZE_LIMIT = 25 * 1024 * 1024;

const headers = {
  Authorization: `Bearer ${key}`,
  apikey: key,
  "Content-Type": "application/json",
};

const existing = await fetch(`${url}/storage/v1/bucket/${bucket}`, { headers });

if (existing.ok) {
  const details = await existing.json();
  console.log(`Bucket "${bucket}" already exists (public: ${details.public}).`);

  if (!details.public) {
    console.warn(
      "\nIt is NOT public. The site links straight at object URLs, so uploaded media " +
        "will 400 until you make it public in the Supabase dashboard.",
    );
    process.exit(1);
  }

  process.exit(0);
}

if (existing.status !== 404) {
  console.error(`Could not check the bucket (${existing.status}): ${await existing.text()}`);
  process.exit(1);
}

const created = await fetch(`${url}/storage/v1/bucket`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    id: bucket,
    name: bucket,
    public: true,
    file_size_limit: FILE_SIZE_LIMIT,
    allowed_mime_types: ALLOWED_MIME_TYPES,
  }),
});

if (!created.ok) {
  console.error(`Creating "${bucket}" failed (${created.status}): ${await created.text()}`);
  process.exit(1);
}

console.log(
  `Created public bucket "${bucket}" ` +
    `(max ${FILE_SIZE_LIMIT / 1024 / 1024} MB, ${ALLOWED_MIME_TYPES.length} media types).`,
);
