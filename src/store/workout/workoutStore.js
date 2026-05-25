import { addWorkout, getWorkouts } from "../../services/workoutStorage.js"
import {
	calculateFitnessStats,
	calculateStreak,
} from "../../utils/fitness/fitnessStats.js"

const SESSIONS_KEY = "aura_workout_sessions_v1"
const STATS_KEY = "aura_fitness_stats_v1"
const CHANGE_EVENT = "aura:workout-data-changed"

const inFlightCompletionTokens = new Set()

const safeRead = (key, fallback) => {
	try {
		const raw = localStorage.getItem(key)
		if (!raw) return fallback
		const parsed = JSON.parse(raw)
		return parsed ?? fallback
	} catch {
		localStorage.removeItem(key)
		return fallback
	}
}

const safeWrite = (key, value) => {
	localStorage.setItem(key, JSON.stringify(value))
}

const normalizeExercise = (exercise, index) => {
	const name = String(exercise?.name || "").trim()
	const sets = Array.isArray(exercise?.sets)
		? exercise.sets
				.map((set) => ({
					weight: Number(set?.weight) || 0,
					reps: Number(set?.reps) || 0,
				}))
				.filter((set) => set.reps > 0)
		: []

	return {
		id: exercise?.id || `ex-${index + 1}`,
		name: name || `Exercise ${index + 1}`,
		sets,
	}
}

const toLegacyWorkout = (session) => {
	const date = new Date(session.completedAt)
	const formattedDate = Number.isNaN(date.getTime())
		? new Date().toISOString().split("T")[0]
		: date.toISOString().split("T")[0]

	return {
		id: session.id,
		date: formattedDate,
		focus: session.workoutName || "Workout",
		exercises: session.exercises.map((exercise, index) => ({
			id: exercise.id || `legacy-${index}`,
			name: exercise.name,
			sets: exercise.sets,
		})),
	}
}

const notifyChange = () => {
	window.dispatchEvent(
		new CustomEvent(CHANGE_EVENT, { detail: { at: Date.now() } }),
	)
}

export const getWorkoutSessions = () => safeRead(SESSIONS_KEY, [])

export const saveWorkoutSessions = (sessions) => {
	safeWrite(SESSIONS_KEY, sessions)
	notifyChange()
}

export const getFitnessStats = () =>
	safeRead(STATS_KEY, {
		totalWorkoutsCompleted: 0,
		weeklyWorkouts: 0,
		streakCount: 0,
		totalCaloriesBurned: 0,
		totalWorkoutMinutes: 0,
		lastWorkoutDate: null,
	})

export const updateFitnessStats = (sessions = getWorkoutSessions()) => {
	const nextStats = calculateFitnessStats(sessions)
	safeWrite(STATS_KEY, nextStats)
	notifyChange()
	return nextStats
}

export const saveWorkoutSession = (sessionInput) => {
	if (!sessionInput?.workoutId || !sessionInput?.completedAt) {
		throw new Error("Incomplete workout data")
	}

	const normalizedExercises = (sessionInput.exercises || []).map(
		normalizeExercise,
	)
	const completedAt = new Date(sessionInput.completedAt)
	if (Number.isNaN(completedAt.getTime())) {
		throw new Error("Invalid completion date")
	}

	const durationMinutes = Math.max(1, Number(sessionInput.durationMinutes) || 0)
	const exercisesCompleted =
		Number(sessionInput.exercisesCompleted) || normalizedExercises.length
	const totalExercises =
		Number(sessionInput.totalExercises) || normalizedExercises.length
	const caloriesBurned = Math.max(0, Number(sessionInput.caloriesBurned) || 0)

	const session = {
		id:
			sessionInput.id ||
			`ws_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
		workoutId: String(sessionInput.workoutId),
		workoutName: String(sessionInput.workoutName || "Workout"),
		completedAt: completedAt.toISOString(),
		durationMinutes,
		caloriesBurned,
		exercisesCompleted,
		totalExercises,
		exercises: normalizedExercises,
		notes: sessionInput.notes || "",
		completionToken: sessionInput.completionToken || null,
	}

	const sessions = getWorkoutSessions()
	sessions.unshift(session)
	saveWorkoutSessions(sessions)
	updateFitnessStats(sessions)

	addWorkout(toLegacyWorkout(session))

	return session
}

export const completeWorkout = (payload) => {
	const token = payload?.completionToken
	if (token && inFlightCompletionTokens.has(token)) {
		throw new Error("Duplicate completion submission")
	}

	if (token) {
		const existing = getWorkoutSessions().some(
			(session) => session.completionToken && session.completionToken === token,
		)
		if (existing) {
			throw new Error("Workout already completed")
		}
		inFlightCompletionTokens.add(token)
	}

	try {
		return saveWorkoutSession(payload)
	} finally {
		if (token) {
			inFlightCompletionTokens.delete(token)
		}
	}
}

export const calculateWorkoutStreak = (sessions = getWorkoutSessions()) =>
	calculateStreak(sessions)

export const subscribeWorkoutChanges = (callback) => {
	if (typeof callback !== "function") return () => {}
	const handler = () => callback()
	window.addEventListener(CHANGE_EVENT, handler)
	window.addEventListener("storage", handler)
	return () => {
		window.removeEventListener(CHANGE_EVENT, handler)
		window.removeEventListener("storage", handler)
	}
}

export const getLegacyWorkouts = () => getWorkouts()
