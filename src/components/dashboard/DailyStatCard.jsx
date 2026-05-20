import { TrendingDown, TrendingUp } from "lucide-react"
import BaseCard from "./BaseCard"

function DailyStatCard({ label, value, delta, direction, isLoading = false }) {
	return (
		<BaseCard className="p-4 sm:p-5">
			{isLoading ? (
				<div className="space-y-3 animate-pulse">
					<div className="h-3 w-24 rounded bg-zinc-700" />
					<div className="h-7 w-28 rounded bg-zinc-700" />
					<div className="h-3 w-32 rounded bg-zinc-700" />
				</div>
			) : (
				<>
					<p className="text-xs uppercase tracking-wider text-zinc-400">
						{label}
					</p>
					<p className="mt-2 text-2xl font-semibold text-zinc-100">{value}</p>
					<div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-300">
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
