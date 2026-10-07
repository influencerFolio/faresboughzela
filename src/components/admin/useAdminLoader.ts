"use client";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useEffect, useState } from "react";

export function useAdminLoader<T>(url: string, fallback: T) {
  const { getToken, user, loading: authLoading } = useAdminAuth();
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          throw new Error(
            res.status === 401 ? "Unauthorized" : "Failed to load content",
          );
        }
        const json = (await res.json()) as T;
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, url, getToken]);

  return { data, setData, loading, error };
}
