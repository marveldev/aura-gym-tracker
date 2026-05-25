import { useMemo, useRef, useState } from "react"
import { completeWorkout } from "../../services/workout/workoutCompletionService.js"

const triggerSuccessHaptics = () => {
	if (
		typeof navigator !== "undefined" &&
		typeof navigator.vibrate === "function"
	) {
		navigator.vibrate([20, 40, 20])
	}
}

export function useWorkoutCompletion() {
	const [isSaving, setIsSaving] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [error, setError] = useState("")
	const [completedSession, setCompletedSession] = useState(null)
	const inFlight = useRef(false)
	const completionToken = useMemo(
		() => `completion_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
		[],
	)

	const complete = async (payload) => {
		if (inFlight.current || isSaving) {
			throw new Error("Workout completion already in progress")
		}

		setError("")
		setIsSaving(true)
		inFlight.current = true

		try {
			const session = completeWorkout({
				...payload,
				completionToken,
			})
			setCompletedSession(session)
			setIsSuccess(true)
			triggerSuccessHaptics()
			return session
		} catch (nextError) {
			const message = nextError?.message || "Unable to complete workout"
			setError(message)
			throw nextError
		} finally {
			setIsSaving(false)
			inFlight.current = false
		}
	}

	const resetSuccess = () => {
		setIsSuccess(false)
	}

	return {
		completeWorkout: complete,
		isSaving,
		isSuccess,
		error,
		completedSession,
		resetSuccess,
	}
}
