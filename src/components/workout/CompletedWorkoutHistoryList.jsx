function CompletedWorkoutHistoryList({ sessions }) {
	if (!sessions.length) {
		return (
			<div className="card p-8 text-center">
				<p className="text-lg font-semibold">No completed workouts yet</p>
				<p className="mt-1 text-sm text-[hsl(var(--muted))]">
					Complete a workout from the Workout page to populate this list.
				</p>
			</div>
		)
	}

	return (
		<div className="space-y-3">
			{sessions.map((session) => {
				const completedAt = new Date(session.completedAt)
				const completedLabel = Number.isNaN(completedAt.getTime())
					? "Unknown time"
					: completedAt.toLocaleString(undefined, {
							weekday: "short",
							month: "short",
							day: "numeric",
							hour: "numeric",
							minute: "2-digit",
						})

				return (
					<div
						key={session.id}
						className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4">
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div>
								<p className="text-sm font-semibold">{session.workoutName}</p>
								<p className="mt-1 text-xs text-[hsl(var(--muted))]">
									{completedLabel}
								</p>
							</div>
							<div className="flex items-center gap-2 text-xs text-[hsl(var(--muted))]">
								<span className="rounded-full border border-[hsl(var(--border))] px-2 py-1">
									{session.durationMinutes} min
								</span>
								<span className="rounded-full border border-[hsl(var(--border))] px-2 py-1">
									{session.caloriesBurned} kcal
								</span>
								<span className="rounded-full border border-[hsl(var(--border))] px-2 py-1">
									{session.exercisesCompleted}/{session.totalExercises}{" "}
									exercises
								</span>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default CompletedWorkoutHistoryList
