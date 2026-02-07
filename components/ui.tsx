import clsx from "clsx";
import React from "react";

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="text-sm font-semibold text-zinc-900 mb-2">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium text-zinc-700">{label}</span>
        {hint ? <span className="text-[11px] text-zinc-400">{hint}</span> : null}
      </div>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none",
        "focus:ring-2 focus:ring-zinc-300"
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={clsx(
        "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none",
        "focus:ring-2 focus:ring-zinc-300"
      )}
    />
  );
}

export function Button({
  variant = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "ghost" }) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium",
        variant === "default" && "bg-zinc-900 text-white hover:bg-black",
        variant === "ghost" && "bg-white border border-zinc-200 hover:bg-zinc-50"
      )}
    />
  );
}
