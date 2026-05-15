import { useState } from "react"
import AppPageFrame from "../components/AppPageFrame.jsx"
import WorkoutTab from "../components/WorkoutTab.jsx"
import ToastContainer from "../components/ToastContainer.jsx"
import { addWorkout } from "../services/workoutStorage.js"

function WorkoutPage() {
	const [toasts, setToasts] = useState([])

	const showToast = (message, type = "success") => {
		const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
		setToasts((current) => [...current, { id, message, type }])

		window.setTimeout(() => {
			setToasts((current) => current.filter((toast) => toast.id !== id))
		}, 4000)
	}

	const handleSaveWorkout = (workout) => {
		addWorkout(workout)
		showToast("Session logged successfully!")
	}

	return (
		<AppPageFrame>
			<div className="px-4 sm:px-6 lg:px-8 py-4">
				<div className="max-w-5xl mx-auto space-y-6">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
						Workout
					</h1>
					<WorkoutTab onCompleteWorkout={handleSaveWorkout} />
				</div>
			</div>
			<ToastContainer toasts={toasts} />
		</AppPageFrame>
	)
}

export default WorkoutPage
