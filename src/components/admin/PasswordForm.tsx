"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/admin/actions";
import { inputClass, labelClass, primaryButton } from "./ui";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, null);
  return (
    <form action={action} className="mt-4 flex flex-col gap-4">
      <div>
        <label htmlFor="password" className={labelClass}>New password</label>
        <input id="password" name="password" type="password" minLength={8} required autoComplete="new-password" className={inputClass} />
      </div>
      <div>
        <label htmlFor="confirm" className={labelClass}>Confirm new password</label>
        <input id="confirm" name="confirm" type="password" minLength={8} required autoComplete="new-password" className={inputClass} />
      </div>
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? "Updating…" : "Update password"}
        </button>
        {state && <p className={`text-sm ${state.ok ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</p>}
      </div>
    </form>
  );
}
