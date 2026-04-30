export const formatDate = (dateString) => {
	const options = { weekday: "short", month: "short", day: "numeric" }
	const date = new Date(dateString)
	date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
	return date.toLocaleDateString("en-US", options)
}

export const getTodayDate = () => new Date().toISOString().split("T")[0]

export const getDateGreeting = () => {
	const date = new Date()
	return date.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	})
}

export const computeWorkoutVolume = (workout) =>
	workout.exercises.reduce(
		(volumeTotal, exercise) =>
			volumeTotal +
			exercise.sets.reduce((setTotal, set) => {
				const weight = parseFloat(set.weight) || 0
				const reps = parseInt(set.reps, 10) || 0
				return setTotal + weight * reps
			}, 0),
		0,
	)
