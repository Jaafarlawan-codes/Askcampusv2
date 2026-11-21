import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
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
import { StudentProfile, SellerReview } from './types';

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

// Initialize Firebase Auth with explicit local persistence
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Auth persistence setup warning:', err);
});

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

const REDIRECT_PENDING_KEY = 'askcampus_auth_redirect_pending';

// Auth helper functions
export async function signInWithGoogle() {
  try {
    sessionStorage.removeItem(REDIRECT_PENDING_KEY);
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google sign-in error:', error?.code, error?.message, error);
    throw error;
  }
}

export async function signInWithGoogleRedirect() {
  try {
    sessionStorage.setItem(REDIRECT_PENDING_KEY, '1');
    await signInWithRedirect(auth, googleProvider);
  } catch (error: any) {
    sessionStorage.removeItem(REDIRECT_PENDING_KEY);
    console.error('Google redirect sign-in error:', error?.code, error?.message, error);
    throw error;
  }
}

export async function completeGoogleRedirectSignIn(): Promise<{
  user: FirebaseUser | null;
  errorCode: string | null;
  redirectLost: boolean;
}> {
  const wasPending = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(REDIRECT_PENDING_KEY) === '1';
  try {
    const result = await getRedirectResult(auth);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(REDIRECT_PENDING_KEY);
    }
    if (result?.user) {
      return { user: result.user, errorCode: null, redirectLost: false };
    }
    return { user: null, errorCode: null, redirectLost: wasPending && !auth.currentUser };
  } catch (error: any) {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(REDIRECT_PENDING_KEY);
    }
    console.error('Google redirect result error:', error?.code, error?.message, error);
    return { user: null, errorCode: error?.code || 'auth/redirect-failed', redirectLost: false };
  }
}

export async function logOut() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(REDIRECT_PENDING_KEY);
    }
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

async function syncCampusPeerDirectory(uid: string, profile: Record<string, any>) {
  if (!uid || !profile.school || !profile.country || profile.school === 'Stanford University') {
    return;
  }
  try {
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
  } catch (err) {
    console.warn('Non-blocking campus_peers sync warning:', err);
  }
}

const inFlightSync = new Map<string, Promise<any>>();

function buildFallbackProfile(user: FirebaseUser, additionalData: Partial<StudentProfile> = {}) {
  const emailUsername = (user.email || 'student').split('@')[0];
  return {
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
}

// User Profile Sync with Firestore (deduplicated & resilient against rule/network hiccups)
export async function syncUserProfile(user: FirebaseUser, additionalData: Partial<StudentProfile> = {}) {
  if (!user) return null;
  const existingPromise = inFlightSync.get(user.uid);
  if (existingPromise) {
    return existingPromise;
  }

  const syncTask = (async () => {
    const userRef = doc(db, 'users', user.uid);
    const fallback = buildFallbackProfile(user, additionalData);
    try {
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, fallback);
        await syncCampusPeerDirectory(user.uid, fallback);
        return fallback;
      } else {
        const existing = snap.data();
        if (existing.college === 'Stanford University' && !existing.country && !additionalData.school) {
          existing.college = '';
          existing.school = '';
        }
        if (additionalData && (additionalData.school || additionalData.country)) {
          const cleanedDoc = {
            uid: user.uid,
            email: existing.email || user.email || '',
            displayName: existing.displayName || user.displayName || 'Campus Student',
            username: existing.username || fallback.username,
            avatar: existing.avatar || fallback.avatar,
            school: additionalData.school || existing.school || '',
            college: additionalData.school || additionalData.college || existing.college || '',
            country: additionalData.country || existing.country || '',
            state: additionalData.state || existing.state || '',
            currencyCode: additionalData.currencyCode || existing.currencyCode || 'USD',
            currencySymbol: additionalData.currencySymbol || existing.currencySymbol || '$',
            major: additionalData.major || existing.major || '',
            graduationYear: existing.graduationYear || '2026',
            karma: typeof existing.karma === 'number' ? existing.karma : 50,
            badges: Array.isArray(existing.badges) ? existing.badges.slice(0, 10) : ['Verified Student'],
            verifiedStudent: true,
            createdAt: existing.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await setDoc(userRef, cleanedDoc);
          await syncCampusPeerDirectory(user.uid, cleanedDoc);
          return cleanedDoc;
        }
        await syncCampusPeerDirectory(user.uid, existing);
        return existing;
      }
    } catch (err) {
      // Log diagnostic info without discarding the user's active Google Auth session
      console.error('Firestore profile sync failed, using verified Google session:', err);
      return fallback;
    } finally {
      inFlightSync.delete(user.uid);
    }
  })();

  inFlightSync.set(user.uid, syncTask);
  return syncTask;
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

export async function submitSellerReviewToFirestore(review: SellerReview): Promise<void> {
  if (!auth.currentUser) return;
  const safeId = review.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `seller_reviews/${safeId}`;
  const sanitizedPayload: Record<string, any> = {
    id: safeId,
    sellerId: String(review.sellerId).slice(0, 128),
    sellerName: String(review.sellerName || 'Campus Seller').slice(0, 120),
    reviewerId: auth.currentUser.uid,
    reviewerName: String(review.reviewerName || auth.currentUser.displayName || 'Student').slice(0, 120),
    reviewerAvatar: String(review.reviewerAvatar || '').slice(0, 1000),
    rating: Math.max(1, Math.min(5, Math.round(review.rating))),
    comment: String(review.comment || '').slice(0, 600),
    tags: Array.isArray(review.tags) ? review.tags.map((t) => String(t).slice(0, 40)).slice(0, 5) : [],
    campus: String(review.campus || '').slice(0, 200),
    verifiedPurchase: Boolean(review.verifiedPurchase),
    createdAt: String(review.createdAt || new Date().toISOString()).slice(0, 50),
  };
  if (review.itemId) sanitizedPayload.itemId = String(review.itemId).slice(0, 128);
  if (review.itemTitle) sanitizedPayload.itemTitle = String(review.itemTitle).slice(0, 200);
  if (review.orderId) sanitizedPayload.orderId = String(review.orderId).slice(0, 128);

  try {
    await setDoc(doc(db, 'seller_reviews', safeId), sanitizedPayload);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export function subscribeSellerReviews(
  onUpdate: (reviews: SellerReview[]) => void
): () => void {
  if (!auth.currentUser) {
    return () => {};
  }
  const reviewsQuery = query(
    collection(db, 'seller_reviews'),
    where('sellerId', '>', '')
  );
  return onSnapshot(
    reviewsQuery,
    (snapshot) => {
      const list: SellerReview[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        if (data?.sellerId && typeof data.rating === 'number') {
          list.push({
            id: data.id || d.id,
            sellerId: data.sellerId,
            sellerName: data.sellerName || 'Campus Seller',
            reviewerId: data.reviewerId || '',
            reviewerName: data.reviewerName || 'Verified Student',
            reviewerAvatar: data.reviewerAvatar || '',
            itemId: data.itemId,
            itemTitle: data.itemTitle,
            orderId: data.orderId,
            rating: data.rating,
            comment: data.comment || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
            campus: data.campus || '',
            verifiedPurchase: Boolean(data.verifiedPurchase),
            createdAt: data.createdAt || '',
            updatedAt: data.updatedAt,
          });
        }
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'seller_reviews');
    }
  );
}

