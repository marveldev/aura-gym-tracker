import ExerciseRow from "./ExerciseRow.jsx"

function WorkoutActiveScreen({ workout, onBack }) {
	const repeatCount = workout.exercises.reduce(
		(maxSets, exercise) => Math.max(maxSets, exercise.targetSets ?? 3),
		3,
	)

	return (
		<section className="mx-auto w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
			<div className="rounded-t-2xl border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-4 sm:px-5">
				<div className="flex items-center justify-between gap-3">
					<h2 className="truncate text-xl font-semibold text-[hsl(var(--fg))]">
						{workout.name}
					</h2>
					<span className="shrink-0 rounded-full bg-[hsl(var(--primary))]/15 px-3 py-1 text-sm font-semibold text-[hsl(var(--primary))]">
						Repeat {repeatCount}X
					</span>
				</div>
				<p className="mt-2 text-sm text-[hsl(var(--muted))]">
					Perform one set of each exercise in order, then rest 40 seconds and
					repeat {repeatCount} times.
				</p>
			</div>

			<div className="overflow-hidden rounded-b-2xl bg-[hsl(var(--surface))] divide-y divide-[hsl(var(--border))]">
				{workout.exercises.map((exercise) => (
					<ExerciseRow
						key={`${workout.name}-${exercise.name}`}
						exercise={exercise}
					/>
				))}
			</div>

			<div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4">
				<button
					type="button"
					onClick={onBack}
					className="btn btn-secondary w-full justify-center rounded-xl py-3">
					Back
				</button>
			</div>
		</section>
	)
}

export default WorkoutActiveScreen
