import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowLeft, Search, X } from "lucide-react"
import AppPageFrame from "../components/AppPageFrame.jsx"
import articlesData from "../data/sportsNutritionArticles.json"

const CATEGORIES = {
	protein: { icon: "🥩", label: "Protein" },
	carbohydrates: { icon: "🍚", label: "Carbohydrates" },
	"healthy-fats": { icon: "🥑", label: "Healthy Fats" },
	hydration: { icon: "💧", label: "Hydration" },
	supplements: { icon: "💊", label: "Supplements" },
	"performance-nutrition": { icon: "🏃", label: "Performance Nutrition" },
}

function SportsNutritionPage() {
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedCategory, setSelectedCategory] = useState(null)

	const normalizedQuery = searchQuery.trim().toLowerCase()
	const isSearching = normalizedQuery.length > 0

	const filteredArticles = useMemo(() => {
		return articlesData.filter((article) => {
			if (selectedCategory && article.category !== selectedCategory) {
				return false
			}

			if (!normalizedQuery) {
				return true
			}

			const searchableText = [
				article.title,
				article.category,
				...(article.tags || []),
				article.summary,
			]
				.join(" ")
				.toLowerCase()

			return searchableText.includes(normalizedQuery)
		})
	}, [normalizedQuery, selectedCategory])

	return (
		<AppPageFrame>
			<div className="bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
				{/* Hero Section */}
				<section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--primary))]/20 via-[hsl(var(--primary))]/8 to-[hsl(var(--primary))]/5 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
					{/* Decorative blur elements */}
					<div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-[hsl(var(--primary))]/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-[hsl(var(--primary))]/5 blur-3xl" />

					<div className="mx-auto max-w-4xl">
						<div className="space-y-8">
							<div className="flex items-center">
								<Link
									to="/handbook"
									className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))]/70 bg-[hsl(var(--surface))]/75 px-3.5 py-1.5 text-sm font-medium text-[hsl(var(--muted))] backdrop-blur-sm transition hover:border-[hsl(var(--primary))]/30 hover:bg-[hsl(var(--surface))] hover:text-[hsl(var(--fg))]">
									<ArrowLeft className="h-4 w-4" />
									Back to Handbook
								</Link>
							</div>
							<div className="space-y-4">
								<h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
									Sports Nutrition
								</h1>
								<div className="h-1 w-16 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/40 rounded-full" />
								<p className="max-w-3xl text-lg leading-relaxed text-[hsl(var(--muted))] sm:text-xl">
									Learn how nutrition supports performance, recovery, muscle
									growth, and overall health. Discover evidence-based strategies
									to optimize your fitness journey.
								</p>
							</div>

							{/* Search Bar */}
							<div>
								<div className="rounded-2xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--bg))]/80 p-1 backdrop-blur-md shadow-xl shadow-[hsl(var(--primary))]/5">
									<div className="relative">
										<Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[hsl(var(--primary))]" />
										<input
											type="search"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											placeholder="Search articles, categories, or topics..."
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
							</div>
						</div>
					</div>
				</section>

				<div className="px-4 py-12 sm:px-6 lg:px-8">
					<div
						className={`mx-auto max-w-7xl ${
							isSearching ? "space-y-8" : "space-y-16"
						}`}>
						{/* Browse By Category */}
						<section className="space-y-3">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold">Browse By Category</h2>
								<p className="text-[hsl(var(--muted))]">
									Explore nutrition topics organized by category
								</p>
							</div>
							<div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
								{Object.entries(CATEGORIES).map(([key, { icon, label }]) => (
									<motion.button
										key={key}
										onClick={() =>
											setSelectedCategory(
												selectedCategory === label ? null : label,
											)
										}
										whileHover={{ y: -4 }}
										className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-all ${
											selectedCategory === label
												? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/15 text-[hsl(var(--fg))]"
												: "border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--muted))] hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--fg))]"
										}`}>
										<div className="inline mr-2 text-base">{icon}</div>
										<h3 className="inline font-semibold">{label}</h3>
										<p className="hidden">
											{articlesData.filter((a) => a.category === label).length}{" "}
											articles
										</p>
									</motion.button>
								))}
							</div>
						</section>

						{/* All Articles Grid */}
						<section className="space-y-6">
							<div className="space-y-3">
								<h2 className="text-3xl font-bold">All Articles</h2>
								<p className="text-[hsl(var(--muted))]">
									{filteredArticles.length}{" "}
									{filteredArticles.length === 1 ? "article" : "articles"}{" "}
									available
								</p>
							</div>

							{filteredArticles.length === 0 ? (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-8 text-center">
									<p className="text-lg font-semibold">No articles found.</p>
									<div className="mt-4 flex flex-wrap items-center justify-center gap-2">
										<button
											type="button"
											onClick={() => {
												setSearchQuery("")
												setSelectedCategory(null)
											}}
											className="rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-sm transition hover:border-[hsl(var(--primary))]/45">
											Clear filters
										</button>
									</div>
								</motion.div>
							) : (
								<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
									{filteredArticles.map((article) => (
										<motion.div
											key={article.id}
											whileHover={{ y: -6 }}
											transition={{ duration: 0.2 }}>
											<Link
												to={`/handbook/sport-nutrition/${article.id}`}
												className="group block h-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-sm transition duration-300 hover:shadow-xl hover:border-[hsl(var(--primary))]/45">
												<img
													src={article.coverImage}
													alt={article.title}
													loading="lazy"
													className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
												/>
												<div className="space-y-3 p-4">
													<div className="flex items-center justify-between gap-2 text-xs">
														<span className="inline-flex rounded-full border border-[hsl(var(--primary))]/35 bg-[hsl(var(--primary))]/10 px-2.5 py-1 font-semibold text-[hsl(var(--primary))]">
															{article.category}
														</span>
														<span className="text-[hsl(var(--muted))]">
															{article.readTime} min
														</span>
													</div>
													<h3 className="text-base font-bold leading-tight text-[hsl(var(--fg))]">
														{article.title}
													</h3>
													<p className="line-clamp-3 text-sm text-[hsl(var(--muted))]">
														{article.summary}
													</p>
												</div>
											</Link>
										</motion.div>
									))}
								</div>
							)}
						</section>
					</div>
				</div>
			</div>
		</AppPageFrame>
	)
}

export default SportsNutritionPage
