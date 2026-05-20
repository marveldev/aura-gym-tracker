import { Trophy, CheckCircle2, Flame } from "lucide-react"

function ActivityFeedItem({ item, isLoading = false }) {
	if (isLoading) {
		return (
			<div className="h-16 animate-pulse rounded-xl bg-[hsl(var(--border))]" />
		)
	}

	const Icon =
		item.type === "workout"
			? CheckCircle2
			: item.type === "record"
				? Trophy
				: Flame

	return (
		<div className="flex items-start gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-3.5">
			<span className="mt-0.5 rounded-lg bg-[hsl(var(--bg))] p-2 text-[hsl(var(--primary))]">
				<Icon className="h-4 w-4" />
			</span>
			<div className="min-w-0">
				<p className="text-sm font-semibold text-[hsl(var(--fg))]">
					{item.title}
				</p>
				<p className="mt-0.5 text-xs text-[hsl(var(--muted))]">
					{item.description}
				</p>
				<p className="mt-1.5 text-[11px] text-[hsl(var(--muted))]">
					{item.time}
				</p>
			</div>
		</div>
	)
}

export default ActivityFeedItem
