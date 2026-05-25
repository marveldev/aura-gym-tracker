const toDate = (value) => {
	if (!value) return null
	const date = new Date(value)
	return Number.isNaN(date.getTime()) ? null : date
}

export const calculateStreak = (sessions = []) => {
	const uniqueDateKeys = Array.from(
		new Set(
			sessions
				.map((session) => {
					const date = toDate(session.completedAt)
					if (!date) return null
					return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
				})
				.filter(Boolean),
		),
	).sort((a, b) => new Date(b) - new Date(a))

	if (!uniqueDateKeys.length) return 0

	let streak = 1
	for (let index = 1; index < uniqueDateKeys.length; index += 1) {
		const previous = new Date(uniqueDateKeys[index - 1])
		const current = new Date(uniqueDateKeys[index])
		const dayDiff = Math.round(
			(previous.getTime() - current.getTime()) / 86400000,
		)
		if (dayDiff !== 1) break
		streak += 1
	}

	return streak
}

const getWeekStart = (date) => {
	const start = new Date(date)
	const day = start.getDay()
	const offsetToMonday = day === 0 ? 6 : day - 1
	start.setDate(start.getDate() - offsetToMonday)
	start.setHours(0, 0, 0, 0)
	return start
}

export const calculateWeeklyWorkouts = (sessions = [], now = new Date()) => {
	const weekStart = getWeekStart(now)
	return sessions.filter((session) => {
		const date = toDate(session.completedAt)
		return date && date >= weekStart && date <= now
	}).length
}

export const calculateFitnessStats = (sessions = []) => {
	const normalized = [...sessions].sort(
		(a, b) => new Date(b.completedAt) - new Date(a.completedAt),
	)

	const totalWorkoutsCompleted = normalized.length
	const totalCaloriesBurned = normalized.reduce(
		(sum, item) => sum + (Number(item.caloriesBurned) || 0),
		0,
	)
	const totalWorkoutMinutes = normalized.reduce(
		(sum, item) => sum + (Number(item.durationMinutes) || 0),
		0,
	)

	return {
		totalWorkoutsCompleted,
		weeklyWorkouts: calculateWeeklyWorkouts(normalized),
		streakCount: calculateStreak(normalized),
		totalCaloriesBurned,
		totalWorkoutMinutes,
		lastWorkoutDate: normalized[0]?.completedAt || null,
	}
}
