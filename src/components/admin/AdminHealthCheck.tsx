"use client";

import { useEffect, useState } from "react";

type Health = {
  ok: boolean;
  firebase?: {
    adminReady?: boolean;
    adminError?: string | null;
    hasAdminPrivateKeyBase64?: boolean;
    hasAdminPrivateKey?: boolean;
    projectsMatch?: boolean;
    firestoreReady?: boolean;
    firestoreError?: string | null;
  };
  cloudinary?: {
    configured?: boolean;
    hasApiSecret?: boolean;
  };
  crash?: string;
};

export function AdminHealthCheck() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    void fetch("/api/admin/health")
      .then(async (res) => {
        const data = (await res.json()) as Health;
        setHealth(data);
      })
      .catch((e) =>
        setHealth({
          ok: false,
          crash: e instanceof Error ? e.message : "Health check failed",
        }),
      );
  }, []);

  if (!health) {
    return (
      <p className="mt-space-md text-sm text-tertiary">Checking server config…</p>
    );
  }

  const firebaseOk = health.firebase?.adminReady;
  const firestoreOk = health.firebase?.firestoreReady;
  const cloudinaryOk = health.cloudinary?.configured;

  return (
    <div
      className={`mt-space-lg rounded-xl border p-space-md text-sm ${
        health.ok
          ? "border-secondary/40 bg-secondary/10 text-on-surface"
          : "border-primary-container/50 bg-primary-container/10 text-on-surface"
      }`}
    >
      <p className="font-medium uppercase tracking-wide">
        Server status: {health.ok ? "Ready" : "Needs setup"}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-tertiary">
        <li>
          Firebase Admin:{" "}
          {firebaseOk
            ? "OK"
            : health.firebase?.adminError || "Not ready — check private key"}
        </li>
        <li>
          Firestore:{" "}
          {firestoreOk
            ? "OK"
            : health.firebase?.firestoreError || "Not reachable"}
        </li>
        <li>
          Private key base64 set:{" "}
          {health.firebase?.hasAdminPrivateKeyBase64 ? "yes" : "NO (required on Netlify)"}
        </li>
        <li>
          Cloudinary:{" "}
          {cloudinaryOk
            ? "OK"
            : "Missing CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET / cloud name"}
        </li>
        {health.firebase?.projectsMatch === false ? (
          <li className="text-primary-container">
            Client and Admin project IDs do not match
          </li>
        ) : null}
        {health.crash ? <li className="text-primary-container">{health.crash}</li> : null}
      </ul>
      {!firestoreOk && firebaseOk ? (
        <p className="mt-2 text-xs text-tertiary">
          Auth works, but Cloud Firestore was never created for this project.
          Open{" "}
          <a
            className="underline text-on-surface"
            href="https://console.firebase.google.com/project/faresboughzela-fc7ce/firestore"
            target="_blank"
            rel="noreferrer"
          >
            Firebase Console → Firestore
          </a>
          , create a database (Native mode), then save again.
        </p>
      ) : null}
      {!health.ok && firestoreOk !== false ? (
        <p className="mt-2 text-xs text-tertiary">
          Login can work even when saves/uploads fail. Copy values from{" "}
          <code className="text-on-surface">.env.secret</code> into Netlify with
          Secret checked, especially{" "}
          <code className="text-on-surface">FIREBASE_ADMIN_PRIVATE_KEY_BASE64</code>{" "}
          and <code className="text-on-surface">CLOUDINARY_API_SECRET</code>, then
          redeploy.
        </p>
      ) : null}
    </div>
  );
}
