import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth"
import { auth } from "../firebase.js"

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

	const logout = async () => {
		await signOut(auth)
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
			login,
			signup,
			logout,
		}),
		[currentUser],
	)

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	)
}
