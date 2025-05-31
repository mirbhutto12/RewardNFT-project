import { initializeApp, getApps } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyACbBU_3yKc1qAKy3T5ojiw7fDXUHtFT8c",
  authDomain: "rewardnft-e01fc.firebaseapp.com",
  projectId: "rewardnft-e01fc",
  storageBucket: "rewardnft-e01fc.firebasestorage.app",
  messagingSenderId: "409092989228",
  appId: "1:409092989228:web:53bce726cc6dc636d50c89",
  measurementId: "G-BJYGSX014K",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Auth
export const auth = getAuth(app)

// Initialize Storage
export const storage = getStorage(app)

// Connect to emulator in development
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  try {
    connectFirestoreEmulator(db, "localhost", 8080)
  } catch (error) {
    // Emulator already connected
  }
}

export default app
