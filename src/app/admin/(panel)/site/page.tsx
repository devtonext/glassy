import { saveSite } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { siteFieldGroups } from "@/lib/admin/site-fields";
import { requireAdmin } from "@/lib/auth";

export default async function SitePage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site").select("*").eq("id", 1).maybeSingle();

  return (
    <>
      <PageHeader title="Site & profile" description="Your name, intro, photo, contact details, social links and SEO." />
      <AdminForm action={saveSite} groups={siteFieldGroups} values={data ?? {}} uploadFolder="site" />
    </>
  );
}
