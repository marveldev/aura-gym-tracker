import { motion } from "framer-motion"

function AnimatedProgressBar({ value, className = "" }) {
	const safeValue = Math.max(0, Math.min(100, value))

	return (
		<div
			className={`h-2.5 w-full rounded-full bg-[hsl(var(--border))] ${className}`}>
			<motion.div
				initial={{ width: 0 }}
				animate={{ width: `${safeValue}%` }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-amber-400"
			/>
		</div>
	)
}

export default AnimatedProgressBar
