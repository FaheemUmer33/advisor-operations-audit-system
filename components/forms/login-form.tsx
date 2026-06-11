"use client";

import { useFormState } from "react-dom";
import { loginAction } from "@/app/actions/auth";

export function LoginForm() {
  const [state, action] = useFormState(loginAction, null);
  return (
    <form action={action} className="space-y-4">
      {state?.error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}
      <label className="block text-sm font-medium text-slate-700">
        Email
        <input
          name="email"
          type="email"
          required
          defaultValue="admin@smartlogics.com"
          className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Password
        <input
          name="password"
          type="password"
          required
          defaultValue="admin123"
          className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </label>
      <button type="submit" className="min-h-10 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
        Login
      </button>
    </form>
  );
}
