"use client";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const { login, configured, user } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace("/admin");
  }, [user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: string }).code)
          : "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("Wrong email or password.");
      } else if (code === "auth/user-not-found") {
        setError("No Firebase user with that email.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Try again later.");
      } else if (!configured) {
        setError("Firebase client env vars are missing. Restart the dev server after updating .env.");
      } else {
        setError(
          code
            ? `Login failed (${code}).`
            : "Login failed. Check credentials and restart the dev server after env changes.",
        );
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-gutter">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-surface-container-low p-space-xl shadow-2xl"
      >
        <h1 className="text-xl font-semibold uppercase tracking-wide">Admin Login</h1>
        {!configured ? (
          <p className="mt-4 text-sm text-tertiary">
            Firebase client env vars are missing. Copy `.env.example` to `.env.local` and configure Firebase.
          </p>
        ) : null}
        <div className="mt-space-md space-y-space-md">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-surface-container-highest px-3 py-2 text-sm"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-surface-container-highest px-3 py-2 text-sm"
            required
          />
        </div>
        {error ? <p className="mt-2 text-sm text-primary-container">{error}</p> : null}
        <button
          type="submit"
          className="mt-space-lg w-full rounded-lg bg-primary-container py-2 text-sm uppercase text-on-primary-container"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
