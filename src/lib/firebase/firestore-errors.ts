/**
 * Map Firestore Admin errors to actionable messages for the admin UI.
 */
export function formatFirestoreAdminError(error: unknown): string {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  const message =
    error instanceof Error ? error.message : String(error ?? "Unknown error");

  // gRPC 5 / NOT_FOUND when the Cloud Firestore database was never created
  if (
    code === "5" ||
    code === "NOT_FOUND" ||
    /\b5 NOT_FOUND\b/i.test(message) ||
    /NOT_FOUND/i.test(message)
  ) {
    const projectId =
      process.env.FIREBASE_ADMIN_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      "your-project";
    return (
      `Cloud Firestore is not set up for project "${projectId}". ` +
      `Open https://console.firebase.google.com/project/${projectId}/firestore ` +
      `and create a database (Native mode). Then retry save.`
    );
  }

  return message;
}
