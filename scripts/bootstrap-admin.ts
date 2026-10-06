import "dotenv/config";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

async function main() {
  const email = requireEnv("ADMIN_BOOTSTRAP_EMAIL");
  const privateKey = requireEnv("FIREBASE_ADMIN_PRIVATE_KEY").replace(/\\n/g, "\n");
  initializeApp({
    credential: cert({
      projectId: requireEnv("FIREBASE_ADMIN_PROJECT_ID"),
      clientEmail: requireEnv("FIREBASE_ADMIN_CLIENT_EMAIL"),
      privateKey,
    }),
  });

  const auth = getAuth();
  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch {
    throw new Error(
      `No Firebase Auth user for ${email}. Create the user in Firebase Console first, then re-run.`,
    );
  }

  await auth.setCustomUserClaims(user.uid, { admin: true });
  console.log(`Admin claim set for ${email} (${user.uid})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
