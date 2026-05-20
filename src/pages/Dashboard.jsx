import { useEffect, useMemo, useState } from "react"
import { Bell, Flame, ChevronRight, Dumbbell } from "lucide-react"
import { motion } from "framer-motion"
import BaseCard from "../components/dashboard/BaseCard"
import HeroWorkoutCard from "../components/dashboard/HeroWorkoutCard"
import DailyStatCard from "../components/dashboard/DailyStatCard"
import AnimatedProgressBar from "../components/dashboard/AnimatedProgressBar"
import QuickActionButton from "../components/dashboard/QuickActionButton"
import RecommendedWorkoutCard from "../components/dashboard/RecommendedWorkoutCard"
import ActivityFeedItem from "../components/dashboard/ActivityFeedItem"
import BottomNavigation from "../components/dashboard/BottomNavigation"
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
		<div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24">
			<div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6 sm:space-y-7">
				<header className="flex items-center justify-between">
					<div>
						<p className="text-sm text-zinc-400">{greeting}</p>
						<h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
							{data.profile.name}
						</h1>
					</div>
					<div className="flex items-center gap-2.5">
						<div className="hidden sm:inline-flex items-center gap-1.5 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-300">
							<Flame className="h-3.5 w-3.5" />
							{data.profile.streakDays} day streak
						</div>
						<button className="relative rounded-2xl border border-zinc-800 bg-zinc-900 p-2.5 transition hover:bg-zinc-800">
							<Bell className="h-4.5 w-4.5 text-zinc-300" />
							<span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
								{data.profile.unreadNotifications}
							</span>
						</button>
						<img
							src={data.profile.avatarUrl}
							alt="User avatar"
							className="h-10 w-10 rounded-2xl border border-zinc-800 object-cover"
						/>
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
								<div className="h-4 rounded bg-zinc-800" />
								<div className="h-2.5 rounded bg-zinc-800" />
								<div className="h-4 rounded bg-zinc-800" />
								<div className="h-2.5 rounded bg-zinc-800" />
							</div>
						) : (
							data.weeklyGoals.map((goal) => {
								const percent = (goal.current / goal.target) * 100
								return (
									<div key={goal.id}>
										<div className="mb-2 flex items-center justify-between text-sm">
											<span className="text-zinc-200">{goal.title}</span>
											<span className="text-zinc-400">
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
						<button className="inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-zinc-200">
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
					className="hidden md:flex fixed bottom-7 right-7 items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-400">
					<Dumbbell className="h-4 w-4" />
					Start Workout
				</motion.button>
			</div>

			<BottomNavigation />
		</div>
	)
}

export default Dashboard
