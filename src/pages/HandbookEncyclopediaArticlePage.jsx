import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Bookmark, Clock } from "lucide-react"
import AppPageFrame from "../components/AppPageFrame.jsx"
import {
	ENCYCLOPEDIA_FALLBACK_IMAGE,
	encyclopediaArticleById,
	encyclopediaArticles,
} from "../data/encyclopediaArticles.js"
import workoutExerciseData from "../data/workoutExerciseData.js"
import {
	addRecentlyViewedArticleId,
	getBookmarkedArticleIds,
	toggleBookmarkedArticleId,
} from "../utils/encyclopediaStorage.js"

function HandbookEncyclopediaArticlePage() {
	const { articleId } = useParams()
	const article = encyclopediaArticleById[articleId]
	const [bookmarkedIds, setBookmarkedIds] = useState(getBookmarkedArticleIds)

	useEffect(() => {
		if (!article) {
			return
		}

		addRecentlyViewedArticleId(article.id)
	}, [article])

	const relatedArticles = useMemo(() => {
		if (!article) {
			return []
		}

		const topicSet = new Set(
			(article.relatedTopics || []).map((topic) => topic.toLowerCase()),
		)

		return encyclopediaArticles
			.filter((candidate) => candidate.id !== article.id)
			.filter((candidate) => {
				if (candidate.category === article.category) {
					return true
				}

				return (candidate.relatedTopics || []).some((topic) =>
					topicSet.has(topic.toLowerCase()),
				)
			})
			.slice(0, 6)
	}, [article])

	const workoutMatch = useMemo(() => {
		if (!article?.exerciseName) {
			return null
		}

		const normalized = article.exerciseName.toLowerCase()
		const allExercises = workoutExerciseData.data ?? []

		const exact = allExercises.find(
			(exercise) => exercise.name.toLowerCase() === normalized,
		)
		if (exact) {
			return exact
		}

		return allExercises.find((exercise) => {
			const name = exercise.name.toLowerCase()
			return name.includes(normalized) || normalized.includes(name)
		})
	}, [article])

	if (!article) {
		return (
			<AppPageFrame>
				<div className="bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
					<div className="w-full card p-6 sm:p-8">
						<h1 className="text-2xl sm:text-3xl font-bold mb-3">
							Article not found
						</h1>
						<p className="text-[hsl(var(--muted))] mb-6">
							This encyclopedia article could not be found.
						</p>
						<Link
							to="/handbook/encyclopedia"
							className="btn btn-primary rounded-lg px-4 py-2">
							Back to Encyclopedia
						</Link>
					</div>
				</div>
			</AppPageFrame>
		)
	}

	const isBookmarked = bookmarkedIds.includes(article.id)

	useEffect(() => {
		console.log("[EncyclopediaImageDebug][Detail]", {
			title: article.title,
			image: article.image,
		})
	}, [article.image, article.title])

	return (
		<AppPageFrame>
			<div className="bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
				<div className="w-full space-y-6">
					<div className="flex items-center justify-between gap-3">
						<Link
							to="/handbook/encyclopedia"
							className="inline-flex items-center gap-2 rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--primary))] transition">
							<ArrowLeft className="h-4 w-4" />
							Back
						</Link>
						<button
							type="button"
							onClick={() =>
								setBookmarkedIds(toggleBookmarkedArticleId(article.id))
							}
							className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
								isBookmarked
									? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))]"
									: "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/45"
							}`}>
							<Bookmark
								className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
							/>
							{isBookmarked ? "Saved" : "Save"}
						</button>
					</div>

					<div className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
						<img
							src={article.image}
							alt={article.title}
							onError={(event) => {
								console.error("[EncyclopediaImageError][DetailHero]", {
									title: article.title,
									image: article.image,
								})
								event.currentTarget.src = ENCYCLOPEDIA_FALLBACK_IMAGE
							}}
							className="h-64 w-full object-cover"
						/>
						<div className="space-y-4 p-6 sm:p-8">
							<div className="flex flex-wrap items-center gap-2">
								<span className="rounded-full bg-[hsl(var(--primary))]/10 px-3 py-1 text-xs font-medium text-[hsl(var(--primary))]">
									{article.category}
								</span>
								<span className="rounded-full border border-[hsl(var(--border))] px-3 py-1 text-xs text-[hsl(var(--muted))] inline-flex items-center gap-1">
									<Clock className="h-3.5 w-3.5" />
									{article.readingTime} min
								</span>
								<span className="rounded-full border border-[hsl(var(--border))] px-3 py-1 text-xs text-[hsl(var(--muted))]">
									{article.difficulty}
								</span>
							</div>

							<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
								{article.title}
							</h1>

							<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4 text-[hsl(var(--muted))] leading-relaxed whitespace-pre-line">
								{article.content}
							</div>

							{workoutMatch && (
								<Link
									to={`/workout?search=${encodeURIComponent(workoutMatch.name)}`}
									className="inline-flex rounded-xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-[hsl(var(--primary-fg))] hover:bg-[hsl(var(--primary-hover))] transition">
									View Exercise
								</Link>
							)}
						</div>
					</div>

					{article.relatedTopics?.length > 0 && (
						<section className="card p-5 sm:p-6">
							<h2 className="text-xl font-bold mb-3">Related Topics</h2>
							<div className="flex gap-2 overflow-x-auto pb-1">
								{article.relatedTopics.map((topic) => (
									<Link
										key={topic}
										to={`/handbook/encyclopedia?q=${encodeURIComponent(topic)}`}
										className="whitespace-nowrap rounded-full border border-[hsl(var(--border))] px-3 py-1 text-xs text-[hsl(var(--muted))] hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--fg))] transition">
										{topic}
									</Link>
								))}
							</div>
						</section>
					)}

					{relatedArticles.length > 0 && (
						<section className="space-y-3">
							<h2 className="text-2xl font-bold">Related Articles</h2>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{relatedArticles.map((related) => (
									<Link
										key={related.id}
										to={`/handbook/encyclopedia/${related.id}`}
										className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] transition hover:border-[hsl(var(--primary))]/45">
										<img
											src={related.image}
											alt={related.title}
											onError={(event) => {
												console.error("[EncyclopediaImageError][Related]", {
													title: related.title,
													image: related.image,
												})
												event.currentTarget.src = ENCYCLOPEDIA_FALLBACK_IMAGE
											}}
											className="h-28 w-full object-cover"
										/>
										<div className="p-4">
											<p className="line-clamp-2 text-sm font-semibold">
												{related.title}
											</p>
											<p className="mt-1 text-xs text-[hsl(var(--muted))]">
												{related.category}
											</p>
										</div>
									</Link>
								))}
							</div>
						</section>
					)}
				</div>
			</div>
		</AppPageFrame>
	)
}

export default HandbookEncyclopediaArticlePage
