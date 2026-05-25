function WorkoutCompletionModal({ session, isOpen, onClose, onGoDashboard }) {
	if (!isOpen || !session) return null

	const completedAt = new Date(session.completedAt)
	const completedLabel = Number.isNaN(completedAt.getTime())
		? "Just now"
		: completedAt.toLocaleString(undefined, {
				weekday: "short",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
			})

	return (
		<div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
			<button
				type="button"
				onClick={onClose}
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				aria-label="Close completion summary"
			/>

			<div className="relative w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 shadow-2xl animate-fade-in">
				<div className="text-center">
					<p className="text-4xl">🎉</p>
					<h3 className="mt-2 text-2xl font-bold">Workout Completed</h3>
					<p className="mt-1 text-sm text-[hsl(var(--muted))]">
						{session.workoutName}
					</p>
				</div>

				<div className="mt-5 grid grid-cols-2 gap-3">
					<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg))] p-3">
						<p className="text-xs text-[hsl(var(--muted))]">Calories Burned</p>
						<p className="mt-1 text-lg font-semibold">
							{session.caloriesBurned}
						</p>
					</div>
					<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg))] p-3">
						<p className="text-xs text-[hsl(var(--muted))]">Duration</p>
						<p className="mt-1 text-lg font-semibold">
							{session.durationMinutes} min
						</p>
					</div>
					<div className="col-span-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg))] p-3">
						<p className="text-xs text-[hsl(var(--muted))]">
							Exercises Completed
						</p>
						<p className="mt-1 text-lg font-semibold">
							{session.exercisesCompleted} / {session.totalExercises}
						</p>
					</div>
				</div>

				<p className="mt-4 text-center text-xs text-[hsl(var(--muted))]">
					Completed {completedLabel}
				</p>

				<div className="mt-5 flex gap-3">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 rounded-xl border border-[hsl(var(--border))] px-4 py-2.5 text-sm font-medium hover:bg-[hsl(var(--bg))]">
						Stay Here
					</button>
					<button
						type="button"
						onClick={onGoDashboard}
						className="flex-1 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-semibold text-[hsl(var(--primary-fg))] hover:bg-[hsl(var(--primary-hover))]">
						Go to Dashboard
					</button>
				</div>
			</div>
		</div>
	)
}

export default WorkoutCompletionModal
