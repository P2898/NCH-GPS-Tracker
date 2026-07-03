import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// Placeholder Firebase Config - Needs to be replaced with actual keys from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.warn('[firebaseService] Initialization error:', error);
}

/**
 * Pushes the live location of an employee to Firestore
 */
export async function updateLiveLocation(employeeId, data) {
  if (!db || !employeeId) return false;

  try {
    const docRef = doc(db, 'active_trips', employeeId);
    await setDoc(docRef, {
      ...data,
      lastUpdated: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('[firebaseService] Update location error:', error);
    return false;
  }
}

/**
 * Removes the active tracking data when the trip ends
 */
export async function removeLiveLocation(employeeId) {
  if (!db || !employeeId) return false;

  try {
    const docRef = doc(db, 'active_trips', employeeId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.warn('[firebaseService] Remove location error:', error);
    return false;
  }
}

export default { updateLiveLocation, removeLiveLocation };
