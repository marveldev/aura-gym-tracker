export const workoutCategories = [
	{
		name: "Weight Loss",
		workouts: [
			{
				name: "Fat Burn HIIT",
				duration: "25 min",
				difficulty: "Intermediate",
				exercises: [
					{ name: "Jump Squat", targetSets: 3 },
					{ name: "Burpees", targetSets: 3 },
					{ name: "Mountain Climbers", targetSets: 3 },
				],
			},
			{
				name: "30-min Cardio Blast",
				duration: "30 min",
				difficulty: "Beginner",
				exercises: [
					{ name: "High Knees", targetSets: 3 },
					{ name: "Walking Lunges", targetSets: 3 },
					{ name: "Jumping Jacks", targetSets: 3 },
				],
			},
		],
	},
	{
		name: "Glutes",
		workouts: [
			{
				name: "Perfect Butt Workout",
				duration: "45 min",
				difficulty: "Intermediate",
				exercises: [
					{ name: "Barbell Hip Thrust", targetSets: 4 },
					{ name: "Romanian Deadlift", targetSets: 3 },
					{ name: "Cable Kickback", targetSets: 3 },
				],
			},
			{
				name: "Glute Activation",
				duration: "25 min",
				difficulty: "Beginner",
				exercises: [
					{ name: "Bodyweight Glute Bridge", targetSets: 3 },
					{ name: "Step-Up", targetSets: 3 },
					{ name: "Banded Lateral Walk", targetSets: 3 },
				],
			},
		],
	},
]

export const defaultWorkoutTemplate = workoutCategories[0].workouts[0]
