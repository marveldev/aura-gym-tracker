import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
	ArrowLeft,
	Search,
	X,
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	Timer,
	Flame,
	Activity,
	BarChart3,
	Dumbbell,
	Trophy,
	Sparkles,
	Medal,
	Award,
	TrendingUp,
	CalendarClock,
	Scale,
} from "lucide-react"
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"
import AppPageFrame from "../components/AppPageFrame.jsx"
import BaseCard from "../components/dashboard/BaseCard"
import WorkoutConsistencyChart from "../components/dashboard/WorkoutConsistencyChart.jsx"
import WeightProgressChart from "../components/dashboard/WeightProgressChart.jsx"
import { getWorkouts } from "../services/workoutStorage.js"
import {
	getWorkoutSessions,
	subscribeWorkoutChanges,
} from "../store/workout/workoutStore.js"
import {
	calculateFitnessStats,
	calculateStreak,
} from "../utils/fitness/fitnessStats.js"
import workoutExerciseData from "../data/workoutExerciseData.js"

const RANGE_OPTIONS = ["Week", "Month", "Year", "All Time"]
const FILTER_OPTIONS = [
	"All",
	"Strength",
	"Cardio",
	"Mobility",
	"Running",
	"Custom Workouts",
]

const MUSCLE_LABELS = {
	chest: "Chest",
	back: "Back",
	"upper legs": "Upper Legs",
	"lower legs": "Lower Legs",
	shoulders: "Shoulders",
	"upper arms": "Upper Arms",
	waist: "Core",
	cardio: "Cardio",
}

const EXERCISE_BY_ID = new Map(
	(workoutExerciseData.data ?? []).map((exercise) => [
		String(exercise.exerciseId),
		exercise,
	]),
)

const EXERCISE_BY_NAME = new Map(
	(workoutExerciseData.data ?? []).map((exercise) => [
		exercise.name.toLowerCase(),
		exercise,
	]),
)

const getDateKey = (date) => {
	const next = new Date(date)
	return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`
}

const parseDate = (value) => {
	const date = new Date(value)
	return Number.isNaN(date.getTime()) ? null : date
}

const formatLongDate = (value) => {
	const date = parseDate(value)
	if (!date) return "Unknown date"
	return date.toLocaleDateString(undefined, {
		weekday: "long",
		month: "short",
		day: "numeric",
		year: "numeric",
	})
}

const formatShortTime = (value) => {
	const date = parseDate(value)
	if (!date) return ""
	return date.toLocaleTimeString(undefined, {
		hour: "numeric",
		minute: "2-digit",
	})
}

const formatRangeTitle = (value) => {
	if (value === "All Time") return "All Time"
	return value
}

const startOfDay = (date) => {
	const next = new Date(date)
	next.setHours(0, 0, 0, 0)
	return next
}

const startOfWeek = (date) => {
	const next = startOfDay(date)
	const day = next.getDay()
	const offset = day === 0 ? 6 : day - 1
	next.setDate(next.getDate() - offset)
	return next
}

const startOfMonth = (date) => {
	const next = new Date(date.getFullYear(), date.getMonth(), 1)
	next.setHours(0, 0, 0, 0)
	return next
}

const endOfMonth = (date) => {
	const next = new Date(date.getFullYear(), date.getMonth() + 1, 0)
	next.setHours(23, 59, 59, 999)
	return next
}

const startOfYear = (date) => {
	const next = new Date(date.getFullYear(), 0, 1)
	next.setHours(0, 0, 0, 0)
	return next
}

const getRangeBounds = (range, now = new Date()) => {
	if (range === "All Time") return { start: null, end: now }
	if (range === "Week") {
		const start = startOfWeek(now)
		const end = new Date(now)
		end.setHours(23, 59, 59, 999)
		return { start, end }
	}
	if (range === "Year") {
		const start = startOfYear(now)
		const end = new Date(now)
		end.setHours(23, 59, 59, 999)
		return { start, end }
	}
	const start = new Date(now)
	start.setDate(start.getDate() - 29)
	start.setHours(0, 0, 0, 0)
	const end = new Date(now)
	end.setHours(23, 59, 59, 999)
	return { start, end }
}

const withinBounds = (date, bounds) => {
	if (!date) return false
	if (!bounds.start) return date <= bounds.end
	return date >= bounds.start && date <= bounds.end
}

const getWorkoutPeakWeight = (workout) => {
	let peak = 0
	;(workout.exercises ?? []).forEach((exercise) => {
		;(exercise.sets ?? []).forEach((set) => {
			const weight = Number(set.weight) || 0
			if (weight > peak) peak = weight
		})
	})
	return peak
}

const estimateDuration = (workout) => {
	const exerciseCount = workout.exercises?.length ?? 0
	const setCount = (workout.exercises ?? []).reduce(
		(total, exercise) => total + (exercise.sets?.length ?? 0),
		0,
	)
	return Math.max(20, exerciseCount * 8 + setCount * 2)
}

const estimateCalories = (workout, durationMinutes) =>
	Math.max(0, Math.round((durationMinutes || estimateDuration(workout)) * 7.2))

const resolveExerciseMeta = (exercise) => {
	const byId = EXERCISE_BY_ID.get(String(exercise?.id || ""))
	const byName = EXERCISE_BY_NAME.get(
		String(exercise?.name || "").toLowerCase(),
	)
	return byId || byName || null
}

const normalizeExercise = (exercise, index) => {
	const meta = resolveExerciseMeta(exercise)
	return {
		id: exercise?.id || `ex-${index + 1}`,
		name: String(exercise?.name || `Exercise ${index + 1}`).trim(),
		sets: Array.isArray(exercise?.sets)
			? exercise.sets.map((set) => ({
					weight: Number(set?.weight) || 0,
					reps: Number(set?.reps) || 0,
				}))
			: [],
		bodyParts: meta?.bodyParts ?? [],
		targetMuscles: meta?.targetMuscles ?? [],
		secondaryMuscles: meta?.secondaryMuscles ?? [],
		equipments: meta?.equipments ?? [],
		exerciseTypes: meta?.exerciseTypes ?? [],
	}
}

const inferWorkoutType = (workout) => {
	const searchableText = [
		workout?.workoutName,
		workout?.focus,
		workout?.notes,
		...(workout?.exercises ?? []).map((exercise) => exercise.name),
	]
		.join(" ")
		.toLowerCase()

	if (/(running|run|jog|treadmill)/.test(searchableText)) return "Running"
	if (
		/(cardio|hiit|bike|cycling|row|rowing|elliptical|stairs)/.test(
			searchableText,
		)
	) {
		return "Cardio"
	}
	if (/(mobility|stretch|yoga|flow|recovery)/.test(searchableText))
		return "Mobility"
	if (/(custom)/.test(searchableText)) return "Custom Workouts"
	if (workout?.source === "legacy") return "Custom Workouts"
	return "Strength"
}

const normalizeHistoryEntry = (record, source = "session") => {
	const completedAt = parseDate(record?.completedAt || record?.date)
	const normalizedExercises = Array.isArray(record?.exercises)
		? record.exercises.map(normalizeExercise)
		: []
	const durationMinutes = Math.max(
		1,
		Number(record?.durationMinutes) ||
			estimateDuration({ exercises: normalizedExercises }),
	)
	const caloriesBurned = Math.max(
		0,
		Number(record?.caloriesBurned) ||
			estimateCalories({ exercises: normalizedExercises }, durationMinutes),
	)
	const workoutName = String(record?.workoutName || record?.focus || "Workout")
	const workoutType = inferWorkoutType({
		...record,
		workoutName,
		source,
		exercises: normalizedExercises,
	})

	return {
		id: String(
			record?.id ||
				`${source}_${workoutName}_${completedAt?.getTime() || Date.now()}`,
		),
		workoutName,
		completedAt: completedAt
			? completedAt.toISOString()
			: new Date().toISOString(),
		durationMinutes,
		caloriesBurned,
		exercisesCompleted:
			Number(record?.exercisesCompleted) || normalizedExercises.length,
		totalExercises:
			Number(record?.totalExercises) || normalizedExercises.length,
		exercises: normalizedExercises,
		notes: String(record?.notes || ""),
		source,
		status: "Completed",
		workoutType,
	}
}

const normalizeData = (workouts = [], sessions = []) => {
	const merged = new Map()
	workouts.forEach((workout) => {
		merged.set(String(workout.id), normalizeHistoryEntry(workout, "legacy"))
	})
	sessions.forEach((session) => {
		merged.set(String(session.id), normalizeHistoryEntry(session, "session"))
	})
	return Array.from(merged.values()).sort(
		(a, b) => new Date(b.completedAt) - new Date(a.completedAt),
	)
}

const filterByRange = (items, range) => {
	const now = new Date()
	const bounds = getRangeBounds(range, now)
	return items.filter((item) =>
		withinBounds(parseDate(item.completedAt), bounds),
	)
}

const filterBySearch = (items, query) => {
	const normalized = query.trim().toLowerCase()
	if (!normalized) return items
	return items.filter((item) => {
		const searchable = [
			item.workoutName,
			item.workoutType,
			item.notes,
			...(item.exercises ?? []).map((exercise) => exercise.name),
		]
			.join(" ")
			.toLowerCase()
		return searchable.includes(normalized)
	})
}

const filterByWorkoutType = (items, filter) => {
	if (filter === "All") return items
	return items.filter((item) => item.workoutType === filter)
}

const buildGroupedBuckets = (items, range) => {
	const sorted = [...items].sort(
		(a, b) => new Date(a.completedAt) - new Date(b.completedAt),
	)
	const map = new Map()

	sorted.forEach((item) => {
		const date = parseDate(item.completedAt)
		if (!date) return
		let bucketDate = date
		let label = ""

		if (range === "Week") {
			bucketDate = startOfDay(date)
			label = bucketDate.toLocaleDateString(undefined, { weekday: "short" })
		} else if (range === "Month") {
			bucketDate = startOfWeek(date)
			label = `${bucketDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
		} else {
			bucketDate = startOfMonth(date)
			label = bucketDate.toLocaleDateString(undefined, {
				month: "short",
				year: "2-digit",
			})
		}

		const key = getDateKey(bucketDate)
		if (!map.has(key)) {
			map.set(key, {
				week: label,
				dateKey: key,
				workouts: 0,
				duration: 0,
				calories: 0,
				weights: [],
			})
		}

		const bucket = map.get(key)
		bucket.workouts += 1
		bucket.duration += Number(item.durationMinutes) || 0
		bucket.calories += Number(item.caloriesBurned) || 0
		const peakWeight = getWorkoutPeakWeight(item)
		if (peakWeight > 0) bucket.weights.push(peakWeight)
	})

	return Array.from(map.values())
		.sort((a, b) => new Date(a.dateKey) - new Date(b.dateKey))
		.map((bucket) => ({
			...bucket,
			weight:
				bucket.weights.length > 0
					? Number(
							(
								bucket.weights.reduce((sum, value) => sum + value, 0) /
								bucket.weights.length
							).toFixed(1),
						)
					: 0,
		}))
}

const buildCalendarGrid = (monthDate, items) => {
	const start = startOfMonth(monthDate)
	const end = endOfMonth(monthDate)
	const firstDayIndex = (start.getDay() + 6) % 7
	const daysInMonth = end.getDate()
	const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7
	const counts = new Map()
	items.forEach((item) => {
		const key = getDateKey(parseDate(item.completedAt) || new Date())
		counts.set(key, (counts.get(key) || 0) + 1)
	})

	const cells = []
	for (let index = 0; index < totalCells; index += 1) {
		const dayNumber = index - firstDayIndex + 1
		if (dayNumber < 1 || dayNumber > daysInMonth) {
			cells.push(null)
			continue
		}

		const date = new Date(start)
		date.setDate(dayNumber)
		const dateKey = getDateKey(date)
		cells.push({
			date,
			dateKey,
			count: counts.get(dateKey) || 0,
		})
	}

	return cells
}

const buildMuscleBreakdown = (items) => {
	const counts = new Map()

	items.forEach((item) => {
		const muscleSet = new Set()
		;(item.exercises ?? []).forEach((exercise) => {
			const meta = resolveExerciseMeta(exercise)
			;(meta?.bodyParts ?? []).forEach((bodyPart) => muscleSet.add(bodyPart))
		})

		muscleSet.forEach((bodyPart) => {
			counts.set(bodyPart, (counts.get(bodyPart) || 0) + 1)
		})
	})

	return Array.from(counts.entries())
		.map(([bodyPart, count]) => ({
			bodyPart,
			label: MUSCLE_LABELS[bodyPart] ?? bodyPart,
			count,
		}))
		.sort((a, b) => b.count - a.count)
}

const buildPersonalRecords = (items) => {
	const records = new Map()

	items.forEach((item) => {
		const completedAt = parseDate(item.completedAt)
		;(item.exercises ?? []).forEach((exercise) => {
			let bestSet = null
			;(exercise.sets ?? []).forEach((set) => {
				const weight = Number(set.weight) || 0
				const reps = Number(set.reps) || 0
				if (weight <= 0) return
				if (
					!bestSet ||
					weight > bestSet.weight ||
					(weight === bestSet.weight && reps > bestSet.reps)
				) {
					bestSet = { weight, reps }
				}
			})

			if (!bestSet) return
			const key = exercise.name.toLowerCase()
			const current = records.get(key)
			const currentDate = current ? parseDate(current.completedAt) : null
			if (
				!current ||
				bestSet.weight > current.weight ||
				(bestSet.weight === current.weight &&
					completedAt &&
					currentDate &&
					completedAt > currentDate)
			) {
				records.set(key, {
					exerciseName: exercise.name,
					weight: bestSet.weight,
					reps: bestSet.reps,
					completedAt: item.completedAt,
					workoutName: item.workoutName,
				})
			}
		})
	})

	return Array.from(records.values())
		.sort((a, b) => b.weight - a.weight)
		.slice(0, 8)
}

const buildAchievements = (items) => {
	const totalWorkouts = items.length
	const streak = calculateStreak(items)
	const totalCalories = items.reduce(
		(sum, item) => sum + (Number(item.caloriesBurned) || 0),
		0,
	)
	const activeDays = new Set(
		items.map((item) => getDateKey(parseDate(item.completedAt) || new Date())),
	).size

	return [
		{
			label: "First Workout",
			value: 1,
			description: "Complete your first logged session",
			icon: Trophy,
			now: totalWorkouts,
		},
		{
			label: "5 Workouts",
			value: 5,
			description: "Build early consistency",
			icon: Award,
			now: totalWorkouts,
		},
		{
			label: "10-Day Streak",
			value: 10,
			description: "Train for 10 consecutive days",
			icon: Sparkles,
			now: streak,
		},
		{
			label: "25 Workouts",
			value: 25,
			description: "A solid training base",
			icon: Medal,
			now: totalWorkouts,
		},
		{
			label: "1,000 Calories Burned",
			value: 1000,
			description: "Total training energy output",
			icon: Flame,
			now: totalCalories,
		},
		{
			label: "15 Active Days",
			value: 15,
			description: "Distinct training days logged",
			icon: CalendarClock,
			now: activeDays,
		},
	].map((achievement) => ({
		...achievement,
		earned: achievement.now >= achievement.value,
		progress: Math.min(
			100,
			Math.round((achievement.now / achievement.value) * 100),
		),
	}))
}

function HistoryPage() {
	const [workouts, setWorkouts] = useState([])
	const [sessions, setSessions] = useState([])
	const [searchQuery, setSearchQuery] = useState("")
	const [dateRange, setDateRange] = useState("Month")
	const [typeFilter, setTypeFilter] = useState("All")
	const [isLoading, setIsLoading] = useState(true)
	const [calendarMonth, setCalendarMonth] = useState(() => new Date())
	const [selectedDateKey, setSelectedDateKey] = useState(null)
	const monthInitializedRef = useRef(false)
	const timelineCardRef = useRef(null)
	const calendarCardRef = useRef(null)
	const [timelineCardHeight, setTimelineCardHeight] = useState(null)
	const muscleBreakdownCardRef = useRef(null)
	const personalRecordsCardRef = useRef(null)
	const [personalRecordsCardHeight, setPersonalRecordsCardHeight] =
		useState(null)

	useEffect(() => {
		const timer = window.setTimeout(() => setIsLoading(false), 700)
		return () => window.clearTimeout(timer)
	}, [])

	useEffect(() => {
		const refresh = () => {
			setWorkouts(getWorkouts())
			setSessions(getWorkoutSessions())
		}

		refresh()
		const unsubscribe = subscribeWorkoutChanges(refresh)
		return unsubscribe
	}, [])

	const historyEntries = useMemo(
		() => normalizeData(workouts, sessions),
		[workouts, sessions],
	)

	useEffect(() => {
		if (!historyEntries.length || monthInitializedRef.current) return
		const latest = parseDate(historyEntries[0]?.completedAt)
		if (latest) {
			setCalendarMonth(latest)
			monthInitializedRef.current = true
		}
	}, [historyEntries])

	useEffect(() => {
		if (typeof window === "undefined") return undefined

		const syncTimelineHeight = () => {
			if (window.innerWidth < 1280) {
				setTimelineCardHeight(null)
				return
			}

			const calendarHeight = calendarCardRef.current?.offsetHeight || 0
			setTimelineCardHeight(calendarHeight > 0 ? calendarHeight : null)
		}

		syncTimelineHeight()

		let resizeObserver
		if (typeof ResizeObserver !== "undefined" && calendarCardRef.current) {
			resizeObserver = new ResizeObserver(syncTimelineHeight)
			resizeObserver.observe(calendarCardRef.current)
		}

		window.addEventListener("resize", syncTimelineHeight)
		return () => {
			window.removeEventListener("resize", syncTimelineHeight)
			if (resizeObserver) resizeObserver.disconnect()
		}
	}, [
		isLoading,
		historyEntries.length,
		dateRange,
		typeFilter,
		searchQuery,
		calendarMonth,
		selectedDateKey,
	])

	const rangeFiltered = useMemo(
		() => filterByRange(historyEntries, dateRange),
		[historyEntries, dateRange],
	)

	const typeFiltered = useMemo(
		() => filterByWorkoutType(rangeFiltered, typeFilter),
		[rangeFiltered, typeFilter],
	)

	const visibleHistory = useMemo(
		() => filterBySearch(typeFiltered, searchQuery),
		[typeFiltered, searchQuery],
	)

	const visibleHistoryMap = useMemo(() => {
		const map = new Map()
		visibleHistory.forEach((item) => {
			const key = getDateKey(parseDate(item.completedAt) || new Date())
			if (!map.has(key)) map.set(key, [])
			map.get(key).push(item)
		})
		return map
	}, [visibleHistory])

	const visibleHistorySorted = useMemo(
		() =>
			[...visibleHistory].sort(
				(a, b) => new Date(b.completedAt) - new Date(a.completedAt),
			),
		[visibleHistory],
	)

	const summaryStats = useMemo(
		() => calculateFitnessStats(visibleHistory),
		[visibleHistory],
	)

	const activeDays = useMemo(
		() =>
			new Set(
				visibleHistory.map((item) =>
					getDateKey(parseDate(item.completedAt) || new Date()),
				),
			).size,
		[visibleHistory],
	)

	const calendarGrid = useMemo(
		() => buildCalendarGrid(calendarMonth, visibleHistory),
		[calendarMonth, visibleHistory],
	)

	const monthlySummaryCards = useMemo(
		() => [
			{
				label: "Total Workouts",
				value: summaryStats.totalWorkoutsCompleted.toLocaleString(),
				description: "Sessions in the selected view",
				icon: Dumbbell,
			},
			{
				label: "Total Workout Time",
				value: `${Math.round(summaryStats.totalWorkoutMinutes).toLocaleString()} min`,
				description: "Time spent training",
				icon: Timer,
			},
			{
				label: "Calories Burned",
				value: `${Math.round(summaryStats.totalCaloriesBurned).toLocaleString()} kcal`,
				description: "Estimated energy output",
				icon: Flame,
			},
			{
				label: "Active Days",
				value: activeDays.toLocaleString(),
				description: "Distinct training days",
				icon: CalendarDays,
			},
		],
		[activeDays, summaryStats],
	)

	const trendData = useMemo(
		() => buildGroupedBuckets(visibleHistory, dateRange),
		[visibleHistory, dateRange],
	)

	const hasWeightData = useMemo(
		() => visibleHistory.some((item) => getWorkoutPeakWeight(item) > 0),
		[visibleHistory],
	)

	const muscleBreakdown = useMemo(
		() => buildMuscleBreakdown(visibleHistory),
		[visibleHistory],
	)

	const bestRecords = useMemo(
		() => buildPersonalRecords(historyEntries),
		[historyEntries],
	)

	const achievements = useMemo(
		() => buildAchievements(historyEntries),
		[historyEntries],
	)

	useEffect(() => {
		if (typeof window === "undefined") return undefined

		const syncPersonalRecordsHeight = () => {
			if (window.innerWidth < 1280) {
				setPersonalRecordsCardHeight(null)
				return
			}

			const muscleBreakdownHeight =
				muscleBreakdownCardRef.current?.offsetHeight || 0
			setPersonalRecordsCardHeight(
				muscleBreakdownHeight > 0 ? muscleBreakdownHeight : null,
			)
		}

		syncPersonalRecordsHeight()

		let resizeObserver
		if (
			typeof ResizeObserver !== "undefined" &&
			muscleBreakdownCardRef.current
		) {
			resizeObserver = new ResizeObserver(syncPersonalRecordsHeight)
			resizeObserver.observe(muscleBreakdownCardRef.current)
		}

		window.addEventListener("resize", syncPersonalRecordsHeight)
		return () => {
			window.removeEventListener("resize", syncPersonalRecordsHeight)
			if (resizeObserver) resizeObserver.disconnect()
		}
	}, [
		isLoading,
		historyEntries.length,
		muscleBreakdown.length,
		bestRecords.length,
	])

	const selectedDayWorkouts = useMemo(() => {
		if (!selectedDateKey) return []
		return visibleHistoryMap.get(selectedDateKey) ?? []
	}, [selectedDateKey, visibleHistoryMap])

	const selectedDayDate = useMemo(
		() => (selectedDateKey ? parseDate(`${selectedDateKey}T12:00:00`) : null),
		[selectedDateKey],
	)

	const selectedDayLabel = selectedDayDate
		? selectedDayDate.toLocaleDateString(undefined, {
				weekday: "long",
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: ""

	const selectedDateCount = selectedDateKey
		? (visibleHistoryMap.get(selectedDateKey) ?? []).length
		: 0

	const hasHistory = historyEntries.length > 0
	const noResults = hasHistory && visibleHistory.length === 0
	const isSearching = searchQuery.trim().length > 0
	const filteredCountLabel = `${visibleHistory.length.toLocaleString()} ${visibleHistory.length === 1 ? "workout" : "workouts"}`

	const shiftCalendarMonth = (offset) => {
		setCalendarMonth((current) => {
			const next = new Date(current)
			next.setMonth(next.getMonth() + offset)
			return next
		})
	}

	const clearAllFilters = () => {
		setSearchQuery("")
		setDateRange("Month")
		setTypeFilter("All")
	}

	const summaryLoading = isLoading

	return (
		<AppPageFrame>
			<div className="bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
				<section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--primary))]/20 via-[hsl(var(--primary))]/8 to-[hsl(var(--primary))]/5 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
					<div className="absolute right-0 top-0 -z-10 h-80 w-80 rounded-full bg-[hsl(var(--primary))]/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-[hsl(var(--primary))]/5 blur-3xl" />

					<div className="mx-auto max-w-7xl space-y-7">
						<div className="flex items-center">
							<Link
								to="/dashboard"
								className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))]/70 bg-[hsl(var(--surface))]/75 px-3.5 py-1.5 text-sm font-medium text-[hsl(var(--muted))] backdrop-blur-sm transition hover:border-[hsl(var(--primary))]/30 hover:bg-[hsl(var(--surface))] hover:text-[hsl(var(--fg))]">
								<ArrowLeft className="h-4 w-4" />
								Back to Dashboard
							</Link>
						</div>

						<div className="space-y-3">
							<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
								History
							</h1>
							<div className="h-1 w-16 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/40" />
							<p className="max-w-3xl text-base leading-relaxed text-[hsl(var(--muted))] sm:text-lg">
								Review your training journey over time with workouts, records,
								calendar views, trends, and milestones.
							</p>
						</div>

						<div className="grid gap-3 lg:grid-cols-[1.4fr_0.9fr]">
							<div className="rounded-2xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--bg))]/80 p-1 backdrop-blur-md shadow-xl shadow-[hsl(var(--primary))]/5">
								<div className="relative">
									<Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[hsl(var(--primary))]" />
									<input
										type="search"
										value={searchQuery}
										onChange={(event) => setSearchQuery(event.target.value)}
										placeholder="Search workouts by name or exercise..."
										className="w-full rounded-xl bg-transparent py-4 pl-12 pr-10 text-base text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))] focus:outline-none"
									/>
									{searchQuery.trim().length > 0 && (
										<button
											type="button"
											onClick={() => setSearchQuery("")}
											className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[hsl(var(--muted))] transition hover:bg-[hsl(var(--surface))] hover:text-[hsl(var(--fg))]"
											aria-label="Clear search">
											<X className="h-4 w-4" />
										</button>
									)}
								</div>
							</div>

							<div className="rounded-2xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--bg))]/80 p-3 backdrop-blur-md shadow-xl shadow-[hsl(var(--primary))]/5">
								<div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
									{RANGE_OPTIONS.map((option) => (
										<motion.button
											key={option}
											whileTap={{ scale: 0.97 }}
											onClick={() => setDateRange(option)}
											className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
												dateRange === option
													? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/15 text-[hsl(var(--fg))]"
													: "border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--muted))] hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--fg))]"
											}`}>
											{option}
										</motion.button>
									))}
								</div>
							</div>
						</div>

						<div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
							{FILTER_OPTIONS.map((option) => (
								<motion.button
									key={option}
									whileTap={{ scale: 0.98 }}
									onClick={() => setTypeFilter(option)}
									className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
										typeFilter === option
											? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/15 text-[hsl(var(--fg))]"
											: "border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--muted))] hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--fg))]"
									}`}>
									{option}
								</motion.button>
							))}
						</div>
					</div>
				</section>

				<div className="px-4 py-10 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl space-y-8">
						{!hasHistory ? (
							<EmptyHistoryState />
						) : noResults ? (
							<BaseCard className="space-y-4 p-8 text-center sm:p-10">
								<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))]">
									<Search className="h-7 w-7" />
								</div>
								<div className="space-y-2">
									<h2 className="text-2xl font-bold">No workouts found</h2>
									<p className="text-[hsl(var(--muted))]">
										Try a broader date range or clear your filters.
									</p>
								</div>
								<button
									type="button"
									onClick={clearAllFilters}
									className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-5 py-2.5 text-sm font-semibold transition hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--primary))]">
									Clear filters
								</button>
							</BaseCard>
						) : (
							<>
								{isSearching ? (
									<section>
										<BaseCard className="p-5 sm:p-6">
											<div className="mb-4 flex items-center justify-between gap-3">
												<div>
													<h2 className="text-xl font-bold">
														Recent Workout Timeline
													</h2>
													<p className="text-sm text-[hsl(var(--muted))]">
														Chronological review of logged sessions
													</p>
												</div>
												<p className="rounded-full border border-[hsl(var(--border))] px-3 py-1 text-xs text-[hsl(var(--muted))]">
													{visibleHistory.length} entries
												</p>
											</div>
											<div className="space-y-3">
												{visibleHistorySorted.map((item, index) => (
													<TimelineItem
														key={item.id}
														item={item}
														index={index}
														onClick={() =>
															setSelectedDateKey(
																getDateKey(
																	parseDate(item.completedAt) || new Date(),
																),
															)
														}
													/>
												))}
											</div>
										</BaseCard>
									</section>
								) : (
									<>
										<section>
											<div className="mb-3 flex items-center justify-between gap-3">
												<div>
													<h2 className="text-xl font-bold sm:text-2xl">
														Period Summary
													</h2>
													<p className="text-sm text-[hsl(var(--muted))]">
														{filteredCountLabel} in{" "}
														{formatRangeTitle(dateRange).toLowerCase()}
													</p>
												</div>
												{summaryLoading && (
													<div className="h-5 w-24 rounded-full bg-[hsl(var(--border))]/70 animate-pulse" />
												)}
											</div>
											<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
												{monthlySummaryCards.map((card) => (
													<SummaryCard
														key={card.label}
														{...card}
														isLoading={summaryLoading}
													/>
												))}
											</div>
										</section>

										<section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
											<BaseCard
												ref={timelineCardRef}
												className="flex flex-col p-5 sm:p-6"
												style={
													timelineCardHeight
														? { height: timelineCardHeight }
														: undefined
												}>
												<div className="mb-4 flex items-center justify-between gap-3">
													<div>
														<h2 className="text-xl font-bold">
															Recent Workout Timeline
														</h2>
														<p className="text-sm text-[hsl(var(--muted))]">
															Chronological review of logged sessions
														</p>
													</div>
													<p className="rounded-full border border-[hsl(var(--border))] px-3 py-1 text-xs text-[hsl(var(--muted))]">
														{visibleHistory.length} entries
													</p>
												</div>
												<div
													className={`space-y-3 ${timelineCardHeight ? "min-h-0 overflow-y-auto pr-1" : ""}`}>
													{visibleHistorySorted.map((item, index) => (
														<TimelineItem
															key={item.id}
															item={item}
															index={index}
															onClick={() =>
																setSelectedDateKey(
																	getDateKey(
																		parseDate(item.completedAt) || new Date(),
																	),
																)
															}
														/>
													))}
												</div>
											</BaseCard>

											<BaseCard
												ref={calendarCardRef}
												className="self-start p-5 sm:p-6">
												<div className="mb-4 flex items-center justify-between gap-3">
													<div>
														<h2 className="text-xl font-bold">
															Workout Calendar
														</h2>
														<p className="text-sm text-[hsl(var(--muted))]">
															Tap a completed day to review workouts
														</p>
													</div>
													<div className="flex items-center gap-1.5">
														<button
															type="button"
															onClick={() => shiftCalendarMonth(-1)}
															className="rounded-xl border border-[hsl(var(--border))] p-2 text-[hsl(var(--muted))] transition hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--fg))]"
															aria-label="Previous month">
															<ChevronLeft className="h-4 w-4" />
														</button>
														<p className="min-w-28 text-center text-sm font-semibold">
															{calendarMonth.toLocaleDateString(undefined, {
																month: "long",
																year: "numeric",
															})}
														</p>
														<button
															type="button"
															onClick={() => shiftCalendarMonth(1)}
															className="rounded-xl border border-[hsl(var(--border))] p-2 text-[hsl(var(--muted))] transition hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--fg))]"
															aria-label="Next month">
															<ChevronRight className="h-4 w-4" />
														</button>
													</div>
												</div>
												{summaryLoading ? (
													<div className="space-y-3">
														<div className="grid grid-cols-7 gap-2">
															{Array.from({ length: 7 }).map((_, index) => (
																<div
																	key={index}
																	className="h-4 rounded bg-[hsl(var(--border))]/70 animate-pulse"
																/>
															))}
														</div>
														<div className="grid grid-cols-7 gap-2">
															{Array.from({ length: 35 }).map((_, index) => (
																<div
																	key={index}
																	className="h-20 rounded-2xl bg-[hsl(var(--border))]/70 animate-pulse"
																/>
															))}
														</div>
													</div>
												) : (
													<div>
														<div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
															{[
																"Mon",
																"Tue",
																"Wed",
																"Thu",
																"Fri",
																"Sat",
																"Sun",
															].map((day) => (
																<div key={day}>{day}</div>
															))}
														</div>
														<div className="grid grid-cols-7 gap-2">
															{calendarGrid.map((cell, index) =>
																cell ? (
																	<motion.button
																		key={cell.dateKey}
																		whileHover={cell.count > 0 ? { y: -2 } : {}}
																		whileTap={
																			cell.count > 0 ? { scale: 0.98 } : {}
																		}
																		onClick={() =>
																			cell.count > 0 &&
																			setSelectedDateKey(cell.dateKey)
																		}
																		disabled={cell.count === 0}
																		className={`min-h-20 rounded-2xl border p-2 text-left transition ${
																			cell.count > 0
																				? "border-[hsl(var(--primary))]/35 bg-[hsl(var(--primary))]/8 hover:border-[hsl(var(--primary))]/60 hover:shadow-md"
																				: "border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--muted))] opacity-60"
																		}`}
																		aria-label={`${cell.date.toDateString()} ${cell.count} workouts`}>
																		<div className="flex items-center justify-between gap-2">
																			<span className="text-xs font-semibold text-[hsl(var(--muted))]">
																				{cell.date.getDate()}
																			</span>
																			{cell.count > 0 && (
																				<span className="rounded-full bg-[hsl(var(--primary))] px-2 py-0.5 text-[10px] font-bold text-white">
																					{cell.count}
																				</span>
																			)}
																		</div>
																		{cell.count > 0 && (
																			<div className="mt-3 flex items-center gap-1.5">
																				<span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
																				<span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]/60" />
																				<span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]/30" />
																			</div>
																		)}
																	</motion.button>
																) : (
																	<div
																		key={`empty-${index}`}
																		className="min-h-20 rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--surface))]/40"
																	/>
																),
															)}
														</div>
														{selectedDateKey && (
															<p className="mt-3 text-xs text-[hsl(var(--muted))]">
																Selected: {selectedDayLabel} ·{" "}
																{selectedDateCount} workout
																{selectedDateCount === 1 ? "" : "s"}
															</p>
														)}
													</div>
												)}
											</BaseCard>
										</section>

										<section className="space-y-4">
											<div className="flex items-center gap-2">
												<BarChart3 className="h-5 w-5 text-[hsl(var(--primary))]" />
												<h2 className="text-xl font-bold sm:text-2xl">
													Progress Charts
												</h2>
											</div>
											<div className="grid gap-4 xl:grid-cols-2">
												<ChartCard
													title="Workouts Completed Over Time"
													subtitle={formatRangeTitle(dateRange)}
													isLoading={summaryLoading}>
													<WorkoutConsistencyChart
														data={trendData}
														isLoading={summaryLoading}
														maxBarSize={80}
														barCategoryGap="36%"
													/>
												</ChartCard>
												<ChartCard
													title="Workout Duration"
													subtitle="Minutes per bucket"
													isLoading={summaryLoading}>
													<HistoryTrendChart
														data={trendData}
														dataKey="duration"
														strokeColor="hsl(var(--primary))"
													/>
												</ChartCard>
												<ChartCard
													title="Calories Burned"
													subtitle="Energy output per bucket"
													isLoading={summaryLoading}>
													<HistoryTrendChart
														data={trendData}
														dataKey="calories"
														strokeColor="#f97316"
													/>
												</ChartCard>
												<ChartCard
													title="Weight"
													subtitle="Average peak set weight"
													isLoading={summaryLoading}>
													{hasWeightData ? (
														<WeightProgressChart
															data={trendData}
															isLoading={summaryLoading}
														/>
													) : (
														<div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 px-6 text-center text-sm text-[hsl(var(--muted))]">
															No weight data available yet.
														</div>
													)}
												</ChartCard>
											</div>
										</section>

										<section className="grid gap-6 xl:grid-cols-2 xl:items-start">
											<BaseCard
												ref={muscleBreakdownCardRef}
												className="self-start p-5 sm:p-6">
												<div className="mb-4 flex items-center gap-2">
													<Activity className="h-5 w-5 text-[hsl(var(--primary))]" />
													<div>
														<h2 className="text-xl font-bold">
															Muscle Group Breakdown
														</h2>
														<p className="text-sm text-[hsl(var(--muted))]">
															Completed workout sessions by muscle group
														</p>
													</div>
												</div>
												{muscleBreakdown.length > 0 ? (
													<div className="space-y-3">
														{muscleBreakdown.map((group) => (
															<div key={group.bodyPart} className="space-y-1.5">
																<div className="flex items-center justify-between gap-3 text-sm">
																	<span className="font-medium">
																		{group.label}
																	</span>
																	<span className="text-[hsl(var(--muted))]">
																		{group.count}
																	</span>
																</div>
																<div className="h-2 rounded-full bg-[hsl(var(--border))]">
																	<div
																		className="h-2 rounded-full bg-[hsl(var(--primary))] transition-all"
																		style={{
																			width: `${Math.max(10, (group.count / muscleBreakdown[0].count) * 100)}%`,
																		}}
																	/>
																</div>
															</div>
														))}
													</div>
												) : (
													<p className="text-sm text-[hsl(var(--muted))]">
														No muscle group data found yet.
													</p>
												)}
											</BaseCard>

											<BaseCard
												ref={personalRecordsCardRef}
												className="self-start flex flex-col p-5 sm:p-6"
												style={
													personalRecordsCardHeight
														? { height: personalRecordsCardHeight }
														: undefined
												}>
												<div className="mb-4 flex items-center gap-2">
													<Scale className="h-5 w-5 text-[hsl(var(--primary))]" />
													<div>
														<h2 className="text-xl font-bold">
															Personal Records
														</h2>
														<p className="text-sm text-[hsl(var(--muted))]">
															Best lifts and when they were achieved
														</p>
													</div>
												</div>
												{bestRecords.length > 0 ? (
													<div
														className={`space-y-3 ${personalRecordsCardHeight ? "min-h-0 overflow-y-auto pr-1" : ""}`}>
														{bestRecords.map((record) => (
															<div
																key={`${record.exerciseName}-${record.completedAt}`}
																className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg))]/60 p-4 transition hover:border-[hsl(var(--primary))]/45">
																<div className="flex items-start justify-between gap-3">
																	<div>
																		<p className="font-semibold">
																			{record.exerciseName}
																		</p>
																		<p className="mt-1 text-xs text-[hsl(var(--muted))]">
																			{record.workoutName} ·{" "}
																			{formatLongDate(record.completedAt)}
																		</p>
																	</div>
																	<span className="rounded-full bg-[hsl(var(--primary))]/15 px-2.5 py-1 text-xs font-semibold text-[hsl(var(--primary))]">
																		{record.weight} lbs × {record.reps}
																	</span>
																</div>
															</div>
														))}
													</div>
												) : (
													<p className="text-sm text-[hsl(var(--muted))]">
														No weighted lifts recorded yet.
													</p>
												)}
											</BaseCard>
										</section>

										<section>
											<div className="mb-4 flex items-center gap-2">
												<Trophy className="h-5 w-5 text-[hsl(var(--primary))]" />
												<div>
													<h2 className="text-xl font-bold sm:text-2xl">
														Achievements
													</h2>
													<p className="text-sm text-[hsl(var(--muted))]">
														Milestones earned from consistency and volume
													</p>
												</div>
											</div>
											<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
												{achievements.map((achievement) => (
													<AchievementCard
														key={achievement.label}
														achievement={achievement}
													/>
												))}
											</div>
										</section>
									</>
								)}
							</>
						)}
					</div>
				</div>

				<AnimatePresence>
					{selectedDateKey && (
						<WorkoutDayModal
							dateLabel={selectedDayLabel}
							workouts={selectedDayWorkouts}
							onClose={() => setSelectedDateKey(null)}
						/>
					)}
				</AnimatePresence>
			</div>
		</AppPageFrame>
	)
}

function WorkoutDayModal({ dateLabel, workouts, onClose }) {
	useEffect(() => {
		const previous = document.body.style.overflow
		document.body.style.overflow = "hidden"

		const onKeyDown = (event) => {
			if (event.key === "Escape") onClose()
		}

		window.addEventListener("keydown", onKeyDown)
		return () => {
			document.body.style.overflow = previous
			window.removeEventListener("keydown", onKeyDown)
		}
	}, [onClose])

	return (
		<div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center">
			<motion.button
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				aria-label="Close workout details"
			/>

			<motion.div
				initial={{ y: "100%", opacity: 0.7 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: "100%", opacity: 0 }}
				transition={{ type: "spring", damping: 28, stiffness: 280 }}
				className="relative z-10 w-full max-w-3xl max-h-[90dvh] overflow-hidden rounded-t-3xl border border-[hsl(var(--border))]/70 bg-[hsl(var(--bg))] shadow-2xl sm:m-4 sm:rounded-3xl">
				<div className="flex items-start justify-between gap-3 border-b border-[hsl(var(--border))]/60 px-5 py-4 sm:px-6">
					<div>
						<p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--primary))]">
							Workout Details
						</p>
						<h3 className="mt-1 text-2xl font-bold">{dateLabel}</h3>
						<p className="mt-1 text-sm text-[hsl(var(--muted))]">
							{workouts.length} completed workout
							{workouts.length === 1 ? "" : "s"}
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-full p-2 text-[hsl(var(--muted))] transition hover:bg-[hsl(var(--surface))] hover:text-[hsl(var(--fg))]"
						aria-label="Close details">
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="overflow-y-auto px-5 py-5 sm:px-6">
					{workouts.length > 0 ? (
						<div className="space-y-4">
							{workouts.map((workout) => (
								<div
									key={workout.id}
									className="rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface))] p-4 sm:p-5">
									<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
										<div className="space-y-1">
											<h4 className="text-lg font-bold">
												{workout.workoutName}
											</h4>
											<p className="text-sm text-[hsl(var(--muted))]">
												{formatShortTime(workout.completedAt)} ·{" "}
												{workout.workoutType}
											</p>
										</div>
										<div className="flex flex-wrap gap-2 text-xs">
											<span className="rounded-full bg-[hsl(var(--primary))]/15 px-2.5 py-1 font-semibold text-[hsl(var(--primary))]">
												{Math.round(workout.durationMinutes)} min
											</span>
											<span className="rounded-full bg-orange-500/15 px-2.5 py-1 font-semibold text-orange-400">
												{Math.round(workout.caloriesBurned)} kcal
											</span>
											<span className="rounded-full bg-emerald-500/15 px-2.5 py-1 font-semibold text-emerald-400">
												{workout.status}
											</span>
										</div>
									</div>

									<div className="mt-4 grid gap-3 sm:grid-cols-2">
										{(workout.exercises ?? []).map((exercise) => (
											<div
												key={exercise.id || exercise.name}
												className="rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--bg))]/60 p-3">
												<p className="font-semibold">{exercise.name}</p>
												{(exercise.sets ?? []).length > 0 && (
													<p className="mt-1 text-xs text-[hsl(var(--muted))]">
														{exercise.sets.length} set
														{exercise.sets.length === 1 ? "" : "s"}
														{exercise.bodyParts?.length
															? ` · ${(exercise.bodyParts ?? []).join(", ")}`
															: ""}
													</p>
												)}
											</div>
										))}
									</div>

									{workout.notes && (
										<p className="mt-4 rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--bg))]/60 p-3 text-sm text-[hsl(var(--muted))]">
											{workout.notes}
										</p>
									)}
								</div>
							))}
						</div>
					) : (
						<p className="text-sm text-[hsl(var(--muted))]">
							No workouts on this day.
						</p>
					)}
				</div>
			</motion.div>
		</div>
	)
}

function TimelineItem({ item, index, onClick }) {
	const completedAt = parseDate(item.completedAt)
	return (
		<motion.button
			type="button"
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2, delay: Math.min(index * 0.04, 0.18) }}
			onClick={onClick}
			className="group w-full rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--bg))]/60 p-4 text-left transition hover:border-[hsl(var(--primary))]/45 hover:bg-[hsl(var(--surface))] hover:shadow-md">
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-1">
					<div className="flex flex-wrap items-center gap-2">
						<h3 className="font-semibold leading-tight group-hover:text-[hsl(var(--primary))]">
							{item.workoutName}
						</h3>
						<span className="rounded-full bg-[hsl(var(--primary))]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--primary))]">
							{item.workoutType}
						</span>
					</div>
					<p className="text-xs text-[hsl(var(--muted))]">
						{formatLongDate(item.completedAt)}
						{completedAt ? ` · ${formatShortTime(item.completedAt)}` : ""}
					</p>
				</div>
				<span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400">
					Completed
				</span>
			</div>

			<div className="mt-3 grid grid-cols-3 gap-2 text-xs">
				<div className="rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface))] p-2">
					<p className="text-[hsl(var(--muted))]">Duration</p>
					<p className="mt-1 font-semibold">
						{Math.round(item.durationMinutes)} min
					</p>
				</div>
				<div className="rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface))] p-2">
					<p className="text-[hsl(var(--muted))]">Calories</p>
					<p className="mt-1 font-semibold">
						{Math.round(item.caloriesBurned)} kcal
					</p>
				</div>
				<div className="rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface))] p-2">
					<p className="text-[hsl(var(--muted))]">Exercises</p>
					<p className="mt-1 font-semibold">{item.exercisesCompleted}</p>
				</div>
			</div>
		</motion.button>
	)
}

function SummaryCard({
	label,
	value,
	description,
	icon: Icon,
	isLoading = false,
}) {
	return (
		<BaseCard className="p-4 sm:p-5">
			{isLoading ? (
				<div className="space-y-3 animate-pulse">
					<div className="h-4 w-24 rounded bg-[hsl(var(--border))]" />
					<div className="h-8 w-32 rounded bg-[hsl(var(--border))]" />
					<div className="h-4 w-36 rounded bg-[hsl(var(--border))]" />
				</div>
			) : (
				<>
					<div className="flex items-center justify-between gap-3">
						<div className="space-y-1">
							<p className="text-xs uppercase tracking-wider text-[hsl(var(--muted))]">
								{label}
							</p>
							<p className="text-2xl font-semibold text-[hsl(var(--fg))]">
								{value}
							</p>
						</div>
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))]">
							<Icon className="h-5 w-5" />
						</div>
					</div>
					<p className="mt-3 text-sm text-[hsl(var(--muted))]">{description}</p>
				</>
			)}
		</BaseCard>
	)
}

function ChartCard({ title, subtitle, children, isLoading = false }) {
	return (
		<BaseCard className="p-5 sm:p-6">
			<div className="mb-4 flex items-start justify-between gap-3">
				<div>
					<h3 className="text-lg font-bold">{title}</h3>
					<p className="text-sm text-[hsl(var(--muted))]">{subtitle}</p>
				</div>
				{isLoading && (
					<div className="h-5 w-20 rounded-full bg-[hsl(var(--border))]/70 animate-pulse" />
				)}
			</div>
			{children}
		</BaseCard>
	)
}

function HistoryTrendChart({ data, dataKey, strokeColor }) {
	if (!data.length) {
		return (
			<div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 text-sm text-[hsl(var(--muted))]">
				No chart data in this period.
			</div>
		)
	}

	return (
		<div className="h-64 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart
					data={data}
					margin={{ left: -8, right: 8, top: 10, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
					<XAxis
						dataKey="week"
						stroke="hsl(var(--muted))"
						tickLine={false}
						axisLine={false}
					/>
					<YAxis stroke="hsl(var(--muted))" tickLine={false} axisLine={false} />
					<Tooltip
						contentStyle={{
							background: "hsl(var(--surface))",
							border: "1px solid hsl(var(--border))",
							borderRadius: "12px",
							color: "hsl(var(--fg))",
						}}
						formatter={(value) => [Math.round(Number(value) || 0), dataKey]}
					/>
					<Area
						type="monotone"
						dataKey={dataKey}
						stroke={strokeColor}
						fill={strokeColor}
						fillOpacity={0.15}
						strokeWidth={2.5}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}

function AchievementCard({ achievement }) {
	const Icon = achievement.icon
	return (
		<BaseCard
			className={`p-4 sm:p-5 transition hover:border-[hsl(var(--primary))]/45 ${
				achievement.earned ? "border-[hsl(var(--primary))]/40" : ""
			}`}>
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<div
							className={`flex h-10 w-10 items-center justify-center rounded-xl ${achievement.earned ? "bg-emerald-500/15 text-emerald-400" : "bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))]"}`}>
							<Icon className="h-5 w-5" />
						</div>
						<div>
							<h3 className="font-bold">{achievement.label}</h3>
							<p className="text-xs text-[hsl(var(--muted))]">
								{achievement.description}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2 text-xs text-[hsl(var(--muted))]">
						<span>
							{achievement.now} / {achievement.value}
						</span>
						<span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--border))]" />
						<span>{achievement.earned ? "Earned" : "In progress"}</span>
					</div>
				</div>
				{achievement.earned && (
					<span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400">
						Unlocked
					</span>
				)}
			</div>
			<div className="mt-4 h-2 rounded-full bg-[hsl(var(--border))]">
				<div
					className={`h-2 rounded-full transition-all ${achievement.earned ? "bg-emerald-500" : "bg-[hsl(var(--primary))]"}`}
					style={{ width: `${achievement.progress}%` }}
				/>
			</div>
		</BaseCard>
	)
}

function EmptyHistoryState() {
	return (
		<BaseCard className="space-y-5 p-8 text-center sm:p-12">
			<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))]">
				<CalendarDays className="h-10 w-10" />
			</div>
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">No history yet</h2>
				<p className="mx-auto max-w-2xl text-[hsl(var(--muted))]">
					Complete your first workout to unlock your workout calendar, timeline,
					charts, records, and achievements.
				</p>
			</div>
			<div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
				<Link
					to="/workout"
					className="inline-flex items-center gap-2 rounded-2xl bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[hsl(var(--primary-hover))]">
					<ArrowLeft className="h-4 w-4 rotate-180" />
					Start a Workout
				</Link>
				<Link
					to="/dashboard"
					className="inline-flex items-center gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-5 py-3 text-sm font-semibold transition hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--primary))]">
					<TrendingUp className="h-4 w-4" />
					Go to Dashboard
				</Link>
			</div>
		</BaseCard>
	)
}

export default HistoryPage
