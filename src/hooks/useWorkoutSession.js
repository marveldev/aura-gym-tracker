import { useMemo, useState } from "react"
import { defaultWorkoutTemplate } from "../data/workoutLibrary.js"
import { getTodayDate } from "../utils/workoutUtils.js"

const DEFAULT_SET_TARGET = 3

const createWorkoutFromTemplate = (template) => ({
	name: template.name,
	duration: template.duration,
	difficulty: template.difficulty,
	exercises: template.exercises.map((exercise) => ({
		name: exercise.name,
		sets: [],
		targetSets: exercise.targetSets ?? DEFAULT_SET_TARGET,
	})),
})

function useWorkoutSession({ onComplete } = {}) {
	const [workoutState, setWorkoutState] = useState("idle")
	const [selectedWorkoutTemplate, setSelectedWorkoutTemplate] = useState(
		defaultWorkoutTemplate,
	)
	const [workout, setWorkout] = useState(() =>
		createWorkoutFromTemplate(defaultWorkoutTemplate),
	)
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
	const [currentSetIndex, setCurrentSetIndex] = useState(0)
	const [repsInput, setRepsInput] = useState(10)
	const [weightInput, setWeightInput] = useState(20)

	const currentExercise = workout.exercises[currentExerciseIndex]
	const totalSets = useMemo(
		() => workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0),
		[workout.exercises],
	)
	const totalVolume = useMemo(
		() =>
			workout.exercises.reduce(
				(sum, exercise) =>
					sum +
					exercise.sets.reduce(
						(exerciseSum, set) => exerciseSum + set.reps * set.weight,
						0,
					),
				0,
			),
		[workout.exercises],
	)

	const startWorkout = (template = selectedWorkoutTemplate) => {
		setSelectedWorkoutTemplate(template)
		setWorkout(createWorkoutFromTemplate(template))
		setCurrentExerciseIndex(0)
		setCurrentSetIndex(0)
		setRepsInput(10)
		setWeightInput(20)
		setWorkoutState("active")
	}

	const logSet = (reps, weight) => {
		const numericReps = Number(reps)
		const numericWeight = Number(weight)

		if (
			Number.isNaN(numericReps) ||
			Number.isNaN(numericWeight) ||
			numericReps <= 0 ||
			numericWeight < 0
		) {
			return
		}

		setWorkout((current) => ({
			...current,
			exercises: current.exercises.map((exercise, index) =>
				index === currentExerciseIndex
					? {
							...exercise,
							sets: [...exercise.sets, { reps: numericReps, weight: numericWeight }],
						}
					: exercise,
			),
		}))
	}

	const nextSet = () => {
		if (workoutState !== "active") {
			return
		}

		const targetSets = currentExercise?.targetSets ?? DEFAULT_SET_TARGET
		if (currentSetIndex < targetSets - 1) {
			setCurrentSetIndex((index) => index + 1)
		}
	}

	const finishWorkout = () => {
		const completedExercises = workout.exercises
			.map((exercise) => ({
				name: exercise.name,
				sets: exercise.sets.map((set) => ({
					reps: Number(set.reps),
					weight: Number(set.weight),
				})),
			}))
			.filter((exercise) => exercise.sets.length > 0)

		if (completedExercises.length > 0 && typeof onComplete === "function") {
			onComplete({
				name: workout.name,
				date: getTodayDate(),
				focus: "Full Body",
				exercises: completedExercises,
			})
		}

		setWorkoutState("completed")
	}

	const nextExercise = () => {
		if (workoutState !== "active") {
			return
		}

		if (currentExerciseIndex >= workout.exercises.length - 1) {
			finishWorkout()
			return
		}

		setCurrentExerciseIndex((index) => index + 1)
		setCurrentSetIndex(0)
		setRepsInput(10)
		setWeightInput(20)
	}

	const resetToIdle = () => {
		setWorkoutState("idle")
		setCurrentExerciseIndex(0)
		setCurrentSetIndex(0)
	}

	return {
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
		defaultSetTarget: DEFAULT_SET_TARGET,
		setRepsInput,
		setWeightInput,
		startWorkout,
		logSet,
		nextSet,
		nextExercise,
		finishWorkout,
		resetToIdle,
	}
}

export default useWorkoutSession
