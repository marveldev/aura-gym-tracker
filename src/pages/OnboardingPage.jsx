import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../firebase.js"

export default function OnboardingPage() {
	const { currentUser } = useAuth()
	const navigate = useNavigate()

	const [age, setAge] = useState("")
	const [weight, setWeight] = useState("")
	const [height, setHeight] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")
	const [successMessage, setSuccessMessage] = useState("")

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")
		setSuccessMessage("")

		// Validation
		if (!age || !weight || !height) {
			setError("Please fill in all fields")
			return
		}

		if (isNaN(age) || isNaN(weight) || isNaN(height)) {
			setError("Please enter valid numbers")
			return
		}

		if (age < 13 || age > 120) {
			setError("Age must be between 13 and 120")
			return
		}

		if (weight < 20 || weight > 500) {
			setError("Weight must be between 20 and 500 kg")
			return
		}

		if (height < 100 || height > 300) {
			setError("Height must be between 100 and 300 cm")
			return
		}

		try {
			setIsLoading(true)

			// Save to Firestore
			if (currentUser && currentUser.uid) {
				const userProfileRef = doc(db, "users", currentUser.uid)
				await setDoc(
					userProfileRef,
					{
						age: parseInt(age),
						weight: parseFloat(weight),
						height: parseInt(height),
						updatedAt: new Date(),
					},
					{ merge: true },
				)
			}

			setSuccessMessage("Profile saved successfully!")
			setTimeout(() => {
				navigate("/dashboard", { replace: true })
			}, 1000)
		} catch (err) {
			console.error("Failed to save profile:", err)
			setError("Failed to save profile. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	const handleSkip = () => {
		navigate("/dashboard", { replace: true })
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="bg-slate-700 rounded-lg shadow-2xl p-8">
					{/* Header */}
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-white mb-2">
							Get Started
						</h1>
						<p className="text-slate-300 text-sm">
							Tell us about yourself so we can personalize your
							experience
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-200 text-sm">
							{error}
						</div>
					)}

					{/* Success Message */}
					{successMessage && (
						<div className="mb-4 p-3 bg-green-900/30 border border-green-500 rounded-lg text-green-200 text-sm">
							{successMessage}
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Age */}
						<div>
							<label
								htmlFor="age"
								className="block text-sm font-medium text-slate-200 mb-2"
							>
								Age (years)
							</label>
							<input
								type="number"
								id="age"
								value={age}
								onChange={(e) => setAge(e.target.value)}
								placeholder="e.g., 25"
								min="13"
								max="120"
								className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
								disabled={isLoading}
							/>
						</div>

						{/* Weight */}
						<div>
							<label
								htmlFor="weight"
								className="block text-sm font-medium text-slate-200 mb-2"
							>
								Weight (kg)
							</label>
							<input
								type="number"
								id="weight"
								value={weight}
								onChange={(e) => setWeight(e.target.value)}
								placeholder="e.g., 75"
								min="20"
								max="500"
								step="0.1"
								className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
								disabled={isLoading}
							/>
						</div>

						{/* Height */}
						<div>
							<label
								htmlFor="height"
								className="block text-sm font-medium text-slate-200 mb-2"
							>
								Height (cm)
							</label>
							<input
								type="number"
								id="height"
								value={height}
								onChange={(e) => setHeight(e.target.value)}
								placeholder="e.g., 180"
								min="100"
								max="300"
								className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
								disabled={isLoading}
							/>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg mt-6 transition-colors"
						>
							{isLoading ? "Saving..." : "Continue"}
						</button>
					</form>

					{/* Skip Link */}
					<div className="text-center mt-4">
						<button
							onClick={handleSkip}
							disabled={isLoading}
							className="text-slate-400 hover:text-slate-200 text-sm disabled:opacity-50 transition-colors"
						>
							Skip for now
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
