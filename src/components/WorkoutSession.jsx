import { workoutCategories } from "../data/workoutLibrary.js"
import useWorkoutSession from "../hooks/useWorkoutSession.js"
import TodayWorkoutCard from "./TodayWorkoutCard.jsx"
import WorkoutLibrary from "./WorkoutLibrary.jsx"

function WorkoutSession({ onCompleteWorkout }) {
	const {
		workoutState,
		workout,
		currentExercise,
		currentExerciseIndex,
		currentSetIndex,
		selectedWorkoutTemplate,
		repsInput,
		weightInput,
		totalSets,
		totalVolume,
		defaultSetTarget,
		setRepsInput,
		setWeightInput,
		startWorkout,
		logSet,
		nextSet,
		nextExercise,
		finishWorkout,
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
								<p className="font-semibold text-[hsl(var(--fg))]">{exercise.name}</p>
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
		<section className="space-y-6">
			<div className="card p-6 sm:p-7 space-y-5">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-semibold text-[hsl(var(--fg))]">
						{workout.name}
					</h2>
					<span className="text-sm text-[hsl(var(--muted))]">
						Exercise {currentExerciseIndex + 1} of {workout.exercises.length} • Set{" "}
						{currentSetIndex + 1} of {currentExercise?.targetSets ?? defaultSetTarget}
					</span>
				</div>

				<div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4">
					<p className="text-sm text-[hsl(var(--muted))] mb-1">Current Exercise</p>
					<h3 className="text-xl font-semibold text-[hsl(var(--fg))]">
						{currentExercise.name}
					</h3>
				</div>

				<div className="grid sm:grid-cols-2 gap-3">
					<label className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-3">
						<span className="block text-sm text-[hsl(var(--muted))] mb-2">Reps</span>
						<input
							type="number"
							min="1"
							value={repsInput}
							onChange={(event) => setRepsInput(event.target.value)}
							className="w-full bg-transparent outline-none text-[hsl(var(--fg))]"
						/>
					</label>
					<label className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-3">
						<span className="block text-sm text-[hsl(var(--muted))] mb-2">
							Weight (kg)
						</span>
						<input
							type="number"
							min="0"
							value={weightInput}
							onChange={(event) => setWeightInput(event.target.value)}
							className="w-full bg-transparent outline-none text-[hsl(var(--fg))]"
						/>
					</label>
				</div>

				<div className="flex flex-wrap gap-3">
					<button
						type="button"
						onClick={() => logSet(repsInput, weightInput)}
						className="btn btn-primary rounded-lg px-5 py-3">
						Log Set
					</button>
					<button
						type="button"
						onClick={nextSet}
						disabled={
							currentSetIndex >= (currentExercise?.targetSets ?? defaultSetTarget) - 1
						}
						className="btn btn-secondary rounded-lg px-5 py-3 disabled:opacity-60 disabled:cursor-not-allowed">
						Next Set
					</button>
					<button
						type="button"
						onClick={nextExercise}
						className="btn btn-secondary rounded-lg px-5 py-3">
						{currentExerciseIndex >= workout.exercises.length - 1
							? "Finish Workout"
							: "Next Exercise"}
					</button>
					<button
						type="button"
						onClick={finishWorkout}
						className="btn btn-secondary rounded-lg px-5 py-3">
						Finish Workout Now
					</button>
				</div>

				<div className="space-y-2">
					<p className="text-sm text-[hsl(var(--muted))]">Logged Sets</p>
					{currentExercise.sets.length === 0 ? (
						<p className="text-sm text-[hsl(var(--muted))]">No sets logged yet.</p>
					) : (
						<div className="space-y-2">
							{currentExercise.sets.map((set, index) => (
								<div
									key={`${currentExercise.name}-${index}`}
									className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 px-4 py-3 text-sm text-[hsl(var(--fg))]">
									Set {index + 1}: {set.reps} reps × {set.weight} kg
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	)
}

export default WorkoutSession
