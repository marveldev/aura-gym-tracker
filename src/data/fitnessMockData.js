export const fitnessDashboardMockData = {
	profile: {
		name: "Marvellous",
		avatarUrl:
			"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
		streakDays: 12,
		unreadNotifications: 3,
	},
	todayWorkout: {
		title: "Upper Body Power",
		type: "Strength Split",
		durationMinutes: 48,
		difficulty: "Intermediate",
		estimatedCalories: 420,
		weeklyCompletionPercent: 68,
	},
	dailyStats: [
		{
			label: "Calories Burned",
			value: "1,184 kcal",
			delta: "+12% vs yesterday",
			direction: "up",
		},
		{
			label: "Active Minutes",
			value: "87 min",
			delta: "+9 min today",
			direction: "up",
		},
	],
	weeklyGoals: [
		{
			id: "workouts",
			title: "Workout Goal",
			current: 4,
			target: 6,
			unit: "sessions",
		},
		{
			id: "steps",
			title: "Step Goal",
			current: 52400,
			target: 70000,
			unit: "steps",
		},
	],
	weightProgress: [
		{ week: "W1", weight: 85.4 },
		{ week: "W2", weight: 84.8 },
		{ week: "W3", weight: 84.1 },
		{ week: "W4", weight: 83.9 },
		{ week: "W5", weight: 83.2 },
		{ week: "W6", weight: 82.8 },
	],
	workoutConsistency: [
		{ week: "W1", workouts: 3 },
		{ week: "W2", workouts: 4 },
		{ week: "W3", workouts: 5 },
		{ week: "W4", workouts: 4 },
		{ week: "W5", workouts: 6 },
		{ week: "W6", workouts: 5 },
	],
	quickActions: [
		{ id: "start", label: "Start Workout", icon: "Dumbbell" },
		{ id: "weight", label: "Log Weight", icon: "Scale" },
		{ id: "meal", label: "Add Meal", icon: "Utensils" },
		{ id: "water", label: "Track Water", icon: "Droplets" },
		{ id: "exercise", label: "View Exercises", icon: "ListChecks" },
	],
	recommendedWorkouts: [
		{
			id: "rw-1",
			title: "Full Body HIIT Blast",
			difficulty: "Intermediate",
			durationMinutes: 32,
			imageUrl:
				"https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80",
		},
		{
			id: "rw-2",
			title: "Lower Body Strength",
			difficulty: "Advanced",
			durationMinutes: 45,
			imageUrl:
				"https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=900&q=80",
		},
		{
			id: "rw-3",
			title: "Core & Mobility Flow",
			difficulty: "Beginner",
			durationMinutes: 24,
			imageUrl:
				"https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=900&q=80",
		},
	],
	recentActivity: [
		{
			id: "ac-1",
			type: "workout",
			title: "Completed Push Day",
			description: "Finished 5 exercises in 52 minutes",
			time: "Today · 7:42 AM",
		},
		{
			id: "ac-2",
			type: "record",
			title: "New PR: Barbell Bench Press",
			description: "Hit 95kg x 5 reps",
			time: "Yesterday · 6:15 PM",
		},
		{
			id: "ac-3",
			type: "streak",
			title: "12-Day Streak",
			description: "You’ve trained consistently for 12 days",
			time: "Yesterday · 9:10 PM",
		},
	],
}
