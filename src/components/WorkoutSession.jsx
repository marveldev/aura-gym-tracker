import { workoutCategories } from "../data/workoutLibrary.js"
import useWorkoutSession from "../hooks/useWorkoutSession.js"
import TodayWorkoutCard from "./TodayWorkoutCard.jsx"
import WorkoutLibrary from "./WorkoutLibrary.jsx"
import WorkoutActiveScreen from "./WorkoutActiveScreen.jsx"

function WorkoutSession({ onCompleteWorkout }) {
	const {
		workoutState,
		workout,
		selectedWorkoutTemplate,
		totalSets,
		totalVolume,
		startWorkout,
		resetToIdle,
	} = useWorkoutSession({ onComplete: onCompleteWorkout })

	if (workoutState === "idle") {
		return (
			<section className="space-y-6">
				<TodayWorkoutCard
					workout={selectedWorkoutTemplate}
					onStart={() => startWorkout(selectedWorkoutTemplate)}
				/>
				<WorkoutLibrary
					categories={workoutCategories}
					onStartWorkout={startWorkout}
				/>
			</section>
		)
	}

	if (workoutState === "completed") {
		return (
			<section className="space-y-6">
				<div className="card p-6 sm:p-7 space-y-5">
					<h2 className="text-2xl font-semibold text-[hsl(var(--fg))]">
						Workout Completed
					</h2>
					<p className="text-[hsl(var(--muted))]">
						{totalSets} sets logged • {totalVolume} kg total volume
					</p>
					<div className="space-y-3">
						{workout.exercises.map((exercise) => (
							<div
								key={exercise.name}
								className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4">
								<p className="font-semibold text-[hsl(var(--fg))]">
									{exercise.name}
								</p>
								<p className="text-sm text-[hsl(var(--muted))] mt-1">
									{exercise.sets.length} sets logged
								</p>
							</div>
						))}
					</div>
					<button
						type="button"
						onClick={resetToIdle}
						className="btn btn-secondary rounded-lg px-5 py-3">
						Back to Summary
					</button>
				</div>
			</section>
		)
	}

	return (
		<section>
			<WorkoutActiveScreen workout={workout} onBack={resetToIdle} />
		</section>
	)
}

export default WorkoutSession
