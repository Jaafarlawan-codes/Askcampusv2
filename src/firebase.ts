import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  getDocs,
  getDocFromServer,
  collection,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { StudentProfile } from './types';

// Skill Mandated Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Validate connection to Firestore
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is currently offline or connecting...');
    }
  }
}
testConnection();

// Auth helper functions
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

export async function logOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// User Profile Sync with Firestore
export async function syncUserProfile(user: FirebaseUser, additionalData: Partial<StudentProfile> = {}) {
  if (!user) return null;
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      const emailUsername = (user.email || 'student').split('@')[0];
      const newProfile: any = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Campus Student',
        username: emailUsername,
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        college: additionalData.school || additionalData.college || '',
        school: additionalData.school || additionalData.college || '',
        country: additionalData.country || '',
        state: additionalData.state || '',
        currencyCode: additionalData.currencyCode || '',
        currencySymbol: additionalData.currencySymbol || '',
        major: additionalData.major || '',
        graduationYear: additionalData.graduationYear || '2026',
        karma: 50,
        badges: ['Verified Student'],
        verifiedStudent: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    } else {
      const existing = snap.data();
      // Purge any legacy hardcoded 'Stanford University' placeholder if country was never set
      if (existing.college === 'Stanford University' && !existing.country && !additionalData.school) {
        existing.college = '';
        existing.school = '';
      }
      // If additional data was provided, merge updates
      if (additionalData && (additionalData.school || additionalData.country)) {
        const updated = {
          ...existing,
          school: additionalData.school || existing.school || '',
          college: additionalData.school || additionalData.college || existing.college || '',
          country: additionalData.country || existing.country || '',
          state: additionalData.state || existing.state || '',
          currencyCode: additionalData.currencyCode || existing.currencyCode || 'USD',
          currencySymbol: additionalData.currencySymbol || existing.currencySymbol || '$',
          major: additionalData.major || existing.major || '',
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userRef, updated, { merge: true });
        return updated;
      }
      return existing;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
    return null;
  }
}

// Update specific fields on user profile in Firestore
export async function updateUserFirestoreProfile(uid: string, profileData: Partial<StudentProfile>) {
  if (!uid) return;
  const userRef = doc(db, 'users', uid);
  try {
    await setDoc(userRef, {
      ...profileData,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
  }
}

// Fetch all genuine registered accounts created by users in Firestore
export async function getRegisteredUsers(): Promise<StudentProfile[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const users: StudentProfile[] = [];
    snap.forEach((d) => {
      const data = d.data();
      // Only include real users who completed their campus setup
      if (data.school && data.country && data.school !== 'Stanford University') {
        users.push({
          id: data.uid || d.id,
          name: data.displayName || 'Campus Student',
          username: data.username || (data.email ? data.email.split('@')[0] : 'student'),
          avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          college: data.school || data.college || 'Campus',
          school: data.school || data.college || 'Campus',
          country: data.country || '',
          state: data.state || '',
          currencyCode: data.currencyCode || 'USD',
          currencySymbol: data.currencySymbol || '$',
          major: data.major || 'Studies',
          graduationYear: data.graduationYear || '2026',
          karma: data.karma || 0,
          badges: data.badges || ['Verified Student'],
          verifiedStudent: true,
        });
      }
    });
    return users;
  } catch (err) {
    console.error('Error fetching registered users:', err);
    return [];
  }
}
