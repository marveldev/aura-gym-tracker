import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import TrackerDashboard from "../components/TrackerDashboard.jsx"
import WorkoutList from "../components/WorkoutList.jsx"
import AnalyticsPanel from "../components/AnalyticsPanel.jsx"
import WorkoutModal from "../components/WorkoutModal.jsx"
import ToastContainer from "../components/ToastContainer.jsx"
import { initMockDataIfEmpty } from "../data/mockData.js"
import {
	addWorkout,
	calculateStats,
	deleteWorkout,
	getExerciseHistory,
	getUniqueExercises,
	getWorkouts,
} from "../services/workoutStorage.js"

const views = ["dashboard", "history", "analytics"]

function DashboardPage() {
	const [activeView, setActiveView] = useState("dashboard")
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [workouts, setWorkouts] = useState([])
	const [selectedExercise, setSelectedExercise] = useState("")
	const [isDarkTheme, setIsDarkTheme] = useState(true)
	const [toasts, setToasts] = useState([])

	useEffect(() => {
		initMockDataIfEmpty()
		setWorkouts(getWorkouts())

		const savedTheme = localStorage.getItem("aura_theme") || "dark"
		const dark = savedTheme === "dark"
		setIsDarkTheme(dark)
		document.documentElement.classList.toggle("dark", dark)
	}, [])

	useEffect(() => {
		const unique = getUniqueExercises()
		if (!unique.length) {
			setSelectedExercise("")
			return
		}

		if (!selectedExercise || !unique.includes(selectedExercise)) {
			setSelectedExercise(unique[0])
		}
	}, [workouts, selectedExercise])

	useEffect(() => {
		const onEscape = (event) => {
			if (event.key === "Escape") {
				setIsModalOpen(false)
			}
		}

		document.addEventListener("keydown", onEscape)
		return () => document.removeEventListener("keydown", onEscape)
	}, [])

	const stats = useMemo(() => calculateStats(workouts), [workouts])
	const uniqueExercises = useMemo(
		() => getUniqueExercises(workouts),
		[workouts],
	)
	const exerciseHistory = useMemo(
		() =>
			selectedExercise ? getExerciseHistory(selectedExercise, workouts) : [],
		[selectedExercise, workouts],
	)

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

	const toggleTheme = () => {
		const nextDark = !isDarkTheme
		setIsDarkTheme(nextDark)
		document.documentElement.classList.toggle("dark", nextDark)
		localStorage.setItem("aura_theme", nextDark ? "dark" : "light")
	}

	return (
		<div className="app-container">
			<aside className="sidebar">
				<div className="p-6">
					<Link to="/" className="flex items-center gap-3 mb-12">
						<img src="/logo.svg" alt="Aura Logo" className="w-8 h-8" />
						<span className="text-xl font-bold tracking-tight text-[hsl(var(--fg))]">
							Aura
						</span>
					</Link>

					<nav className="flex flex-col gap-2">
						{views.map((view) => (
							<button
								key={view}
								className={`nav-link ${activeView === view ? "active" : ""}`}
								onClick={() => setActiveView(view)}>
								<i
									className={`ph text-xl ${
										view === "dashboard"
											? "ph-squares-four"
											: view === "history"
												? "ph-clock-counter-clockwise"
												: "ph-chart-line-up"
									}`}></i>
								{view.charAt(0).toUpperCase() + view.slice(1)}
							</button>
						))}
					</nav>
				</div>

				<div className="p-6 border-t border-[hsl(var(--border))]">
					<button
						className="nav-link w-full justify-between"
						onClick={toggleTheme}>
						<span className="flex items-center gap-3">
							<i
								className={`ph text-xl ${isDarkTheme ? "ph-sun" : "ph-moon"}`}></i>
							Theme
						</span>
					</button>
				</div>
			</aside>

			<nav className="mobile-nav">
				{views.map((view) => (
					<button
						key={view}
						className={`mobile-link ${activeView === view ? "active" : ""}`}
						onClick={() => setActiveView(view)}>
						<i
							className={`ph text-2xl ${
								view === "dashboard"
									? "ph-squares-four"
									: view === "history"
										? "ph-clock-counter-clockwise"
										: "ph-chart-line-up"
							}`}></i>
						<span>{view.charAt(0).toUpperCase() + view.slice(1)}</span>
					</button>
				))}
				<button className="mobile-link" onClick={toggleTheme}>
					<i
						className={`ph text-2xl ${isDarkTheme ? "ph-sun" : "ph-moon"}`}></i>
					<span>Theme</span>
				</button>
			</nav>

			<main className="main-content">
				{activeView === "dashboard" && (
					<TrackerDashboard
						workouts={workouts}
						stats={stats}
						onOpenModal={() => setIsModalOpen(true)}
						onViewHistory={() => setActiveView("history")}
					/>
				)}

				{activeView === "history" && (
					<WorkoutList
						workouts={workouts}
						onOpenModal={() => setIsModalOpen(true)}
						onDeleteWorkout={handleDeleteWorkout}
					/>
				)}

				{activeView === "analytics" && (
					<AnalyticsPanel
						exercises={uniqueExercises}
						selectedExercise={selectedExercise}
						onSelectExercise={setSelectedExercise}
						history={exerciseHistory}
						isDarkTheme={isDarkTheme}
					/>
				)}
			</main>

			<WorkoutModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSaveWorkout}
				onError={(message) => showToast(message, "error")}
			/>

			<ToastContainer toasts={toasts} />
		</div>
	)
}

export default DashboardPage
