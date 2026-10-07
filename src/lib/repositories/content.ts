import {
  defaultAboutSettings,
  defaultGeneralSettings,
  defaultHomepageSettings,
  defaultPortfolioItems,
  defaultServices,
} from "@/lib/data/defaults";
import { getAdminDb } from "@/lib/firebase/admin";
import type {
  AboutSettings,
  ContactMessage,
  GeneralSettings,
  HomepageSettings,
  PageSeo,
  PortfolioItem,
  ServiceItem,
  TrainingRegistration,
} from "@/types/cms";

/** Strip Firestore Timestamps / class instances for RSC → client props. */
function toClientJson<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, v) => {
      if (v && typeof v === "object" && typeof (v as { toDate?: unknown }).toDate === "function") {
        try {
          return (v as { toDate: () => Date }).toDate().toISOString();
        } catch {
          return null;
        }
      }
      return v;
    }),
  ) as T;
}

async function getDoc<T>(path: string, fallback: T): Promise<T> {
  const db = getAdminDb();
  if (!db) return toClientJson(fallback);
  try {
    const snap = await db.doc(path).get();
    if (!snap.exists) return toClientJson(fallback);
    return toClientJson({ ...fallback, ...snap.data() } as T);
  } catch (error) {
    console.error(`[content] getDoc ${path} failed:`, error);
    return toClientJson(fallback);
  }
}

async function getCollection<T>(
  name: string,
  fallback: T[],
  filter?: (item: T) => boolean,
): Promise<T[]> {
  const db = getAdminDb();
  if (!db) {
    const list = filter ? fallback.filter(filter) : fallback;
    return toClientJson(list);
  }
  try {
    const snap = await db.collection(name).get();
    if (snap.empty) {
      const list = filter ? fallback.filter(filter) : fallback;
      return toClientJson(list);
    }
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
    const list = filter ? items.filter(filter) : items;
    return toClientJson(list);
  } catch (error) {
    console.error(`[content] getCollection ${name} failed:`, error);
    const list = filter ? fallback.filter(filter) : fallback;
    return toClientJson(list);
  }
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  const data = await getDoc("settings/general", defaultGeneralSettings);
  return toClientJson({
    ...defaultGeneralSettings,
    ...data,
    social: {
      ...defaultGeneralSettings.social,
      ...data.social,
    },
  });
}

export async function getHomepageSettings(): Promise<HomepageSettings> {
  const data = await getDoc("settings/homepage", defaultHomepageSettings);
  return toClientJson({
    ...defaultHomepageSettings,
    ...data,
    heroPills: data.heroPills ?? defaultHomepageSettings.heroPills,
    stats: data.stats ?? defaultHomepageSettings.stats,
    collaborationCards:
      data.collaborationCards ?? defaultHomepageSettings.collaborationCards,
    whyWorkPillars: data.whyWorkPillars ?? defaultHomepageSettings.whyWorkPillars,
    featuredPortfolioIds:
      data.featuredPortfolioIds ?? defaultHomepageSettings.featuredPortfolioIds,
  });
}

export async function getAboutSettings(): Promise<AboutSettings> {
  const data = await getDoc("settings/about", defaultAboutSettings);
  return toClientJson({
    ...defaultAboutSettings,
    ...data,
    highlights: data.highlights ?? defaultAboutSettings.highlights,
  });
}

export async function getPublishedPortfolio(): Promise<PortfolioItem[]> {
  const items = await getCollection<PortfolioItem>(
    "portfolio",
    defaultPortfolioItems,
    (i) => i.published,
  );
  return [...items].sort((a, b) => a.order - b.order);
}

export async function getAllPortfolioAdmin(): Promise<PortfolioItem[]> {
  return getCollection<PortfolioItem>("portfolio", defaultPortfolioItems);
}

export async function getPublishedServices(): Promise<ServiceItem[]> {
  const items = await getCollection<ServiceItem>(
    "services",
    defaultServices,
    (s) => s.published,
  );
  return [...items].sort((a, b) => a.order - b.order);
}

export async function getAllServicesAdmin(): Promise<ServiceItem[]> {
  return getCollection<ServiceItem>("services", defaultServices);
}

export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  const services = await getPublishedServices();
  return services.find((s) => s.slug === slug) ?? null;
}

export async function getPageSeo(pageKey: string): Promise<PageSeo | null> {
  const db = getAdminDb();
  if (!db) return null;
  try {
    const snap = await db.doc(`seoPages/${pageKey}`).get();
    if (!snap.exists) return null;
    return toClientJson(snap.data() as PageSeo);
  } catch {
    return null;
  }
}

export async function getMessagesAdmin(): Promise<ContactMessage[]> {
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snap = await db
      .collection("messages")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();
    return toClientJson(
      snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ContactMessage),
    );
  } catch {
    return [];
  }
}

export async function getRegistrationsAdmin(): Promise<TrainingRegistration[]> {
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snap = await db
      .collection("registrations")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();
    return toClientJson(
      snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as TrainingRegistration,
      ),
    );
  } catch {
    return [];
  }
}

export async function saveSettingsDoc(path: string, data: object) {
  const db = getAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured");
  await db.doc(path).set(data, { merge: true });
}

export async function saveCollectionDoc(
  collection: string,
  id: string,
  data: object,
) {
  const db = getAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured");
  await db.collection(collection).doc(id).set(data, { merge: true });
}

export async function deleteCollectionDoc(collection: string, id: string) {
  const db = getAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured");
  await db.collection(collection).doc(id).delete();
}
