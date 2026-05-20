import { useEffect, useMemo, useState } from "react"
import { Flame, ChevronRight, Dumbbell } from "lucide-react"
import { motion } from "framer-motion"
import AppPageFrame from "../components/AppPageFrame.jsx"
import BaseCard from "../components/dashboard/BaseCard"
import HeroWorkoutCard from "../components/dashboard/HeroWorkoutCard"
import DailyStatCard from "../components/dashboard/DailyStatCard"
import AnimatedProgressBar from "../components/dashboard/AnimatedProgressBar"
import QuickActionButton from "../components/dashboard/QuickActionButton"
import RecommendedWorkoutCard from "../components/dashboard/RecommendedWorkoutCard"
import ActivityFeedItem from "../components/dashboard/ActivityFeedItem"
import WeightProgressChart from "../components/dashboard/WeightProgressChart"
import WorkoutConsistencyChart from "../components/dashboard/WorkoutConsistencyChart"
import { fitnessDashboardMockData } from "../data/fitnessMockData"

function Dashboard() {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const timer = window.setTimeout(() => setIsLoading(false), 850)
		return () => window.clearTimeout(timer)
	}, [])

	const data = fitnessDashboardMockData

	const greeting = useMemo(() => {
		const hour = new Date().getHours()
		if (hour < 12) return "Good morning"
		if (hour < 18) return "Good afternoon"
		return "Good evening"
	}, [])

	return (
		<AppPageFrame>
			<div className="-mx-6 md:-mx-10 pb-24">
				<div className="w-full px-6 sm:px-8 lg:px-10 pt-5 sm:pt-6 pb-7 sm:pb-8 space-y-6 sm:space-y-7">
					<header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="min-w-0">
							<p className="text-sm text-[hsl(var(--muted))]">{greeting}</p>
							<h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
								{data.profile.name}
							</h1>
						</div>
						<div className="flex items-center gap-2 self-start md:self-auto">
							<div className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-[hsl(var(--primary))]/30 bg-[hsl(var(--primary))]/10 px-2.5 py-1.5 text-xs font-semibold text-[hsl(var(--primary))]">
								<Flame className="h-3.5 w-3.5" />
								{data.profile.streakDays} day streak
							</div>
						</div>
					</header>

					<HeroWorkoutCard
						title={data.todayWorkout.title}
						type={data.todayWorkout.type}
						durationMinutes={data.todayWorkout.durationMinutes}
						difficulty={data.todayWorkout.difficulty}
						estimatedCalories={data.todayWorkout.estimatedCalories}
						weeklyCompletionPercent={data.todayWorkout.weeklyCompletionPercent}
						isLoading={isLoading}
					/>

					<section>
						<div className="mb-3 flex items-center justify-between">
							<h2 className="text-base font-semibold tracking-tight">
								Daily Stats
							</h2>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
							{data.dailyStats.map((stat) => (
								<DailyStatCard
									key={stat.label}
									label={stat.label}
									value={stat.value}
									delta={stat.delta}
									direction={stat.direction}
									isLoading={isLoading}
								/>
							))}
						</div>
					</section>

					<section>
						<div className="mb-3 flex items-center justify-between">
							<h2 className="text-base font-semibold tracking-tight">
								Weekly Goals
							</h2>
						</div>
						<BaseCard className="p-4 sm:p-5 space-y-5">
							{isLoading ? (
								<div className="space-y-4 animate-pulse">
									<div className="h-4 rounded bg-[hsl(var(--border))]" />
									<div className="h-2.5 rounded bg-[hsl(var(--border))]" />
									<div className="h-4 rounded bg-[hsl(var(--border))]" />
									<div className="h-2.5 rounded bg-[hsl(var(--border))]" />
								</div>
							) : (
								data.weeklyGoals.map((goal) => {
									const percent = (goal.current / goal.target) * 100
									return (
										<div key={goal.id}>
											<div className="mb-2 flex items-center justify-between text-sm">
												<span className="text-[hsl(var(--fg))]">
													{goal.title}
												</span>
												<span className="text-[hsl(var(--muted))]">
													{goal.current.toLocaleString()} /{" "}
													{goal.target.toLocaleString()} {goal.unit}
												</span>
											</div>
											<AnimatedProgressBar value={percent} />
										</div>
									)
								})
							)}
						</BaseCard>
					</section>

					<section>
						<div className="mb-3 flex items-center justify-between">
							<h2 className="text-base font-semibold tracking-tight">
								Progress Charts
							</h2>
						</div>
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
							<BaseCard className="p-4 sm:p-5">
								<div className="mb-3 flex items-center justify-between">
									<h3 className="font-semibold">Weight Progress</h3>
								</div>
								<WeightProgressChart
									data={data.weightProgress}
									isLoading={isLoading}
								/>
							</BaseCard>
							<BaseCard className="p-4 sm:p-5">
								<div className="mb-3 flex items-center justify-between">
									<h3 className="font-semibold">Workout Consistency</h3>
								</div>
								<WorkoutConsistencyChart
									data={data.workoutConsistency}
									isLoading={isLoading}
								/>
							</BaseCard>
						</div>
					</section>

					<section>
						<div className="mb-3 flex items-center justify-between">
							<h2 className="text-base font-semibold tracking-tight">
								Quick Actions
							</h2>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
							{data.quickActions.map((action) => (
								<QuickActionButton
									key={action.id}
									label={action.label}
									icon={action.icon}
									isLoading={isLoading}
								/>
							))}
						</div>
					</section>

					<section>
						<div className="mb-3 flex items-center justify-between">
							<h2 className="text-base font-semibold tracking-tight">
								Recommended Workouts
							</h2>
							<button className="inline-flex items-center gap-1 text-sm text-[hsl(var(--muted))] transition hover:text-[hsl(var(--fg))]">
								See all <ChevronRight className="h-4 w-4" />
							</button>
						</div>
						<div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
							{data.recommendedWorkouts.map((workout) => (
								<div key={workout.id} className="snap-start">
									<RecommendedWorkoutCard
										workout={workout}
										isLoading={isLoading}
									/>
								</div>
							))}
						</div>
					</section>

					<section>
						<div className="mb-3 flex items-center justify-between">
							<h2 className="text-base font-semibold tracking-tight">
								Recent Activity
							</h2>
						</div>
						<BaseCard className="p-4 sm:p-5">
							<div className="space-y-2.5">
								{data.recentActivity.map((item) => (
									<ActivityFeedItem
										key={item.id}
										item={item}
										isLoading={isLoading}
									/>
								))}
							</div>
						</BaseCard>
					</section>

					<motion.button
						whileTap={{ scale: 0.98 }}
						className="hidden md:flex fixed bottom-7 right-7 items-center gap-2 rounded-2xl bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-[hsl(var(--primary-fg))] shadow-lg shadow-[hsl(var(--primary))]/30 transition hover:bg-[hsl(var(--primary-hover))]">
						<Dumbbell className="h-4 w-4" />
						Start Workout
					</motion.button>
				</div>
			</div>
		</AppPageFrame>
	)
}

export default Dashboard
