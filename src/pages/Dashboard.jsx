import { useEffect, useMemo, useState } from "react"
import { Flame, ChevronRight, Dumbbell } from "lucide-react"
import { motion } from "framer-motion"
import AppPageFrame from "../components/AppPageFrame.jsx"
import ExerciseDetailModal from "../components/ExerciseDetailModal.jsx"
import BaseCard from "../components/dashboard/BaseCard"
import HeroWorkoutCard from "../components/dashboard/HeroWorkoutCard"
import DailyStatCard from "../components/dashboard/DailyStatCard"
import QuickActionButton from "../components/dashboard/QuickActionButton"
import RecommendedWorkoutCard from "../components/dashboard/RecommendedWorkoutCard"
import ActivityFeedItem from "../components/dashboard/ActivityFeedItem"
import WeightProgressChart from "../components/dashboard/WeightProgressChart"
import WorkoutConsistencyChart from "../components/dashboard/WorkoutConsistencyChart"
import { fitnessDashboardMockData } from "../data/fitnessMockData"
import workoutExerciseData from "../data/workoutExerciseData.js"
import { getWorkouts } from "../services/workoutStorage.js"

const toTitleCase = (value = "") =>
	value
		.toLowerCase()
		.split(" ")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")

const toDisplayLabel = (value = "") =>
	value
		.split("-")
		.map((part) => toTitleCase(part))
		.join(" ")

const getDaySeed = (date) =>
	Math.floor(
		new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() /
			86400000,
	)

const parseWorkoutDate = (dateString = "") => {
	const [year, month, day] = dateString.split("-").map(Number)
	if (!year || !month || !day) {
		return null
	}
	return new Date(year, month - 1, day)
}

const getDateKey = (date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
		date.getDate(),
	).padStart(2, "0")}`

const getWorkoutVolume = (workout) =>
	(workout.exercises ?? []).reduce(
		(total, exercise) =>
			total +
			(exercise.sets ?? []).reduce((setTotal, set) => {
				const weight = parseFloat(set.weight) || 0
				const reps = parseInt(set.reps, 10) || 0
				return setTotal + weight * reps
			}, 0),
		0,
	)

const getWorkoutSetCount = (workout) =>
	(workout.exercises ?? []).reduce(
		(total, exercise) => total + (exercise.sets ?? []).length,
		0,
	)

function Dashboard() {
	const [isLoading, setIsLoading] = useState(true)
	const [selectedExercise, setSelectedExercise] = useState(null)
	const [workouts, setWorkouts] = useState([])

	useEffect(() => {
		const timer = window.setTimeout(() => setIsLoading(false), 850)
		return () => window.clearTimeout(timer)
	}, [])

	useEffect(() => {
		const refreshWorkouts = () => {
			setWorkouts(getWorkouts())
		}

		refreshWorkouts()
		window.addEventListener("focus", refreshWorkouts)
		window.addEventListener("storage", refreshWorkouts)

		return () => {
			window.removeEventListener("focus", refreshWorkouts)
			window.removeEventListener("storage", refreshWorkouts)
		}
	}, [])

	const data = fitnessDashboardMockData

	const handleStartWorkout = () => {
		if (todayWorkout.exercise) {
			setSelectedExercise(todayWorkout.exercise)
		}
	}

	const greeting = useMemo(() => {
		const hour = new Date().getHours()
		if (hour < 12) return "Good morning"
		if (hour < 18) return "Good afternoon"
		return "Good evening"
	}, [])

	const dailyStats = useMemo(() => {
		const today = new Date()
		const yesterday = new Date(today)
		yesterday.setDate(today.getDate() - 1)

		const todayKey = getDateKey(today)
		const yesterdayKey = getDateKey(yesterday)

		const todaysWorkouts = workouts.filter(
			(workout) => workout.date === todayKey,
		)
		const yesterdaysWorkouts = workouts.filter(
			(workout) => workout.date === yesterdayKey,
		)

		const todayVolume = todaysWorkouts.reduce(
			(total, workout) => total + getWorkoutVolume(workout),
			0,
		)
		const yesterdayVolume = yesterdaysWorkouts.reduce(
			(total, workout) => total + getWorkoutVolume(workout),
			0,
		)

		const todaySets = todaysWorkouts.reduce(
			(total, workout) => total + getWorkoutSetCount(workout),
			0,
		)
		const yesterdaySets = yesterdaysWorkouts.reduce(
			(total, workout) => total + getWorkoutSetCount(workout),
			0,
		)

		const volumeDeltaPercent =
			yesterdayVolume > 0
				? Math.round(((todayVolume - yesterdayVolume) / yesterdayVolume) * 100)
				: todayVolume > 0
					? 100
					: 0

		const setsDelta = todaySets - yesterdaySets

		return [
			{
				label: "Volume Lifted",
				value: `${Math.round(todayVolume).toLocaleString()} kg`,
				delta:
					volumeDeltaPercent === 0
						? "No change vs yesterday"
						: `${volumeDeltaPercent > 0 ? "+" : ""}${volumeDeltaPercent}% vs yesterday`,
				direction: volumeDeltaPercent >= 0 ? "up" : "down",
			},
			{
				label: "Sets Completed",
				value: todaySets.toLocaleString(),
				delta:
					setsDelta === 0
						? "No change vs yesterday"
						: `${setsDelta > 0 ? "+" : ""}${setsDelta} vs yesterday`,
				direction: setsDelta >= 0 ? "up" : "down",
			},
		]
	}, [workouts])

	const weeklyCompletionPercent = useMemo(() => {
		const workoutsGoal = data.weeklyGoals.find((goal) => goal.id === "workouts")
		const target = workoutsGoal?.target
		if (!target) {
			return data.todayWorkout.weeklyCompletionPercent
		}

		const now = new Date()
		const startOfWeek = new Date(now)
		const day = startOfWeek.getDay()
		const offsetToMonday = day === 0 ? 6 : day - 1
		startOfWeek.setDate(startOfWeek.getDate() - offsetToMonday)
		startOfWeek.setHours(0, 0, 0, 0)

		const completedThisWeek = workouts.filter((workout) => {
			const workoutDate = parseWorkoutDate(workout.date)
			if (!workoutDate) {
				return false
			}
			return workoutDate >= startOfWeek && workoutDate <= now
		}).length

		const percent = (completedThisWeek / target) * 100
		return Math.round(Math.max(0, Math.min(100, percent)))
	}, [data.todayWorkout.weeklyCompletionPercent, data.weeklyGoals, workouts])

	const todayWorkout = useMemo(() => {
		const exercises = workoutExerciseData?.data ?? []
		if (!exercises.length) {
			return {
				...data.todayWorkout,
				weeklyCompletionPercent,
			}
		}

		const now = new Date()
		const seed = getDaySeed(now)

		const exercisesByBodyPart = exercises.reduce((grouped, exercise) => {
			const primaryBodyPart = exercise?.bodyParts?.[0] || "full body"
			if (!grouped[primaryBodyPart]) {
				grouped[primaryBodyPart] = []
			}
			grouped[primaryBodyPart].push(exercise)
			return grouped
		}, {})

		const availableBodyParts = Object.keys(exercisesByBodyPart).sort()
		if (!availableBodyParts.length) {
			return {
				...data.todayWorkout,
				weeklyCompletionPercent,
			}
		}

		const selectedBodyPart =
			availableBodyParts[Math.abs(seed) % availableBodyParts.length]
		const candidates = exercisesByBodyPart[selectedBodyPart] ?? exercises
		const exercise = candidates[Math.abs(seed) % candidates.length]

		const bodyPart = toDisplayLabel(exercise?.bodyParts?.[0] || "full body")
		const focusType = toDisplayLabel(exercise?.exerciseTypes?.[0] || "strength")
		const durationMinutes = 30 + (seed % 5) * 5
		const estimatedCalories = 240 + (seed % 7) * 35

		return {
			exercise,
			title: toTitleCase(exercise?.name || data.todayWorkout.title),
			type: `${focusType} • ${bodyPart}`,
			durationMinutes,
			difficulty: toTitleCase(exercise?.difficulty || "intermediate"),
			estimatedCalories,
			weeklyCompletionPercent,
		}
	}, [data.todayWorkout, weeklyCompletionPercent])

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
						title={todayWorkout.title}
						type={todayWorkout.type}
						durationMinutes={todayWorkout.durationMinutes}
						difficulty={todayWorkout.difficulty}
						estimatedCalories={todayWorkout.estimatedCalories}
						weeklyCompletionPercent={todayWorkout.weeklyCompletionPercent}
						onStartWorkout={handleStartWorkout}
						isLoading={isLoading}
					/>

					<section>
						<div className="mb-3 flex items-center justify-between">
							<h2 className="text-base font-semibold tracking-tight">
								Daily Stats
							</h2>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
							{dailyStats.map((stat) => (
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
						onClick={handleStartWorkout}
						className="hidden md:flex fixed bottom-7 right-7 items-center gap-2 rounded-2xl bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-[hsl(var(--primary-fg))] shadow-lg shadow-[hsl(var(--primary))]/30 transition hover:bg-[hsl(var(--primary-hover))]">
						<Dumbbell className="h-4 w-4" />
						Start Workout
					</motion.button>

					{selectedExercise && (
						<ExerciseDetailModal
							exercise={selectedExercise}
							onClose={() => setSelectedExercise(null)}
						/>
					)}
				</div>
			</div>
		</AppPageFrame>
	)
}

export default Dashboard
