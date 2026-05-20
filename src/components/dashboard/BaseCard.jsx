import { motion } from "framer-motion"

function BaseCard({ children, className = "" }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35, ease: "easeOut" }}
			className={`rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${className}`}>
			{children}
		</motion.div>
	)
}

export default BaseCard
