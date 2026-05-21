import { Dumbbell, Droplets, ListChecks, Scale, Utensils } from "lucide-react"

const iconMap = {
	Dumbbell,
	Scale,
	Utensils,
	Droplets,
	ListChecks,
}

function QuickActionButton({ label, icon, onClick, isLoading = false }) {
	const Icon = iconMap[icon] ?? Dumbbell

	if (isLoading) {
		return (
			<div className="h-16 animate-pulse rounded-2xl bg-[hsl(var(--border))]" />
		)
	}

	return (
		<button
			type="button"
			onClick={onClick}
			className="group flex h-16 items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 text-left transition hover:border-[hsl(var(--primary))]/60 hover:bg-[hsl(var(--bg))] active:scale-[0.99]">
			<span className="rounded-xl bg-[hsl(var(--bg))] p-2.5 text-[hsl(var(--primary))] transition group-hover:bg-[hsl(var(--primary))]/10">
				<Icon className="h-4.5 w-4.5" />
			</span>
			<span className="text-sm font-medium text-[hsl(var(--fg))]">{label}</span>
		</button>
	)
}

export default QuickActionButton
