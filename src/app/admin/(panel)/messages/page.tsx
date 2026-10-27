import { deleteMessage, setMessageRead } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { PageHeader } from "@/components/admin/PageHeader";
import { cardClass, dangerButton, secondaryButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import type { Message } from "@/lib/types";

export default async function MessagesPage() {
  const { supabase } = await requireAdmin();
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Message[]>();

  return (
    <>
      <PageHeader title="Messages" description="Everything visitors send through your contact form." />

      {!messages || messages.length === 0 ? (
        <div className={`${cardClass} p-10 text-center text-sm text-muted`}>No messages yet.</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((m) => (
            <li key={m.id} className={`${cardClass} p-5 ${m.is_read ? "opacity-75" : "ring-1 ring-sky-600/30"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium text-ink">
                    {!m.is_read && <span className="size-2 rounded-full bg-sky-600" aria-label="Unread" />}
                    {m.name}
                  </p>
                  <a href={`mailto:${m.email}`} className="text-sm break-all text-ink-soft hover:underline">
                    {m.email}
                  </a>
                </div>
                <time className="text-xs text-slate-500" dateTime={m.created_at}>
                  {new Date(m.created_at).toLocaleString()}
                </time>
              </div>
              {m.subject && <p className="mt-3 text-sm font-medium text-ink">{m.subject}</p>}
              <p className="mt-1 text-sm whitespace-pre-wrap text-muted">{m.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "Your message"}`)}`}
                  className={secondaryButton}
                >
                  Reply
                </a>
                <form action={setMessageRead.bind(null, m.id, !m.is_read)}>
                  <button type="submit" className={secondaryButton}>
                    Mark as {m.is_read ? "unread" : "read"}
                  </button>
                </form>
                <form action={deleteMessage.bind(null, m.id)}>
                  <ConfirmSubmit message="Delete this message?" className={dangerButton}>
                    Delete
                  </ConfirmSubmit>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
