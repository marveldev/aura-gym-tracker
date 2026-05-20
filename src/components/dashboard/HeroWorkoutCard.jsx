import { Flame, Timer, Zap, GaugeCircle } from "lucide-react"
import BaseCard from "./BaseCard"
import AnimatedProgressBar from "./AnimatedProgressBar"

function HeroWorkoutCard({
	title,
	type,
	durationMinutes,
	difficulty,
	estimatedCalories,
	weeklyCompletionPercent,
	isLoading = false,
}) {
	return (
		<BaseCard className="p-5 sm:p-6">
			{isLoading ? (
				<div className="space-y-4 animate-pulse">
					<div className="h-4 w-36 rounded bg-[hsl(var(--border))]" />
					<div className="h-8 w-52 rounded bg-[hsl(var(--border))]" />
					<div className="grid grid-cols-2 gap-3">
						<div className="h-16 rounded-xl bg-[hsl(var(--border))]" />
						<div className="h-16 rounded-xl bg-[hsl(var(--border))]" />
					</div>
					<div className="h-11 rounded-xl bg-[hsl(var(--border))]" />
				</div>
			) : (
				<>
					<p className="text-xs uppercase tracking-wider text-[hsl(var(--primary))]">
						Today's Workout
					</p>
					<h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[hsl(var(--fg))]">
						{title}
					</h2>
					<p className="mt-1 text-sm text-[hsl(var(--muted))]">{type}</p>

					<div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
						<div className="rounded-xl bg-[hsl(var(--bg))] p-3 border border-[hsl(var(--border))]">
							<div className="flex items-center gap-2 text-[hsl(var(--muted))] text-xs">
								<Timer className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />{" "}
								Duration
							</div>
							<p className="mt-1 text-[hsl(var(--fg))] font-semibold">
								{durationMinutes} min
							</p>
						</div>
						<div className="rounded-xl bg-[hsl(var(--bg))] p-3 border border-[hsl(var(--border))]">
							<div className="flex items-center gap-2 text-[hsl(var(--muted))] text-xs">
								<GaugeCircle className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
								Difficulty
							</div>
							<p className="mt-1 text-[hsl(var(--fg))] font-semibold">
								{difficulty}
							</p>
						</div>
						<div className="rounded-xl bg-[hsl(var(--bg))] p-3 border border-[hsl(var(--border))]">
							<div className="flex items-center gap-2 text-[hsl(var(--muted))] text-xs">
								<Flame className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />{" "}
								Calories
							</div>
							<p className="mt-1 text-[hsl(var(--fg))] font-semibold">
								{estimatedCalories} kcal
							</p>
						</div>
						<div className="rounded-xl bg-[hsl(var(--bg))] p-3 border border-[hsl(var(--border))]">
							<div className="flex items-center gap-2 text-[hsl(var(--muted))] text-xs">
								<Zap className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />{" "}
								Weekly
							</div>
							<p className="mt-1 text-[hsl(var(--fg))] font-semibold">
								{weeklyCompletionPercent}%
							</p>
						</div>
					</div>

					<button className="mt-5 w-full sm:w-auto rounded-2xl bg-[hsl(var(--primary))] px-6 py-3 text-sm font-semibold text-[hsl(var(--primary-fg))] transition hover:bg-[hsl(var(--primary-hover))] active:scale-[0.98]">
						Start Workout
					</button>

					<div className="mt-5">
						<div className="mb-2 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
							<span>Weekly completion</span>
							<span>{weeklyCompletionPercent}%</span>
						</div>
						<AnimatedProgressBar value={weeklyCompletionPercent} />
					</div>
				</>
			)}
		</BaseCard>
	)
}

export default HeroWorkoutCard
