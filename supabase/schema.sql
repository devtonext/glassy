-- =============================================================================
--  Glass Portfolio — database schema
--
--  Run this ONCE in your Supabase project:
--    Supabase Dashboard → SQL Editor → New query → paste this file → Run
--
--  It is safe to run again: it never deletes your content.
--  It creates:
--    • tables for your site content, projects, highlights, testimonials, messages
--    • Row Level Security so only YOU (the admin) can edit content
--    • a public "media" storage bucket for image uploads
--    • demo content so your site looks like the preview right away
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Admins — users allowed to use /admin
--    The first admin is created from the /admin/setup page.
-- -----------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;


-- -----------------------------------------------------------------------------
-- 2. Site — one row with your profile, hero text, contact info and SEO
-- -----------------------------------------------------------------------------
create table if not exists public.site (
  id                   int primary key default 1 check (id = 1),
  brand                text not null default 'Xlorva',
  meta_title           text,
  meta_description     text,
  nav_cta_label        text default 'Get in touch',

  name                 text not null default 'Jane Doe',
  role                 text default 'UX/UI Designer',
  bio                  text,
  photo_url            text,
  hero_cta_label       text default 'Let''s talk',
  hero_cta_url         text default '#contact',
  hero_secondary_label text default 'View resume',
  hero_secondary_url   text,

  about_title          text,
  about_text           text,
  stat_1_value         text,
  stat_1_label         text,
  stat_2_value         text,
  stat_2_label         text,
  stat_3_value         text,
  stat_3_label         text,

  work_title           text default 'Selected work',
  work_subtitle        text,
  people_title         text default 'Kind words',
  people_subtitle      text,

  contact_title        text default 'Let''s build something together',
  contact_text         text,
  email                text,
  phone                text,
  location             text,

  social_x             text,
  social_linkedin      text,
  social_dribbble      text,
  social_instagram     text,
  social_github        text,

  footer_text          text,
  updated_at           timestamptz not null default now()
);


-- -----------------------------------------------------------------------------
-- 3. Highlights — the small glass cards next to your photo in the hero
-- -----------------------------------------------------------------------------
create table if not exists public.highlights (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subtitle    text,
  description text,
  image_url   text,
  link_url    text,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);


-- -----------------------------------------------------------------------------
-- 4. Projects — your portfolio / case studies
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text,
  description text,
  image_url   text,
  case_url    text,
  live_url    text,
  published   boolean not null default true,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);


-- -----------------------------------------------------------------------------
-- 5. Testimonials — "Kind words" section
-- -----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text,
  quote      text not null,
  avatar_url text,
  position   int not null default 0,
  created_at timestamptz not null default now()
);


-- -----------------------------------------------------------------------------
-- 6. Messages — submissions from the contact form (your inbox)
-- -----------------------------------------------------------------------------
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  email      text not null check (char_length(email) between 3 and 200),
  subject    text check (char_length(subject) <= 200),
  message    text not null check (char_length(message) between 1 and 5000),
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_at_idx on public.messages (created_at desc);


-- -----------------------------------------------------------------------------
-- 7. Permissions + Row Level Security
-- -----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.site, public.highlights, public.projects, public.testimonials to anon, authenticated;
grant insert, update, delete on public.site, public.highlights, public.projects, public.testimonials to authenticated;
grant insert on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;
grant select on public.admins to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admins       enable row level security;
alter table public.site         enable row level security;
alter table public.highlights   enable row level security;
alter table public.projects     enable row level security;
alter table public.testimonials enable row level security;
alter table public.messages     enable row level security;

-- admins: a user can only see whether they themselves are an admin
drop policy if exists "admins: read own row" on public.admins;
create policy "admins: read own row" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- public content: everyone can read, only admins can write
drop policy if exists "site: public read" on public.site;
create policy "site: public read" on public.site for select using (true);
drop policy if exists "site: admin write" on public.site;
create policy "site: admin write" on public.site
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "highlights: public read" on public.highlights;
create policy "highlights: public read" on public.highlights for select using (true);
drop policy if exists "highlights: admin write" on public.highlights;
create policy "highlights: admin write" on public.highlights
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "projects: public read" on public.projects;
create policy "projects: public read" on public.projects
  for select using (published or public.is_admin());
drop policy if exists "projects: admin write" on public.projects;
create policy "projects: admin write" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "testimonials: public read" on public.testimonials;
create policy "testimonials: public read" on public.testimonials for select using (true);
drop policy if exists "testimonials: admin write" on public.testimonials;
create policy "testimonials: admin write" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- messages: anyone can send one, only admins can read / manage them
drop policy if exists "messages: anyone can send" on public.messages;
create policy "messages: anyone can send" on public.messages
  for insert with check (is_read = false);
drop policy if exists "messages: admin read" on public.messages;
create policy "messages: admin read" on public.messages
  for select to authenticated using (public.is_admin());
drop policy if exists "messages: admin update" on public.messages;
create policy "messages: admin update" on public.messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "messages: admin delete" on public.messages;
create policy "messages: admin delete" on public.messages
  for delete to authenticated using (public.is_admin());


-- -----------------------------------------------------------------------------
-- 8. Storage — public "media" bucket for images you upload in /admin
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'])
on conflict (id) do nothing;

drop policy if exists "media: public read" on storage.objects;
create policy "media: public read" on storage.objects
  for select using (bucket_id = 'media');
drop policy if exists "media: admin upload" on storage.objects;
create policy "media: admin upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: admin update" on storage.objects;
create policy "media: admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: admin delete" on storage.objects;
create policy "media: admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());


-- -----------------------------------------------------------------------------
-- 9. Demo content (only inserted when the tables are empty)
--    Replace it all from /admin — or delete these rows.
-- -----------------------------------------------------------------------------
insert into public.site (
  id, brand, meta_title, meta_description, nav_cta_label,
  name, role, bio, photo_url, hero_cta_label, hero_cta_url, hero_secondary_label, hero_secondary_url,
  about_title, about_text,
  stat_1_value, stat_1_label, stat_2_value, stat_2_label, stat_3_value, stat_3_label,
  work_title, work_subtitle, people_title, people_subtitle,
  contact_title, contact_text, email, phone, location,
  social_x, social_linkedin, social_dribbble, social_instagram, social_github,
  footer_text
) values (
  1, 'Xlorva', 'Jane Doe — UX/UI Designer',
  'Jane Doe is a UX/UI designer crafting calm, human interfaces for products people love to use.',
  'Get in touch',
  'Jane Doe', 'UX/UI Designer',
  'I design clear, calm digital products — from first sketch to polished interface — for startups and teams who care about the details.',
  '/demo/jane.jpg', 'Let''s talk', '#contact', 'View resume', '#',
  'Design that feels effortless',
  'For the past eight years I have helped startups and global brands turn complex ideas into simple, beautiful experiences. I combine research, interaction design and visual craft to ship products that people actually enjoy using.',
  '8+', 'Years of experience', '120', 'Projects delivered', '40+', 'Happy clients',
  'Selected work', 'A few recent projects I am proud of.',
  'Kind words', 'What clients and collaborators say.',
  'Let''s build something together',
  'Have a project in mind or just want to say hello? Send me a message and I will get back to you within two days.',
  'hello@janedoe.design', '+1 (555) 012-3456', 'Lisbon, Portugal',
  'https://x.com', 'https://linkedin.com', 'https://dribbble.com', 'https://instagram.com', null,
  'Designing calm, human interfaces.'
) on conflict (id) do nothing;

insert into public.highlights (title, subtitle, description, image_url, link_url, position)
select * from (values
  ('Fintech Redesign', 'Lead Designer', 'Rebuilt onboarding for 2M users and lifted activation by 34%.', '/demo/w2.jpg', '#work', 1),
  ('Atlas Design System', 'Creator', '120+ components powering five product teams.', '/demo/w1.jpg', '#work', 2),
  ('Mindful App', 'Product Designer', 'A meditation app featured by Apple in 30 countries.', '/demo/w6.jpg', '#work', 3)
) as v(title, subtitle, description, image_url, link_url, position)
where not exists (select 1 from public.highlights);

insert into public.projects (title, category, description, image_url, case_url, live_url, position)
select * from (values
  ('Lumen Banking App', 'Fintech · Mobile', 'A calmer way to manage money: simplified flows, clearer numbers and a fresh visual language.', '/demo/w2.jpg', '#', '#', 1),
  ('Atlas Design System', 'Design Systems', 'A token-based system with 120+ accessible components shared across web and native apps.', '/demo/w1.jpg', '#', '#', 2),
  ('Nomad Travel Platform', 'Web · Booking', 'End-to-end booking experience that cut checkout time in half for a travel startup.', '/demo/w4.jpg', '#', '#', 3),
  ('Pulse Analytics', 'SaaS · Dashboard', 'Turning dense product data into clear dashboards that teams check every morning.', '/demo/w5.jpg', '#', '#', 4),
  ('Studio Brand Kit', 'Branding', 'Identity, illustration and a flexible layout system for a creative studio.', '/demo/w3.jpg', '#', '#', 5),
  ('Mindful App', 'Health · iOS', 'A meditation companion with gentle motion and a focus on daily habits.', '/demo/w6.jpg', '#', '#', 6)
) as v(title, category, description, image_url, case_url, live_url, position)
where not exists (select 1 from public.projects);

insert into public.testimonials (name, role, quote, avatar_url, position)
select * from (values
  ('Aaron Ellis', 'CEO, Lumen', 'Jane took a messy product and made it feel obvious. Our support tickets dropped by a third within a month of launch.', '/demo/p3.jpg', 1),
  ('Andre Foster', 'Head of Product, Pulse', 'A rare designer who thinks like a product owner. Clear communication, beautiful work, always on time.', '/demo/p5.jpg', 2),
  ('Maya Chen', 'Founder, Nomad', 'Working with Jane felt like adding a senior partner to the team. I would hire her again tomorrow.', '/demo/p4.jpg', 3)
) as v(name, role, quote, avatar_url, position)
where not exists (select 1 from public.testimonials);
