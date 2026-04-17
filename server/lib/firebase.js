import { initializeApp, getApps, cert } from 'firebase-admin/app';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

export const adminApp = getApps().length === 0 
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApps()[0];
