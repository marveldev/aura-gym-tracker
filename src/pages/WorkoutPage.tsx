import { useEffect, useMemo, useState } from "react"
import AppPageFrame from "../components/AppPageFrame.jsx"
import FlatList from "../components/FlatList"

interface ExerciseDbExercise {
	id: string
	name: string
	bodyPart: string
	target: string
	equipment: string
	gifUrl: string
}

interface ExerciseDbRawExercise {
	id?: string | number
	name?: string
	bodyPart?: string
	target?: string
	equipment?: string
	gifUrl?: string
}

const EXERCISE_DB_ENDPOINT = "https://oss.exercisedb.dev/api/v1/exercises"
const INITIAL_FETCH_LIMIT = 50

const toExercise = (item: ExerciseDbRawExercise): ExerciseDbExercise => ({
	id: String(item.id ?? `${item.name ?? "exercise"}-${Math.random()}`),
	name: (item.name || "Unknown Exercise").trim(),
	bodyPart: (item.bodyPart || "Unknown").trim(),
	target: (item.target || "Unknown").trim(),
	equipment: (item.equipment || "Unknown").trim(),
	gifUrl: (item.gifUrl || "").trim(),
})

const readExerciseList = (payload: unknown): ExerciseDbRawExercise[] => {
	if (Array.isArray(payload)) {
		return payload as ExerciseDbRawExercise[]
	}

	if (payload && typeof payload === "object") {
		const asRecord = payload as Record<string, unknown>
		if (Array.isArray(asRecord.data)) {
			return asRecord.data as ExerciseDbRawExercise[]
		}
		if (Array.isArray(asRecord.results)) {
			return asRecord.results as ExerciseDbRawExercise[]
		}
	}

	return []
}

const fetchExercises = async (
	limit = INITIAL_FETCH_LIMIT,
	offset = 0,
	signal?: AbortSignal,
): Promise<ExerciseDbExercise[]> => {
	const url = new URL(EXERCISE_DB_ENDPOINT)
	url.searchParams.set("limit", String(limit))
	url.searchParams.set("offset", String(offset))

	const response = await fetch(url.toString(), {
		headers: { Accept: "application/json" },
		signal,
	})

	if (!response.ok) {
		throw new Error(
			`ExerciseDB request failed (${response.status} ${response.statusText})`,
		)
	}

	const payload: unknown = await response.json()
	return readExerciseList(payload).map(toExercise)
}

function WorkoutPage() {
	const [exercises, setExercises] = useState<ExerciseDbExercise[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [error, setError] = useState("")
	const [offset, setOffset] = useState(0)
	const [seenIds] = useState(() => new Set<string>())

	const loadExercises = async (signal?: AbortSignal) => {
		setIsLoading(true)
		setError("")
		setOffset(0)
		seenIds.clear()

		try {
			const items = await fetchExercises(INITIAL_FETCH_LIMIT, 0, signal)
			items.forEach((ex) => seenIds.add(ex.id))
			setExercises(items)
			setOffset(INITIAL_FETCH_LIMIT)
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") {
				return
			}
			const message =
				err instanceof Error ? err.message : "Failed to load exercises."
			setError(message)
		} finally {
			setIsLoading(false)
		}
	}

	const loadMoreExercises = async () => {
		if (isLoadingMore) return

		setIsLoadingMore(true)
		try {
			const items = await fetchExercises(INITIAL_FETCH_LIMIT, offset)
			const uniqueNewItems = items.filter((ex) => {
				if (seenIds.has(ex.id)) return false
				seenIds.add(ex.id)
				return true
			})

			if (uniqueNewItems.length > 0) {
				setExercises((prev) => [...prev, ...uniqueNewItems])
				setOffset((prev) => prev + INITIAL_FETCH_LIMIT)
			}
		} catch (err) {
			if (!(err instanceof DOMException && err.name === "AbortError")) {
				console.error("Failed to load more exercises:", err)
			}
		} finally {
			setIsLoadingMore(false)
		}
	}

	useEffect(() => {
		const controller = new AbortController()
		void loadExercises(controller.signal)

		return () => {
			controller.abort()
		}
	}, [])

	const headerStats = useMemo(
		() => `${exercises.length} exercises loaded`,
		[exercises.length],
	)

	const renderExerciseCard = (exercise: ExerciseDbExercise) => (
		<article className="card p-4 sm:p-5 shadow-md shadow-black/5 rounded-2xl">
			<div className="flex gap-4 items-start">
				<div className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg))] overflow-hidden shrink-0">
					{exercise.gifUrl ? (
						<img
							src={exercise.gifUrl}
							alt={exercise.name}
							className="h-full w-full object-contain p-1"
							loading="lazy"
						/>
					) : (
						<div className="h-full w-full flex items-center justify-center text-xs text-[hsl(var(--muted))] px-2 text-center">
							No image
						</div>
					)}
				</div>

				<div className="min-w-0 flex-1 space-y-2">
					<h2 className="text-base sm:text-lg font-semibold capitalize truncate text-[hsl(var(--fg))]">
						{exercise.name}
					</h2>
					<div className="flex flex-wrap gap-2 text-xs sm:text-sm">
						<span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-3 py-1 text-[hsl(var(--muted))] capitalize">
							Body: {exercise.bodyPart}
						</span>
						<span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-3 py-1 text-[hsl(var(--muted))] capitalize">
							Target: {exercise.target}
						</span>
						<span className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-3 py-1 text-[hsl(var(--muted))] capitalize">
							Equipment: {exercise.equipment}
						</span>
					</div>
				</div>
			</div>
		</article>
	)

	return (
		<AppPageFrame>
			<section className="px-4 sm:px-6 lg:px-8 py-4">
				<div className="max-w-5xl mx-auto space-y-5">
					<header className="space-y-1">
						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
							Workout Library
						</h1>
						<p className="text-sm sm:text-base text-[hsl(var(--muted))]">
							Explore curated exercises from AscendAPI ExerciseDB
						</p>
						{!isLoading && !error && (
							<p className="text-xs sm:text-sm text-[hsl(var(--muted))]">
								{headerStats}
							</p>
						)}
					</header>

					{isLoading ? (
						<div className="h-[calc(100vh-220px)] overflow-y-auto pr-1 space-y-3">
							{Array.from({ length: 8 }).map((_, index) => (
								<div
									key={`exercise-loading-${index}`}
									className="card p-4 sm:p-5 rounded-2xl animate-pulse">
									<div className="flex gap-4 items-start">
										<div className="h-24 w-24 rounded-xl bg-[hsl(var(--border))]" />
										<div className="flex-1 space-y-2">
											<div className="h-4 w-1/2 rounded bg-[hsl(var(--border))]" />
											<div className="h-3 w-1/3 rounded bg-[hsl(var(--border))]" />
											<div className="h-3 w-2/3 rounded bg-[hsl(var(--border))]" />
										</div>
									</div>
								</div>
							))}
						</div>
					) : error ? (
						<div className="card rounded-2xl p-6 sm:p-8 text-center space-y-4">
							<p className="text-base sm:text-lg font-semibold">
								Could not load exercises
							</p>
							<p className="text-sm text-[hsl(var(--muted))]">{error}</p>
							<div>
								<button
									type="button"
									onClick={() => void loadExercises()}
									className="btn btn-primary px-5 py-2 rounded-lg">
									Try Again
								</button>
							</div>
						</div>
					) : (
						<FlatList
							data={exercises}
							className="h-[calc(100vh-220px)] pr-1"
							contentClassName="space-y-3"
							keyExtractor={(item) => item.id}
							renderItem={(item) => renderExerciseCard(item)}
							onEndReached={loadMoreExercises}
							listFooterComponent={
								isLoadingMore ? (
									<div className="py-4 text-center">
										<div className="inline-flex items-center gap-2">
											<div className="h-4 w-4 animate-spin rounded-full border-2 border-[hsl(var(--border))] border-t-[hsl(var(--primary))]" />
											<span className="text-sm text-[hsl(var(--muted))]">
												Loading more exercises...
											</span>
										</div>
									</div>
								) : undefined
							}
							emptyComponent={
								<div className="card rounded-2xl p-6 text-center text-[hsl(var(--muted))]">
									No exercises found.
								</div>
							}
						/>
					)}
				</div>
			</section>
		</AppPageFrame>
	)
}

export default WorkoutPage
