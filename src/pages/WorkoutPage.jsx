import { useMemo, useState } from "react"
import ExerciseCard from "../components/ExerciseCard.jsx"
import ExerciseDetailModal from "../components/ExerciseDetailModal.jsx"
import AppPageFrame from "../components/AppPageFrame.jsx"
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
		<AppPageFrame>
			<div className="pb-24">
				<main className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-4">
					<div className="pb-2 flex items-center justify-between">
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

					<div className="space-y-4">
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
									className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/40 transition"
								/>
							</div>

							<div className="relative min-w-44">
								<select
									value={activeEquipment}
									onChange={(e) => setActiveEquipment(e.target.value)}
									className="w-full appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--fg))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/40 transition capitalize cursor-pointer">
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
							<div className="grid grid-cols-1 gap-4 animate-fade-in">
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
		</AppPageFrame>
	)
}

export default WorkoutPage
