import { Clock3, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

function RecommendedWorkoutCard({ workout, onClick, isLoading = false }) {
	if (isLoading) {
		return (
			<div className="h-52 min-w-[250px] animate-pulse rounded-2xl bg-[hsl(var(--border))]" />
		)
	}

	return (
		<motion.button
			type="button"
			onClick={onClick}
			whileHover={{ y: -3 }}
			className="min-w-[250px] overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-left transition hover:border-[hsl(var(--primary))]/60">
			<img
				src={workout.imageUrl}
				alt={workout.title}
				className="h-28 w-full object-cover"
			/>
			<div className="p-4">
				<p className="text-base font-semibold text-[hsl(var(--fg))]">
					{workout.title}
				</p>
				<div className="mt-3 flex items-center gap-4 text-xs text-[hsl(var(--muted))]">
					<span className="inline-flex items-center gap-1">
						<BarChart3 className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
						{workout.difficulty}
					</span>
					<span className="inline-flex items-center gap-1">
						<Clock3 className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
						{workout.durationMinutes} min
					</span>
				</div>
			</div>
		</motion.button>
	)
}

export default RecommendedWorkoutCard
