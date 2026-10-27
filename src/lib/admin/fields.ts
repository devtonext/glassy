export type FieldType = "text" | "textarea" | "url" | "email" | "image" | "checkbox";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  /** Show in a half-width column on large screens */
  half?: boolean;
};

export type FieldGroup = { title: string; description?: string; fields: Field[] };

export type FieldValues = Record<string, string | boolean | null | undefined>;

/** Reads the configured fields out of a submitted form. */
export function readFields(fields: Field[], formData: FormData) {
  const values: Record<string, string | boolean | null> = {};
  const missing: string[] = [];

  for (const field of fields) {
    if (field.type === "checkbox") {
      values[field.name] = formData.get(field.name) === "on";
      continue;
    }
    const value = String(formData.get(field.name) ?? "").trim();
    if (field.required && !value) missing.push(field.label);
    values[field.name] = value || null;
  }

  return { values, error: missing.length ? `Please fill in: ${missing.join(", ")}` : null };
}
