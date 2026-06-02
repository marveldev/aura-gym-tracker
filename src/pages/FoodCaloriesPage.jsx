import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"
import AppPageFrame from "../components/AppPageFrame.jsx"
import ToastContainer from "../components/ToastContainer.jsx"
import { foodCategories, foodItems } from "../data/foodCaloriesData.js"

const DAILY_LOG_STORAGE_KEY = "food_calories_daily_log"
const WEEKLY_HISTORY_STORAGE_KEY = "food_calories_weekly_history"

const DAILY_GOALS = {
	calories: 2400,
	protein: 180,
	carbs: 250,
	fat: 70,
}

const QUICK_ADD_FOOD_NAMES = [
	"Banana",
	"Apple",
	"Egg",
	"Chicken Breast",
	"Rice",
	"Oats",
	"Greek Yogurt",
	"Protein Shake",
]

function getTodayKey() {
	return new Date().toISOString().slice(0, 10)
}

function getLast7DateKeys() {
	const keys = []
	const now = new Date()

	for (let index = 6; index >= 0; index -= 1) {
		const day = new Date(now)
		day.setDate(now.getDate() - index)
		keys.push(day.toISOString().slice(0, 10))
	}

	return keys
}

function getDayLabel(dateKey) {
	const date = new Date(`${dateKey}T00:00:00`)
	return date.toLocaleDateString(undefined, { weekday: "short" })
}

function getInitialDailyLog() {
	if (typeof window === "undefined") {
		return []
	}

	const storedLog = window.localStorage.getItem(DAILY_LOG_STORAGE_KEY)
	if (!storedLog) {
		return []
	}

	try {
		const parsed = JSON.parse(storedLog)

		if (Array.isArray(parsed)) {
			return parsed
		}

		if (
			parsed &&
			typeof parsed === "object" &&
			parsed.date === getTodayKey() &&
			Array.isArray(parsed.items)
		) {
			return parsed.items
		}

		return []
	} catch {
		return []
	}
}

function getInitialWeeklyHistory() {
	if (typeof window === "undefined") {
		return {}
	}

	const storedWeeklyHistory = window.localStorage.getItem(
		WEEKLY_HISTORY_STORAGE_KEY,
	)
	if (!storedWeeklyHistory) {
		return {}
	}

	try {
		const parsed = JSON.parse(storedWeeklyHistory)
		return parsed && typeof parsed === "object" ? parsed : {}
	} catch {
		return {}
	}
}

function toNumber(value) {
	const parsed = Number(value)
	return Number.isFinite(parsed) ? parsed : 0
}

function getFoodNutrition(food) {
	return {
		calories: toNumber(food?.calories),
		protein: toNumber(food?.protein),
		carbs: toNumber(food?.carbs),
		fat: toNumber(food?.fat),
		fiber: toNumber(food?.fiber),
		sugar: toNumber(food?.sugar),
	}
}

function getProgressPercent(value, goal) {
	if (!goal || goal <= 0) {
		return 0
	}

	return Math.min((value / goal) * 100, 100)
}

function areDailyTotalsEqual(currentTotals, nextTotals) {
	if (!currentTotals || !nextTotals) {
		return false
	}

	return (
		currentTotals.calories === nextTotals.calories &&
		currentTotals.protein === nextTotals.protein &&
		currentTotals.carbs === nextTotals.carbs &&
		currentTotals.fat === nextTotals.fat &&
		currentTotals.fiber === nextTotals.fiber &&
		currentTotals.sugar === nextTotals.sugar
	)
}

function formatMacro(value) {
	return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function ProgressBar({ percent, barColorClass = "bg-[hsl(var(--primary))]" }) {
	return (
		<div className="h-2.5 w-full overflow-hidden rounded-full bg-[hsl(var(--border))]">
			<div
				className={`h-full rounded-full transition-all duration-500 ease-out ${barColorClass}`}
				style={{ width: `${Math.max(0, Math.min(percent, 100))}%` }}
			/>
		</div>
	)
}

function FoodCaloriesPage() {
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("All")
	const [selectedFood, setSelectedFood] = useState(null)
	const [dailyLog, setDailyLog] = useState(getInitialDailyLog)
	const [weeklyHistory, setWeeklyHistory] = useState(getInitialWeeklyHistory)
	const [toasts, setToasts] = useState([])

	useEffect(() => {
		window.localStorage.setItem(
			DAILY_LOG_STORAGE_KEY,
			JSON.stringify({ date: getTodayKey(), items: dailyLog }),
		)
	}, [dailyLog])

	useEffect(() => {
		window.localStorage.setItem(
			WEEKLY_HISTORY_STORAGE_KEY,
			JSON.stringify(weeklyHistory),
		)
	}, [weeklyHistory])

	const filteredFoods = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase()

		return foodItems.filter((food) => {
			const matchesCategory =
				selectedCategory === "All" || food.category === selectedCategory
			const matchesQuery =
				!normalizedQuery || food.name.toLowerCase().includes(normalizedQuery)
			return matchesCategory && matchesQuery
		})
	}, [searchQuery, selectedCategory])

	const quickAddFoods = useMemo(
		() =>
			QUICK_ADD_FOOD_NAMES.map((name) => {
				const byExactName = foodItems.find(
					(food) => food.name.toLowerCase() === name.toLowerCase(),
				)

				if (byExactName) {
					return byExactName
				}

				const loweredTarget = name.toLowerCase()
				return foodItems.find((food) =>
					food.name.toLowerCase().includes(loweredTarget),
				)
			}).filter(Boolean),
		[],
	)

	const nutritionTotals = useMemo(
		() =>
			dailyLog.reduce(
				(totals, item) => {
					const nutrition = getFoodNutrition(item)
					return {
						calories: totals.calories + nutrition.calories,
						protein: totals.protein + nutrition.protein,
						carbs: totals.carbs + nutrition.carbs,
						fat: totals.fat + nutrition.fat,
						fiber: totals.fiber + nutrition.fiber,
						sugar: totals.sugar + nutrition.sugar,
					}
				},
				{ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 },
			),
		[dailyLog],
	)

	const totalCaloriesConsumed = nutritionTotals.calories
	const remainingCalories = Math.max(
		DAILY_GOALS.calories - totalCaloriesConsumed,
		0,
	)
	const calorieProgressPercent = getProgressPercent(
		totalCaloriesConsumed,
		DAILY_GOALS.calories,
	)

	useEffect(() => {
		const todayKey = getTodayKey()
		const todayTotals = {
			calories: Math.round(nutritionTotals.calories),
			protein: Number(nutritionTotals.protein.toFixed(1)),
			carbs: Number(nutritionTotals.carbs.toFixed(1)),
			fat: Number(nutritionTotals.fat.toFixed(1)),
			fiber: Number(nutritionTotals.fiber.toFixed(1)),
			sugar: Number(nutritionTotals.sugar.toFixed(1)),
		}

		setWeeklyHistory((currentHistory) => {
			const currentTodayTotals = currentHistory[todayKey]
			if (areDailyTotalsEqual(currentTodayTotals, todayTotals)) {
				return currentHistory
			}

			const nextHistory = {
				...currentHistory,
				[todayKey]: todayTotals,
			}

			const cutoffDate = new Date()
			cutoffDate.setDate(cutoffDate.getDate() - 35)
			const cutoffKey = cutoffDate.toISOString().slice(0, 10)

			return Object.fromEntries(
				Object.entries(nextHistory).filter(([dateKey]) => dateKey >= cutoffKey),
			)
		})
	}, [nutritionTotals])

	const weeklyTrendData = useMemo(() => {
		const todayKey = getTodayKey()
		return getLast7DateKeys().map((dateKey) => {
			const historicalTotals = weeklyHistory[dateKey]
			const calories =
				dateKey === todayKey
					? Math.round(totalCaloriesConsumed)
					: Math.round(historicalTotals?.calories ?? 0)

			return {
				day: getDayLabel(dateKey),
				calories,
			}
		})
	}, [totalCaloriesConsumed, weeklyHistory])

	const addToDailyLog = (food) => {
		const foodId = food.id ?? food.foodId ?? `${food.name}-${Date.now()}`
		const nutrition = getFoodNutrition(food)

		setDailyLog((currentLog) => [
			...currentLog,
			{
				id: `${foodId}-${Date.now()}`,
				foodId,
				name: food.name,
				calories: nutrition.calories,
				protein: nutrition.protein,
				carbs: nutrition.carbs,
				fat: nutrition.fat,
				fiber: nutrition.fiber,
				sugar: nutrition.sugar,
				category: food.category ?? "Food",
			},
		])

		const toastId = `${foodId}-${Date.now()}`
		setToasts((currentToasts) => [
			...currentToasts,
			{
				id: toastId,
				type: "success",
				message: `${food.name} added to daily log`,
			},
		])

		window.setTimeout(() => {
			setToasts((currentToasts) =>
				currentToasts.filter((toast) => toast.id !== toastId),
			)
		}, 2800)
	}

	const removeFromDailyLog = (logId) => {
		setDailyLog((currentLog) => currentLog.filter((item) => item.id !== logId))
	}

	const removeAllFromDailyLog = () => {
		setDailyLog([])

		const toastId = `clear-log-${Date.now()}`
		setToasts((currentToasts) => [
			...currentToasts,
			{
				id: toastId,
				type: "success",
				message: "All food items removed from daily log",
			},
		])

		window.setTimeout(() => {
			setToasts((currentToasts) =>
				currentToasts.filter((toast) => toast.id !== toastId),
			)
		}, 2800)
	}

	return (
		<AppPageFrame>
			<div className="bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
				<div className="w-full">
					<header className="mb-8 flex items-center gap-3">
						<Link
							to="/handbook"
							aria-label="Back to handbook"
							className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--fg))] transition hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--primary))]">
							<ArrowLeft className="h-5 w-5" />
						</Link>
						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
							Food & Calories
						</h1>
					</header>

					<section className="card p-5 sm:p-6 mb-6 rounded-2xl shadow-sm">
						<div className="mb-4 flex items-center justify-between gap-3">
							<h2 className="text-lg font-semibold">Daily Summary</h2>
							<p className="text-sm font-medium text-[hsl(var(--muted))]">
								{Math.round(calorieProgressPercent)}%
							</p>
						</div>

						<p className="text-2xl sm:text-3xl font-bold text-[hsl(var(--primary))]">
							{Math.round(totalCaloriesConsumed)} / {DAILY_GOALS.calories} kcal
						</p>
						<p className="mt-1 text-sm text-[hsl(var(--muted))]">
							{Math.round(remainingCalories)} kcal remaining
						</p>

						<div className="mt-4">
							<ProgressBar percent={calorieProgressPercent} />
						</div>

						<div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
							<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-3">
								<p className="text-xs text-[hsl(var(--muted))]">Consumed</p>
								<p className="mt-1 text-lg font-semibold">
									{Math.round(totalCaloriesConsumed)} kcal
								</p>
							</div>
							<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-3">
								<p className="text-xs text-[hsl(var(--muted))]">Goal</p>
								<p className="mt-1 text-lg font-semibold">
									{DAILY_GOALS.calories} kcal
								</p>
							</div>
							<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-3">
								<p className="text-xs text-[hsl(var(--muted))]">Remaining</p>
								<p className="mt-1 text-lg font-semibold">
									{Math.round(remainingCalories)} kcal
								</p>
							</div>
							<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-3">
								<p className="text-xs text-[hsl(var(--muted))]">Complete</p>
								<p className="mt-1 text-lg font-semibold">
									{Math.round(calorieProgressPercent)}%
								</p>
							</div>
						</div>

						<div className="mt-5 border-t border-[hsl(var(--border))] pt-4">
							<div className="mb-3 flex items-center justify-between gap-3">
								<h3 className="text-sm font-semibold tracking-wide text-[hsl(var(--muted))] uppercase">
									Daily Log
								</h3>
								{dailyLog.length > 0 && (
									<button
										type="button"
										onClick={removeAllFromDailyLog}
										className="rounded-lg border border-[hsl(var(--danger))]/35 bg-[hsl(var(--primary))]/10  px-3 py-1.5 text-xs font-semibold text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))]/20">
										Remove all
									</button>
								)}
							</div>

							{dailyLog.length > 0 ? (
								<div className="space-y-2 max-h-52 overflow-y-auto pr-1">
									{dailyLog.map((item) => (
										<div
											key={item.id}
											className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 px-3 py-2">
											<div>
												<p className="text-sm font-medium">{item.name}</p>
												<p className="text-xs text-[hsl(var(--muted))]">
													{item.calories} kcal
												</p>
											</div>
											<button
												type="button"
												onClick={() => removeFromDailyLog(item.id)}
												className="rounded-md bg-[hsl(var(--primary))]/10 px-2 py-1 text-xs font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/20">
												Remove
											</button>
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-[hsl(var(--muted))]">
									No foods logged yet. Tap a food and add it to your daily log.
								</p>
							)}
						</div>
					</section>

					<div className="mb-6 grid gap-6 lg:grid-cols-2 items-stretch">
						<section className="card p-5 sm:p-6 h-full">
							<h2 className="text-lg font-semibold mb-4">
								Daily Nutrition Breakdown
							</h2>
							<div className="grid grid-cols-2 gap-3">
								<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-3">
									<p className="text-xs text-[hsl(var(--muted))]">Calories</p>
									<p className="mt-1 text-lg font-semibold">
										{Math.round(nutritionTotals.calories)}
									</p>
								</div>
								<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-3">
									<p className="text-xs text-[hsl(var(--muted))]">Protein</p>
									<p className="mt-1 text-lg font-semibold">
										{formatMacro(nutritionTotals.protein)}g
									</p>
								</div>
								<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-3">
									<p className="text-xs text-[hsl(var(--muted))]">Carbs</p>
									<p className="mt-1 text-lg font-semibold">
										{formatMacro(nutritionTotals.carbs)}g
									</p>
								</div>
								<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-3">
									<p className="text-xs text-[hsl(var(--muted))]">Fat</p>
									<p className="mt-1 text-lg font-semibold">
										{formatMacro(nutritionTotals.fat)}g
									</p>
								</div>
								<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-3">
									<p className="text-xs text-[hsl(var(--muted))]">Fiber</p>
									<p className="mt-1 text-lg font-semibold">
										{formatMacro(nutritionTotals.fiber)}g
									</p>
								</div>
								<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-3">
									<p className="text-xs text-[hsl(var(--muted))]">Sugar</p>
									<p className="mt-1 text-lg font-semibold">
										{formatMacro(nutritionTotals.sugar)}g
									</p>
								</div>
							</div>
						</section>

						<section className="card p-5 sm:p-6 h-full">
							<h2 className="text-lg font-semibold mb-4">Weekly Trends</h2>
							<div className="h-44 sm:h-48 w-full">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={weeklyTrendData}
										margin={{ left: -18, right: 8, top: 4, bottom: 0 }}>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke="hsl(var(--border))"
										/>
										<XAxis
											dataKey="day"
											stroke="hsl(var(--muted))"
											tickLine={false}
											axisLine={false}
										/>
										<YAxis
											stroke="hsl(var(--muted))"
											fontSize={11}
											tickLine={false}
											axisLine={false}
										/>
										<Tooltip
											cursor={{
												fill: "hsl(var(--primary))",
												fillOpacity: 0.08,
											}}
											contentStyle={{
												background: "hsl(var(--surface))",
												border: "1px solid hsl(var(--border))",
												borderRadius: "12px",
												color: "hsl(var(--fg))",
												boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
											}}
											labelStyle={{
												color: "hsl(var(--muted))",
												fontWeight: 600,
											}}
											itemStyle={{
												color: "hsl(var(--fg))",
												fontWeight: 600,
											}}
											formatter={(value) => [
												`${Math.round(Number(value) || 0)} kcal`,
												"Calories",
											]}
										/>
										<Bar
											dataKey="calories"
											fill="hsl(var(--primary))"
											activeBar={{
												fill: "hsl(var(--primary-hover))",
												stroke: "hsl(var(--primary))",
												strokeWidth: 1,
											}}
											barSize={22}
											radius={[6, 6, 0, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</section>
					</div>

					<section className="card p-5 sm:p-6 mb-6">
						<div className="mb-4">
							<label htmlFor="food-search" className="sr-only">
								Search foods
							</label>
							<input
								id="food-search"
								type="search"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								placeholder="Search food by name"
								className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 text-sm placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/35"
							/>
						</div>

						<div className="flex gap-2 overflow-x-auto pb-1">
							{foodCategories.map((category) => (
								<button
									key={category}
									type="button"
									onClick={() => setSelectedCategory(category)}
									className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition ${
										selectedCategory === category
											? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))] hover:bg-[hsl(var(--primary-hover))]"
											: "border-[hsl(var(--border))] text-[hsl(var(--muted))] hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--fg))]"
									}`}>
									{category}
								</button>
							))}
						</div>

						<div className="mt-4">
							<div className="mb-2 flex items-center justify-between gap-2">
								<p className="text-sm font-semibold">Quick Add</p>
								<p className="text-xs text-[hsl(var(--muted))]">
									Tap to log instantly
								</p>
							</div>
							<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
								{quickAddFoods.map((food) => (
									<button
										key={`quick-${food.id}`}
										type="button"
										onClick={() => addToDailyLog(food)}
										className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-3 py-2 text-left transition hover:border-[hsl(var(--primary))]/45 hover:bg-[hsl(var(--primary))]/5">
										<div className="flex items-center justify-between gap-2">
											<p className="truncate text-sm font-semibold">
												+ {food.name}
											</p>
											<span className="rounded-full bg-[hsl(var(--primary))]/10 px-2 py-0.5 text-xs font-semibold text-[hsl(var(--primary))]">
												{Math.round(food.calories)} kcal
											</span>
										</div>
									</button>
								))}
							</div>
						</div>
					</section>

					<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{filteredFoods.map((food) => (
							<article
								key={food.id}
								className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-sm">
								<button
									type="button"
									onClick={() => setSelectedFood(food)}
									className="block w-full text-left">
									<img
										src={food.image}
										alt={food.name}
										loading="lazy"
										className="h-32 w-full object-cover"
									/>
									<div className="p-4">
										<div className="mb-2 flex items-center justify-between gap-2">
											<h3 className="font-semibold leading-tight">
												{food.name}
											</h3>
											<span className="rounded-full bg-[hsl(var(--primary))]/10 px-2 py-0.5 text-xs text-[hsl(var(--primary))]">
												{food.category}
											</span>
										</div>
										<p className="text-sm text-[hsl(var(--muted))]">
											{food.calories} kcal / 100g
										</p>
									</div>
								</button>
								<div className="px-4 pb-4">
									<button
										type="button"
										onClick={() => addToDailyLog(food)}
										className="w-full rounded-lg bg-[hsl(var(--primary))]/10 px-3 py-2 text-sm font-semibold text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))]/20">
										Add to daily log
									</button>
								</div>
							</article>
						))}
					</section>

					{filteredFoods.length === 0 && (
						<section className="card p-8 mt-6 text-center">
							<p className="text-[hsl(var(--muted))]">
								No foods found for this search/filter.
							</p>
						</section>
					)}
				</div>
			</div>

			{selectedFood && (
				<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 px-4 py-6">
					<div className="w-full max-w-md overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-xl">
						<img
							src={selectedFood.image}
							alt={selectedFood.name}
							className="h-44 w-full object-cover"
						/>
						<div className="p-5">
							<div className="mb-3 flex items-center justify-between">
								<h3 className="text-xl font-bold">{selectedFood.name}</h3>
								<span className="rounded-full bg-[hsl(var(--primary))]/10 px-2 py-0.5 text-xs text-[hsl(var(--primary))]">
									{selectedFood.category}
								</span>
							</div>

							<div className="mb-4 grid grid-cols-2 gap-3">
								<div className="rounded-lg border border-[hsl(var(--border))] p-3">
									<p className="text-xs text-[hsl(var(--muted))]">Calories</p>
									<p className="text-lg font-semibold">
										{selectedFood.calories} kcal
									</p>
								</div>
								<div className="rounded-lg border border-[hsl(var(--border))] p-3">
									<p className="text-xs text-[hsl(var(--muted))]">Protein</p>
									<p className="text-lg font-semibold">
										{formatMacro(selectedFood.protein)}g
									</p>
								</div>
								<div className="rounded-lg border border-[hsl(var(--border))] p-3">
									<p className="text-xs text-[hsl(var(--muted))]">Carbs</p>
									<p className="text-lg font-semibold">
										{formatMacro(selectedFood.carbs)}g
									</p>
								</div>
								<div className="rounded-lg border border-[hsl(var(--border))] p-3">
									<p className="text-xs text-[hsl(var(--muted))]">Fat</p>
									<p className="text-lg font-semibold">
										{formatMacro(selectedFood.fat)}g
									</p>
								</div>
							</div>

							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => addToDailyLog(selectedFood)}
									className="flex-1 rounded-lg bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-semibold text-[hsl(var(--primary-fg))] transition hover:bg-[hsl(var(--primary-hover))]">
									Add to daily log
								</button>
								<button
									type="button"
									onClick={() => setSelectedFood(null)}
									className="rounded-lg border border-[hsl(var(--border))] px-4 py-2.5 text-sm font-medium hover:bg-[hsl(var(--surface))]/70">
									Close
								</button>
							</div>
						</div>
					</div>
					<button
						type="button"
						onClick={() => setSelectedFood(null)}
						className="absolute inset-0 -z-10"
						aria-label="Close food details"
					/>
				</div>
			)}

			<ToastContainer toasts={toasts} />
		</AppPageFrame>
	)
}

export default FoodCaloriesPage
