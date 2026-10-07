# Fares Boughzala — Athlete Portfolio

Production-ready bilingual (EN/FR) spearfishing athlete portfolio with CMS admin, Firestore, Cloudinary media, WhatsApp CTAs, and SEO. Self-hostable Next.js standalone build.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS v4
- `next-intl` (`/en`, `/fr`)
- Firebase Auth (admin) + Firestore
- Cloudinary (images)
- Framer Motion (respects `prefers-reduced-motion`)

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) (middleware redirects `/` to default locale).

Without Firebase credentials, the site uses **built-in default content** from the Stitch design reference. Forms return `503` until Firestore Admin is configured.

## Environment

See [`.env.example`](.env.example) for all variables.

| Variable group | Purpose |
|----------------|---------|
| `NEXT_PUBLIC_*` Firebase | Client auth for `/admin` |
| `FIREBASE_ADMIN_*` | Server Firestore writes (forms, CMS API) |
| `CLOUDINARY_*` | Signed uploads in admin |
| `ADMIN_BOOTSTRAP_EMAIL` | One-time admin custom claim |
| `REVALIDATE_SECRET` | Optional on-demand revalidation |

## Firebase setup

1. Create a Firebase project and enable **Authentication** (Email/Password) and **Firestore**.
2. Create a web app and copy client keys into `.env.local`.
3. Generate a service account key → `FIREBASE_ADMIN_*` fields.
   - Local: put the PEM in `FIREBASE_ADMIN_PRIVATE_KEY` with `\n` for newlines.
   - **Netlify (recommended):** set `FIREBASE_ADMIN_PRIVATE_KEY_BASE64` to the base64 of the full PEM (avoids newline corruption). Generate with:
     `node -e "require('dotenv').config(); console.log(Buffer.from(process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\\\n/g,'\\n')).toString('base64'))"`
4. Deploy rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

(Use Firebase CLI with `firestore.rules` and `firestore.indexes.json` in this repo.)

5. Create an admin user in Firebase Auth, then:

```bash
npm run bootstrap-admin
```

6. Seed demo CMS content (optional):

```bash
npm run seed
```

## Production build (self-host)

```bash
npm run build
npm run start
```

Standalone output lives in `.next/standalone`. For Docker:

```bash
docker build -t faresboughzela .
docker run -p 3000:3000 --env-file .env.local faresboughzela
```

Place a reverse proxy (nginx, Caddy, etc.) in front for TLS and set `NEXT_PUBLIC_SITE_URL` to your public URL.

## Admin CMS

- URL: `/admin/login`
- Sections: General, Homepage, About, Portfolio, Services, Inbox, SEO
- Portfolio/Services: JSON editor + Cloudinary upload (sets `cover` on current draft)
- Inbox: contact messages + training registrations with status updates

## Public routes

- `/en`, `/fr` — home (all design sections)
- `/[locale]/portfolio`
- `/[locale]/services` and `/[locale]/services/[slug]`
- `/[locale]/contact`
- `/[locale]/training/[slug]` → redirects to services slug

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start standalone server |
| `npm run seed` | Seed Firestore with defaults |
| `npm run bootstrap-admin` | Set `admin: true` custom claim |

## License

Private project for Fares Boughzala.
