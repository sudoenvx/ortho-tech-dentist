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
  auth,
  db,
  hasFirebaseConfig,
  managersCollectionName,
} from '../lib/firebase'
// import {
//   createManagerAuthUserViaFunction,
//   updateManagerAuthUserPasswordViaFunction,
//   deleteManagerAuthUserViaFunction,
// } from '../lib/authUtils'
import type { Manager, NewManagerInput } from '../types/manager'
import { createUserWithEmailAndPassword, reauthenticateWithCredential } from 'firebase/auth'

const previewManagers: Manager[] = [
  {
    id: 'manager-1',
    name: 'Mona Sedky',
    email: 'mona@orthotech.app',
    password: 'password123',
    role: 'admin',
    createdAt: new Date('2026-04-10T08:00:00'),
    updatedAt: new Date('2026-04-10T08:00:00'),
  },
  {
    id: 'manager-2',
    name: 'Tarek Salem',
    email: 'tarek@orthotech.app',
    password: 'password123',
    role: 'editor',
    createdAt: new Date('2026-04-11T09:20:00'),
    updatedAt: new Date('2026-04-11T09:20:00'),
  },
  {
    id: 'manager-3',
    name: 'Sara Fathy',
    email: 'sara@orthotech.app',
    password: 'password123',
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
    password: String(raw['password'] ?? ''),
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

  try {
    // Create Firebase Auth user first (via Cloud Function)
    // await createManagerAuthUserViaFunction(input.email, input.password)

    const user = await createUserWithEmailAndPassword(auth!,input.email, input.password)

    // If Auth user creation succeeded, create the Firestore document
    const docRef = await addDoc(collection(db, managersCollectionName), {
      uid: user.user.uid,
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return {
      ...nextManager,
      id: docRef.id,
    }
  } catch (error) {
    // If something fails, re-throw so the calling code can handle it
    console.error('Failed to add manager:', error)
    throw error
  }
}


export async function updateManager(id: string, updates: Partial<Omit<Manager, 'id'>>) {
  if (!db || !hasFirebaseConfig) {
    return
  }

  try {
    // If password is being updated, update the Firebase Auth user password
    const docRef = doc(db, managersCollectionName, id)


    // Update the Firestore document
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Failed to update manager:', error)
    throw error
  }
}


export async function deleteManager(id: string) {
  if (!db || !hasFirebaseConfig) {
    return
  }

  try {
    // First, get the manager's email so we can delete the auth user
    const managerRef = doc(db, managersCollectionName, id)
    const managerDoc = await getDoc(managerRef)

    if (!managerDoc.exists()) {
      throw new Error('Manager not found')
    }

    const managerEmail =  String(managerDoc.data()['email'] ?? '')

    // Delete the Firebase Auth user
    // await deleteManagerAuthUserViaFunction(managerEmail)

    // Delete the Firestore document
    await deleteDoc(managerRef)
  } catch (error) {
    console.error('Failed to delete manager:', error)
    throw error
  }
}
