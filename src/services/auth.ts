import type { Auth, User } from "firebase/auth"
import {
	signInAnonymously as firebaseSignInAnonymously,
	signOut as firebaseSignOut,
} from "firebase/auth"

export async function signInAsGuest(auth: Auth): Promise<User> {
	if (auth.currentUser?.isAnonymous) {
		return auth.currentUser
	}

	if (auth.currentUser && !auth.currentUser.isAnonymous) {
		await firebaseSignOut(auth)
	}

	const userCredential = await firebaseSignInAnonymously(auth)
	return userCredential.user
}

export async function signOut(auth: Auth): Promise<void> {
	if (!auth.currentUser) {
		return
	}

	await firebaseSignOut(auth)
}
