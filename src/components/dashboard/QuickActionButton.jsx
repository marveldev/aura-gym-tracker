import { Dumbbell, Droplets, ListChecks, Scale, Utensils } from "lucide-react"

const iconMap = {
	Dumbbell,
	Scale,
	Utensils,
	Droplets,
	ListChecks,
}

function QuickActionButton({ label, icon, isLoading = false }) {
	const Icon = iconMap[icon] ?? Dumbbell

	if (isLoading) {
		return <div className="h-16 animate-pulse rounded-2xl bg-zinc-800" />
	}

	return (
		<button className="group flex h-16 items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 text-left transition hover:border-orange-500/60 hover:bg-zinc-800/80 active:scale-[0.99]">
			<span className="rounded-xl bg-zinc-800 p-2.5 text-orange-400 transition group-hover:bg-orange-500/20">
				<Icon className="h-4.5 w-4.5" />
			</span>
			<span className="text-sm font-medium text-zinc-100">{label}</span>
		</button>
	)
}

export default QuickActionButton
