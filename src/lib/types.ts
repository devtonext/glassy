export type Site = {
  brand: string;
  meta_title: string | null;
  meta_description: string | null;
  nav_cta_label: string | null;
  name: string;
  role: string | null;
  bio: string | null;
  photo_url: string | null;
  hero_cta_label: string | null;
  hero_cta_url: string | null;
  hero_secondary_label: string | null;
  hero_secondary_url: string | null;
  about_title: string | null;
  about_text: string | null;
  stat_1_value: string | null;
  stat_1_label: string | null;
  stat_2_value: string | null;
  stat_2_label: string | null;
  stat_3_value: string | null;
  stat_3_label: string | null;
  work_title: string | null;
  work_subtitle: string | null;
  people_title: string | null;
  people_subtitle: string | null;
  contact_title: string | null;
  contact_text: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  social_x: string | null;
  social_linkedin: string | null;
  social_dribbble: string | null;
  social_instagram: string | null;
  social_github: string | null;
  footer_text: string | null;
};

export type Highlight = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  position: number;
};

export type Project = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  case_url: string | null;
  live_url: string | null;
  published: boolean;
  position: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  avatar_url: string | null;
  position: number;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type SiteContent = {
  site: Site;
  highlights: Highlight[];
  projects: Project[];
  testimonials: Testimonial[];
};
