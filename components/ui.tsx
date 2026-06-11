import Link from "next/link";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-slate-200 bg-white p-5 shadow-soft", className)}>
      {children}
    </section>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-navy">{title}</h1>
        {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      {children}
    </Link>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      {children}
    </button>
  );
}

export function EmptyState({ label = "No data found." }: { label?: string }) {
  return <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">{label}</div>;
}

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <textarea
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        rows={4}
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

export function Select({
  label,
  name,
  options,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <select
        name={name}
        required={required}
        defaultValue={defaultValue ?? options[0]}
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-navy">{value}</p>
    </Card>
  );
}
