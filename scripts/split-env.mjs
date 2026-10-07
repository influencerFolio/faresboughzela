import "dotenv/config";
import fs from "fs";
import path from "path";

const root = process.cwd();

const publicKeys = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_DEFAULT_LOCALE",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
  "FIREBASE_ADMIN_PROJECT_ID",
  "FIREBASE_ADMIN_CLIENT_EMAIL",
  "CLOUDINARY_UPLOAD_FOLDER",
  "CLOUDINARY_API_KEY",
  "ADMIN_BOOTSTRAP_EMAIL",
  "RATE_LIMIT_MAX_PER_HOUR",
];

const secretKeys = [
  "FIREBASE_ADMIN_PRIVATE_KEY",
  "FIREBASE_ADMIN_PRIVATE_KEY_BASE64",
  "CLOUDINARY_API_SECRET",
  "REVALIDATE_SECRET",
  "RESEND_API_KEY",
  "CONTACT_NOTIFICATION_EMAIL",
];

function formatValue(key, value) {
  if (!value) return "";
  if (key === "FIREBASE_ADMIN_PRIVATE_KEY") {
    const oneLine = value.replace(/\n/g, "\\n");
    return `"${oneLine}"`;
  }
  return value;
}

function buildFile(header, keys) {
  const lines = [header, ""];
  for (const key of keys) {
    const value = process.env[key];
    if (value === undefined || value === "") continue;
    lines.push(`${key}=${formatValue(key, value)}`);
  }
  lines.push("");
  return lines.join("\n");
}

// Ensure base64 key exists for Netlify
let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || "";
privateKey = privateKey.trim();
if (
  (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
  (privateKey.startsWith("'") && privateKey.endsWith("'"))
) {
  privateKey = privateKey.slice(1, -1);
}
privateKey = privateKey.replace(/\\n/g, "\n").trim();
if (privateKey.includes("BEGIN PRIVATE KEY") && !process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64) {
  process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64 = Buffer.from(
    privateKey,
    "utf8",
  ).toString("base64");
}

const publicHeader = `# Public / non-secret — safe to paste in Netlify WITHOUT "Secret" checkbox
# Copy each KEY=VALUE line as a separate Netlify environment variable.
# Production: set NEXT_PUBLIC_SITE_URL to https://faresboughzela.netlify.app`;

const secretHeader = `# SECRET — mark each variable as "Secret" in Netlify
# Never commit this file. Never paste the whole file into one Netlify field.
# Prefer FIREBASE_ADMIN_PRIVATE_KEY_BASE64 on Netlify (not the PEM line).`;

fs.writeFileSync(
  path.join(root, ".env.public"),
  buildFile(publicHeader, publicKeys),
  "utf8",
);
fs.writeFileSync(
  path.join(root, ".env.secret"),
  buildFile(secretHeader, secretKeys),
  "utf8",
);

console.log("Created .env.public and .env.secret");
