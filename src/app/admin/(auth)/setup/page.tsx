import Link from "next/link";
import { connection } from "next/server";
import { SetupForm } from "@/components/admin/AuthForms";
import { cardClass, primaryButton } from "@/components/admin/ui";
import { isSupabaseConfigured, supabaseServiceKey } from "@/lib/supabase/config";
import { createServiceClient } from "@/lib/supabase/server";

type Status = "missing-env" | "missing-service-key" | "missing-schema" | "ready" | "done";

async function getSetupStatus(): Promise<Status> {
  await connection(); // always check live, never at build time
  if (!isSupabaseConfigured) return "missing-env";
  if (!supabaseServiceKey) return "missing-service-key";
  const { count, error } = await createServiceClient()
    .from("admins")
    .select("*", { count: "exact", head: true });
  if (error) return "missing-schema";
  return (count ?? 0) > 0 ? "done" : "ready";
}

export default async function SetupPage() {
  const status = await getSetupStatus();

  return (
    <div className={`${cardClass} p-7 sm:p-8`}>
      <p className="text-xs font-medium tracking-[0.2em] text-faint uppercase">Setup</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
        {status === "ready" ? "Create your admin account" : status === "done" ? "You're all set" : "Connect your database"}
      </h1>

      <Steps status={status} />

      {status === "ready" && (
        <div className="mt-6">
          <SetupForm />
        </div>
      )}
      {status === "done" && (
        <>
          <p className="mt-2 text-sm text-muted">An admin account already exists for this site.</p>
          <Link href="/admin/login" className={`${primaryButton} mt-6 w-full`}>
            Go to login
          </Link>
        </>
      )}
    </div>
  );
}

function Steps({ status }: { status: Status }) {
  const order: Status[] = ["missing-env", "missing-service-key", "missing-schema", "ready", "done"];
  const reached = order.indexOf(status);
  const steps = [
    {
      title: "Add your Supabase keys",
      body: (
        <>
          Copy <code>.env.example</code> to <code>.env.local</code> and fill in{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then restart the server.
        </>
      ),
      done: reached > 0,
    },
    {
      title: "Add the service role key",
      body: (
        <>
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code> (Project Settings → API Keys). It is only used
          on the server to create your account.
        </>
      ),
      done: reached > 1,
    },
    {
      title: "Run the database schema",
      body: (
        <>
          In Supabase open <b>SQL Editor</b>, paste the contents of <code>supabase/schema.sql</code> and click <b>Run</b>.
          Then refresh this page.
        </>
      ),
      done: reached > 2,
    },
    { title: "Create your admin account", body: <>Choose the email and password you will use to log in.</>, done: reached > 3 },
  ];

  if (status === "done") return null;

  return (
    <ol className="mt-5 space-y-3">
      {steps.map((step, i) => {
        const current = !step.done && (i === 0 || steps[i - 1].done);
        return (
          <li
            key={step.title}
            className={`flex gap-3 rounded-xl p-3 text-sm ${current ? "bg-white ring-1 ring-ink/10" : ""} ${
              !step.done && !current ? "opacity-50" : ""
            }`}
          >
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                step.done ? "bg-emerald-600 text-white" : current ? "bg-ink text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              {step.done ? "✓" : i + 1}
            </span>
            <div className="min-w-0 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:text-[12px] [&_code]:break-all">
              <p className="font-medium text-ink">{step.title}</p>
              {current && <p className="mt-1 text-muted">{step.body}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
