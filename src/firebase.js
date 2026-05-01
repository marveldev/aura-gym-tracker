import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import {
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager,
} from "firebase/firestore"

// Your config (keep this exactly as Firebase gave you)
const firebaseConfig = {
	apiKey: "AIzaSyA_z_p-jXfLga9i3FRisZzV08-_cWS4fVc",
	authDomain: "aura-gym-tracker.firebaseapp.com",
	projectId: "aura-gym-tracker",
	storageBucket: "aura-gym-tracker.firebasestorage.app",
	messagingSenderId: "661561472645",
	appId: "1:661561472645:web:c41ba7c838f4f5dcf01bec",
	measurementId: "G-5JRR7K260Q",
}

// Initialize app
const app = initializeApp(firebaseConfig)

// 🔥 Firestore with offline support
export const db = initializeFirestore(app, {
	localCache: persistentLocalCache({
		tabManager: persistentMultipleTabManager(),
	}),
})

// 🔐 Auth
export const auth = getAuth(app)
