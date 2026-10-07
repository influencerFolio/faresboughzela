/** Parse error message from admin API JSON responses. */
export async function readApiError(
  res: Response,
  fallback: string,
): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    if (data?.error) return data.error;
  } catch {
    // ignore
  }
  return `${fallback} (${res.status})`;
}
