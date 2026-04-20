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
  casesCollectionName,
  db,
  hasFirebaseConfig,
} from '../lib/firebase'
import type {
  CaseSteps,
  JawFile,
  NewPatientCaseInput,
  PatientCase,
} from '../types/case'

const EMPTY_STEPS: CaseSteps = {
  stl: { completed: false },
  printing: { completed: false },
  stacking: { completed: false },
  finishing: { completed: false },
  delivered: { completed: false },
}

const previewCases: PatientCase[] = []

function toDate(value: unknown) {
  if (value instanceof Date) {
    return value
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof value.toDate === 'function'
  ) {
    return value.toDate()
  }

  return new Date()
}

function normalizeSteps(steps: Partial<CaseSteps> | undefined): CaseSteps {
  return {
    stl: typeof steps?.stl === 'object' ? steps.stl : { completed: Boolean(steps?.stl) },
    printing: typeof steps?.printing === 'object' ? steps.printing : { completed: Boolean(steps?.printing) },
    stacking: typeof steps?.stacking === 'object' ? steps.stacking : { completed: Boolean(steps?.stacking) },
    finishing: typeof steps?.finishing === 'object' ? steps.finishing : { completed: Boolean(steps?.finishing) },
    delivered: typeof steps?.delivered === 'object' ? steps.delivered : { completed: Boolean(steps?.delivered) },
  }
}

function normalizeCase(rawCase: Record<string, unknown>, id: string): PatientCase {
  return {
    id,
    patientName: String(rawCase['patientName'] ?? ''),
    doctorName: String(rawCase['doctorName'] ?? ''),
    websiteId: String(rawCase['websiteId'] ?? 'website-1'),
    steps: normalizeSteps(rawCase['steps'] as Partial<CaseSteps> | undefined),
    jawFiles: (rawCase['jawFiles'] as JawFile[]) ?? [],
    isImportant: Boolean(rawCase['isImportant'] ?? false),
    updatedAt: toDate(rawCase['updatedAt']),
    createdAt: toDate(rawCase['createdAt']),
  }
}

export function subscribeToCases({
  onData,
  onError,
}: {
  onData: (cases: PatientCase[]) => void
  onError: (error: Error) => void
}) {
  if (!db) {
    onData(previewCases)
    return () => undefined
  }

  const casesQuery = query(
    collection(db, casesCollectionName),
    orderBy('updatedAt', 'desc'),
  )

  return onSnapshot(
    casesQuery,
    (snapshot) => {
      const nextCases = snapshot.docs.map((item) =>
        normalizeCase(item.data(), item.id),
      )
      onData(nextCases)
    },
    (error) => onError(error),
  )
}

export async function addCase(input: NewPatientCaseInput) {
  const nextCase: Omit<PatientCase, 'id'> = {
    patientName: input.patientName.trim(),
    doctorName: input.doctorName.trim(),
    websiteId: input.websiteId,
    steps: EMPTY_STEPS,
    jawFiles: [],
    isImportant: false,
    updatedAt: new Date(),
    createdAt: new Date(),
  }

  if (!db || !hasFirebaseConfig) {
    return {
      ...nextCase,
      id: crypto.randomUUID(),
    }
  }

  const docRef = await addDoc(collection(db, casesCollectionName), {
    ...nextCase,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return {
    ...nextCase,
    id: docRef.id,
  }
}

export async function updateCase(id: string, updates: Partial<Omit<PatientCase, 'id'>>) {
  if (!db || !hasFirebaseConfig) {
    return
  }

  const docRef = doc(db, casesCollectionName, id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteCase(id: string) {
  if (!db || !hasFirebaseConfig) {
    return
  }

  const docRef = doc(db, casesCollectionName, id)
  await deleteDoc(docRef)
}

export { hasFirebaseConfig }
