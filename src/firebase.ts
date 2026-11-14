import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
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
  query,
  where,
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
    console.error('Google sign-in error:', error?.code, error?.message, error);
    throw error;
  }
}

export async function signInWithGoogleRedirect() {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error: any) {
    console.error('Google redirect sign-in error:', error?.code, error?.message, error);
    throw error;
  }
}

export async function completeGoogleRedirectSignIn() {
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error: any) {
    console.error('Google redirect result error:', error?.code, error?.message, error);
    return null;
  }
}

export async function logOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

async function syncCampusPeerDirectory(uid: string, profile: Record<string, any>) {
  if (!uid || !profile.school || !profile.country || profile.school === 'Stanford University') {
    return;
  }
  const peerRef = doc(db, 'campus_peers', uid);
  const existingPeer = await getDoc(peerRef);
  const editableFields = {
    displayName: profile.displayName || profile.name || 'Campus Student',
    username: profile.username || 'student',
    avatar: profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    college: profile.school || profile.college || '',
    school: profile.school || profile.college || '',
    country: profile.country || '',
    state: profile.state || '',
    currencyCode: profile.currencyCode || 'USD',
    currencySymbol: profile.currencySymbol || '$',
    major: profile.major || '',
    graduationYear: profile.graduationYear || '2026',
    updatedAt: new Date().toISOString(),
  };

  if (!existingPeer.exists()) {
    await setDoc(peerRef, {
      uid,
      ...editableFields,
      karma: typeof profile.karma === 'number' ? profile.karma : 50,
      badges: Array.isArray(profile.badges) ? profile.badges.slice(0, 10) : ['Verified Student'],
      verifiedStudent: true,
    });
  } else {
    await updateDoc(peerRef, editableFields);
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
      await syncCampusPeerDirectory(user.uid, newProfile);
      return newProfile;
    } else {
      const existing = snap.data();
      // Purge any legacy hardcoded 'Stanford University' placeholder if country was never set
      if (existing.college === 'Stanford University' && !existing.country && !additionalData.school) {
        existing.college = '';
        existing.school = '';
      }
      // If additional data was provided, merge updates strictly using allowed fields
      if (additionalData && (additionalData.school || additionalData.country)) {
        const updateFields = {
          school: additionalData.school || existing.school || '',
          college: additionalData.school || additionalData.college || existing.college || '',
          country: additionalData.country || existing.country || '',
          state: additionalData.state || existing.state || '',
          currencyCode: additionalData.currencyCode || existing.currencyCode || 'USD',
          currencySymbol: additionalData.currencySymbol || existing.currencySymbol || '$',
          major: additionalData.major || existing.major || '',
          updatedAt: new Date().toISOString(),
        };
        await updateDoc(userRef, updateFields);
        const merged = { ...existing, ...updateFields };
        await syncCampusPeerDirectory(user.uid, merged);
        return merged;
      }
      await syncCampusPeerDirectory(user.uid, existing);
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
    const allowedUpdate: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
    if (profileData.name) allowedUpdate.displayName = profileData.name;
    if (profileData.username) allowedUpdate.username = profileData.username;
    if (profileData.avatar) allowedUpdate.avatar = profileData.avatar;
    if (profileData.college !== undefined) allowedUpdate.college = profileData.college;
    if (profileData.school !== undefined) allowedUpdate.school = profileData.school;
    if (profileData.country !== undefined) allowedUpdate.country = profileData.country;
    if (profileData.state !== undefined) allowedUpdate.state = profileData.state;
    if (profileData.currencyCode !== undefined) allowedUpdate.currencyCode = profileData.currencyCode;
    if (profileData.currencySymbol !== undefined) allowedUpdate.currencySymbol = profileData.currencySymbol;
    if (profileData.major !== undefined) allowedUpdate.major = profileData.major;
    if (profileData.graduationYear !== undefined) allowedUpdate.graduationYear = profileData.graduationYear;

    await setDoc(userRef, allowedUpdate, { merge: true });
    await syncCampusPeerDirectory(uid, {
      ...allowedUpdate,
      displayName: profileData.name || auth.currentUser?.displayName || 'Campus Student',
      badges: profileData.badges,
      karma: profileData.karma,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
  }
}

// Fetch genuine registered colleagues from non-PII campus_peers directory (authenticated only)
export async function getRegisteredUsers(userSchool?: string): Promise<StudentProfile[]> {
  if (!auth.currentUser) {
    return [];
  }
  try {
    const peersCollection = collection(db, 'campus_peers');
    const q = userSchool
      ? query(peersCollection, where('school', '==', userSchool))
      : peersCollection;
    const snap = await getDocs(q);
    const users: StudentProfile[] = [];
    snap.forEach((d) => {
      const data = d.data();
      if (data.school && data.country && data.school !== 'Stanford University') {
        users.push({
          id: data.uid || d.id,
          name: data.displayName || 'Campus Student',
          username: data.username || 'student',
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
    console.error('Error fetching registered peers:', err);
    return [];
  }
}
