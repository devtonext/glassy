import type { FieldGroup } from "./fields";

/** Everything editable on the "Site & profile" page — one row in the `site` table. */
export const siteFieldGroups: FieldGroup[] = [
  {
    title: "Hero",
    description: "The first thing visitors see.",
    fields: [
      { name: "name", label: "Your name", type: "text", required: true, half: true },
      { name: "role", label: "Role / title", type: "text", half: true, placeholder: "UX/UI Designer" },
      { name: "bio", label: "Short intro", type: "textarea" },
      { name: "photo_url", label: "Portrait photo", type: "image", help: "A portrait (4:5) photo looks best." },
      { name: "hero_cta_label", label: "Main button text", type: "text", half: true, placeholder: "Let's talk" },
      { name: "hero_cta_url", label: "Main button link", type: "text", half: true, placeholder: "#contact" },
      { name: "hero_secondary_label", label: "Second button text", type: "text", half: true, placeholder: "View resume" },
      { name: "hero_secondary_url", label: "Second button link", type: "text", half: true, placeholder: "https://… (e.g. a PDF)" },
    ],
  },
  {
    title: "About",
    fields: [
      { name: "about_title", label: "Heading", type: "text" },
      { name: "about_text", label: "Text", type: "textarea" },
      { name: "stat_1_value", label: "Stat 1 value", type: "text", half: true, placeholder: "8+" },
      { name: "stat_1_label", label: "Stat 1 label", type: "text", half: true, placeholder: "Years of experience" },
      { name: "stat_2_value", label: "Stat 2 value", type: "text", half: true },
      { name: "stat_2_label", label: "Stat 2 label", type: "text", half: true },
      { name: "stat_3_value", label: "Stat 3 value", type: "text", half: true },
      { name: "stat_3_label", label: "Stat 3 label", type: "text", half: true },
    ],
  },
  {
    title: "Section headings",
    fields: [
      { name: "work_title", label: "Portfolio heading", type: "text", half: true },
      { name: "work_subtitle", label: "Portfolio subheading", type: "text", half: true },
      { name: "people_title", label: "Testimonials heading", type: "text", half: true },
      { name: "people_subtitle", label: "Testimonials subheading", type: "text", half: true },
    ],
  },
  {
    title: "Contact",
    fields: [
      { name: "contact_title", label: "Heading", type: "text" },
      { name: "contact_text", label: "Text", type: "textarea" },
      { name: "email", label: "Email", type: "email", half: true },
      { name: "phone", label: "Phone", type: "text", half: true },
      { name: "location", label: "Location", type: "text", half: true },
    ],
  },
  {
    title: "Social links",
    description: "Leave a field empty to hide that icon.",
    fields: [
      { name: "social_x", label: "X / Twitter", type: "url", half: true },
      { name: "social_linkedin", label: "LinkedIn", type: "url", half: true },
      { name: "social_dribbble", label: "Dribbble", type: "url", half: true },
      { name: "social_instagram", label: "Instagram", type: "url", half: true },
      { name: "social_github", label: "GitHub", type: "url", half: true },
    ],
  },
  {
    title: "Branding & SEO",
    fields: [
      { name: "brand", label: "Logo text", type: "text", required: true, half: true },
      { name: "nav_cta_label", label: "Header button text", type: "text", half: true, placeholder: "Get in touch" },
      { name: "meta_title", label: "Browser / Google title", type: "text" },
      { name: "meta_description", label: "Google description", type: "textarea" },
      { name: "footer_text", label: "Footer tagline", type: "text" },
    ],
  },
];

export const siteFields = siteFieldGroups.flatMap((g) => g.fields);
