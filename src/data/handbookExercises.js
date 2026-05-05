export const handbookExerciseData = {
	chest: {
		title: "Chest",
		exercises: [
			{
				slug: "bench-press",
				name: "Bench Press",
				type: "compound",
				description: "Horizontal barbell press for overall chest strength",
				targetMuscles: "Chest, Triceps, Front delts",
				instructions: [
					"Lie flat on a bench with feet planted and eyes under the bar.",
					"Grip the bar slightly wider than shoulder width and brace your core.",
					"Lower the bar to mid-chest with control.",
					"Press upward until elbows are nearly locked while maintaining shoulder position.",
				],
				warnings: [
					"Keep wrists neutral and avoid excessive elbow flare.",
					"Use a spotter or safety arms for heavier sets.",
				],
				howToTips: [
					"Drive feet into the floor to improve stability.",
					"Keep shoulder blades retracted during each rep.",
				],
			},
			{
				slug: "incline-bench-press",
				name: "Incline Bench Press",
				type: "compound",
				description: "Targets upper chest with an inclined angle",
				targetMuscles: "Upper chest, Shoulders, Triceps",
			},
			{
				slug: "decline-bench-press",
				name: "Decline Bench Press",
				type: "compound",
				description: "Emphasizes lower chest fibers",
				targetMuscles: "Lower chest, Triceps",
			},
			{
				slug: "dumbbell-bench-press",
				name: "Dumbbell Bench Press",
				type: "compound",
				description: "Allows greater range of motion and stability work",
				targetMuscles: "Chest, Triceps, Stabilizers",
			},
			{
				slug: "incline-dumbbell-press",
				name: "Incline Dumbbell Press",
				type: "compound",
				description: "Upper chest focus with improved stretch",
				targetMuscles: "Upper chest, Shoulders",
			},
			{
				slug: "chest-fly-dumbbell",
				name: "Chest Fly (Dumbbell)",
				type: "isolation",
				description: "Stretch-focused movement isolating the chest",
				targetMuscles: "Chest",
			},
			{
				slug: "cable-fly",
				name: "Cable Fly",
				type: "isolation",
				description: "Constant tension movement for chest contraction",
				targetMuscles: "Chest",
			},
			{
				slug: "pec-deck-machine",
				name: "Pec Deck Machine",
				type: "machine",
				description: "Controlled chest isolation using a machine",
				targetMuscles: "Chest",
			},
			{
				slug: "push-up",
				name: "Push-Up",
				type: "bodyweight",
				description: "Fundamental bodyweight pressing movement",
				targetMuscles: "Chest, Triceps, Core",
			},
			{
				slug: "incline-push-up",
				name: "Incline Push-Up",
				type: "bodyweight",
				description: "Easier push-up variation targeting lower chest",
				targetMuscles: "Chest, Triceps",
			},
			{
				slug: "decline-push-up",
				name: "Decline Push-Up",
				type: "bodyweight",
				description: "More advanced push-up emphasizing upper chest",
				targetMuscles: "Upper chest, Shoulders",
			},
			{
				slug: "dips-chest-focused",
				name: "Dips (Chest Focused)",
				type: "bodyweight",
				description: "Leaning forward variation to target chest",
				targetMuscles: "Chest, Triceps",
			},
			{
				slug: "cable-crossover",
				name: "Cable Crossover",
				type: "isolation",
				description: "Cross-body cable movement for peak contraction",
				targetMuscles: "Chest",
			},
		],
	},
	back: {
		title: "Back",
		exercises: [
			{
				slug: "pull-up",
				name: "Pull-Up",
				description:
					"Bodyweight vertical pull for upper-back and lat strength.",
				targetMuscles: "Lats, upper back, biceps",
			},
			{
				slug: "barbell-row",
				name: "Barbell Row",
				description: "Horizontal pull that builds overall back thickness.",
				targetMuscles: "Mid back, lats, rear delts, biceps",
			},
			{
				slug: "lat-pulldown",
				name: "Lat Pulldown",
				description: "Machine-based vertical pull with adjustable load.",
				targetMuscles: "Lats, upper back, biceps",
			},
		],
	},
	legs: {
		title: "Legs",
		exercises: [
			{
				slug: "back-squat",
				name: "Back Squat",
				description: "Primary compound lift for lower-body strength.",
				targetMuscles: "Quads, glutes, hamstrings, core",
			},
			{
				slug: "romanian-deadlift",
				name: "Romanian Deadlift",
				description: "Hip-hinge movement focused on posterior-chain loading.",
				targetMuscles: "Hamstrings, glutes, lower back",
			},
			{
				slug: "leg-press",
				name: "Leg Press",
				description: "Machine press pattern for controlled lower-body volume.",
				targetMuscles: "Quads, glutes, hamstrings",
			},
		],
	},
	shoulders: {
		title: "Shoulders",
		exercises: [
			{
				slug: "overhead-press",
				name: "Overhead Press",
				description:
					"Vertical press that develops shoulder and pressing strength.",
				targetMuscles: "Delts, triceps, upper chest",
			},
			{
				slug: "lateral-raise",
				name: "Lateral Raise",
				description: "Isolation movement for shoulder width and control.",
				targetMuscles: "Lateral delts, upper traps",
			},
			{
				slug: "rear-delt-fly",
				name: "Rear Delt Fly",
				description: "Rear-shoulder focused movement for posture and balance.",
				targetMuscles: "Rear delts, upper back",
			},
		],
	},
	arms: {
		title: "Arms",
		exercises: [
			{
				slug: "barbell-curl",
				name: "Barbell Curl",
				description: "Classic curl variation for biceps strength and size.",
				targetMuscles: "Biceps, forearms",
			},
			{
				slug: "hammer-curl",
				name: "Hammer Curl",
				description: "Neutral-grip curl emphasizing brachialis and forearms.",
				targetMuscles: "Biceps, brachialis, forearms",
			},
			{
				slug: "triceps-pushdown",
				name: "Triceps Pushdown",
				description: "Cable extension for triceps isolation and control.",
				targetMuscles: "Triceps",
			},
		],
	},
}
