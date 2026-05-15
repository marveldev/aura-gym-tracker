import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import TrackerDashboard from "../components/TrackerDashboard.jsx"
import WorkoutList from "../components/WorkoutList.jsx"
import AnalyticsPanel from "../components/AnalyticsPanel.jsx"
import HandbookPage from "./HandbookPage.jsx"
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

const views = ["dashboard", "workout", "handbook", "history", "analytics"]
const viewPathMap = {
	dashboard: "/dashboard",
	workout: "/workout",
	handbook: "/handbook",
	history: "/history",
	analytics: "/analytics",
}

const getViewFromPathname = (pathname) => {
	if (pathname === "/workout") return "workout"
	if (pathname === "/handbook") return "handbook"
	if (pathname === "/history") return "history"
	if (pathname === "/analytics") return "analytics"
	return "dashboard"
}

const getLegacyViewRedirectPath = (pathname, search) => {
	const params = new URLSearchParams(search)
	const legacyView = params.get("view")
	if (!legacyView) return null

	if (views.includes(legacyView)) {
		return viewPathMap[legacyView] ?? "/dashboard"
	}

	return pathname || "/dashboard"
}

function DashboardPage() {
	const location = useLocation()
	const navigate = useNavigate()
	const { logout } = useAuth()
	const initialView = getViewFromPathname(location.pathname)
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
		const redirectPath = getLegacyViewRedirectPath(
			location.pathname,
			location.search,
		)
		if (
			redirectPath &&
			`${location.pathname}${location.search}` !== redirectPath
		) {
			navigate(redirectPath, { replace: true })
		}
	}, [location.pathname, location.search, navigate])

	useEffect(() => {
		const nextView = getViewFromPathname(location.pathname)
		if (nextView !== activeView) {
			setActiveView(nextView)
		}
	}, [activeView, location.pathname])

	useEffect(() => {
		if (!location.state?.openWorkoutModal) {
			return
		}

		const prefillWorkout = location.state?.prefillWorkout
		setActiveView("dashboard")
		setPrefillExerciseName((prefillWorkout?.exercise?.name || "").trim())
		setPrefillFocus((prefillWorkout?.focus || "").trim())
		setIsModalOpen(true)

		navigate("/dashboard", { replace: true, state: null })
	}, [location.state, navigate])

	const handleViewChange = (view) => {
		setActiveView(view)
		navigate(viewPathMap[view] ?? "/dashboard", { replace: true })
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

	const handleSignOut = async () => {
		await logout()
		navigate("/", { replace: true })
	}

	return (
		<div className="app-container">
			<nav className="fixed w-full top-0 z-50 transition-all duration-300 backdrop-blur-md bg-[hsl(var(--bg))]/80 border-b border-[hsl(var(--border))]/50">
				<div className="px-4 md:px-6 h-16 flex items-center justify-between">
					<Link to="/" className="flex items-center gap-3">
						<img
							src="/logo.svg"
							alt="Aura Logo"
							className="w-7 h-7 sm:w-8 sm:h-8"
						/>
						<span className="text-lg sm:text-xl font-bold tracking-tight text-[hsl(var(--fg))]">
							Aura
						</span>
					</Link>

					<div className="flex items-center gap-2 sm:gap-3">
						<button
							className="btn-secondary h-10 w-10 rounded flex items-center justify-center"
							onClick={toggleTheme}
							aria-label={
								isDarkTheme ? "Switch to light theme" : "Switch to dark theme"
							}>
							<i
								className={`ph text-lg ${isDarkTheme ? "ph-sun" : "ph-moon"}`}></i>
						</button>
						<button
							className="btn-secondary py-2 px-3 sm:px-4 text-sm rounded font-bold whitespace-nowrap"
							onClick={handleSignOut}>
							Sign Out
						</button>
					</div>
				</div>
			</nav>

			<aside className="sidebar pt-16">
				<div className="p-6">
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
													: view === "handbook"
														? "ph-book-open"
														: view === "history"
															? "ph-clock-counter-clockwise"
															: "ph-chart-line-up"
										}`}></i>
									{view.charAt(0).toUpperCase() + view.slice(1)}
								</button>
							</div>
						))}
					</nav>
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
											: view === "handbook"
												? "ph-book-open"
												: view === "history"
													? "ph-clock-counter-clockwise"
													: "ph-chart-line-up"
								}`}></i>
							<span>{view.charAt(0).toUpperCase() + view.slice(1)}</span>
						</button>
					</div>
				))}
			</nav>

			<main className="main-content pt-20 md:pt-24">
				{activeView === "dashboard" && (
					<TrackerDashboard
						workouts={workouts}
						stats={stats}
						onOpenModal={() => setIsModalOpen(true)}
						onViewHistory={() => handleViewChange("history")}
					/>
				)}
				{activeView === "workout" && null}
				{activeView === "handbook" && <HandbookPage embedded />}
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
