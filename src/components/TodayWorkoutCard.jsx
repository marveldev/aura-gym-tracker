import ExerciseApiImage from "./ExerciseApiImage.jsx"

function TodayWorkoutCard({ workout, onStart }) {
	return (
		<div className="card p-6 sm:p-7 space-y-4">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-sm uppercase tracking-[0.18em] text-[hsl(var(--muted))]">
						Today
					</p>
					<h2 className="text-2xl font-semibold text-[hsl(var(--fg))] mt-2">
						{workout.name}
					</h2>
				</div>
				<span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/70 px-3 py-1 text-sm text-[hsl(var(--muted))]">
					{workout.exercises.length} exercises
				</span>
			</div>

			<p className="text-[hsl(var(--muted))]">
				Your planned session is ready. Review the exercises below and start when
				you are ready.
			</p>

			<div className="space-y-2">
				{workout.exercises.map((exercise) => (
					<div
						key={exercise.name}
						className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 px-3 py-2.5">
						<div className="flex items-center gap-3">
							<ExerciseApiImage exerciseName={exercise.name} />
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm sm:text-base font-medium text-[hsl(var(--fg))]">
									{exercise.name}
								</p>
								<p className="text-xs text-[hsl(var(--muted))]">
									{exercise.targetSets} target sets
								</p>
							</div>
						</div>
					</div>
				))}
			</div>

			<button
				type="button"
				onClick={onStart}
				className="btn btn-primary rounded-lg px-5 py-3">
				Start Workout
			</button>
		</div>
	)
}

export default TodayWorkoutCard
