import { useMemo, useState, useCallback, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react"
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

const POPULAR_QUESTIONS = [
	"protein-shakes-necessity",
	"how-much-protein-needed",
	"creatine-safety-efficacy",
	"pre-workout-nutrition-timing",
	"post-workout-recovery-nutrition",
	"build-muscle-without-supplements",
]

function SportsNutritionPage() {
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [activeIndex, setActiveIndex] = useState(0)
	const [autoplay, setAutoplay] = useState(true)
	const carouselRef = useRef(null)

	const normalizedQuery = searchQuery.trim().toLowerCase()

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

	const featuredArticles = useMemo(
		() => articlesData.filter((article) => article.featured),
		[],
	)

	const scrollCarousel = (direction) => {
		if (!carouselRef.current) return
		const scrollAmount = carouselRef.current.clientWidth * 0.8
		carouselRef.current.scrollBy({
			left: direction === "left" ? -scrollAmount : scrollAmount,
			behavior: "smooth",
		})
		setAutoplay(false)
	}

	useEffect(() => {
		if (!autoplay) return
		const interval = setInterval(() => {
			if (carouselRef.current) {
				const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
				if (scrollLeft + clientWidth >= scrollWidth - 10) {
					carouselRef.current.scrollTo({ left: 0, behavior: "smooth" })
				} else {
					carouselRef.current.scrollBy({
						left: clientWidth * 0.8,
						behavior: "smooth",
					})
				}
			}
		}, 6000)
		return () => clearInterval(interval)
	}, [autoplay])

	const handleCarouselScroll = useCallback(() => {
		if (!carouselRef.current) return
		const { scrollLeft, clientWidth } = carouselRef.current
		const cardWidth = clientWidth * 0.8
		setActiveIndex(Math.round(scrollLeft / Math.max(cardWidth, 1)))
	}, [])

	const popularArticles = articlesData.filter((a) =>
		POPULAR_QUESTIONS.includes(a.id),
	)

	return (
		<AppPageFrame>
			<div className="bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
				{/* Hero Section */}
				<section className="bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--primary))]/5 px-4 py-12 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
							Sports Nutrition
						</h1>
						<p className="mt-2 max-w-3xl text-lg text-[hsl(var(--muted))] sm:text-xl">
							Learn how nutrition supports performance, recovery, muscle growth,
							and overall health.
						</p>

						{/* Search Bar */}
						<div className="mt-8">
							<div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg))]/90 p-3 backdrop-blur-md">
								<div className="relative">
									<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted))]" />
									<input
										type="search"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="Search articles, categories, or topics..."
										className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-3 pl-9 pr-10 text-sm text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30"
									/>
									{searchQuery.trim().length > 0 && (
										<button
											type="button"
											onClick={() => setSearchQuery("")}
											className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-[hsl(var(--border))] p-1.5 text-[hsl(var(--muted))] transition hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--fg))]"
											aria-label="Clear search">
											<X className="h-3.5 w-3.5" />
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</section>

				<div className="px-4 py-8 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl space-y-12">
						{/* Featured Articles Carousel */}
						{featuredArticles.length > 0 && (
							<section className="space-y-4">
								<h2 className="text-2xl font-bold">Featured Articles</h2>
								<div className="relative">
									<div
										ref={carouselRef}
										onScroll={handleCarouselScroll}
										className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
										{featuredArticles.map((article) => (
											<motion.div
												key={article.id}
												initial={{ opacity: 0, y: 16 }}
												whileInView={{ opacity: 1, y: 0 }}
												viewport={{ once: true, amount: 0.2 }}
												className="min-w-[80%] snap-start sm:min-w-[45%] lg:min-w-[35%]">
												<Link
												to={`/handbook/sport-nutrition/${article.id}`}
													className="group block overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-sm transition hover:border-[hsl(var(--primary))]/45 hover:shadow-xl">
													<div className="relative h-48">
														<img
															src={article.coverImage}
															alt={article.title}
															loading="lazy"
															className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
														/>
														<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
														<div className="absolute inset-x-0 bottom-0 p-4 text-white">
															<div className="mb-2 flex items-center justify-between gap-2 text-xs">
																<span className="rounded-full bg-white/20 px-2.5 py-1 font-semibold backdrop-blur-sm">
																	{article.category}
																</span>
																<span>{article.readTime} min</span>
															</div>
															<h3 className="text-lg font-bold leading-tight">
																{article.title}
															</h3>
														</div>
													</div>
													<div className="p-4">
														<p className="text-sm text-[hsl(var(--muted))] line-clamp-2">
															{article.summary}
														</p>
														<button className="mt-3 inline-flex items-center rounded-lg border border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 px-3 py-2 text-xs font-semibold text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))]/20">
															Read Article →
														</button>
													</div>
												</Link>
											</motion.div>
										))}
									</div>

									{/* Carousel Controls */}
									<button
										onClick={() => scrollCarousel("left")}
										className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--surface))] p-2 shadow-lg transition hover:bg-[hsl(var(--primary))]/10 lg:-left-6"
										aria-label="Previous">
										<ChevronLeft className="h-5 w-5" />
									</button>
									<button
										onClick={() => scrollCarousel("right")}
										className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--surface))] p-2 shadow-lg transition hover:bg-[hsl(var(--primary))]/10 lg:-right-6"
										aria-label="Next">
										<ChevronRight className="h-5 w-5" />
									</button>

									{/* Pagination Dots */}
									<div className="mt-4 flex items-center justify-center gap-2">
										{Array.from({
											length: Math.ceil(featuredArticles.length / 1),
										}).map((_, index) => (
											<button
												key={index}
												type="button"
												onClick={() => {
													if (carouselRef.current) {
														const cardWidth =
															carouselRef.current.clientWidth * 0.8
														carouselRef.current.scrollTo({
															left: index * cardWidth,
															behavior: "smooth",
														})
													}
												}}
												className={`h-2.5 rounded-full transition-all ${
													activeIndex === index
														? "w-6 bg-[hsl(var(--primary))]"
														: "w-2.5 bg-[hsl(var(--border))]"
												}`}
												aria-label={`Go to featured article ${index + 1}`}
											/>
										))}
									</div>
								</div>
							</section>
						)}

						{/* Browse By Category */}
						<section className="space-y-4">
							<h2 className="text-2xl font-bold">Browse By Category</h2>
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{Object.entries(CATEGORIES).map(([key, { icon, label }]) => (
									<motion.button
										key={key}
										onClick={() =>
											setSelectedCategory(
												selectedCategory === label ? null : label,
											)
										}
										whileHover={{ y: -4 }}
										className={`rounded-2xl border p-6 text-left transition ${
											selectedCategory === label
												? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10"
												: "border-[hsl(var(--border))] bg-[hsl(var(--surface))] hover:border-[hsl(var(--primary))]/45"
										}`}>
										<div className="text-3xl">{icon}</div>
										<h3 className="mt-2 font-bold">{label}</h3>
										<p className="mt-1 text-xs text-[hsl(var(--muted))]">
											{articlesData.filter((a) => a.category === label).length}{" "}
											articles
										</p>
									</motion.button>
								))}
							</div>
						</section>

						{/* Popular Questions */}
						<section className="space-y-4">
							<h2 className="text-2xl font-bold">Popular Questions</h2>
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{popularArticles.map((article) => (
									<Link
										key={article.id}
										to={`/handbook/sport-nutrition/${article.id}`}
										className="group overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 transition hover:border-[hsl(var(--primary))]/45 hover:shadow-lg">
										<p className="font-bold text-[hsl(var(--fg))] transition group-hover:text-[hsl(var(--primary))]">
											{article.title}
										</p>
										<p className="mt-2 text-xs text-[hsl(var(--muted))]">
											{article.readTime} min read
										</p>
									</Link>
								))}
							</div>
						</section>

						{/* All Articles Grid */}
						<section className="space-y-4">
							<div className="flex items-center justify-between gap-3">
								<h2 className="text-2xl font-bold">All Articles</h2>
								<p className="text-sm text-[hsl(var(--muted))]">
									{filteredArticles.length} articles
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
