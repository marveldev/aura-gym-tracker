import { TrendingDown, TrendingUp } from "lucide-react"
import BaseCard from "./BaseCard"

function DailyStatCard({ label, value, delta, direction, isLoading = false }) {
	return (
		<BaseCard className="p-4 sm:p-5">
			{isLoading ? (
				<div className="space-y-3 animate-pulse">
					<div className="h-3 w-24 rounded bg-[hsl(var(--border))]" />
					<div className="h-7 w-28 rounded bg-[hsl(var(--border))]" />
					<div className="h-3 w-32 rounded bg-[hsl(var(--border))]" />
				</div>
			) : (
				<>
					<p className="text-xs uppercase tracking-wider text-[hsl(var(--muted))]">
						{label}
					</p>
					<p className="mt-2 text-2xl font-semibold text-[hsl(var(--fg))]">
						{value}
					</p>
					<div className="mt-3 flex items-center gap-1.5 text-xs text-[hsl(var(--muted))]">
						{direction === "up" ? (
							<TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
						) : (
							<TrendingDown className="h-3.5 w-3.5 text-rose-400" />
						)}
						<span>{delta}</span>
					</div>
				</>
			)}
		</BaseCard>
	)
}

export default DailyStatCard
