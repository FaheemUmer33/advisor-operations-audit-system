import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock3,
  FileText,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "danger" | "blue" | "purple";
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const toneClasses: Record<Tone, string> = {
  default: "border-slate-200 bg-slate-50 text-slate-700",
  success: "border-green-200 bg-green-50 text-green-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  purple: "border-violet-200 bg-violet-50 text-violet-700",
};

const buttonClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-blue-600 bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:border-blue-700",
  secondary:
    "border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50",
  danger:
    "border border-red-600 bg-red-600 text-white shadow-sm hover:border-red-700 hover:bg-red-700",
  ghost: "border border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
};

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "print-card rounded-lg border border-slate-200 bg-white p-5 shadow-soft",
        className
      )}
    >
      {children}
    </section>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      {(title || description || action) && (
        <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-base font-semibold text-slate-950">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </Card>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
  meta,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <div className="mb-7 rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          {meta ? <div className="mb-2">{meta}</div> : null}
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
      </div>
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition",
        buttonClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition",
        buttonClasses[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}

export function SubmitButton({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
}) {
  return (
    <Button type="submit" variant={variant}>
      {children}
    </Button>
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status?: string | null }) {
  const tone: Tone =
    status === "Won" || status === "Audit Completed" || status === "Completed"
      ? "success"
      : status === "Lost"
        ? "danger"
        : status === "Audit In Progress" ||
            status === "In Progress" ||
            status === "Negotiation"
          ? "warning"
          : status === "Audit Scheduled" ||
              status === "Proposal Sent" ||
              status === "Discovery Booked"
            ? "blue"
            : status === "Nurture"
              ? "default"
              : "default";
  return <Badge tone={tone}>{status || "Not set"}</Badge>;
}

export function PriorityBadge({ level }: { level?: string | null }) {
  const tone: Tone =
    level === "Critical Priority"
      ? "danger"
      : level === "High Priority"
        ? "warning"
        : level === "Medium Priority"
          ? "blue"
          : "default";
  return <Badge tone={tone}>{level || "Minimal Priority"}</Badge>;
}

export function EmptyState({ label = "No data found." }: { label?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
        <Info className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  helper,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  helper?: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="flex items-center gap-1">
        {label}
        {required ? <span className="text-blue-600">*</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        min={type === "number" ? 0 : undefined}
        defaultValue={defaultValue ?? ""}
        className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
      {helper ? <span className="mt-1 block text-xs text-slate-500">{helper}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  required,
  helper,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  helper?: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="flex items-center gap-1">
        {label}
        {required ? <span className="text-blue-600">*</span> : null}
      </span>
      <textarea
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        rows={4}
        className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
      {helper ? <span className="mt-1 block text-xs text-slate-500">{helper}</span> : null}
    </label>
  );
}

export function Select({
  label,
  name,
  options,
  defaultValue,
  required,
  helper,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string | null;
  required?: boolean;
  helper?: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="flex items-center gap-1">
        {label}
        {required ? <span className="text-blue-600">*</span> : null}
      </span>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue ?? options[0]}
        className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {helper ? <span className="mt-1 block text-xs text-slate-500">{helper}</span> : null}
    </label>
  );
}

export function Metric({
  label,
  value,
  description,
  icon: Icon = Circle,
  tone = "blue",
}: {
  label: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
  tone?: Tone;
}) {
  return (
    <Card className="group transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
          {description ? (
            <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border",
            toneClasses[tone]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export function DataTable({ children }: { children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">{children}</table>
      </div>
    </Card>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>;
}

export const tableCell = "px-4 py-3 align-middle";

export const statusIcons = {
  complete: CheckCircle2,
  warning: AlertTriangle,
  draft: FileText,
  progress: Clock3,
};
