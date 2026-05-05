import { useEffect, useMemo, useState } from "react"
import {
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from "react-router-dom"
import TrackerDashboard from "../components/TrackerDashboard.jsx"
import WorkoutList from "../components/WorkoutList.jsx"
import AnalyticsPanel from "../components/AnalyticsPanel.jsx"
import WorkoutTab from "../components/WorkoutTab.jsx"
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

const views = ["dashboard", "workout", "history", "analytics"]

function DashboardPage() {
	const location = useLocation()
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const initialView = views.includes(searchParams.get("view"))
		? searchParams.get("view")
		: "dashboard"
	const [activeView, setActiveView] = useState(initialView)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [prefillExerciseName, setPrefillExerciseName] = useState("")
	const [prefillFocus, setPrefillFocus] = useState("")
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

	useEffect(() => {
		const nextView = searchParams.get("view")
		if (views.includes(nextView) && nextView !== activeView) {
			setActiveView(nextView)
			return
		}

		if (!nextView && activeView !== "dashboard") {
			setSearchParams({ view: activeView }, { replace: true })
		}
	}, [activeView, searchParams, setSearchParams])

	useEffect(() => {
		if (!location.state?.openWorkoutModal) {
			return
		}

		const prefillWorkout = location.state?.prefillWorkout
		setActiveView("dashboard")
		setPrefillExerciseName((prefillWorkout?.exercise?.name || "").trim())
		setPrefillFocus((prefillWorkout?.focus || "").trim())
		setIsModalOpen(true)

		navigate(`/dashboard?view=${activeView}`, { replace: true, state: null })
	}, [location.state, navigate])

	const handleViewChange = (view) => {
		setActiveView(view)
		if (view === "dashboard") {
			setSearchParams({}, { replace: true })
			return
		}

		setSearchParams({ view }, { replace: true })
	}

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
		setPrefillExerciseName("")
		setPrefillFocus("")
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
							<div key={view} className="flex flex-col gap-2">
								<button
									className={`nav-link ${activeView === view ? "active" : ""}`}
									onClick={() => handleViewChange(view)}>
									<i
										className={`ph text-xl ${
											view === "dashboard"
												? "ph-squares-four"
												: view === "workout"
													? "ph-barbell"
													: view === "history"
														? "ph-clock-counter-clockwise"
														: "ph-chart-line-up"
										}`}></i>
									{view.charAt(0).toUpperCase() + view.slice(1)}
								</button>
								{view === "dashboard" && (
									<Link to="/handbook" className="nav-link">
										<i className="ph ph-book-open text-xl"></i>
										Handbook
									</Link>
								)}
							</div>
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
					<div key={view} className="contents">
						<button
							className={`mobile-link ${activeView === view ? "active" : ""}`}
							onClick={() => handleViewChange(view)}>
							<i
								className={`ph text-2xl ${
									view === "dashboard"
										? "ph-squares-four"
										: view === "workout"
											? "ph-barbell"
											: view === "history"
												? "ph-clock-counter-clockwise"
												: "ph-chart-line-up"
								}`}></i>
							<span>{view.charAt(0).toUpperCase() + view.slice(1)}</span>
						</button>
						{view === "dashboard" && (
							<Link to="/handbook" className="mobile-link">
								<i className="ph ph-book-open text-2xl"></i>
								<span>Handbook</span>
							</Link>
						)}
					</div>
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
						onViewHistory={() => handleViewChange("history")}
					/>
				)}

				{activeView === "workout" && (
					<WorkoutTab onCompleteWorkout={handleSaveWorkout} />
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
				onClose={() => {
					setIsModalOpen(false)
					setPrefillExerciseName("")
					setPrefillFocus("")
				}}
				onSave={handleSaveWorkout}
				onError={(message) => showToast(message, "error")}
				initialExerciseName={prefillExerciseName}
				initialFocus={prefillFocus}
			/>

			<ToastContainer toasts={toasts} />
		</div>
	)
}

export default DashboardPage
