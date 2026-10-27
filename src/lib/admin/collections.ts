import type { Field } from "./fields";

/**
 * The list-style content you can manage in /admin.
 * Add a field here (and a column in supabase/schema.sql) and the admin form picks it up automatically.
 */
export type Collection = {
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  /** Round thumbnails in the list (for people) */
  roundImage?: boolean;
  fields: Field[];
};

export const collections: Record<string, Collection> = {
  highlights: {
    key: "highlights",
    table: "highlights",
    label: "Highlights",
    singular: "highlight",
    description: "The small glass cards next to your photo. Two are shown at a time; arrows appear when you add more.",
    titleField: "title",
    subtitleField: "subtitle",
    imageField: "image_url",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, half: true, placeholder: "Fintech Redesign" },
      { name: "subtitle", label: "Subtitle", type: "text", half: true, placeholder: "Lead Designer" },
      { name: "description", label: "Short description", type: "textarea", placeholder: "One or two lines about it." },
      { name: "image_url", label: "Image", type: "image" },
      { name: "link_url", label: "Link", type: "url", placeholder: "#work or https://…", help: "Where the card goes when clicked." },
    ],
  },
  projects: {
    key: "projects",
    table: "projects",
    label: "Projects",
    singular: "project",
    description: "Your portfolio. The first three are shown; visitors click “Explore” to see the rest.",
    titleField: "title",
    subtitleField: "category",
    imageField: "image_url",
    fields: [
      { name: "title", label: "Project title", type: "text", required: true, half: true, placeholder: "Lumen Banking App" },
      { name: "category", label: "Category", type: "text", half: true, placeholder: "Fintech · Mobile" },
      { name: "description", label: "Description", type: "textarea", placeholder: "What you did and the result." },
      { name: "image_url", label: "Cover image", type: "image" },
      { name: "case_url", label: "Case study link", type: "url", half: true, placeholder: "https://…" },
      { name: "live_url", label: "Live site link", type: "url", half: true, placeholder: "https://…" },
      { name: "published", label: "Published (visible on the site)", type: "checkbox" },
    ],
  },
  testimonials: {
    key: "testimonials",
    table: "testimonials",
    label: "Testimonials",
    singular: "testimonial",
    description: "Quotes from clients and collaborators.",
    titleField: "name",
    subtitleField: "role",
    imageField: "avatar_url",
    roundImage: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true, placeholder: "Aaron Ellis" },
      { name: "role", label: "Role / company", type: "text", half: true, placeholder: "CEO, Lumen" },
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "avatar_url", label: "Photo", type: "image" },
    ],
  },
};

export function getCollection(key: string) {
  return Object.hasOwn(collections, key) ? collections[key] : null;
}
