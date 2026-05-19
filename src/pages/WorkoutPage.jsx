import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import ExerciseCard from "../components/ExerciseCard.jsx"
import ExerciseDetailModal from "../components/ExerciseDetailModal.jsx"
import workoutExerciseData from "../data/workoutExerciseData.js"

const ALL_EXERCISES = workoutExerciseData.data ?? []

const ALL_BODY_PARTS = [
	"all",
	...Array.from(
		new Set(ALL_EXERCISES.flatMap((e) => e.bodyParts ?? [])),
	).sort(),
]

const ALL_EQUIPMENTS = [
	"all",
	...Array.from(
		new Set(ALL_EXERCISES.flatMap((e) => e.equipments ?? [])),
	).sort(),
]

const views = ["dashboard", "workout", "handbook", "history", "analytics"]
const viewPathMap = {
	dashboard: "/dashboard",
	workout: "/workout",
	handbook: "/handbook",
	history: "/history",
	analytics: "/analytics",
}
const viewIcons = {
	dashboard: "ph-squares-four",
	workout: "ph-barbell",
	handbook: "ph-book-open",
	history: "ph-clock-counter-clockwise",
	analytics: "ph-chart-line-up",
}

const BODY_PART_LABELS = {
	all: "All",
	back: "Back",
	cardio: "Cardio",
	chest: "Chest",
	"lower legs": "Lower Legs",
	shoulders: "Shoulders",
	"upper arms": "Upper Arms",
	"upper legs": "Upper Legs",
	waist: "Waist",
}

function WorkoutPage() {
	const navigate = useNavigate()
	const { logout } = useAuth()
	const [search, setSearch] = useState("")
	const [activeBodyPart, setActiveBodyPart] = useState("all")
	const [activeEquipment, setActiveEquipment] = useState("all")
	const [selectedExercise, setSelectedExercise] = useState(null)
	const [isDarkTheme, setIsDarkTheme] = useState(true)

	useEffect(() => {
		const savedTheme = localStorage.getItem("aura_theme") || "dark"
		const dark = savedTheme === "dark"
		setIsDarkTheme(dark)
		document.documentElement.classList.toggle("dark", dark)
	}, [])

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

	const handleNavChange = (view) => {
		navigate(viewPathMap[view] ?? "/dashboard", { replace: true })
	}

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase()
		return ALL_EXERCISES.filter((ex) => {
			const matchesSearch =
				q === "" ||
				ex.name.toLowerCase().includes(q) ||
				(ex.targetMuscles ?? []).some((m) => m.toLowerCase().includes(q)) ||
				(ex.secondaryMuscles ?? []).some((m) => m.toLowerCase().includes(q))

			const matchesBodyPart =
				activeBodyPart === "all" ||
				(ex.bodyParts ?? []).includes(activeBodyPart)

			const matchesEquipment =
				activeEquipment === "all" ||
				(ex.equipments ?? []).includes(activeEquipment)

			return matchesSearch && matchesBodyPart && matchesEquipment
		})
	}, [search, activeBodyPart, activeEquipment])

	const clearFilters = () => {
		setSearch("")
		setActiveBodyPart("all")
		setActiveEquipment("all")
	}

	const hasActiveFilters =
		search !== "" || activeBodyPart !== "all" || activeEquipment !== "all"

	return (
		<div className="app-container">
			{/* ── Top nav ── */}
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
								className={`ph text-lg ${isDarkTheme ? "ph-sun" : "ph-moon"}`}
							/>
						</button>
						<button
							className="btn-secondary py-2 px-3 sm:px-4 text-sm rounded font-bold whitespace-nowrap"
							onClick={handleSignOut}>
							Sign Out
						</button>
					</div>
				</div>
			</nav>

			{/* ── Desktop sidebar ── */}
			<aside className="sidebar pt-16">
				<div className="p-6">
					<nav className="flex flex-col gap-2">
						{views.map((view) => (
							<button
								key={view}
								className={`nav-link ${view === "workout" ? "active" : ""}`}
								onClick={() => handleNavChange(view)}>
								<i className={`ph text-xl ${viewIcons[view]}`} />
								{view.charAt(0).toUpperCase() + view.slice(1)}
							</button>
						))}
					</nav>
				</div>
			</aside>

			{/* ── Mobile bottom nav ── */}
			<nav className="mobile-nav">
				{views.map((view) => (
					<button
						key={view}
						className={`mobile-link ${view === "workout" ? "active" : ""}`}
						onClick={() => handleNavChange(view)}>
						<i className={`ph text-2xl ${viewIcons[view]}`} />
						<span>{view.charAt(0).toUpperCase() + view.slice(1)}</span>
					</button>
				))}
			</nav>

			{/* ── Page content ── */}
			<main className="main-content pt-20 md:pt-24">
				{/* Page heading */}
				<div className="px-4 sm:px-6 lg:px-8 pb-2 flex items-center justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
							Exercise Library
						</h1>
						<p className="text-sm text-[hsl(var(--muted))] mt-0.5">
							{filtered.length}{" "}
							{filtered.length === 1 ? "exercise" : "exercises"} available
						</p>
					</div>
				</div>

				<div className="px-4 sm:px-6 lg:px-8 py-4 space-y-4">
					{/* Search + equipment row */}
					<div className="flex flex-col sm:flex-row gap-3">
						<div className="relative flex-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted))] pointer-events-none"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<input
								type="search"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search exercises or muscles…"
								className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50 transition"
							/>
						</div>

						<div className="relative min-w-44">
							<select
								value={activeEquipment}
								onChange={(e) => setActiveEquipment(e.target.value)}
								className="w-full appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--fg))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50 transition capitalize cursor-pointer">
								{ALL_EQUIPMENTS.map((eq) => (
									<option key={eq} value={eq} className="capitalize">
										{eq === "all" ? "All Equipment" : eq}
									</option>
								))}
							</select>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted))] pointer-events-none"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					</div>

					{/* Body part filter chips */}
					<div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
						{ALL_BODY_PARTS.map((bp) => (
							<button
								key={bp}
								type="button"
								onClick={() => setActiveBodyPart(bp)}
								className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]
									${
										activeBodyPart === bp
											? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))] shadow-sm"
											: "bg-[hsl(var(--surface))] border border-[hsl(var(--border))] text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] hover:border-[hsl(var(--primary))]/40"
									}`}>
								{BODY_PART_LABELS[bp] ?? bp}
							</button>
						))}
					</div>

					{/* Active filter summary + clear */}
					{hasActiveFilters && (
						<div className="flex items-center justify-between text-sm">
							<p className="text-[hsl(var(--muted))]">
								Showing{" "}
								<span className="text-[hsl(var(--fg))] font-semibold">
									{filtered.length}
								</span>{" "}
								{filtered.length === 1 ? "result" : "results"}
							</p>
							<button
								type="button"
								onClick={clearFilters}
								className="text-[hsl(var(--primary))] hover:underline font-medium">
								Clear filters
							</button>
						</div>
					)}

					{/* Grid */}
					{filtered.length > 0 ? (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
							{filtered.map((exercise) => (
								<ExerciseCard
									key={exercise.exerciseId}
									exercise={exercise}
									onClick={setSelectedExercise}
								/>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-24 text-center gap-4">
							<div className="w-16 h-16 rounded-2xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))] flex items-center justify-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-8 h-8 text-[hsl(var(--muted))]"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={1.5}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-lg font-semibold">No exercises found</p>
								<p className="text-[hsl(var(--muted))] text-sm mt-1">
									Try adjusting your search or filters.
								</p>
							</div>
							<button
								type="button"
								onClick={clearFilters}
								className="px-4 py-2 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))] text-sm font-medium hover:bg-[hsl(var(--primary-hover))] transition-colors">
								Clear all filters
							</button>
						</div>
					)}
				</div>
			</main>

			{/* Detail modal */}
			{selectedExercise && (
				<ExerciseDetailModal
					exercise={selectedExercise}
					onClose={() => setSelectedExercise(null)}
				/>
			)}
		</div>
	)
}

export default WorkoutPage
