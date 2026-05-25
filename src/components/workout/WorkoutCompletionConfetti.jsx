import { useEffect, useRef } from "react"
import confetti from "canvas-confetti"

function WorkoutCompletionConfetti({ active, onDone }) {
	const hasPlayedRef = useRef(false)

	useEffect(() => {
		if (!active || hasPlayedRef.current) return
		hasPlayedRef.current = true

		const base = {
			spread: 70,
			startVelocity: 35,
			zIndex: 300,
			ticks: 220,
		}

		confetti({ ...base, particleCount: 120, origin: { x: 0.2, y: 0.85 } })
		confetti({ ...base, particleCount: 120, origin: { x: 0.8, y: 0.85 } })

		const timer = window.setTimeout(() => {
			onDone?.()
		}, 1800)

		return () => {
			window.clearTimeout(timer)
		}
	}, [active, onDone])

	useEffect(() => {
		if (!active) {
			hasPlayedRef.current = false
		}
	}, [active])

	return null
}

export default WorkoutCompletionConfetti
