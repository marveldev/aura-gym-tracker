const STORAGE_KEY = "aura_workouts_data"

export const generateId = () => `_${Math.random().toString(36).slice(2, 11)}`

export const getWorkouts = () => {
	try {
		const data = localStorage.getItem(STORAGE_KEY)
		return data ? JSON.parse(data) : []
	} catch {
		return []
	}
}

export const saveWorkouts = (workouts) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts))
}

export const addWorkout = (workoutObj) => {
	const workouts = getWorkouts()
	const nextWorkout = { ...workoutObj, id: workoutObj.id || generateId() }
	workouts.push(nextWorkout)
	workouts.sort((a, b) => new Date(b.date) - new Date(a.date))
	saveWorkouts(workouts)
}

export const deleteWorkout = (id) => {
	const workouts = getWorkouts().filter((workout) => workout.id !== id)
	saveWorkouts(workouts)
}

export const calculateStats = (workouts = getWorkouts()) => {
	let totalVolume = 0
	let totalSets = 0

	workouts.forEach((workout) => {
		workout.exercises.forEach((exercise) => {
			exercise.sets.forEach((set) => {
				const weight = parseFloat(set.weight) || 0
				const reps = parseInt(set.reps, 10) || 0
				totalVolume += weight * reps
				totalSets += 1
			})
		})
	})

	return {
		totalWorkouts: workouts.length,
		totalVolume,
		totalSets,
	}
}

export const getUniqueExercises = (workouts = getWorkouts()) => {
	const names = new Set()

	workouts.forEach((workout) => {
		workout.exercises.forEach((exercise) => {
			if (exercise.name.trim()) {
				names.add(exercise.name.trim())
			}
		})
	})

	return Array.from(names).sort()
}

export const getExerciseHistory = (exerciseName, workouts = getWorkouts()) => {
	const history = []

	workouts.forEach((workout) => {
		const exercise = workout.exercises.find(
			(item) => item.name.toLowerCase() === exerciseName.toLowerCase(),
		)

		if (!exercise) {
			return
		}

		let maxWeight = 0
		let volume = 0

		exercise.sets.forEach((set) => {
			const weight = parseFloat(set.weight) || 0
			const reps = parseInt(set.reps, 10) || 0
			if (weight > maxWeight) {
				maxWeight = weight
			}
			volume += weight * reps
		})

		history.push({
			date: workout.date,
			maxWeight,
			volume,
		})
	})

	return history.sort((a, b) => new Date(a.date) - new Date(b.date))
}
