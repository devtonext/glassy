"use client";

import { useActionState } from "react";
import { createFirstAdmin, login } from "@/app/admin/actions";
import { inputClass, labelClass, primaryButton } from "./ui";

export function LoginForm({ initialError }: { initialError?: string }) {
  const [state, action, pending] = useActionState(
    login,
    initialError ? { ok: false, message: initialError } : null,
  );
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </div>
      {state && !state.ok && <p className="text-sm text-rose-700">{state.message}</p>}
      <button type="submit" disabled={pending} className={`${primaryButton} mt-2 w-full`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export function SetupForm() {
  const [state, action, pending] = useActionState(createFirstAdmin, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className={labelClass}>Your email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>Password (min. 8 characters)</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={inputClass} />
      </div>
      <div>
        <label htmlFor="confirm" className={labelClass}>Confirm password</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required className={inputClass} />
      </div>
      {state && !state.ok && <p className="text-sm text-rose-700">{state.message}</p>}
      <button type="submit" disabled={pending} className={`${primaryButton} mt-2 w-full`}>
        {pending ? "Creating account…" : "Create admin account"}
      </button>
    </form>
  );
}
