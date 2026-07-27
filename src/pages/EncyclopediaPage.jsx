import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Search, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import AppPageFrame from "../components/AppPageFrame.jsx"
import EncyclopediaCard from "../components/encyclopedia/EncyclopediaCard"
import FeaturedTopicsCarousel from "../components/encyclopedia/FeaturedTopicsCarousel"
import EncyclopediaCategoryFilter from "../components/encyclopedia/EncyclopediaCategoryFilter"
import topicsData from "../data/encyclopediaTopics.json"

const topics = topicsData
const CATEGORY_CHIPS = [
	"All",
	...new Set(topics.map((topic) => topic.category)),
]

function EncyclopediaPage() {
	const location = useLocation()
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("All")

	const normalizedQuery = searchQuery.trim().toLowerCase()

	const filteredTopics = useMemo(() => {
		return topics.filter((topic) => {
			const matchesCategory =
				selectedCategory === "All" || topic.category === selectedCategory

			if (!matchesCategory) {
				return false
			}

			if (!normalizedQuery) {
				return true
			}

			const searchableText = [
				topic.title,
				topic.category,
				...(topic.tags || []),
			]
				.join(" ")
				.toLowerCase()

			return searchableText.includes(normalizedQuery)
		})
	}, [normalizedQuery, selectedCategory])

	const featuredTopics = useMemo(
		() => filteredTopics.filter((topic) => topic.featured),
		[filteredTopics],
	)

	const nonFeaturedTopics = useMemo(
		() => filteredTopics.filter((topic) => !topic.featured),
		[filteredTopics],
	)

	const backTo = location.pathname.startsWith("/handbook")
		? "/handbook"
		: "/dashboard"
	const backLabel =
		backTo === "/handbook" ? "Back to Handbook" : "Back to Dashboard"
	const isSearching = normalizedQuery.length > 0

	const isEmptyState = nonFeaturedTopics.length === 0

	return (
		<AppPageFrame>
			<div className="bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
				<section className="relative -mx-6 md:mx-0 overflow-hidden bg-gradient-to-br from-[hsl(var(--primary))]/20 via-[hsl(var(--primary))]/8 to-[hsl(var(--primary))]/5 px-0 py-14 sm:px-6 sm:py-16 lg:px-8">
					<div className="absolute right-0 top-0 -z-10 h-80 w-80 rounded-full bg-[hsl(var(--primary))]/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-[hsl(var(--primary))]/5 blur-3xl" />

					<div className="mx-auto w-full px-10 sm:max-w-5xl sm:px-12 md:px-0 space-y-7">
						<div className="flex items-center">
							<Link
								to={backTo}
								className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))]/70 bg-[hsl(var(--surface))]/75 px-3.5 py-1.5 text-sm font-medium text-[hsl(var(--muted))] backdrop-blur-sm transition hover:border-[hsl(var(--primary))]/30 hover:bg-[hsl(var(--surface))] hover:text-[hsl(var(--fg))]">
								<ArrowLeft className="h-4 w-4" />
								{backLabel}
							</Link>
						</div>

						<div className="space-y-3">
							<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
								Fitness Encyclopedia
							</h1>
							<div className="h-1 w-16 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/40" />
							<p className="max-w-3xl text-base leading-relaxed text-[hsl(var(--muted))] sm:text-lg">
								Learn about training, nutrition, recovery, supplements, and
								common fitness questions.
							</p>
						</div>

						<div className="rounded-2xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--bg))]/80 p-1 backdrop-blur-md shadow-xl shadow-[hsl(var(--primary))]/5">
							<div className="relative">
								<Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[hsl(var(--primary))]" />
								<input
									type="search"
									value={searchQuery}
									onChange={(event) => setSearchQuery(event.target.value)}
									placeholder="Search topics, categories, or tags..."
									className="w-full rounded-xl bg-transparent py-4 pl-12 pr-10 text-base text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))] focus:outline-none"
								/>
								{isSearching && (
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
				</section>

				<div className="px-4 py-10 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl space-y-8">
						<section className="space-y-3">
							<div className="space-y-3">
								<h2 className="text-xl font-bold">Browse By Category</h2>
								<EncyclopediaCategoryFilter
									categories={CATEGORY_CHIPS}
									selectedCategory={selectedCategory}
									onSelectCategory={setSelectedCategory}
								/>
							</div>
						</section>

						<section className="space-y-4">
							<h2 className="text-xl font-bold">Featured Topics</h2>
							<FeaturedTopicsCarousel topics={featuredTopics} />
						</section>

						<section className="space-y-4">
							<div className="flex items-center justify-between gap-3">
								<h2 className="text-xl font-bold">All Topics</h2>
								<p className="text-sm text-[hsl(var(--muted))]">
									{nonFeaturedTopics.length} topics
								</p>
							</div>

							{isEmptyState ? (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-8 text-center">
									<p className="text-lg font-semibold">No topics found.</p>
									<div className="mt-4 flex flex-wrap items-center justify-center gap-2">
										<button
											type="button"
											onClick={() => {
												setSearchQuery("")
												setSelectedCategory("All")
											}}
											className="rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-sm transition hover:border-[hsl(var(--primary))]/45">
											Clear search
										</button>
										{CATEGORY_CHIPS.slice(1, 4).map((suggestedCategory) => (
											<button
												key={suggestedCategory}
												type="button"
												onClick={() => {
													setSearchQuery("")
													setSelectedCategory(suggestedCategory)
												}}
												className="rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-sm text-[hsl(var(--muted))] transition hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--fg))]">
												{suggestedCategory}
											</button>
										))}
									</div>
								</motion.div>
							) : (
								<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
									{nonFeaturedTopics.map((topic) => (
										<EncyclopediaCard
											key={topic.id}
											topic={topic}
											to={`/encyclopedia/${topic.id}`}
										/>
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

export default EncyclopediaPage
