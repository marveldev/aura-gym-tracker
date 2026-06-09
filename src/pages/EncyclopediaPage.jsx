import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import AppPageFrame from "../components/AppPageFrame.jsx"
import EncyclopediaCard from "../components/encyclopedia/EncyclopediaCard"
import EncyclopediaSearch from "../components/encyclopedia/EncyclopediaSearch"
import FeaturedTopicsCarousel from "../components/encyclopedia/FeaturedTopicsCarousel"
import EncyclopediaCategoryFilter from "../components/encyclopedia/EncyclopediaCategoryFilter"
import topicsData from "../data/encyclopediaTopics.json"

const topics = topicsData
const CATEGORY_CHIPS = [
	"All",
	...new Set(topics.map((topic) => topic.category)),
]

function EncyclopediaPage() {
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

	const isEmptyState = filteredTopics.length === 0

	return (
		<AppPageFrame>
			<div className="bg-[hsl(var(--bg))] px-4 py-8 text-[hsl(var(--fg))] sm:px-6 lg:px-8">
				<div className="mx-auto max-w-7xl space-y-8">
					<header className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Fitness Encyclopedia
						</h1>
						<p className="max-w-3xl text-sm text-[hsl(var(--muted))] sm:text-base">
							Learn about training, nutrition, recovery, supplements, and common
							fitness questions.
						</p>
					</header>

					<section className="space-y-3">
						<EncyclopediaSearch
							value={searchQuery}
							onChange={setSearchQuery}
							onClear={() => setSearchQuery("")}
						/>
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
								{filteredTopics.length} topics
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
								{filteredTopics.map((topic) => (
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
		</AppPageFrame>
	)
}

export default EncyclopediaPage
