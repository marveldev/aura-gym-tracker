import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import AppPageFrame from "../components/AppPageFrame.jsx"
import ToastContainer from "../components/ToastContainer.jsx"
import { foodCategories, foodItems } from "../data/foodCaloriesData.js"

const DAILY_LOG_STORAGE_KEY = "food_calories_daily_log"

function getTodayKey() {
	return new Date().toISOString().slice(0, 10)
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

function formatMacro(value) {
	return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function FoodCaloriesPage() {
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("All")
	const [selectedFood, setSelectedFood] = useState(null)
	const [dailyLog, setDailyLog] = useState(getInitialDailyLog)
	const [toasts, setToasts] = useState([])

	useEffect(() => {
		window.localStorage.setItem(
			DAILY_LOG_STORAGE_KEY,
			JSON.stringify({ date: getTodayKey(), items: dailyLog }),
		)
	}, [dailyLog])

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

	const totalCaloriesConsumed = useMemo(
		() => dailyLog.reduce((total, item) => total + item.calories, 0),
		[dailyLog],
	)

	const addToDailyLog = (food) => {
		setDailyLog((currentLog) => [
			...currentLog,
			{
				id: `${food.id}-${Date.now()}`,
				foodId: food.id,
				name: food.name,
				calories: food.calories,
				protein: food.protein,
				carbs: food.carbs,
				fat: food.fat,
				category: food.category,
			},
		])

		const toastId = `${food.id}-${Date.now()}`
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

					<section className="card p-5 sm:p-6 mb-6">
						<div className="mb-4 flex items-center justify-between gap-3">
							<h2 className="text-lg font-semibold">Daily Calories</h2>
							{dailyLog.length > 0 && (
								<button
									type="button"
									onClick={removeAllFromDailyLog}
									className="rounded-lg border border-[hsl(var(--danger))]/35 px-3 py-1.5 text-xs font-semibold text-[hsl(var(--danger))] transition hover:bg-[hsl(var(--danger))]/10">
									Remove all
								</button>
							)}
						</div>
						<div className="grid gap-3 sm:grid-cols-3 mb-5">
							<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4">
								<p className="text-xs uppercase tracking-wide text-[hsl(var(--muted))]">
									Total Consumed
								</p>
								<p className="mt-2 text-2xl font-bold text-[hsl(var(--primary))]">
									{totalCaloriesConsumed}
									<span className="ml-1 text-sm text-[hsl(var(--muted))]">
										kcal
									</span>
								</p>
							</div>
							<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4">
								<p className="text-xs uppercase tracking-wide text-[hsl(var(--muted))]">
									Items Logged
								</p>
								<p className="mt-2 text-2xl font-bold">{dailyLog.length}</p>
							</div>
							<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4">
								<p className="text-xs uppercase tracking-wide text-[hsl(var(--muted))]">
									Avg / Item
								</p>
								<p className="mt-2 text-2xl font-bold">
									{dailyLog.length > 0
										? Math.round(totalCaloriesConsumed / dailyLog.length)
										: 0}
									<span className="ml-1 text-sm text-[hsl(var(--muted))]">
										kcal
									</span>
								</p>
							</div>
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
											className="rounded-md px-2 py-1 text-xs font-medium text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger))]/10">
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
					</section>

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
