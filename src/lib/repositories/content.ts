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

async function getDoc<T>(path: string, fallback: T): Promise<T> {
  const db = getAdminDb();
  if (!db) return fallback;
  try {
    const snap = await db.doc(path).get();
    if (!snap.exists) return fallback;
    return { ...fallback, ...snap.data() } as T;
  } catch {
    return fallback;
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
    return list;
  }
  try {
    const snap = await db.collection(name).get();
    if (snap.empty) {
      return filter ? fallback.filter(filter) : fallback;
    }
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
    return filter ? items.filter(filter) : items;
  } catch {
    return filter ? fallback.filter(filter) : fallback;
  }
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  const data = await getDoc("settings/general", defaultGeneralSettings);
  return {
    ...defaultGeneralSettings,
    ...data,
    social: {
      ...defaultGeneralSettings.social,
      ...data.social,
    },
  };
}

export async function getHomepageSettings(): Promise<HomepageSettings> {
  return getDoc("settings/homepage", defaultHomepageSettings);
}

export async function getAboutSettings(): Promise<AboutSettings> {
  return getDoc("settings/about", defaultAboutSettings);
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
    return snap.data() as PageSeo;
  } catch {
    return null;
  }
}

export async function getMessagesAdmin(): Promise<ContactMessage[]> {
  const db = getAdminDb();
  if (!db) return [];
  const snap = await db
    .collection("messages")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ContactMessage);
}

export async function getRegistrationsAdmin(): Promise<TrainingRegistration[]> {
  const db = getAdminDb();
  if (!db) return [];
  const snap = await db
    .collection("registrations")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();
  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as TrainingRegistration,
  );
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
