import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteItem, moveItem } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { PageHeader } from "@/components/admin/PageHeader";
import { cardClass, primaryButton } from "@/components/admin/ui";
import { getCollection } from "@/lib/admin/collections";
import { requireAdmin } from "@/lib/auth";

type Row = Record<string, string | number | boolean | null> & { id: string };

export default async function CollectionPage({ params, searchParams }: PageProps<"/admin/[collection]">) {
  const { collection: key } = await params;
  const { saved } = await searchParams;
  const collection = getCollection(key);
  if (!collection) notFound();

  const { supabase } = await requireAdmin();
  const { data: rows } = await supabase.from(collection.table).select("*").order("position").returns<Row[]>();

  return (
    <>
      <PageHeader
        title={collection.label}
        description={collection.description}
        actions={
          <Link href={`/admin/${collection.key}/new`} className={primaryButton}>
            + Add {collection.singular}
          </Link>
        }
      />

      {saved && (
        <p role="status" className="mb-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
          Saved — your site is updated.
        </p>
      )}

      {!rows || rows.length === 0 ? (
        <div className={`${cardClass} p-10 text-center`}>
          <p className="text-sm text-muted">Nothing here yet.</p>
          <Link href={`/admin/${collection.key}/new`} className={`${primaryButton} mt-4`}>
            Add your first {collection.singular}
          </Link>
        </div>
      ) : (
        <ul className={`${cardClass} divide-y divide-slate-200/70`}>
          {rows.map((row, i) => {
            const image = collection.imageField ? (row[collection.imageField] as string | null) : null;
            return (
              <li key={row.id} className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                <div className="flex flex-col">
                  <form action={moveItem.bind(null, collection.key, row.id, "up")}>
                    <button type="submit" disabled={i === 0} className="px-1.5 text-slate-400 hover:text-ink disabled:opacity-25" aria-label="Move up">
                      ▲
                    </button>
                  </form>
                  <form action={moveItem.bind(null, collection.key, row.id, "down")}>
                    <button type="submit" disabled={i === rows.length - 1} className="px-1.5 text-slate-400 hover:text-ink disabled:opacity-25" aria-label="Move down">
                      ▼
                    </button>
                  </form>
                </div>
                {collection.imageField && (
                  <div className={`size-12 shrink-0 overflow-hidden bg-slate-100 ${collection.roundImage ? "rounded-full" : "rounded-lg"}`}>
                    {image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt="" className="size-full object-cover" />
                    )}
                  </div>
                )}
                <Link href={`/admin/${collection.key}/${row.id}`} className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{String(row[collection.titleField] ?? "Untitled")}</p>
                  {collection.subtitleField && row[collection.subtitleField] && (
                    <p className="truncate text-xs text-muted">{String(row[collection.subtitleField])}</p>
                  )}
                </Link>
                {row.published === false && (
                  <span className="hidden rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 sm:inline">Hidden</span>
                )}
                <Link href={`/admin/${collection.key}/${row.id}`} className="text-sm font-medium text-ink-soft hover:underline">
                  Edit
                </Link>
                <form action={deleteItem.bind(null, collection.key, row.id)}>
                  <ConfirmSubmit message={`Delete this ${collection.singular}? This cannot be undone.`} className="text-sm text-rose-700 hover:underline">
                    Delete
                  </ConfirmSubmit>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
