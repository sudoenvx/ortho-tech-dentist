import {
  auth,
  db,
  hasFirebaseConfig,
} from './firebase'
import {
  createUserWithEmailAndPassword,
  updatePassword,
  deleteUser,
  signOut,
  signInWithEmailAndPassword,
  type User,
} from 'firebase/auth'

/**
 * Creates a Firebase Auth user with the given email and password
 * Note: This should be called from an authenticated admin context or with special privileges
 */
export async function createAuthUser(email: string, password: string): Promise<User | null> {
  if (!auth || !hasFirebaseConfig) {
    console.warn('Firebase Auth not configured')
    return null
  }

  try {
    // Check if the current user is authenticated (admin)
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('Must be authenticated to create a user. Use admin SDK or configure proper permissions.')
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error: any) {
    console.error('Failed to create auth user:', error)
    throw new Error(`Failed to create auth user: ${error.message}`)
  }
}

/**
 * Updates the password of an existing Firebase Auth user
 * Note: This requires re-authentication or should be called from an admin context
 */
export async function updateAuthUserPassword(email: string, newPassword: string): Promise<void> {
  if (!auth || !hasFirebaseConfig) {
    console.warn('Firebase Auth not configured')
    return
  }

  try {
    // We need to find the user by email - this is tricky without admin SDK
    // The best approach is to update the password directly if we have access to the user
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('No authenticated user. Cannot update password.')
    }

    // Only update if the current user email matches (for self-updates)
    if (currentUser.email === email) {
      await updatePassword(currentUser, newPassword)
    } else {
      // For updating other users' passwords, we'd need admin SDK
      throw new Error('Can only update password for currently authenticated user. Use admin SDK for other users.')
    }
  } catch (error: any) {
    console.error('Failed to update auth user password:', error)
    throw new Error(`Failed to update auth user password: ${error.message}`)
  }
}

/**
 * Deletes a Firebase Auth user by email
 * Note: This requires admin SDK for proper implementation
 * For client-side, we can only delete the current user
 */
export async function deleteAuthUser(email: string): Promise<void> {
  if (!auth || !hasFirebaseConfig) {
    console.warn('Firebase Auth not configured')
    return
  }

  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('No authenticated user. Cannot delete user.')
    }

    // Only delete if it's the current user
    if (currentUser.email === email) {
      await deleteUser(currentUser)
    } else {
      // For deleting other users, we need a different approach
      // Since we can't access other users' accounts from client-side,
      // we should use Firebase Admin SDK via a backend function
      console.warn(`Cannot delete user ${email} from client-side. Consider using Cloud Functions.`)
      throw new Error('Use admin SDK or Cloud Function to delete other users')
    }
  } catch (error: any) {
    console.error('Failed to delete auth user:', error)
    throw new Error(`Failed to delete auth user: ${error.message}`)
  }
}

/**
 * This is a placeholder for server-side user management
 * In production, you should implement this as a Cloud Function
 * Example Cloud Function code:
 * 
 * export const createManagerAuthUser = functions.https.onCall(async (data, context) => {
 *   if (!context.auth) throw new Error('Must be authenticated');
 *   
 *   const email = data.email;
 *   const password = data.password;
 *   
 *   try {
 *     const userRecord = await admin.auth().createUser({
 *       email,
 *       password,
 *     });
 *     return { uid: userRecord.uid };
 *   } catch (error) {
 *     throw error;
 *   }
 * });
 * 
 * export const updateManagerAuthUserPassword = functions.https.onCall(async (data, context) => {
 *   if (!context.auth) throw new Error('Must be authenticated');
 *   
 *   const email = data.email;
 *   const newPassword = data.newPassword;
 *   
 *   try {
 *     const userRecord = await admin.auth().getUserByEmail(email);
 *     await admin.auth().updateUser(userRecord.uid, {
 *       password: newPassword,
 *     });
 *   } catch (error) {
 *     throw error;
 *   }
 * });
 * 
 * export const deleteManagerAuthUser = functions.https.onCall(async (data, context) => {
 *   if (!context.auth) throw new Error('Must be authenticated');
 *   
 *   const email = data.email;
 *   
 *   try {
 *     const userRecord = await admin.auth().getUserByEmail(email);
 *     await admin.auth().deleteUser(userRecord.uid);
 *   } catch (error) {
 *     throw error;
 *   }
 * });
 */

/**
 * Calls a Cloud Function to create a manager auth user on the backend
 * This is the recommended approach for production
 */
export async function createManagerAuthUserViaFunction(email: string, password: string): Promise<void> {
  // This would call a Firebase Cloud Function
  // For now, we'll use a simple API endpoint approach
  // You can replace this with a proper Cloud Function call using httpsCallable()
  
  const response = await fetch('/.netlify/functions/createManagerAuth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create auth user')
  }
}

/**
 * Calls a Cloud Function to update a manager auth user password
 */
export async function updateManagerAuthUserPasswordViaFunction(email: string, newPassword: string): Promise<void> {
  const response = await fetch('/.netlify/functions/updateManagerAuthPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, newPassword }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update auth user password')
  }
}

/**
 * Calls a Cloud Function to delete a manager auth user
 */
export async function deleteManagerAuthUserViaFunction(email: string): Promise<void> {
  const response = await fetch('/.netlify/functions/deleteManagerAuth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete auth user')
  }
}
