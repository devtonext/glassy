import Link from "next/link";
import { notFound } from "next/navigation";
import { saveItem } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { getCollection } from "@/lib/admin/collections";
import { requireAdmin } from "@/lib/auth";

export default async function EditItemPage({ params }: PageProps<"/admin/[collection]/[id]">) {
  const { collection: key, id } = await params;
  const collection = getCollection(key);
  if (!collection) notFound();

  const { supabase } = await requireAdmin();
  const { data } = await supabase.from(collection.table).select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <>
      <Link href={`/admin/${collection.key}`} className="text-sm text-muted hover:text-ink">← {collection.label}</Link>
      <PageHeader title={`Edit ${collection.singular}`} />
      <AdminForm
        action={saveItem.bind(null, collection.key, id)}
        groups={[{ title: collection.label, fields: collection.fields }]}
        values={data}
        uploadFolder={collection.key}
      />
    </>
  );
}
