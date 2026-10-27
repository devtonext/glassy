"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/supabase/config";
import { inputClass, secondaryButton } from "./ui";

const MAX_BYTES = 5 * 1024 * 1024;

/** Upload an image to Supabase Storage (or paste a URL). The URL is submitted with the form. */
export function ImageField({
  name,
  defaultValue,
  folder,
}: {
  name: string;
  defaultValue: string;
  folder: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) return setStatus("Please choose an image file.");
    if (file.size > MAX_BYTES) return setStatus("Images must be smaller than 5 MB.");

    setUploading(true);
    setStatus("Uploading…");
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const supabase = createClient();
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
    });
    setUploading(false);
    if (error) return setStatus(`Upload failed: ${error.message}`);

    setUrl(supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl);
    setStatus("Uploaded — remember to save.");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-[11px] text-slate-400">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="size-full object-cover" />
        ) : (
          "No image"
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <input
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Upload an image or paste a URL"
          className={inputClass}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={secondaryButton}
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
          >
            {uploading ? "Uploading…" : "Upload image"}
          </button>
          {url && (
            <button type="button" className="text-xs text-slate-500 hover:text-rose-600" onClick={() => setUrl("")}>
              Remove
            </button>
          )}
          {status && <span className="text-xs text-slate-500">{status}</span>}
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
