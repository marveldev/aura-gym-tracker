import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const AUTH_TAB_STORAGE_KEY = "aura_auth_tab"

const getAuthErrorMessage = (errorCode) => {
	switch (errorCode) {
		case "auth/invalid-email":
			return "Please enter a valid email address."
		case "auth/user-not-found":
		case "auth/invalid-credential":
			return "Invalid email or password."
		case "auth/wrong-password":
			return "Invalid email or password."
		case "auth/email-already-in-use":
			return "An account with this email already exists."
		case "auth/weak-password":
			return "Password should be at least 6 characters long."
		case "auth/too-many-requests":
			return "Too many attempts. Please try again later."
		case "auth/popup-closed-by-user":
			return "Google sign-in was canceled."
		case "auth/popup-blocked":
			return "Popup blocked by browser. Please allow popups and try again."
		default:
			return "Something went wrong. Please try again."
	}
}

function AuthPage() {
	const [mode, setMode] = useState(() => {
		const savedMode = localStorage.getItem(AUTH_TAB_STORAGE_KEY)
		return savedMode === "signup" ? "signup" : "signin"
	}) // "signin" | "signup"
	const [isDarkTheme, setIsDarkTheme] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")
	const [successMessage, setSuccessMessage] = useState("")

	// Sign-in fields
	const [signInEmail, setSignInEmail] = useState("")
	const [signInPassword, setSignInPassword] = useState("")
	const [showSignInPassword, setShowSignInPassword] = useState(false)

	// Sign-up fields
	const [signUpEmail, setSignUpEmail] = useState("")
	const [signUpPassword, setSignUpPassword] = useState("")
	const [signUpConfirm, setSignUpConfirm] = useState("")
	const [showSignUpPassword, setShowSignUpPassword] = useState(false)

	const {
		currentUser,
		isGuest,
		login,
		resetPassword,
		signInAsGuest,
		signup,
		signInWithGoogle,
		checkProfileExists,
	} = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		const savedTheme = localStorage.getItem("aura_theme") || "dark"
		const dark = savedTheme === "dark"
		setIsDarkTheme(dark)
		document.documentElement.classList.toggle("dark", dark)
	}, [])

	useEffect(() => {
		if (currentUser || isGuest) {
			navigate("/dashboard", { replace: true })
		}
	}, [currentUser, isGuest, navigate])

	const handleContinueAsGuest = async () => {
		setError("")
		setSuccessMessage("")

		try {
			setIsLoading(true)
			await signInAsGuest()
			// Guests always go to dashboard directly
			navigate("/dashboard", { replace: true })
		} catch (authError) {
			setError(getAuthErrorMessage(authError.code))
		} finally {
			setIsLoading(false)
		}
	}

	const handleGoogleSignIn = async () => {
		setError("")
		setSuccessMessage("")

		try {
			setIsLoading(true)
			const user = await signInWithGoogle()
			const profileExists = await checkProfileExists(user.uid)
			if (profileExists) {
				navigate("/dashboard", { replace: true })
			} else {
				navigate("/onboarding", { replace: true })
			}
		} catch (authError) {
			setError(getAuthErrorMessage(authError.code))
		} finally {
			setIsLoading(false)
		}
	}

	const toggleTheme = () => {
		const nextDark = !isDarkTheme
		setIsDarkTheme(nextDark)
		document.documentElement.classList.toggle("dark", nextDark)
		localStorage.setItem("aura_theme", nextDark ? "dark" : "light")
	}

	const switchMode = (next) => {
		setMode(next)
		localStorage.setItem(AUTH_TAB_STORAGE_KEY, next)
		setError("")
		setSuccessMessage("")
	}

	const handleForgotPassword = async () => {
		setError("")
		setSuccessMessage("")

		if (!signInEmail) {
			setError("Please enter your email address first.")
			return
		}

		const result = await resetPassword(signInEmail)

		if (result.success) {
			setSuccessMessage("Password reset email sent. Please check your inbox.")
			return
		}

		setError(getAuthErrorMessage(result.error?.code))
	}

	const handleSignIn = async (e) => {
		e.preventDefault()
		setError("")
		setSuccessMessage("")
		if (!signInEmail || !signInPassword) {
			setError("Please fill in all fields.")
			return
		}

		try {
			setIsLoading(true)
			const user = await login(signInEmail, signInPassword)
			const profileExists = await checkProfileExists(user.uid)
			if (profileExists) {
				navigate("/dashboard", { replace: true })
			} else {
				navigate("/onboarding", { replace: true })
			}
		} catch (authError) {
			setError(getAuthErrorMessage(authError.code))
		} finally {
			setIsLoading(false)
		}
	}

	const handleSignUp = async (e) => {
		e.preventDefault()
		setError("")
		setSuccessMessage("")
		if (!signUpEmail || !signUpPassword || !signUpConfirm) {
			setError("Please fill in all fields.")
			return
		}
		if (signUpPassword !== signUpConfirm) {
			setError("Passwords do not match.")
			return
		}
		if (signUpPassword.length < 8) {
			setError("Password must be at least 8 characters.")
			return
		}

		try {
			setIsLoading(true)
			const user = await signup(signUpEmail, signUpPassword)
			// New sign-ups always go to onboarding first
			navigate("/onboarding", { replace: true })
		} catch (authError) {
			setError(getAuthErrorMessage(authError.code))
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-[hsl(var(--bg))] flex flex-col selection:bg-[hsl(var(--primary))] selection:text-white">
			{/* Nav */}
			<nav className="w-full border-b border-[hsl(var(--border))]/50 bg-[hsl(var(--bg))]/80 backdrop-blur-md">
				<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
					<Link to="/" className="flex items-center gap-3">
						<img src="/logo.svg" alt="Aura Logo" className="w-7 h-7" />
						<span className="text-lg font-bold tracking-tight text-[hsl(var(--fg))]">
							Aura
						</span>
					</Link>
					<button
						className="btn-secondary py-2 px-3 text-sm rounded-lg"
						onClick={toggleTheme}>
						<i className={`ph ${isDarkTheme ? "ph-sun" : "ph-moon"}`}></i>
					</button>
				</div>
			</nav>

			{/* Main */}
			<div className="flex flex-1 items-center justify-center px-4 py-12">
				{/* Glow */}
				<div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[hsl(var(--primary))]/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

				<div className="w-full max-w-md animate-slide-up">
					{/* Tab switcher */}
					<div className="flex bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-xl p-1 mb-8">
						<button
							onClick={() => switchMode("signin")}
							className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
								mode === "signin"
									? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))] shadow-md"
									: "text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]"
							}`}>
							Sign In
						</button>
						<button
							onClick={() => switchMode("signup")}
							className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
								mode === "signup"
									? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))] shadow-md"
									: "text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]"
							}`}>
							Create Account
						</button>
					</div>

					{/* Card */}
					<div className="card p-8">
						<div className="mb-8">
							<h1 className="text-2xl font-bold text-[hsl(var(--fg))]">
								{mode === "signin" ? "Welcome back." : "Start your journey."}
							</h1>
							<p className="text-[hsl(var(--muted))] text-sm mt-1">
								{mode === "signin"
									? "Sign in to access your dashboard."
									: "Create a free account to start tracking."}
							</p>
						</div>

						{/* Error banner */}
						{error && (
							<div className="flex items-center gap-3 bg-[hsl(var(--danger))]/10 border border-[hsl(var(--danger))]/30 text-[hsl(var(--danger))] text-sm rounded-lg px-4 py-3 mb-6">
								<i className="ph ph-warning-circle text-lg shrink-0"></i>
								{error}
							</div>
						)}

						{successMessage && (
							<div className="flex items-center gap-3 bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/30 text-[hsl(var(--success))] text-sm rounded-lg px-4 py-3 mb-6">
								<i className="ph ph-check-circle text-lg shrink-0"></i>
								{successMessage}
							</div>
						)}

						{/* ── Sign In Form ── */}
						{mode === "signin" && (
							<form onSubmit={handleSignIn} className="space-y-5">
								<div>
									<label className="label">Email address</label>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted))]">
											<i className="ph ph-envelope text-base"></i>
										</span>
										<input
											type="email"
											placeholder="you@example.com"
											className="input-field pl-9"
											required
											value={signInEmail}
											onChange={(e) => setSignInEmail(e.target.value)}
										/>
									</div>
								</div>

								<div>
									<div className="flex justify-between items-center mb-1.5">
										<label className="label mb-0">Password</label>
										<button
											type="button"
											onClick={handleForgotPassword}
											className="text-xs text-[hsl(var(--primary))] hover:underline">
											Forgot password?
										</button>
									</div>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted))]">
											<i className="ph ph-lock-key text-base"></i>
										</span>
										<input
											type={showSignInPassword ? "text" : "password"}
											placeholder="••••••••"
											className="input-field pl-9 pr-10"
											required
											value={signInPassword}
											onChange={(e) => setSignInPassword(e.target.value)}
										/>
										<button
											type="button"
											className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] transition-colors"
											onClick={() => setShowSignInPassword((v) => !v)}>
											<i
												className={`ph text-base ${showSignInPassword ? "ph-eye-slash" : "ph-eye"}`}></i>
										</button>
									</div>
								</div>

								<button
									type="submit"
									disabled={isLoading}
									className="btn btn-primary w-full py-3 mt-2 rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
									{isLoading ? (
										<span className="flex items-center justify-center gap-2">
											<i className="ph ph-spinner-gap animate-spin text-lg"></i>
											Signing in…
										</span>
									) : (
										<span className="flex items-center justify-center gap-2">
											Sign In
											<i className="ph ph-arrow-right text-base"></i>
										</span>
									)}
								</button>
							</form>
						)}

						{/* ── Sign Up Form ── */}
						{mode === "signup" && (
							<form onSubmit={handleSignUp} className="space-y-5">
								<div>
									<label className="label">Email address</label>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted))]">
											<i className="ph ph-envelope text-base"></i>
										</span>
										<input
											type="email"
											placeholder="you@example.com"
											className="input-field pl-9"
											required
											value={signUpEmail}
											onChange={(e) => setSignUpEmail(e.target.value)}
										/>
									</div>
								</div>

								<div>
									<label className="label">Password</label>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted))]">
											<i className="ph ph-lock-key text-base"></i>
										</span>
										<input
											type={showSignUpPassword ? "text" : "password"}
											placeholder="Min. 8 characters"
											className="input-field pl-9 pr-10"
											required
											value={signUpPassword}
											onChange={(e) => setSignUpPassword(e.target.value)}
										/>
										<button
											type="button"
											className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] transition-colors"
											onClick={() => setShowSignUpPassword((v) => !v)}>
											<i
												className={`ph text-base ${showSignUpPassword ? "ph-eye-slash" : "ph-eye"}`}></i>
										</button>
									</div>
								</div>

								<div>
									<label className="label">Confirm password</label>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted))]">
											<i className="ph ph-lock-key text-base"></i>
										</span>
										<input
											type={showSignUpPassword ? "text" : "password"}
											placeholder="Re-enter password"
											className="input-field pl-9"
											required
											value={signUpConfirm}
											onChange={(e) => setSignUpConfirm(e.target.value)}
										/>
									</div>
								</div>

								<button
									type="submit"
									disabled={isLoading}
									className="btn btn-primary w-full py-3 mt-2 rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
									{isLoading ? (
										<span className="flex items-center justify-center gap-2">
											<i className="ph ph-spinner-gap animate-spin text-lg"></i>
											Creating account…
										</span>
									) : (
										<span className="flex items-center justify-center gap-2">
											Create Account
											<i className="ph ph-arrow-right text-base"></i>
										</span>
									)}
								</button>

								<p className="text-xs text-center text-[hsl(var(--muted))] pt-1">
									By creating an account you agree to our{" "}
									<span className="text-[hsl(var(--primary))] cursor-pointer hover:underline">
										Terms of Service
									</span>
									.
								</p>
							</form>
						)}

						{/* Secondary auth options */}
						<div className="w-full max-w-sm mx-auto mt-6">
							<div className="flex items-center gap-4 mb-4">
								<div className="flex-1 h-px bg-[hsl(var(--border))]"></div>
								<span className="text-xs text-[hsl(var(--muted))] font-medium whitespace-nowrap">
									or
								</span>
								<div className="flex-1 h-px bg-[hsl(var(--border))]"></div>
							</div>

							<div className="flex flex-col items-center space-y-3">
								<button
									type="button"
									onClick={handleGoogleSignIn}
									disabled={isLoading}
									className="btn btn-secondary w-full justify-center py-2.5 rounded-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed">
									<svg
										className="w-4 h-4"
										viewBox="0 0 24 24"
										fill="currentColor">
										<path
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											fill="#4285F4"
										/>
										<path
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											fill="#34A853"
										/>
										<path
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											fill="#FBBC05"
										/>
										<path
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											fill="#EA4335"
										/>
									</svg>
									{isLoading ? "Please wait..." : "Continue with Google"}
								</button>
								<button
									type="button"
									onClick={handleContinueAsGuest}
									disabled={isLoading}
									className="btn btn-secondary w-full justify-center py-2.5 rounded-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed">
									<i className="ph ph-user-circle text-base"></i>
									Continue as Guest
								</button>
							</div>
						</div>
					</div>

					{/* Footer switch link */}
					<p className="text-center text-sm text-[hsl(var(--muted))] mt-6">
						{mode === "signin" ? (
							<>
								Don't have an account?{" "}
								<button
									onClick={() => switchMode("signup")}
									className="text-[hsl(var(--primary))] font-medium hover:underline">
									Create one
								</button>
							</>
						) : (
							<>
								Already have an account?{" "}
								<button
									onClick={() => switchMode("signin")}
									className="text-[hsl(var(--primary))] font-medium hover:underline">
									Sign in
								</button>
							</>
						)}
					</p>
				</div>
			</div>
		</div>
	)
}

export default AuthPage
