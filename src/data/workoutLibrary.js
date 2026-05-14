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
			{
				name: "Sweat Circuit",
				duration: "35 min",
				difficulty: "Advanced",
				exercises: [
					{ name: "Battle Ropes", targetSets: 4 },
					{ name: "Box Jumps", targetSets: 4 },
					{ name: "Rowing Sprint", targetSets: 4 },
				],
			},
		],
	},

	{
		name: "Muscle Gain",
		workouts: [
			{
				name: "Upper Body Mass",
				duration: "60 min",
				difficulty: "Intermediate",
				exercises: [
					{ name: "Bench Press", targetSets: 4 },
					{ name: "Pull-Up", targetSets: 4 },
					{ name: "Seated Shoulder Press", targetSets: 3 },
				],
			},
			{
				name: "Leg Hypertrophy",
				duration: "70 min",
				difficulty: "Advanced",
				exercises: [
					{ name: "Back Squat", targetSets: 5 },
					{ name: "Leg Press", targetSets: 4 },
					{ name: "Bulgarian Split Squat", targetSets: 3 },
				],
			},
		],
	},

	{
		name: "Strength",
		workouts: [
			{
				name: "Powerlifting Basics",
				duration: "75 min",
				difficulty: "Intermediate",
				exercises: [
					{ name: "Deadlift", targetSets: 5 },
					{ name: "Bench Press", targetSets: 5 },
					{ name: "Back Squat", targetSets: 5 },
				],
			},
			{
				name: "Full Body Strength",
				duration: "50 min",
				difficulty: "Beginner",
				exercises: [
					{ name: "Goblet Squat", targetSets: 3 },
					{ name: "Push-Up", targetSets: 3 },
					{ name: "Dumbbell Row", targetSets: 3 },
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
			{
				name: "Booty Builder",
				duration: "55 min",
				difficulty: "Advanced",
				exercises: [
					{ name: "Sumo Deadlift", targetSets: 4 },
					{ name: "Walking Lunge", targetSets: 4 },
					{ name: "Smith Machine Hip Thrust", targetSets: 4 },
				],
			},
		],
	},

	{
		name: "Core",
		workouts: [
			{
				name: "Abs Burner",
				duration: "20 min",
				difficulty: "Beginner",
				exercises: [
					{ name: "Crunch", targetSets: 3 },
					{ name: "Plank", targetSets: 3 },
					{ name: "Leg Raise", targetSets: 3 },
				],
			},
			{
				name: "Core Stability",
				duration: "30 min",
				difficulty: "Intermediate",
				exercises: [
					{ name: "Dead Bug", targetSets: 3 },
					{ name: "Russian Twist", targetSets: 3 },
					{ name: "Side Plank", targetSets: 3 },
				],
			},
		],
	},

	{
		name: "Chest",
		workouts: [
			{
				name: "Chest Builder",
				duration: "50 min",
				difficulty: "Intermediate",
				exercises: [
					{ name: "Bench Press", targetSets: 4 },
					{ name: "Incline Dumbbell Press", targetSets: 3 },
					{ name: "Cable Fly", targetSets: 3 },
				],
			},
			{
				name: "Push Day",
				duration: "65 min",
				difficulty: "Advanced",
				exercises: [
					{ name: "Weighted Dip", targetSets: 4 },
					{ name: "Flat Dumbbell Press", targetSets: 4 },
					{ name: "Push-Up", targetSets: 3 },
				],
			},
		],
	},

	{
		name: "Back",
		workouts: [
			{
				name: "Wide Back Workout",
				duration: "55 min",
				difficulty: "Intermediate",
				exercises: [
					{ name: "Lat Pulldown", targetSets: 4 },
					{ name: "Barbell Row", targetSets: 4 },
					{ name: "Face Pull", targetSets: 3 },
				],
			},
			{
				name: "Pull Day Strength",
				duration: "70 min",
				difficulty: "Advanced",
				exercises: [
					{ name: "Weighted Pull-Up", targetSets: 5 },
					{ name: "T-Bar Row", targetSets: 4 },
					{ name: "Rack Pull", targetSets: 4 },
				],
			},
		],
	},

	{
		name: "Legs",
		workouts: [
			{
				name: "Quad Destroyer",
				duration: "60 min",
				difficulty: "Intermediate",
				exercises: [
					{ name: "Front Squat", targetSets: 4 },
					{ name: "Leg Extension", targetSets: 4 },
					{ name: "Walking Lunge", targetSets: 3 },
				],
			},
			{
				name: "Athletic Legs",
				duration: "50 min",
				difficulty: "Beginner",
				exercises: [
					{ name: "Goblet Squat", targetSets: 3 },
					{ name: "Step-Up", targetSets: 3 },
					{ name: "Calf Raise", targetSets: 4 },
				],
			},
		],
	},

	{
		name: "Arms",
		workouts: [
			{
				name: "Big Arms Workout",
				duration: "45 min",
				difficulty: "Intermediate",
				exercises: [
					{ name: "Barbell Curl", targetSets: 4 },
					{ name: "Tricep Pushdown", targetSets: 4 },
					{ name: "Hammer Curl", targetSets: 3 },
				],
			},
			{
				name: "Sleeve Splitter",
				duration: "55 min",
				difficulty: "Advanced",
				exercises: [
					{ name: "Skull Crusher", targetSets: 4 },
					{ name: "Preacher Curl", targetSets: 4 },
					{ name: "Close-Grip Bench Press", targetSets: 4 },
				],
			},
		],
	},

	{
		name: "Shoulders",
		workouts: [
			{
				name: "Boulder Shoulders",
				duration: "50 min",
				difficulty: "Intermediate",
				exercises: [
					{ name: "Overhead Press", targetSets: 4 },
					{ name: "Lateral Raise", targetSets: 4 },
					{ name: "Rear Delt Fly", targetSets: 3 },
				],
			},
			{
				name: "Shoulder Sculpt",
				duration: "35 min",
				difficulty: "Beginner",
				exercises: [
					{ name: "Arnold Press", targetSets: 3 },
					{ name: "Front Raise", targetSets: 3 },
					{ name: "Face Pull", targetSets: 3 },
				],
			},
		],
	},

	{
		name: "Full Body",
		workouts: [
			{
				name: "Functional Fitness",
				duration: "45 min",
				difficulty: "Beginner",
				exercises: [
					{ name: "Kettlebell Swing", targetSets: 3 },
					{ name: "Push-Up", targetSets: 3 },
					{ name: "Air Squat", targetSets: 3 },
				],
			},
			{
				name: "Total Body Challenge",
				duration: "75 min",
				difficulty: "Advanced",
				exercises: [
					{ name: "Thruster", targetSets: 5 },
					{ name: "Burpee Pull-Up", targetSets: 4 },
					{ name: "Farmer Carry", targetSets: 4 },
				],
			},
		],
	},
]

export const defaultWorkoutTemplate = workoutCategories[0].workouts[0]
