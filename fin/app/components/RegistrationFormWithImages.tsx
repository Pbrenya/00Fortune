"use client";

import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Shadow input — matches Aceternity's `shadow-input` style                  */
/* -------------------------------------------------------------------------- */

function ShadowInput({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="block w-full rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-[0px_0px_1px_1px_rgba(0,0,0,0.12)] transition-shadow placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-[0px_0px_1px_1px_rgba(255,255,255,0.12)] dark:placeholder:text-neutral-500 dark:focus:ring-blue-400/40"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  GitHub mark                                                               */
/* -------------------------------------------------------------------------- */

function GitHubMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12v3.14c0 .31.21.68.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Avatar row (social proof)                                                 */
/* -------------------------------------------------------------------------- */

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80",
];

function AvatarRow() {
  return (
    <div className="flex items-center">
      {AVATARS.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="-mr-3 h-10 w-10 rounded-full border-2 border-white object-cover last:mr-0 dark:border-neutral-800"
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Decorative grid lines                                                     */
/* -------------------------------------------------------------------------- */

function GridLines() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Horizontal lines */}
      <div className="absolute top-16 left-0 h-px w-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="absolute bottom-16 left-0 h-px w-full bg-neutral-200 dark:bg-neutral-800" />
      {/* Vertical lines */}
      <div className="absolute top-0 left-16 h-full w-px bg-neutral-200 dark:bg-neutral-800" />
      <div className="absolute top-0 right-16 h-full w-px bg-neutral-200 dark:bg-neutral-800" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  The block                                                                 */
/* -------------------------------------------------------------------------- */

export default function RegistrationFormWithImages() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      {/* ------------------------------------------------------------------ */}
      {/* Left: registration form                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12 sm:px-10 dark:bg-neutral-900">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-sm font-bold text-white dark:bg-white dark:text-neutral-900">
              A
            </div>
            <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Acme Inc
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">
              Sign up for an account
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Already have an account?{" "}
              <a
                href="#"
                className="font-medium text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
              >
                Sign in
              </a>
            </p>
          </div>

          {/* GitHub social button */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2.5 rounded-md bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-[0px_0px_1px_1px_rgba(0,0,0,0.12)] transition-shadow hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-[0px_0px_1px_1px_rgba(255,255,255,0.12)] dark:hover:bg-neutral-800"
          >
            <GitHubMark />
            Sign up with GitHub
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Or
            </span>
            <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
          </div>

          {/* Email form */}
          <form
            className="space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <ShadowInput
              id="fullname"
              label="Full name"
              placeholder="John Doe"
              autoComplete="name"
            />
            <ShadowInput
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
            <ShadowInput
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
              />
              <span>
                By clicking on sign up, you agree to our{" "}
                <a
                  href="#"
                  className="font-medium text-neutral-700 underline-offset-2 hover:underline dark:text-neutral-300"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-neutral-700 underline-offset-2 hover:underline dark:text-neutral-300"
                >
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={!agreed}
              className="flex w-full items-center justify-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 dark:focus:ring-white/40 dark:focus:ring-offset-neutral-900"
            >
              Create account
            </button>
          </form>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right: social proof with images                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative hidden items-center justify-center overflow-hidden bg-white px-10 lg:flex dark:bg-neutral-950">
        <GridLines />

        <div className="relative z-10 max-w-sm text-center">
          {/* Overlapping avatars */}
          <div className="mb-6 flex justify-center">
            <AvatarRow />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">
            People love us
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Join thousands of developers, designers, and founders who are
            already building with Acme. Ship faster, together.
          </p>

          {/* Subtle CTA */}
          <a
            href="#"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
          >
            See what they&apos;re saying
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}