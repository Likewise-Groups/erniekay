import BridalPageClient from "@/components/bridal/BridalPageClient";
import { getMediaOverrides } from "@/lib/media";

/**
 * Rendered per request so media changes made in the admin appear immediately.
 * Without this the page is prerendered at build time and would freeze whichever
 * pictures were live when it was built. The lookup is a single indexed query
 * over a table with a few dozen rows, through Hyperdrive.
 */
export const dynamic = "force-dynamic";


/**
 * Thin server shell over the bridal page.
 *
 * The page itself is a large stateful form (package selection, enquiry fields),
 * so it stays a client component in components/bridal/BridalPageClient.tsx. This
 * file exists only to read the media overrides — a client component cannot query
 * the database, and the pictures on this page are editable from the admin.
 */
export default async function BridalPage() {
  const media = await getMediaOverrides();

  return <BridalPageClient media={media} />;
}
