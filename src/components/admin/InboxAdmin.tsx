"use client";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import type { ContactMessage, TrainingRegistration } from "@/types/cms";
import { useState } from "react";

export function InboxAdmin({
  messages,
  registrations,
}: {
  messages: ContactMessage[];
  registrations: TrainingRegistration[];
}) {
  const { getToken } = useAdminAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [messageRows, setMessageRows] = useState(messages);
  const [registrationRows, setRegistrationRows] = useState(registrations);

  async function updateStatus(
    collection: "messages" | "registrations",
    id: string,
    statusValue: string,
  ) {
    const token = await getToken();
    const res = await fetch("/api/admin/inbox", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ collection, id, status: statusValue }),
    });
    if (!res.ok) {
      setStatus("Update failed");
      return;
    }
    if (collection === "messages") {
      setMessageRows((rows) =>
        rows.map((m) =>
          m.id === id ? { ...m, status: statusValue as ContactMessage["status"] } : m,
        ),
      );
    } else {
      setRegistrationRows((rows) =>
        rows.map((r) =>
          r.id === id
            ? { ...r, status: statusValue as TrainingRegistration["status"] }
            : r,
        ),
      );
    }
    setStatus("Updated");
  }

  return (
    <div className="space-y-space-2xl">
      <header>
        <h1 className="text-2xl font-semibold uppercase">Inbox</h1>
        <p className="mt-2 text-sm text-tertiary">
          Contact form messages and training registrations. Change status as you follow up.
        </p>
        {status ? <p className="mt-2 text-sm text-secondary">{status}</p> : null}
      </header>

      <section>
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-xl font-semibold uppercase">Messages</h2>
          <span className="text-xs text-tertiary">{messageRows.length} total</span>
        </div>
        {messageRows.length === 0 ? (
          <p className="mt-2 text-sm text-tertiary">No messages yet.</p>
        ) : (
          <ul className="mt-space-md space-y-space-md">
            {messageRows.map((m) => (
              <li
                key={m.id}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-space-md text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <strong className="text-on-surface">{m.name}</strong>
                    {m.company ? (
                      <span className="text-tertiary"> · {m.company}</span>
                    ) : null}
                  </div>
                  <select
                    value={m.status}
                    onChange={(e) =>
                      void updateStatus("messages", m.id, e.target.value)
                    }
                    className="rounded bg-surface-container-highest px-2 py-1 text-xs"
                  >
                    {["New", "Read", "Contacted", "Completed"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-tertiary">
                  <a href={`mailto:${m.email}`} className="hover:text-primary">
                    {m.email}
                  </a>
                  {m.phone ? ` · ${m.phone}` : ""}
                  {m.collaborationType ? ` · ${m.collaborationType}` : ""}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-on-surface">{m.message}</p>
                <p className="mt-2 text-[11px] text-tertiary">
                  {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-xl font-semibold uppercase">Training registrations</h2>
          <span className="text-xs text-tertiary">{registrationRows.length} total</span>
        </div>
        {registrationRows.length === 0 ? (
          <p className="mt-2 text-sm text-tertiary">No registrations yet.</p>
        ) : (
          <ul className="mt-space-md space-y-space-md">
            {registrationRows.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-space-md text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong>{r.fullName}</strong>
                  <select
                    value={r.status}
                    onChange={(e) =>
                      void updateStatus("registrations", r.id, e.target.value)
                    }
                    className="rounded bg-surface-container-highest px-2 py-1 text-xs"
                  >
                    {[
                      "New",
                      "Contacted",
                      "Confirmed",
                      "Completed",
                      "Cancelled",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-tertiary">
                  {r.trainingName?.en || r.trainingSlug} ·{" "}
                  <a href={`mailto:${r.email}`} className="hover:text-primary">
                    {r.email}
                  </a>{" "}
                  · {r.phone} · {r.participants} pax
                </p>
                {r.message ? (
                  <p className="mt-3 whitespace-pre-wrap">{r.message}</p>
                ) : null}
                <p className="mt-2 text-[11px] text-tertiary">
                  {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                  {r.preferredDate ? ` · Preferred: ${r.preferredDate}` : ""}
                  {r.experienceLevel ? ` · Level: ${r.experienceLevel}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
