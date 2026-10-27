import type { Metadata } from "next";
import Link from "next/link";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Navbar } from "@/components/site/Navbar";
import { People } from "@/components/site/People";
import { Work } from "@/components/site/Work";
import { getSiteContent } from "@/lib/content";

// Content is cached and refreshed instantly when you save in /admin.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteContent();
  const title = site.meta_title || `${site.name}${site.role ? ` — ${site.role}` : ""}`;
  const description = site.meta_description || site.bio || undefined;
  return {
    title,
    description,
    openGraph: { title, description, images: site.photo_url ? [site.photo_url] : undefined },
  };
}

export default async function HomePage() {
  const { site, highlights, projects, testimonials, isDemo } = await getSiteContent();

  return (
    <div className="page-bg relative isolate min-h-screen overflow-x-clip">
      {/* Soft shapes behind the glass — they are what makes the blur visible */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[30rem] -left-40 size-[34rem] rounded-full bg-[#7f9db3]/50 blur-3xl" />
        <div className="absolute top-[62rem] -right-32 size-[30rem] rounded-full bg-[#b9d2e0]/70 blur-3xl" />
        <div className="absolute top-[110rem] left-1/4 size-[36rem] rounded-full bg-[#8aa3b5]/45 blur-3xl" />
        <div className="absolute bottom-0 -right-20 size-[28rem] rounded-full bg-[#6f8ba0]/40 blur-3xl" />
      </div>
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      {isDemo && process.env.NODE_ENV === "development" && (
        <p className="glass mb-4 rounded-2xl px-4 py-2 text-center text-xs text-muted">
          Demo content — connect Supabase (see README) and visit <Link href="/admin" className="font-medium text-ink underline">/admin</Link> to make it yours.
        </p>
      )}

      {/* Hero panel */}
      <div className="glass-strong rounded-[2rem] px-5 pt-5 pb-10 sm:rounded-[2.5rem] sm:px-10 sm:pt-7 sm:pb-14">
        <Navbar brand={site.brand} ctaLabel={site.nav_cta_label} />
        <Hero site={site} highlights={highlights} />
      </div>

      {/* Content sheet */}
      <main className="glass-sheet mx-auto mt-6 flex max-w-[68rem] flex-col gap-20 rounded-[2rem] px-5 pt-14 sm:mt-8 sm:rounded-[2.5rem] sm:px-10 sm:pt-16">
        <About site={site} />
        <Work title={site.work_title} subtitle={site.work_subtitle} projects={projects} />
        <People title={site.people_title} subtitle={site.people_subtitle} testimonials={testimonials} />
        <Contact site={site} />
        <Footer site={site} projects={projects} />
      </main>
    </div>
    </div>
  );
}
