import Link from "next/link";
import { notFound } from "next/navigation";
import { saveItem } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { getCollection } from "@/lib/admin/collections";

export default async function NewItemPage({ params }: PageProps<"/admin/[collection]/new">) {
  const { collection: key } = await params;
  const collection = getCollection(key);
  if (!collection) notFound();

  return (
    <>
      <Link href={`/admin/${collection.key}`} className="text-sm text-muted hover:text-ink">← {collection.label}</Link>
      <PageHeader title={`New ${collection.singular}`} />
      <AdminForm
        action={saveItem.bind(null, collection.key, null)}
        groups={[{ title: collection.label, fields: collection.fields }]}
        values={{}}
        submitLabel={`Add ${collection.singular}`}
        uploadFolder={collection.key}
      />
    </>
  );
}
