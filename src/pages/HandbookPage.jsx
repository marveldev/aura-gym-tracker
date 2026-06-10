import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import handbookArticles from "../data/handbookArticles"

const FEATURED_INDEX_STORAGE_KEY = "handbook_featured_index"

const getInitialFeaturedIndex = () => {
	if (typeof window === "undefined") {
		return 0
	}

	const storedIndex = Number(
		window.sessionStorage.getItem(FEATURED_INDEX_STORAGE_KEY),
	)

	if (
		Number.isNaN(storedIndex) ||
		storedIndex < 0 ||
		storedIndex >= handbookArticles.length
	) {
		return 0
	}

	return storedIndex
}

const handbookSections = [
	{
		title: "Exercises",
		slug: "exercises",
		description: "Movement guides, form cues, and training fundamentals.",
		icon: "ph-barbell",
		imageUrl:
			"https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80",
	},
	{
		title: "Sport Nutrition",
		slug: "sport-nutrition",
		description: "Fueling principles, meal timing, hydration, and recovery.",
		icon: "ph-apple-logo",
		imageUrl:
			"https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80",
	},
	{
		title: "Encyclopedia",
		slug: "encyclopedia",
		description: "A-Z fitness and health glossary with concise definitions.",
		icon: "ph-book-open-text",
		imageUrl:
			"https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJvb2t8ZW58MHx8MHx8fDA%3D",
	},
	{
		title: "Food & Calories",
		slug: "food-calories",
		description: "Common foods with calorie and macronutrient information.",
		icon: "ph-bowl-food",
		imageUrl:
			"https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=80",
	},
]

function HandbookPage({ embedded = false }) {
	const [query, setQuery] = useState("")
	const [activeIndex, setActiveIndex] = useState(getInitialFeaturedIndex)
	const [direction, setDirection] = useState(0)
	const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)
	const pauseTimeoutRef = useRef(null)
	const featuredArticles = handbookArticles

	const filteredSections = useMemo(() => {
		const normalized = query.trim().toLowerCase()
		if (!normalized) {
			return handbookSections
		}

		return handbookSections.filter(
			(section) =>
				section.title.toLowerCase().includes(normalized) ||
				section.description.toLowerCase().includes(normalized),
		)
	}, [query])

	const hasNoResults = query.trim().length > 0 && filteredSections.length === 0

	const activeArticle = featuredArticles[activeIndex]

	useEffect(() => {
		if (activeIndex >= featuredArticles.length) {
			setActiveIndex(0)
		}
	}, [activeIndex, featuredArticles.length])

	useEffect(() => {
		if (featuredArticles.length === 0) {
			return
		}

		window.sessionStorage.setItem(
			FEATURED_INDEX_STORAGE_KEY,
			String(activeIndex),
		)
	}, [activeIndex, featuredArticles.length])

	useEffect(() => {
		if (pauseTimeoutRef.current) {
			return () => window.clearTimeout(pauseTimeoutRef.current)
		}
	}, [])

	useEffect(() => {
		if (isAutoplayPaused || featuredArticles.length <= 1) {
			return undefined
		}

		const intervalId = window.setInterval(() => {
			setDirection(1)
			setActiveIndex(
				(currentIndex) => (currentIndex + 1) % featuredArticles.length,
			)
		}, 6000)

		return () => window.clearInterval(intervalId)
	}, [featuredArticles.length, isAutoplayPaused])

	const pauseAutoplay = (duration = 12000) => {
		setIsAutoplayPaused(true)
		if (pauseTimeoutRef.current) {
			window.clearTimeout(pauseTimeoutRef.current)
		}
		if (duration > 0) {
			pauseTimeoutRef.current = window.setTimeout(() => {
				setIsAutoplayPaused(false)
				pauseTimeoutRef.current = null
			}, duration)
		}
	}

	const resumeAutoplay = () => {
		if (pauseTimeoutRef.current) {
			window.clearTimeout(pauseTimeoutRef.current)
			pauseTimeoutRef.current = null
		}
		setIsAutoplayPaused(false)
	}

	const goToSlide = (nextIndex) => {
		pauseAutoplay()
		setDirection(nextIndex > activeIndex ? 1 : -1)
		setActiveIndex(nextIndex)
	}

	const paginate = (nextDirection) => {
		pauseAutoplay()
		setDirection(nextDirection)
		setActiveIndex(
			(currentIndex) =>
				(currentIndex + nextDirection + featuredArticles.length) %
				featuredArticles.length,
		)
	}

	const handleDragEnd = (_, info) => {
		const swipeOffset = info.offset.x
		const swipeVelocity = info.velocity.x
		const swipePower = Math.abs(swipeOffset) * swipeVelocity

		if (swipeOffset <= -90 || swipePower <= -12000) {
			paginate(1)
			return
		}

		if (swipeOffset >= 90 || swipePower >= 12000) {
			paginate(-1)
			return
		}

		pauseAutoplay(8000)
	}

	const handleCarouselKeyDown = (event) => {
		if (event.key === "ArrowLeft") {
			event.preventDefault()
			paginate(-1)
		}

		if (event.key === "ArrowRight") {
			event.preventDefault()
			paginate(1)
		}
	}

	const slideVariants = {
		enter: (nextDirection) => ({
			x: nextDirection > 0 ? 64 : -64,
			opacity: 0,
			scale: 0.985,
		}),
		center: {
			x: 0,
			opacity: 1,
			scale: 1,
		},
		exit: (nextDirection) => ({
			x: nextDirection > 0 ? -64 : 64,
			opacity: 0,
			scale: 0.985,
		}),
	}

	if (!activeArticle) {
		return null
	}

	return (
		<div
			className={`${
				embedded ? "" : "min-h-screen"
			} bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8`}>
			<div className="w-full">
				<header className="mb-5 flex items-center justify-between">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
						Handbook
					</h1>
					{!embedded && (
						<Link
							to="/dashboard"
							className="btn btn-primary rounded-lg px-4 py-2">
							Dashboard
						</Link>
					)}
				</header>

				<div className="relative mb-6">
					<Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted))]" />
					<input
						type="search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search handbook topics"
						aria-label="Search handbook"
						className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-3 pl-10 pr-4 text-sm text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))] shadow-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30"
					/>
				</div>

				<motion.section
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					whileHover={{ y: -3 }}
					onMouseEnter={() => setIsAutoplayPaused(true)}
					onMouseLeave={resumeAutoplay}
					onFocusCapture={() => pauseAutoplay(0)}
					onBlurCapture={resumeAutoplay}
					onTouchStart={() => pauseAutoplay()}
					onKeyDown={handleCarouselKeyDown}
					aria-label="Featured handbook articles"
					aria-roledescription="carousel"
					tabIndex={0}
					className="relative mb-7 overflow-hidden rounded-3xl border border-[hsl(var(--border))] shadow-sm">
					<div className="relative h-64 sm:h-72">
						<AnimatePresence initial={false} custom={direction} mode="wait">
							<motion.article
								key={activeArticle.slug}
								custom={direction}
								variants={slideVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									x: { type: "spring", stiffness: 280, damping: 28 },
									opacity: { duration: 0.22 },
									scale: { duration: 0.22 },
								}}
								drag="x"
								dragConstraints={{ left: 0, right: 0 }}
								dragElastic={0.12}
								onDragStart={() => pauseAutoplay()}
								onDragEnd={handleDragEnd}
								style={{ touchAction: "pan-y" }}
								className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
								<img
									src={activeArticle.coverImage}
									alt={activeArticle.title}
									onError={(event) => {
										event.currentTarget.src =
											"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1800&q=80"
									}}
									loading="eager"
									className="h-full w-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
								<div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 pr-20 sm:pr-24 z-20">
									<p className="text-xs uppercase tracking-wider text-white/80">
										Featured Guide
									</p>
									<h2 className="mt-1 text-xl sm:text-2xl font-bold text-white">
										{activeArticle.title}
									</h2>
									<p className="mt-2 max-w-2xl text-sm text-white/85">
										{activeArticle.excerpt}
									</p>
									<Link
										to={`/handbook/${activeArticle.slug}`}
										onClick={() => pauseAutoplay()}
										className="mt-4 inline-flex rounded-xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-[hsl(var(--primary-fg))] transition hover:bg-[hsl(var(--primary-hover))] focus:outline-none focus:ring-2 focus:ring-white/45">
										Read article
									</Link>
								</div>
							</motion.article>
						</AnimatePresence>

						<button
							type="button"
							onClick={() => paginate(-1)}
							className="absolute left-3 top-1/2 z-40 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/45"
							aria-label="Previous article">
							<ChevronLeft className="h-5 w-5" />
						</button>
						<button
							type="button"
							onClick={() => paginate(1)}
							className="absolute right-3 top-1/2 z-40 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/45"
							aria-label="Next article">
							<ChevronRight className="h-5 w-5" />
						</button>

						<div className="absolute inset-x-0 bottom-4 z-30 flex justify-center px-4 pointer-events-none">
							<div className="flex items-center gap-2 rounded-full bg-black/25 px-3 py-2 backdrop-blur-sm pointer-events-auto">
								{featuredArticles.map((article, index) => (
									<button
										key={article.slug}
										type="button"
										onClick={() => goToSlide(index)}
										className={`h-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white/45 ${
											index === activeIndex
												? "w-6 bg-[hsl(var(--primary))]"
												: "w-2.5 bg-white/45 hover:bg-white/65"
										}`}
										aria-label={`Go to article ${index + 1}: ${article.title}`}
										aria-current={index === activeIndex ? "true" : "false"}
									/>
								))}
							</div>
						</div>
					</div>
				</motion.section>

				{hasNoResults ? (
					<div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 text-center sm:p-8">
						<h2 className="text-xl font-semibold tracking-tight">
							No results found
						</h2>
						<p className="mt-2 text-sm text-[hsl(var(--muted))]">
							No handbook topic matches "{query.trim()}".
						</p>
					</div>
				) : (
					<div className="grid gap-4 sm:gap-5 md:grid-cols-2">
						{filteredSections.map((section) => (
							<motion.div
								key={section.slug}
								whileHover={{ y: -4 }}
								whileTap={{ scale: 0.985 }}>
								<Link
									to={`/handbook/${section.slug}`}
									className="group relative block overflow-hidden rounded-3xl border border-[hsl(var(--border))] shadow-sm transition-all hover:border-[hsl(var(--primary))]/45">
									<img
										src={section.imageUrl}
										alt={section.title}
										loading="lazy"
										className="h-52 w-full object-cover sm:h-56"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5" />
									<div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
										<div className="mb-3 flex items-center justify-between">
											<i
												className={`ph ${section.icon} text-2xl text-white`}></i>
											<i className="ph ph-arrow-up-right text-lg text-white/85 transition-colors group-hover:text-white"></i>
										</div>
										<h2 className="text-xl font-semibold tracking-tight text-white">
											{section.title}
										</h2>
										<p className="mt-1 text-sm text-white/85 leading-relaxed">
											{section.description}
										</p>
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default HandbookPage
