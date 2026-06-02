import { useEffect, useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Bookmark, Clock, Search } from "lucide-react"
import AppPageFrame from "../components/AppPageFrame.jsx"
import EncyclopediaArticleCard from "../components/encyclopedia/EncyclopediaArticleCard.jsx"
import {
	encyclopediaArticles,
	encyclopediaCategories,
	featuredEncyclopediaArticles,
} from "../data/encyclopediaArticles.js"
import {
	addToEncyclopediaSearchHistory,
	getBookmarkedArticleIds,
	getEncyclopediaSearchHistory,
	getLastSelectedEncyclopediaCategory,
	getRecentlyViewedArticleIds,
	setLastSelectedEncyclopediaCategory,
	toggleBookmarkedArticleId,
} from "../utils/encyclopediaStorage.js"

function HandbookEncyclopediaPage() {
	const location = useLocation()
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedCategory, setSelectedCategory] = useState(
		getLastSelectedEncyclopediaCategory,
	)
	const [bookmarkedIds, setBookmarkedIds] = useState(getBookmarkedArticleIds)
	const [recentlyViewedIds] = useState(getRecentlyViewedArticleIds)
	const [searchHistory, setSearchHistory] = useState(getEncyclopediaSearchHistory)

	useEffect(() => {
		const params = new URLSearchParams(location.search)
		const queryFromUrl = params.get("q")
		if (queryFromUrl) {
			setSearchQuery(queryFromUrl)
		}
	}, [location.search])

	useEffect(() => {
		setLastSelectedEncyclopediaCategory(selectedCategory)
	}, [selectedCategory])

	useEffect(() => {
		if (!searchQuery.trim()) {
			return undefined
		}

		const timerId = window.setTimeout(() => {
			setSearchHistory(addToEncyclopediaSearchHistory(searchQuery))
		}, 700)

		return () => window.clearTimeout(timerId)
	}, [searchQuery])

	const filteredArticles = useMemo(() => {
		const normalized = searchQuery.trim().toLowerCase()

		return encyclopediaArticles.filter((article) => {
			const matchesCategory =
				selectedCategory === "All" || article.category === selectedCategory

			if (!normalized) {
				return matchesCategory
			}

			const keywordBlob = [
				article.title,
				article.category,
				article.summary,
				...(article.keywords || []),
				...(article.relatedTopics || []),
			].join(" ").toLowerCase()

			return matchesCategory && keywordBlob.includes(normalized)
		})
	}, [searchQuery, selectedCategory])

	const bookmarkedArticles = useMemo(
		() =>
			bookmarkedIds
				.map((id) => encyclopediaArticles.find((article) => article.id === id))
				.filter(Boolean),
		[bookmarkedIds],
	)

	const recentlyViewedArticles = useMemo(
		() =>
			recentlyViewedIds
				.map((id) => encyclopediaArticles.find((article) => article.id === id))
				.filter(Boolean)
				.slice(0, 5),
		[recentlyViewedIds],
	)

	const toggleBookmark = (articleId) => {
		setBookmarkedIds(toggleBookmarkedArticleId(articleId))
	}

	return (
		<AppPageFrame>
			<div className="bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
				<div className="w-full space-y-6">
					<header className="space-y-4">
						<div className="flex items-center justify-between gap-3">
							<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Fitness Encyclopedia</h1>
							<Link
								to="/handbook"
								className="btn btn-secondary rounded-lg px-4 py-2">
								Back
							</Link>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
							<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4">
								<p className="text-xs text-[hsl(var(--muted))] uppercase tracking-wide">Total articles</p>
								<p className="mt-1 text-2xl font-bold">{encyclopediaArticles.length}</p>
							</div>
							<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4">
								<p className="text-xs text-[hsl(var(--muted))] uppercase tracking-wide">Saved articles</p>
								<p className="mt-1 text-2xl font-bold">{bookmarkedArticles.length}</p>
							</div>
							<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4">
								<p className="text-xs text-[hsl(var(--muted))] uppercase tracking-wide">Recently viewed</p>
								<p className="mt-1 text-2xl font-bold">{recentlyViewedArticles.length}</p>
							</div>
						</div>
					</header>

					<section className="card p-5 sm:p-6 space-y-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted))]" />
							<input
								type="search"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								placeholder="Search titles, categories, keywords, exercises, muscles, nutrition topics"
								className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-3 pl-10 pr-4 text-sm placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30"
							/>
						</div>

						{searchHistory.length > 0 && (
							<div className="flex gap-2 overflow-x-auto pb-1">
								{searchHistory.map((query) => (
									<button
										key={query}
										type="button"
										onClick={() => setSearchQuery(query)}
										className="whitespace-nowrap rounded-full border border-[hsl(var(--border))] px-3 py-1 text-xs text-[hsl(var(--muted))] hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--fg))] transition">
										{query}
									</button>
								))}
							</div>
						)}

						<div className="flex gap-2 overflow-x-auto pb-1">
							{encyclopediaCategories.map((category) => (
								<button
									key={category}
									type="button"
									onClick={() => setSelectedCategory(category)}
									className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition ${
										selectedCategory === category
											? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))]"
											: "border-[hsl(var(--border))] text-[hsl(var(--muted))] hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--fg))]"
									}`}>
									{category}
								</button>
							))}
						</div>
					</section>

					<section className="space-y-3">
						<h2 className="text-xl font-bold">Featured</h2>
						<div className="flex gap-3 overflow-x-auto pb-1">
							{featuredEncyclopediaArticles.map((article) => (
								<Link
									key={article.id}
									to={`/handbook/encyclopedia/article/${article.id}`}
									className="min-w-[280px] max-w-[320px] overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] transition hover:border-[hsl(var(--primary))]/45">
									<img src={article.image} alt={article.title} className="h-36 w-full object-cover" />
									<div className="p-4">
										<p className="text-sm font-semibold line-clamp-2">{article.title}</p>
										<p className="mt-2 text-xs text-[hsl(var(--muted))] inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {article.readingTime} min</p>
									</div>
								</Link>
							))}
						</div>
					</section>

					{bookmarkedArticles.length > 0 && (
						<section className="space-y-3">
							<h2 className="text-xl font-bold inline-flex items-center gap-2"><Bookmark className="h-5 w-5" /> Saved Articles</h2>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{bookmarkedArticles.map((article) => (
									<EncyclopediaArticleCard
										key={`saved-${article.id}`}
										article={article}
										isBookmarked={bookmarkedIds.includes(article.id)}
										onToggleBookmark={toggleBookmark}
										to={`/handbook/encyclopedia/article/${article.id}`}
									/>
								))}
							</div>
						</section>
					)}

					{recentlyViewedArticles.length > 0 && (
						<section className="space-y-3">
							<h2 className="text-xl font-bold">Recently Viewed</h2>
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
								{recentlyViewedArticles.map((article) => (
									<Link
										key={`recent-${article.id}`}
										to={`/handbook/encyclopedia/article/${article.id}`}
										className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-3 transition hover:border-[hsl(var(--primary))]/45">
										<p className="text-sm font-medium line-clamp-2">{article.title}</p>
										<p className="mt-1 text-xs text-[hsl(var(--muted))]">{article.category}</p>
									</Link>
								))}
							</div>
						</section>
					)}

					<section className="space-y-3">
						<div className="flex items-center justify-between gap-2">
							<h2 className="text-xl font-bold">Articles</h2>
							<p className="text-sm text-[hsl(var(--muted))]">{filteredArticles.length} results</p>
						</div>
						{filteredArticles.length > 0 ? (
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{filteredArticles.map((article) => (
									<EncyclopediaArticleCard
										key={article.id}
										article={article}
										isBookmarked={bookmarkedIds.includes(article.id)}
										onToggleBookmark={toggleBookmark}
										to={`/handbook/encyclopedia/article/${article.id}`}
									/>
								))}
							</div>
						) : (
							<div className="card p-8 text-center text-[hsl(var(--muted))]">No encyclopedia articles match your filters.</div>
						)}
					</section>
				</div>
			</div>
		</AppPageFrame>
	)
}

export default HandbookEncyclopediaPage
