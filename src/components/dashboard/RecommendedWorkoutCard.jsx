import { Clock3, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

function RecommendedWorkoutCard({ workout, isLoading = false }) {
	if (isLoading) {
		return (
			<div className="h-52 min-w-[250px] animate-pulse rounded-2xl bg-zinc-800" />
		)
	}

	return (
		<motion.div
			whileHover={{ y: -3 }}
			className="min-w-[250px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
			<img
				src={workout.imageUrl}
				alt={workout.title}
				className="h-28 w-full object-cover"
			/>
			<div className="p-4">
				<p className="text-base font-semibold text-zinc-100">{workout.title}</p>
				<div className="mt-3 flex items-center gap-4 text-xs text-zinc-400">
					<span className="inline-flex items-center gap-1">
						<BarChart3 className="h-3.5 w-3.5 text-orange-400" />
						{workout.difficulty}
					</span>
					<span className="inline-flex items-center gap-1">
						<Clock3 className="h-3.5 w-3.5 text-orange-400" />
						{workout.durationMinutes} min
					</span>
				</div>
			</div>
		</motion.div>
	)
}

export default RecommendedWorkoutCard
