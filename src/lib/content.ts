import "server-only";
import { demoContent } from "./demo-content";
import { isSupabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/server";
import type { Highlight, Project, Site, SiteContent, Testimonial } from "./types";

/** Loads everything the public site needs. Falls back to demo content until Supabase is set up. */
export async function getSiteContent(): Promise<SiteContent & { isDemo: boolean }> {
  if (!isSupabaseConfigured) return { ...demoContent, isDemo: true };

  const supabase = createPublicClient();
  const [site, highlights, projects, testimonials] = await Promise.all([
    supabase.from("site").select("*").eq("id", 1).maybeSingle<Site>(),
    supabase.from("highlights").select("*").order("position").returns<Highlight[]>(),
    supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("position")
      .returns<Project[]>(),
    supabase.from("testimonials").select("*").order("position").returns<Testimonial[]>(),
  ]);

  const error = site.error ?? highlights.error ?? projects.error ?? testimonials.error;
  if (error) {
    console.error(
      "[portfolio] Could not load content from Supabase — did you run supabase/schema.sql?",
      error.message,
    );
    return { ...demoContent, isDemo: true };
  }

  return {
    site: site.data ?? demoContent.site,
    highlights: highlights.data ?? [],
    projects: projects.data ?? [],
    testimonials: testimonials.data ?? [],
    isDemo: false,
  };
}
