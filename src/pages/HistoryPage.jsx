import { useEffect, useState } from "react"
import AppPageFrame from "../components/AppPageFrame.jsx"
import WorkoutList from "../components/WorkoutList.jsx"
import WorkoutModal from "../components/WorkoutModal.jsx"
import ToastContainer from "../components/ToastContainer.jsx"
import { initMockDataIfEmpty } from "../data/mockData.js"
import {
	addWorkout,
	deleteWorkout,
	getWorkouts,
} from "../services/workoutStorage.js"

function HistoryPage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [workouts, setWorkouts] = useState([])
	const [toasts, setToasts] = useState([])

	useEffect(() => {
		initMockDataIfEmpty()
		setWorkouts(getWorkouts())
	}, [])

	const showToast = (message, type = "success") => {
		const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
		setToasts((current) => [...current, { id, message, type }])

		window.setTimeout(() => {
			setToasts((current) => current.filter((toast) => toast.id !== id))
		}, 4000)
	}

	const refreshWorkouts = () => {
		setWorkouts(getWorkouts())
	}

	const handleSaveWorkout = (workout) => {
		addWorkout(workout)
		refreshWorkouts()
		showToast("Session logged successfully!")
		setIsModalOpen(false)
	}

	const handleDeleteWorkout = (id) => {
		if (!window.confirm("Are you sure you want to delete this session?")) {
			return
		}

		deleteWorkout(id)
		refreshWorkouts()
		showToast("Workout deleted successfully.")
	}

	return (
		<AppPageFrame>
			<div className="px-4 sm:px-6 lg:px-8 py-4">
				<div className="max-w-5xl mx-auto space-y-6">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
						History
					</h1>
					<WorkoutList
						workouts={workouts}
						onOpenModal={() => setIsModalOpen(true)}
						onDeleteWorkout={handleDeleteWorkout}
					/>
				</div>
			</div>

			<WorkoutModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSaveWorkout}
				onError={(message) => showToast(message, "error")}
			/>

			<ToastContainer toasts={toasts} />
		</AppPageFrame>
	)
}

export default HistoryPage
