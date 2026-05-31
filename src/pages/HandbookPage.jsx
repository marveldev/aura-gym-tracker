import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

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
			"https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1400&q=80",
	},
	{
		title: "Food & Calories",
		slug: "food",
		description: "Common foods with calorie and macronutrient information.",
		icon: "ph-bowl-food",
		imageUrl:
			"https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=80",
	},
]

const trendingArticles = [
	{
		title: "Build Better Running Endurance",
		description:
			"Structured intervals and recovery pacing for consistent gains.",
		to: "/handbook/encyclopedia/interval-training",
		imageUrl:
			"https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1400&q=80",
	},
	{
		title: "Pre-Workout Fueling Essentials",
		description: "Simple timing rules for carbs, hydration, and performance.",
		to: "/handbook/sport-nutrition",
		imageUrl:
			"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
	},
	{
		title: "Master Core Stability Basics",
		description:
			"Improve form and strength with controlled anti-rotation work.",
		to: "/handbook/exercises/core",
		imageUrl:
			"https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=1400&q=80",
	},
]

function HandbookPage({ embedded = false }) {
	const [query, setQuery] = useState("")

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

				<motion.article
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					whileHover={{ y: -3 }}
					className="relative mb-7 overflow-hidden rounded-3xl border border-[hsl(var(--border))] shadow-sm">
					<img
						src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1800&q=80"
						alt="Featured training guide"
						loading="lazy"
						className="h-64 w-full object-cover sm:h-72"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
					<div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
						<p className="text-xs uppercase tracking-wider text-white/80">
							Featured Guide
						</p>
						<h2 className="mt-1 text-xl sm:text-2xl font-bold text-white">
							The 7-Day Strength Form Reset
						</h2>
						<p className="mt-2 max-w-2xl text-sm text-white/85">
							Refine technique, prevent injury, and train smarter with clear
							cues for your next week of sessions.
						</p>
						<Link
							to="/handbook/article/7-day-strength-form-reset"
							className="mt-4 inline-flex rounded-xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-[hsl(var(--primary-fg))] transition hover:bg-[hsl(var(--primary-hover))]">
							Read article
						</Link>
					</div>
				</motion.article>

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
										<i className={`ph ${section.icon} text-2xl text-white`}></i>
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

				<section className="mt-8">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
							Trending
						</h2>
					</div>
					<div className="grid gap-4 sm:gap-5 md:grid-cols-3">
						{trendingArticles.map((article) => (
							<motion.div
								key={article.title}
								whileHover={{ y: -4 }}
								whileTap={{ scale: 0.985 }}>
								<Link
									to={article.to}
									className="group relative block overflow-hidden rounded-2xl border border-[hsl(var(--border))] shadow-sm transition-all hover:border-[hsl(var(--primary))]/45">
									<img
										src={article.imageUrl}
										alt={article.title}
										loading="lazy"
										className="h-44 w-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
									<div className="absolute inset-x-0 bottom-0 p-4">
										<h3 className="text-base font-semibold text-white">
											{article.title}
										</h3>
										<p className="mt-1 text-xs text-white/80">
											{article.description}
										</p>
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				</section>
			</div>
		</div>
	)
}

export default HandbookPage
