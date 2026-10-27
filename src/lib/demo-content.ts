import type { SiteContent } from "./types";

/**
 * Content shown before Supabase is connected (and used for the live preview).
 * It mirrors the demo rows inserted by supabase/schema.sql.
 */
export const demoContent: SiteContent = {
  site: {
    brand: "Xlorva",
    meta_title: "Jane Doe — UX/UI Designer",
    meta_description:
      "Jane Doe is a UX/UI designer crafting calm, human interfaces for products people love to use.",
    nav_cta_label: "Get in touch",
    name: "Jane Doe",
    role: "UX/UI Designer",
    bio: "I design clear, calm digital products — from first sketch to polished interface — for startups and teams who care about the details.",
    photo_url: "/demo/jane.jpg",
    hero_cta_label: "Let's talk",
    hero_cta_url: "#contact",
    hero_secondary_label: "View resume",
    hero_secondary_url: "#",
    about_title: "Design that feels effortless",
    about_text:
      "For the past eight years I have helped startups and global brands turn complex ideas into simple, beautiful experiences. I combine research, interaction design and visual craft to ship products that people actually enjoy using.",
    stat_1_value: "8+",
    stat_1_label: "Years of experience",
    stat_2_value: "120",
    stat_2_label: "Projects delivered",
    stat_3_value: "40+",
    stat_3_label: "Happy clients",
    work_title: "Selected work",
    work_subtitle: "A few recent projects I am proud of.",
    people_title: "Kind words",
    people_subtitle: "What clients and collaborators say.",
    contact_title: "Let's build something together",
    contact_text:
      "Have a project in mind or just want to say hello? Send me a message and I will get back to you within two days.",
    email: "hello@janedoe.design",
    phone: "+1 (555) 012-3456",
    location: "Lisbon, Portugal",
    social_x: "https://x.com",
    social_linkedin: "https://linkedin.com",
    social_dribbble: "https://dribbble.com",
    social_instagram: "https://instagram.com",
    social_github: null,
    footer_text: "Designing calm, human interfaces.",
  },
  highlights: [
    {
      id: "demo-h1",
      title: "Fintech Redesign",
      subtitle: "Lead Designer",
      description: "Rebuilt onboarding for 2M users and lifted activation by 34%.",
      image_url: "/demo/w2.jpg",
      link_url: "#work",
      position: 1,
    },
    {
      id: "demo-h2",
      title: "Atlas Design System",
      subtitle: "Creator",
      description: "120+ components powering five product teams.",
      image_url: "/demo/w1.jpg",
      link_url: "#work",
      position: 2,
    },
    {
      id: "demo-h3",
      title: "Mindful App",
      subtitle: "Product Designer",
      description: "A meditation app featured by Apple in 30 countries.",
      image_url: "/demo/w6.jpg",
      link_url: "#work",
      position: 3,
    },
  ],
  projects: [
    {
      id: "demo-p1",
      title: "Lumen Banking App",
      category: "Fintech · Mobile",
      description:
        "A calmer way to manage money: simplified flows, clearer numbers and a fresh visual language.",
      image_url: "/demo/w2.jpg",
      case_url: "#",
      live_url: "#",
      published: true,
      position: 1,
    },
    {
      id: "demo-p2",
      title: "Atlas Design System",
      category: "Design Systems",
      description:
        "A token-based system with 120+ accessible components shared across web and native apps.",
      image_url: "/demo/w1.jpg",
      case_url: "#",
      live_url: "#",
      published: true,
      position: 2,
    },
    {
      id: "demo-p3",
      title: "Nomad Travel Platform",
      category: "Web · Booking",
      description:
        "End-to-end booking experience that cut checkout time in half for a travel startup.",
      image_url: "/demo/w4.jpg",
      case_url: "#",
      live_url: "#",
      published: true,
      position: 3,
    },
    {
      id: "demo-p4",
      title: "Pulse Analytics",
      category: "SaaS · Dashboard",
      description:
        "Turning dense product data into clear dashboards that teams check every morning.",
      image_url: "/demo/w5.jpg",
      case_url: "#",
      live_url: "#",
      published: true,
      position: 4,
    },
    {
      id: "demo-p5",
      title: "Studio Brand Kit",
      category: "Branding",
      description:
        "Identity, illustration and a flexible layout system for a creative studio.",
      image_url: "/demo/w3.jpg",
      case_url: "#",
      live_url: "#",
      published: true,
      position: 5,
    },
    {
      id: "demo-p6",
      title: "Mindful App",
      category: "Health · iOS",
      description:
        "A meditation companion with gentle motion and a focus on daily habits.",
      image_url: "/demo/w6.jpg",
      case_url: "#",
      live_url: "#",
      published: true,
      position: 6,
    },
  ],
  testimonials: [
    {
      id: "demo-t1",
      name: "Aaron Ellis",
      role: "CEO, Lumen",
      quote:
        "Jane took a messy product and made it feel obvious. Our support tickets dropped by a third within a month of launch.",
      avatar_url: "/demo/p3.jpg",
      position: 1,
    },
    {
      id: "demo-t2",
      name: "Andre Foster",
      role: "Head of Product, Pulse",
      quote:
        "A rare designer who thinks like a product owner. Clear communication, beautiful work, always on time.",
      avatar_url: "/demo/p5.jpg",
      position: 2,
    },
    {
      id: "demo-t3",
      name: "Maya Chen",
      role: "Founder, Nomad",
      quote:
        "Working with Jane felt like adding a senior partner to the team. I would hire her again tomorrow.",
      avatar_url: "/demo/p4.jpg",
      position: 3,
    },
  ],
};
