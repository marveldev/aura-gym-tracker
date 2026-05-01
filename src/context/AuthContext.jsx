import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth"
import { auth } from "../firebase.js"

const AuthContext = createContext(null)
const GUEST_STORAGE_KEY = "aura_guest_session"

export function useAuth() {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}

	return context
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null)
	const [isGuest, setIsGuest] = useState(
		() => localStorage.getItem(GUEST_STORAGE_KEY) === "true",
	)
	const [loading, setLoading] = useState(true)

	const signup = async (email, password) => {
		setIsGuest(false)
		localStorage.removeItem(GUEST_STORAGE_KEY)
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password,
		)

		return userCredential.user
	}

	const login = async (email, password) => {
		setIsGuest(false)
		localStorage.removeItem(GUEST_STORAGE_KEY)
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password,
		)

		return userCredential.user
	}

	const continueAsGuest = () => {
		setCurrentUser(null)
		setIsGuest(true)
		localStorage.setItem(GUEST_STORAGE_KEY, "true")
	}

	const logout = async () => {
		if (auth.currentUser) {
			await signOut(auth)
		}

		setCurrentUser(null)
		setIsGuest(false)
		localStorage.removeItem(GUEST_STORAGE_KEY)
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user)
			if (user) {
				setIsGuest(false)
				localStorage.removeItem(GUEST_STORAGE_KEY)
			}
			setLoading(false)
		})

		return unsubscribe
	}, [])

	const value = useMemo(
		() => ({
			currentUser,
			isGuest,
			login,
			signup,
			continueAsGuest,
			logout,
		}),
		[currentUser, isGuest],
	)

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	)
}
