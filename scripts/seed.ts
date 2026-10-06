import "dotenv/config";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  defaultAboutSettings,
  defaultGeneralSettings,
  defaultHomepageSettings,
  defaultPortfolioItems,
  defaultServices,
} from "../src/lib/data/defaults";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

async function main() {
  const privateKey = requireEnv("FIREBASE_ADMIN_PRIVATE_KEY").replace(/\\n/g, "\n");
  initializeApp({
    credential: cert({
      projectId: requireEnv("FIREBASE_ADMIN_PROJECT_ID"),
      clientEmail: requireEnv("FIREBASE_ADMIN_CLIENT_EMAIL"),
      privateKey,
    }),
  });
  const db = getFirestore();

  await db.doc("settings/general").set(defaultGeneralSettings, { merge: true });
  await db.doc("settings/homepage").set(defaultHomepageSettings, { merge: true });
  await db.doc("settings/about").set(defaultAboutSettings, { merge: true });

  for (const item of defaultPortfolioItems) {
    await db.collection("portfolio").doc(item.id).set(item, { merge: true });
  }
  for (const service of defaultServices) {
    await db.collection("services").doc(service.id).set(service, { merge: true });
  }

  console.log("Seed completed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
