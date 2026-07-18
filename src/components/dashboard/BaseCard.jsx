import { motion } from "framer-motion"
import { forwardRef } from "react"

const BaseCard = forwardRef(function BaseCard(
	{ children, className = "", style },
	ref,
) {
	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35, ease: "easeOut" }}
			style={style}
			className={`rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-sm ${className}`}>
			{children}
		</motion.div>
	)
})

export default BaseCard
