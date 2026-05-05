import { Link, useParams } from "react-router-dom"
import { handbookExerciseData } from "../data/handbookExercises.js"

function HandbookExerciseMusclePage() {
	const { muscle } = useParams()
	const muscleKey = muscle?.toLowerCase()
	const current = handbookExerciseData[muscleKey]

	if (!current) {
		return (
			<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-4xl mx-auto card p-6 sm:p-8">
					<h1 className="text-2xl sm:text-3xl font-bold mb-3">Muscle group not found</h1>
					<p className="text-[hsl(var(--muted))] mb-6">
						This muscle group is not available.
					</p>
					<Link to="/handbook/exercises" className="btn btn-primary rounded-lg px-4 py-2">
						Back to Exercises
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{current.title}</h1>
					<Link to="/handbook/exercises" className="btn btn-secondary rounded-lg px-4 py-2">
						Back
					</Link>
				</div>

				<div className="card p-6 sm:p-8">
					<p className="text-[hsl(var(--muted))] leading-relaxed mb-4">
						Common exercises for {current.title.toLowerCase()} training:
					</p>
					<div className="space-y-3">
						{current.exercises.map((exercise) => (
							<Link
								key={exercise.slug}
								to={`/handbook/exercises/${muscleKey}/${exercise.slug}`}
								className="block rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4 transition-colors hover:border-[hsl(var(--primary))]/45">
								<div className="flex items-center justify-between gap-3">
									<h2 className="font-semibold text-lg">{exercise.name}</h2>
									<i className="ph ph-caret-right text-lg text-[hsl(var(--muted))]" aria-hidden="true"></i>
								</div>
								<p className="text-[hsl(var(--muted))] mt-1">{exercise.description}</p>
								<p className="text-sm text-[hsl(var(--primary))] mt-2">
									Target muscles: {exercise.targetMuscles}
								</p>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default HandbookExerciseMusclePage
