import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithPopup,
	signInWithEmailAndPassword,
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth } from "../firebase.js"
import { db } from "../firebase.js"
import {
	signInAsGuest as signInAsGuestHelper,
	signOut as signOutHelper,
} from "../services/auth.ts"

const AuthContext = createContext(null)

export function useAuth() {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}

	return context
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const isGuest = Boolean(currentUser?.isAnonymous)

	const signup = async (email, password) => {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password,
		)

		return userCredential.user
	}

	const login = async (email, password) => {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password,
		)

		return userCredential.user
	}

	const signInWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider()
			const userCredential = await signInWithPopup(auth, provider)

			return userCredential.user
		} catch (error) {
			console.error("Google sign-in failed", error)
			throw error
		}
	}

	const signInAnonymously = async () => {
		try {
			return await signInAsGuestHelper(auth)
		} catch (error) {
			console.error("Anonymous sign-in failed", error)
			throw error
		}
	}

	const signInAsGuest = async () => {
		try {
			return await signInAnonymously()
		} catch (error) {
			console.error("Guest sign-in failed", error)
			throw error
		}
	}

	const resetPassword = async (email) => {
		try {
			await sendPasswordResetEmail(auth, email)
			return { success: true, error: null }
		} catch (error) {
			console.error("Password reset failed", error)
			return { success: false, error }
		}
	}

	const signOut = async () => {
		await signOutHelper(auth)
		setCurrentUser(null)
	}

	const logout = signOut

	const checkProfileExists = async (uid) => {
		try {
			if (!uid) return false
			const userDocRef = doc(db, "users", uid)
			const docSnapshot = await getDoc(userDocRef)
			return docSnapshot.exists()
		} catch (error) {
			console.error("Error checking profile:", error)
			return false
		}
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user)
			setLoading(false)
		})

		return unsubscribe
	}, [])

	const value = useMemo(
		() => ({
			currentUser,
			isGuest,
			loading,
			login,
			resetPassword,
			signInAsGuest,
			signInAnonymously,
			signInWithGoogle,
			signup,
			signOut,
			logout,
			checkProfileExists,
		}),
		[currentUser, isGuest, loading],
	)

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	)
}
