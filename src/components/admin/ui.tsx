import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-muted">
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-border bg-surface-2/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted/50",
        "outline-none transition-all duration-200 focus:border-accent/60 focus:bg-surface-2 focus:ring-2 focus:ring-accent/10",
        props.className
      )}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-lg border border-border bg-surface-2/50 px-3 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted/50",
        "outline-none transition-all duration-200 focus:border-accent/60 focus:bg-surface-2 focus:ring-2 focus:ring-accent/10",
        props.className
      )}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-lg border border-border bg-surface-2/50 px-3 py-2.5 text-sm text-foreground",
        "outline-none transition-all duration-200 focus:border-accent/60 focus:bg-surface-2 focus:ring-2 focus:ring-accent/10",
        props.className
      )}
    />
  );
}

export function Button({
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" &&
          "bg-accent text-background shadow-sm hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/15 hover:-translate-y-0.5",
        variant === "secondary" &&
          "border border-border bg-surface/50 text-foreground hover:border-border-hover hover:text-accent",
        variant === "danger" &&
          "border border-danger/40 bg-danger/10 text-danger hover:bg-danger/20",
        props.className
      )}
    />
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-5 transition-colors duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatusPill({ ok, text }: { ok: boolean; text: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px]",
        ok
          ? "border-accent/30 bg-accent/5 text-accent"
          : "border-amber-400/30 bg-amber-400/5 text-amber-400"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          ok ? "bg-accent" : "bg-amber-400"
        )}
      />
      {text}
    </span>
  );
}
