import { useEffect, useState } from "react"

function AnimatedCount({ value, duration = 450 }) {
	const [displayValue, setDisplayValue] = useState(Number(value) || 0)

	useEffect(() => {
		const startValue = Number(displayValue) || 0
		const targetValue = Number(value) || 0
		if (startValue === targetValue) return

		let animationFrame
		const startTime = performance.now()

		const step = (time) => {
			const progress = Math.min((time - startTime) / duration, 1)
			const next = Math.round(
				startValue + (targetValue - startValue) * progress,
			)
			setDisplayValue(next)
			if (progress < 1) {
				animationFrame = window.requestAnimationFrame(step)
			}
		}

		animationFrame = window.requestAnimationFrame(step)
		return () => {
			window.cancelAnimationFrame(animationFrame)
		}
	}, [duration, value])

	return <>{displayValue}</>
}

export default AnimatedCount
