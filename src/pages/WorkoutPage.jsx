import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import WorkoutModal from "../components/WorkoutModal.jsx"
import { addWorkout } from "../services/workoutStorage.js"

function WorkoutPage() {
	const location = useLocation()
	const navigate = useNavigate()
	const [error, setError] = useState("")

	const prefillWorkout = location.state?.prefillWorkout
	const initialExerciseName = (prefillWorkout?.exercise?.name || "").trim()
	const initialFocus = (prefillWorkout?.focus || "").trim()

	const handleClose = () => {
		navigate("/dashboard", { replace: true })
	}

	const handleSave = (workout) => {
		addWorkout(workout)
		navigate("/dashboard", { replace: true })
	}

	return (
		<div className="min-h-screen bg-[hsl(var(--bg))]">
			{error && (
				<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] rounded-lg border border-[hsl(var(--danger))]/40 bg-[hsl(var(--surface))] px-4 py-2 text-sm text-[hsl(var(--danger))]">
					{error}
				</div>
			)}
			<WorkoutModal
				isOpen={true}
				onClose={handleClose}
				onSave={handleSave}
				onError={setError}
				initialExerciseName={initialExerciseName}
				initialFocus={initialFocus}
			/>
		</div>
	)
}

export default WorkoutPage
