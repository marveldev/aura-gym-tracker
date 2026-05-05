import { Link, useParams } from "react-router-dom"
import { handbookExerciseData } from "../data/handbookExercises.js"

function HandbookExerciseDetailPage() {
	const { muscle, exercise } = useParams()
	const muscleKey = muscle?.toLowerCase()
	const exerciseKey = exercise?.toLowerCase()
	const muscleGroup = handbookExerciseData[muscleKey]
	const selectedExercise = muscleGroup?.exercises.find((item) => item.slug === exerciseKey)

	if (!muscleGroup || !selectedExercise) {
		return (
			<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-4xl mx-auto card p-6 sm:p-8">
					<h1 className="text-2xl sm:text-3xl font-bold mb-3">Exercise not found</h1>
					<p className="text-[hsl(var(--muted))] mb-6">
						This exercise is not available for the selected muscle group.
					</p>
					<Link
						to={`/handbook/exercises/${muscleKey || "chest"}`}
						className="btn btn-primary rounded-lg px-4 py-2">
						Back to Muscle Group
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
						{selectedExercise.name}
					</h1>
					<Link
						to={`/handbook/exercises/${muscleKey}`}
						className="btn btn-secondary rounded-lg px-4 py-2">
						Back
					</Link>
				</div>

				<div className="card p-6 sm:p-8 space-y-4">
					<p className="text-[hsl(var(--muted))] leading-relaxed">
						{selectedExercise.description}
					</p>
					<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4">
						<p className="text-sm text-[hsl(var(--primary))]">
							Target muscles: {selectedExercise.targetMuscles}
						</p>
						<p className="text-sm text-[hsl(var(--muted))] mt-2">
							Muscle group: {muscleGroup.title}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HandbookExerciseDetailPage
