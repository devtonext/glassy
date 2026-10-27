"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/admin/actions";
import type { Field, FieldGroup, FieldValues } from "@/lib/admin/fields";
import { ImageField } from "./ImageField";
import { cardClass, inputClass, labelClass, primaryButton } from "./ui";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

/** Renders a form from a field config. Used for every editable section of the admin. */
export function AdminForm({
  action,
  groups,
  values,
  submitLabel = "Save changes",
  uploadFolder,
}: {
  action: Action;
  groups: FieldGroup[];
  values: FieldValues;
  submitLabel?: string;
  uploadFolder: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {groups.map((group) => (
        <fieldset key={group.title} className={`${cardClass} p-5 sm:p-6`}>
          {groups.length > 1 && (
            <legend className="contents">
              <span className="block text-base font-semibold text-ink">{group.title}</span>
              {group.description && <span className="mt-0.5 block text-sm text-muted">{group.description}</span>}
            </legend>
          )}
          <div className={`grid gap-4 sm:grid-cols-2 ${groups.length > 1 ? "mt-5" : ""}`}>
            {group.fields.map((field) => (
              <FieldInput key={field.name} field={field} value={values[field.name]} uploadFolder={uploadFolder} />
            ))}
          </div>
        </fieldset>
      ))}

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-4 rounded-2xl border border-white/80 bg-white/85 px-5 py-3 shadow-lg backdrop-blur">
        <button type="submit" className={primaryButton} disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </button>
        {state && (
          <p role="status" className={`text-sm ${state.ok ? "text-emerald-700" : "text-rose-700"}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

function FieldInput({
  field,
  value,
  uploadFolder,
}: {
  field: Field;
  value: FieldValues[string];
  uploadFolder: string;
}) {
  const id = `f-${field.name}`;
  const span = field.half ? "" : "sm:col-span-2";
  const text = typeof value === "string" ? value : "";

  if (field.type === "checkbox") {
    return (
      <label className={`flex items-center gap-3 text-sm text-ink ${span}`}>
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={value === undefined ? true : Boolean(value)}
          className="size-4 rounded accent-ink"
        />
        {field.label}
      </label>
    );
  }

  return (
    <div className={span}>
      <label htmlFor={id} className={labelClass}>
        {field.label}
        {field.required && <span className="text-rose-600"> *</span>}
      </label>
      {field.type === "image" ? (
        <ImageField name={field.name} defaultValue={text} folder={uploadFolder} />
      ) : field.type === "textarea" ? (
        <textarea
          id={id}
          name={field.name}
          defaultValue={text}
          required={field.required}
          placeholder={field.placeholder}
          rows={4}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.type === "url" ? "text" : field.type}
          defaultValue={text}
          required={field.required}
          placeholder={field.placeholder}
          className={inputClass}
        />
      )}
      {field.help && <p className="mt-1.5 text-xs text-slate-500">{field.help}</p>}
    </div>
  );
}
