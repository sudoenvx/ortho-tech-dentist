import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import {
  db,
  hasFirebaseConfig,
  websitesCollectionName,
} from '../lib/firebase'
import type { Website, NewWebsiteInput } from '../types/website'

function toDate(value: unknown) {
  if (value instanceof Date) {
    return value
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as any).toDate === 'function'
  ) {
    return (value as any).toDate()
  }

  return new Date()
}

function normalizeWebsite(raw: Record<string, unknown>, id: string): Website {
  return {
    id,
    name: String(raw['name'] ?? ''),
    link: raw['link'] ? String(raw['link']) : undefined,
    isActive: Boolean(raw['isActive'] ?? true),
    createdAt: toDate(raw['createdAt']),
    updatedAt: toDate(raw['updatedAt']),
  }
}

export function subscribeToWebsites({
  onData,
  onError,
}: {
  onData: (websites: Website[]) => void
  onError: (error: Error) => void
}) {
  if (!db) {
    onData([])
    return () => undefined
  }

  const websitesQuery = query(
    collection(db, websitesCollectionName),
    orderBy('updatedAt', 'desc'),
  )

  return onSnapshot(
    websitesQuery,
    (snapshot) => {
      const nextWebsites = snapshot.docs.map((item) => normalizeWebsite(item.data(), item.id))
      onData(nextWebsites)
    },
    (error) => onError(error),
  )
}

export async function addWebsite(input: NewWebsiteInput) {
  const nextWebsite: Omit<Website, 'id'> = {
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  if (!db || !hasFirebaseConfig) {
    return {
      ...nextWebsite,
      id: crypto.randomUUID(),
    }
  }

  try {
    const docRef = await addDoc(collection(db, websitesCollectionName), {
      name: input.name,
      link: input.link || null,
      isActive: input.isActive,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return {
      ...nextWebsite,
      id: docRef.id,
    }
  } catch (error) {
    console.error('Failed to add website:', error)
    throw error
  }
}

export async function updateWebsite(id: string, updates: Partial<Omit<Website, 'id'>>) {
  if (!db || !hasFirebaseConfig) {
    return
  }

  try {
    const docRef = doc(db, websitesCollectionName, id)

    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Failed to update website:', error)
    throw error
  }
}

export async function deleteWebsite(id: string) {
  if (!db || !hasFirebaseConfig) {
    return
  }

  try {
    const websiteRef = doc(db, websitesCollectionName, id)
    await deleteDoc(websiteRef)
  } catch (error) {
    console.error('Failed to delete website:', error)
    throw error
  }
}

export async function getWebsiteById(id: string): Promise<Website | null> {
  if (!db || !hasFirebaseConfig) {
    return null
  }

  try {
    const docRef = doc(db, websitesCollectionName, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    return normalizeWebsite(docSnap.data(), docSnap.id)
  } catch (error) {
    console.error('Failed to get website:', error)
    throw error
  }
}