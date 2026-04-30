import ExerciseItem from "./ExerciseItem.jsx"
import { formatDate } from "../utils/workoutUtils.js"

function WorkoutList({ workouts, onOpenModal, onDeleteWorkout }) {
	return (
		<div className="animate-fade-in">
			<header className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Workout History</h1>
					<p className="text-[hsl(var(--muted))] mt-1">
						All your logged sessions.
					</p>
				</div>
				<button className="btn btn-primary" onClick={onOpenModal}>
					<i className="ph ph-plus-bold"></i>
					Log
				</button>
			</header>

			{workouts.length === 0 ? (
				<div className="card p-12 text-center flex flex-col items-center justify-center">
					<i className="ph ph-folder-open text-4xl text-[hsl(var(--muted))] mb-4"></i>
					<h3 className="text-lg font-medium text-[hsl(var(--fg))]">
						No history found
					</h3>
					<p className="text-[hsl(var(--muted))] text-sm mt-1">
						Your logged workouts will appear here.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{workouts.map((workout) => {
						const [weekday, month, day] = formatDate(workout.date).split(" ")

						return (
							<div
								key={workout.id}
								className="card p-6 relative group overflow-hidden">
								<div className="flex justify-between items-center mb-4">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))] flex flex-col items-center justify-center">
											<span className="text-xs font-bold text-[hsl(var(--primary))]">
												{month}
											</span>
											<span className="text-[10px] text-[hsl(var(--muted))]">
												{weekday}
											</span>
										</div>
										<div>
											<h3 className="font-bold text-lg">{workout.focus}</h3>
											<p className="text-xs text-[hsl(var(--muted))]">
												{workout.exercises.length} Exercises · {day}
											</p>
										</div>
									</div>

									<button
										className="text-[hsl(var(--danger))] opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[hsl(var(--danger))]/10 rounded-lg"
										onClick={() => onDeleteWorkout(workout.id)}>
										<i className="ph ph-trash text-xl"></i>
									</button>
								</div>

								<div className="bg-[hsl(var(--bg))] rounded-lg p-4">
									{workout.exercises.map((exercise) => (
										<ExerciseItem
											key={exercise.id || `${workout.id}-${exercise.name}`}
											exercise={exercise}
										/>
									))}
								</div>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default WorkoutList
