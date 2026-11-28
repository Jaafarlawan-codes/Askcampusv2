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
  deleteDoc,
  getDocs,
  getDocFromServer,
  collection,
  query,
  where,
  limit,
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

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

const ALLOWED_USER_PROFILE_KEYS = new Set([
  'uid', 'email', 'displayName', 'username', 'avatar',
  'college', 'school', 'country', 'state',
  'currencyCode', 'currencySymbol', 'major', 'graduationYear',
  'karma', 'badges', 'verifiedStudent', 'createdAt', 'updatedAt',
]);

const ALLOWED_PEER_KEYS = new Set([
  'uid', 'displayName', 'username', 'avatar',
  'college', 'school', 'country', 'state',
  'currencyCode', 'currencySymbol', 'major', 'graduationYear',
  'karma', 'badges', 'verifiedStudent', 'updatedAt',
]);

function clampStr(value: unknown, maxLen: number, fallback = ''): string {
  const s = typeof value === 'string' ? value : fallback;
  return s.slice(0, maxLen);
}

function hasUnknownKeys(docData: Record<string, any>, allowed: Set<string>): boolean {
  return Object.keys(docData).some((key) => !allowed.has(key));
}

async function syncCampusPeerDirectory(uid: string, profile: Record<string, any>) {
  if (!uid || !profile.school || !profile.country || profile.school === 'Stanford University') {
    return;
  }
  if (!auth.currentUser || auth.currentUser.uid !== uid || !auth.currentUser.emailVerified) {
    return;
  }
  try {
    const peerRef = doc(db, 'campus_peers', uid);
    const existingPeer = await getDoc(peerRef);
    const editableFields = {
      displayName: clampStr(profile.displayName || profile.name, 120, 'Campus Student') || 'Campus Student',
      username: clampStr(profile.username, 100, 'student') || 'student',
      avatar: clampStr(profile.avatar, 1000, DEFAULT_AVATAR) || DEFAULT_AVATAR,
      college: clampStr(profile.school || profile.college, 200),
      school: clampStr(profile.school || profile.college, 200),
      country: clampStr(profile.country, 100),
      state: clampStr(profile.state, 100),
      currencyCode: clampStr(profile.currencyCode, 10, 'USD') || 'USD',
      currencySymbol: clampStr(profile.currencySymbol, 10, '$') || '$',
      major: clampStr(profile.major, 120),
      graduationYear: clampStr(profile.graduationYear, 10, '2026') || '2026',
      updatedAt: new Date().toISOString().slice(0, 50),
    };

    if (!existingPeer.exists()) {
      await setDoc(peerRef, {
        uid,
        ...editableFields,
        karma: typeof profile.karma === 'number' ? Math.max(0, Math.min(100000, profile.karma)) : 50,
        badges: Array.isArray(profile.badges) ? profile.badges.slice(0, 10) : ['Verified Student'],
        verifiedStudent: true,
      });
    } else {
      const peerData = existingPeer.data();
      const needsRewrite =
        !peerData?.uid ||
        !peerData?.displayName ||
        !peerData?.school ||
        !peerData?.country ||
        hasUnknownKeys(peerData, ALLOWED_PEER_KEYS);

      if (needsRewrite) {
        await deleteDoc(peerRef);
        await setDoc(peerRef, {
          uid,
          ...editableFields,
          karma: typeof peerData?.karma === 'number' ? Math.max(0, Math.min(100000, peerData.karma)) : 50,
          badges: Array.isArray(peerData?.badges) ? peerData.badges.slice(0, 10) : ['Verified Student'],
          verifiedStudent: true,
        });
      } else {
        const changed = (
          peerData.displayName !== editableFields.displayName ||
          peerData.username !== editableFields.username ||
          peerData.avatar !== editableFields.avatar ||
          peerData.college !== editableFields.college ||
          peerData.school !== editableFields.school ||
          peerData.country !== editableFields.country ||
          peerData.state !== editableFields.state ||
          peerData.currencyCode !== editableFields.currencyCode ||
          peerData.currencySymbol !== editableFields.currencySymbol ||
          peerData.major !== editableFields.major ||
          peerData.graduationYear !== editableFields.graduationYear
        );
        if (changed) {
          await updateDoc(peerRef, editableFields);
        }
      }
    }
  } catch (err) {
    console.warn('Non-blocking campus_peers sync warning:', err);
  }
}

const inFlightSync = new Map<string, Promise<any>>();

function buildFallbackProfile(user: FirebaseUser, additionalData: Partial<StudentProfile> = {}) {
  const emailUsername = clampStr((user.email || 'student').split('@')[0], 100, 'student') || 'student';
  const now = new Date().toISOString().slice(0, 50);
  return {
    uid: user.uid,
    email: clampStr(user.email, 200),
    displayName: clampStr(additionalData.name || user.displayName, 120, 'Campus Student') || 'Campus Student',
    username: clampStr(additionalData.username, 100, emailUsername) || emailUsername,
    avatar: clampStr(additionalData.avatar || user.photoURL, 1000, DEFAULT_AVATAR) || DEFAULT_AVATAR,
    college: clampStr(additionalData.school || additionalData.college, 200),
    school: clampStr(additionalData.school || additionalData.college, 200),
    country: clampStr(additionalData.country, 100),
    state: clampStr(additionalData.state, 100),
    currencyCode: clampStr(additionalData.currencyCode, 10),
    currencySymbol: clampStr(additionalData.currencySymbol, 10),
    major: clampStr(additionalData.major, 120),
    graduationYear: clampStr(additionalData.graduationYear, 10, '2026') || '2026',
    karma: 50,
    badges: ['Verified Student'],
    verifiedStudent: true,
    createdAt: now,
    updatedAt: now,
  };
}

// User Profile Sync with Firestore (deduplicated & schema-strict)
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
        if (!user.emailVerified) {
          return fallback;
        }
        await setDoc(userRef, fallback);
        await syncCampusPeerDirectory(user.uid, fallback);
        return fallback;
      }

      const existing = snap.data() as Record<string, any>;
      if (existing.college === 'Stanford University' && !existing.country && !additionalData.school) {
        existing.college = '';
        existing.school = '';
      }

      const needsSchemaRewrite =
        existing.uid !== user.uid ||
        typeof existing.email !== 'string' ||
        typeof existing.displayName !== 'string' ||
        !existing.displayName.length ||
        hasUnknownKeys(existing, ALLOWED_USER_PROFILE_KEYS);

      const resolvedProfile = {
        uid: user.uid,
        email: clampStr(existing.email || user.email, 200),
        displayName: clampStr(existing.displayName || user.displayName, 120, 'Campus Student') || 'Campus Student',
        username: clampStr(existing.username, 100, fallback.username) || fallback.username,
        avatar: clampStr(existing.avatar, 1000, fallback.avatar) || fallback.avatar,
        school: clampStr(additionalData.school || existing.school, 200),
        college: clampStr(additionalData.school || additionalData.college || existing.college, 200),
        country: clampStr(additionalData.country || existing.country, 100),
        state: clampStr(additionalData.state || existing.state, 100),
        currencyCode: clampStr(additionalData.currencyCode || existing.currencyCode, 10, 'USD') || 'USD',
        currencySymbol: clampStr(additionalData.currencySymbol || existing.currencySymbol, 10, '$') || '$',
        major: clampStr(additionalData.major || existing.major, 120),
        graduationYear: clampStr(additionalData.graduationYear || existing.graduationYear, 10, '2026') || '2026',
        karma: typeof existing.karma === 'number' ? Math.max(0, Math.min(100000, existing.karma)) : 50,
        badges: Array.isArray(existing.badges) ? existing.badges.slice(0, 10) : ['Verified Student'],
        verifiedStudent: true,
        createdAt: clampStr(existing.createdAt, 50, fallback.createdAt) || fallback.createdAt,
        updatedAt: new Date().toISOString().slice(0, 50),
      };

      if (!user.emailVerified) {
        return resolvedProfile;
      }

      if (needsSchemaRewrite) {
        const cleanDoc = {
          ...resolvedProfile,
          karma: Math.min(50, resolvedProfile.karma),
        };
        await deleteDoc(userRef);
        await setDoc(userRef, cleanDoc);
        await syncCampusPeerDirectory(user.uid, cleanDoc);
        return cleanDoc;
      }

      const mutablePatch: Record<string, any> = {};
      const mutableKeys = [
        'displayName', 'username', 'avatar', 'college', 'school',
        'country', 'state', 'currencyCode', 'currencySymbol',
        'major', 'graduationYear',
      ] as const;

      for (const key of mutableKeys) {
        if (resolvedProfile[key] !== existing[key]) {
          mutablePatch[key] = resolvedProfile[key];
        }
      }

      if (Object.keys(mutablePatch).length > 0) {
        mutablePatch.updatedAt = resolvedProfile.updatedAt;
        await updateDoc(userRef, mutablePatch);
        await syncCampusPeerDirectory(user.uid, resolvedProfile);
        return resolvedProfile;
      }

      await syncCampusPeerDirectory(user.uid, resolvedProfile);
      return existing;
    } catch (err) {
      // Log warning without discarding the user's active Google Auth session
      console.warn('Firestore profile sync skipped cleanly, using verified Google session:', err);
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
  if (!uid || !auth.currentUser || auth.currentUser.uid !== uid || !auth.currentUser.emailVerified) {
    return;
  }
  const userRef = doc(db, 'users', uid);
  try {
    const snap = await getDoc(userRef);
    const allowedUpdate: Record<string, any> = {
      updatedAt: new Date().toISOString().slice(0, 50),
    };
    if (profileData.name) allowedUpdate.displayName = clampStr(profileData.name, 120, 'Campus Student') || 'Campus Student';
    if (profileData.username) allowedUpdate.username = clampStr(profileData.username, 100, 'student') || 'student';
    if (profileData.avatar) allowedUpdate.avatar = clampStr(profileData.avatar, 1000, DEFAULT_AVATAR) || DEFAULT_AVATAR;
    if (profileData.college !== undefined) allowedUpdate.college = clampStr(profileData.college, 200);
    if (profileData.school !== undefined) allowedUpdate.school = clampStr(profileData.school, 200);
    if (profileData.country !== undefined) allowedUpdate.country = clampStr(profileData.country, 100);
    if (profileData.state !== undefined) allowedUpdate.state = clampStr(profileData.state, 100);
    if (profileData.currencyCode !== undefined) allowedUpdate.currencyCode = clampStr(profileData.currencyCode, 10);
    if (profileData.currencySymbol !== undefined) allowedUpdate.currencySymbol = clampStr(profileData.currencySymbol, 10);
    if (profileData.major !== undefined) allowedUpdate.major = clampStr(profileData.major, 120);
    if (profileData.graduationYear !== undefined) allowedUpdate.graduationYear = clampStr(profileData.graduationYear, 10);

    if (!snap.exists()) {
      const created = buildFallbackProfile(auth.currentUser, profileData);
      await setDoc(userRef, created);
      await syncCampusPeerDirectory(uid, created);
      return;
    }

    const existing = snap.data() as Record<string, any>;
    if (hasUnknownKeys(existing, ALLOWED_USER_PROFILE_KEYS) || existing.uid !== uid || typeof existing.displayName !== 'string' || !existing.displayName.length) {
      const migrated = {
        ...buildFallbackProfile(auth.currentUser, profileData),
        createdAt: clampStr(existing.createdAt, 50, new Date().toISOString().slice(0, 50)),
        karma: typeof existing.karma === 'number' ? Math.max(0, Math.min(50, existing.karma)) : 50,
      };
      await deleteDoc(userRef);
      await setDoc(userRef, migrated);
      await syncCampusPeerDirectory(uid, migrated);
      return;
    }

    await updateDoc(userRef, allowedUpdate);
    await syncCampusPeerDirectory(uid, {
      ...existing,
      ...allowedUpdate,
      displayName: allowedUpdate.displayName || existing.displayName || auth.currentUser.displayName || 'Campus Student',
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
          avatar: data.avatar || DEFAULT_AVATAR,
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
    console.warn('Error fetching registered peers:', err);
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
    where('rating', 'in', [1, 2, 3, 4, 5]),
    limit(200)
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
      if (!auth.currentUser) return;
      handleFirestoreError(error, OperationType.LIST, 'seller_reviews');
    }
  );
}


