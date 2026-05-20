import { motion } from "framer-motion"

function BaseCard({ children, className = "" }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35, ease: "easeOut" }}
			className={`rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-sm ${className}`}>
			{children}
		</motion.div>
	)
}

export default BaseCard
