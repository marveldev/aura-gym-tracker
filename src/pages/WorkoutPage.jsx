import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
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
	const [search, setSearch] = useState("")
	const [activeBodyPart, setActiveBodyPart] = useState("all")
	const [activeEquipment, setActiveEquipment] = useState("all")
	const [selectedExercise, setSelectedExercise] = useState(null)

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
		<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
			{/* Header */}
			<header className="sticky top-0 z-20 bg-[hsl(var(--bg))]/90 backdrop-blur-md border-b border-[hsl(var(--border))]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<Link
							to="/dashboard"
							aria-label="Back to dashboard"
							className="p-1.5 rounded-lg text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--border))]/60 transition-colors">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</Link>
						<h1 className="text-lg font-bold tracking-tight">
							Exercise Library
						</h1>
					</div>

					<span className="text-sm text-[hsl(var(--muted))] hidden sm:block">
						{filtered.length} {filtered.length === 1 ? "exercise" : "exercises"}
					</span>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
				{/* Search + equipment row */}
				<div className="flex flex-col sm:flex-row gap-3">
					{/* Search */}
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

					{/* Equipment select */}
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
				<div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide no-scrollbar">
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
