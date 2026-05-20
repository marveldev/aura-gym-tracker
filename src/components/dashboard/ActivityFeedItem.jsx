import { Trophy, CheckCircle2, Flame } from "lucide-react"

function ActivityFeedItem({ item, isLoading = false }) {
	if (isLoading) {
		return <div className="h-16 animate-pulse rounded-xl bg-zinc-800" />
	}

	const Icon =
		item.type === "workout"
			? CheckCircle2
			: item.type === "record"
				? Trophy
				: Flame

	return (
		<div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3.5">
			<span className="mt-0.5 rounded-lg bg-zinc-800 p-2 text-orange-400">
				<Icon className="h-4 w-4" />
			</span>
			<div className="min-w-0">
				<p className="text-sm font-semibold text-zinc-100">{item.title}</p>
				<p className="mt-0.5 text-xs text-zinc-400">{item.description}</p>
				<p className="mt-1.5 text-[11px] text-zinc-500">{item.time}</p>
			</div>
		</div>
	)
}

export default ActivityFeedItem
