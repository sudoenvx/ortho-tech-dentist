import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDMFbEMzTCqMo8EE4TvF5lAxcXov3-v8mQ",
  authDomain: "ortho-tech.firebaseapp.com",
  projectId: "ortho-tech",
  storageBucket: "ortho-tech.firebasestorage.app",
  messagingSenderId: "415109247292",
  appId: "1:415109247292:web:fc7da8ced793a48bed6e39",
  measurementId: "G-LF212F9YZZ"
};

export const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean)

const app: FirebaseApp | null = hasFirebaseConfig
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null

export const db = app ? getFirestore(app) : null
export const auth = app ? getAuth(app) : null
export const casesCollectionName = 'cases'
export const managersCollectionName = 'managers'
