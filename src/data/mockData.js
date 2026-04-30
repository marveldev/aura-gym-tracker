import {
	generateId,
	getWorkouts,
	saveWorkouts,
} from "../services/workoutStorage.js"

export const initMockDataIfEmpty = () => {
	const existing = getWorkouts()
	if (existing.length > 0) {
		return
	}

	const today = new Date()
	const mockData = []
	const routines = [
		{
			focus: "Chest",
			exercises: ["Bench Press", "Incline Dumbbell Press", "Cable Crossovers"],
		},
		{ focus: "Back", exercises: ["Deadlift", "Pull-ups", "Barbell Rows"] },
		{ focus: "Legs", exercises: ["Squat", "Leg Press", "Calf Raises"] },
	]

	for (let index = 0; index < 12; index += 1) {
		const date = new Date(today)
		date.setDate(
			date.getDate() - (30 - index * 2 - Math.floor(Math.random() * 2)),
		)

		const routine = routines[index % 3]
		const exercises = routine.exercises.map((name) => {
			const baseWeight =
				name === "Deadlift"
					? 225
					: name === "Squat"
						? 185
						: name === "Bench Press"
							? 135
							: 50
			const weight = baseWeight + index * 5

			return {
				id: generateId(),
				name,
				sets: [
					{ reps: 10, weight },
					{ reps: 8, weight: weight + 10 },
					{ reps: 5, weight: weight + 20, isPR: index > 8 },
				],
			}
		})

		mockData.push({
			id: generateId(),
			date: date.toISOString().split("T")[0],
			focus: routine.focus,
			exercises,
		})
	}

	saveWorkouts(mockData.reverse())
}
