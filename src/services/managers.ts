import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import {
  db,
  hasFirebaseConfig,
  managersCollectionName,
} from '../lib/firebase'
import type { Manager, NewManagerInput } from '../types/manager'

const previewManagers: Manager[] = [
  {
    id: 'manager-1',
    name: 'Mona Sedky',
    email: 'mona@orthotech.app',
    role: 'admin',
    createdAt: new Date('2026-04-10T08:00:00'),
    updatedAt: new Date('2026-04-10T08:00:00'),
  },
  {
    id: 'manager-2',
    name: 'Tarek Salem',
    email: 'tarek@orthotech.app',
    role: 'editor',
    createdAt: new Date('2026-04-11T09:20:00'),
    updatedAt: new Date('2026-04-11T09:20:00'),
  },
  {
    id: 'manager-3',
    name: 'Sara Fathy',
    email: 'sara@orthotech.app',
    role: 'viewer',
    createdAt: new Date('2026-04-12T11:30:00'),
    updatedAt: new Date('2026-04-12T11:30:00'),
  },
]

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

function normalizeManager(raw: Record<string, unknown>, id: string): Manager {
  return {
    id,
    name: String(raw['name'] ?? ''),
    email: String(raw['email'] ?? ''),
    role: (raw['role'] as Manager['role']) ?? 'viewer',
    createdAt: toDate(raw['createdAt']),
    updatedAt: toDate(raw['updatedAt']),
  }
}

export function subscribeToManagers({
  onData,
  onError,
}: {
  onData: (managers: Manager[]) => void
  onError: (error: Error) => void
}) {
  if (!db) {
    onData(previewManagers)
    return () => undefined
  }

  const managersQuery = query(
    collection(db, managersCollectionName),
    orderBy('updatedAt', 'desc'),
  )

  return onSnapshot(
    managersQuery,
    (snapshot) => {
      const nextManagers = snapshot.docs.map((item) => normalizeManager(item.data(), item.id))
      onData(nextManagers)
    },
    (error) => onError(error),
  )
}

export async function addManager(input: NewManagerInput) {
  const nextManager: Omit<Manager, 'id'> = {
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  if (!db || !hasFirebaseConfig) {
    return {
      ...nextManager,
      id: crypto.randomUUID(),
    }
  }

  const docRef = await addDoc(collection(db, managersCollectionName), {
    ...nextManager,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return {
    ...nextManager,
    id: docRef.id,
  }
}

export async function updateManager(id: string, updates: Partial<Omit<Manager, 'id'>>) {
  if (!db || !hasFirebaseConfig) {
    return
  }

  const docRef = doc(db, managersCollectionName, id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteManager(id: string) {
  if (!db || !hasFirebaseConfig) {
    return
  }

  const docRef = doc(db, managersCollectionName, id)
  await deleteDoc(docRef)
}
