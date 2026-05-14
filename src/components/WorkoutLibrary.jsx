import ExerciseApiImage from "./ExerciseApiImage.jsx"

function WorkoutLibrary({ categories, onStartWorkout }) {
	return (
		<section className="space-y-6">
			{categories.map((category) => (
				<div key={category.name} className="space-y-3">
					<div>
						<h2 className="text-xl font-semibold text-[hsl(var(--fg))]">
							{category.name}
						</h2>
					</div>
					<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
						{category.workouts.map((workout) => (
							<button
								key={`${category.name}-${workout.name}`}
								type="button"
								onClick={() => onStartWorkout(workout)}
								className="card p-5 text-left transition-all hover:border-[hsl(var(--primary))]/45 hover:bg-[hsl(var(--surface))]/95">
								<div className="flex items-start justify-between gap-3">
									<div>
										<h3 className="text-lg font-semibold text-[hsl(var(--fg))]">
											{workout.name}
										</h3>
										<p className="text-sm text-[hsl(var(--muted))] mt-1">
											{workout.exercises.length} exercises
										</p>
									</div>
									<i
										className="ph ph-caret-right text-lg text-[hsl(var(--muted))]"
										aria-hidden="true"></i>
								</div>
								<div className="mt-4 flex flex-wrap gap-2 text-sm">
									<span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/70 px-3 py-1 text-[hsl(var(--muted))]">
										{workout.duration}
									</span>
									<span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/70 px-3 py-1 text-[hsl(var(--muted))]">
										{workout.difficulty}
									</span>
								</div>
								<div className="mt-4 space-y-2">
									{workout.exercises.map((exercise) => (
										<div
											key={`${workout.name}-${exercise.name}`}
											className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 px-3 py-2">
											<div className="flex items-center gap-3">
												<ExerciseApiImage
													exerciseName={exercise.name}
													containerClassName="h-12 w-12"
												/>
												<div className="min-w-0 flex-1">
													<p className="truncate text-sm font-medium text-[hsl(var(--fg))]">
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
								<p className="mt-4 text-sm font-medium text-[hsl(var(--primary))]">
									Start workout
								</p>
							</button>
						))}
					</div>
				</div>
			))}
		</section>
	)
}

export default WorkoutLibrary
