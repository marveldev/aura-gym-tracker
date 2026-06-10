import { useCallback, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowLeft, ChevronRight, Search, X } from "lucide-react"
import AppPageFrame from "../components/AppPageFrame.jsx"
import { handbookExerciseData } from "../data/handbookExercises.js"

const exerciseCategories = [
	{
		id: "chest",
		name: "Chest",
		image:
			"https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80",
	},
	{
		id: "back",
		name: "Back",
		image:
			"https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80",
	},
	{
		id: "legs",
		name: "Legs",
		image:
			"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1400&q=80",
	},
	{
		id: "gluteus",
		name: "Gluteus",
		image:
			"https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80",
	},
	{
		id: "shoulders",
		name: "Shoulders",
		image:
			"https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=1400&q=80",
	},
	{
		id: "arms",
		name: "Arms",
		image:
			"https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1400&q=80",
	},
	{
		id: "core",
		name: "Core",
		image:
			"https://images.unsplash.com/photo-1598971639058-a3289398f4f0?auto=format&fit=crop&w=1400&q=80",
	},
	{
		id: "cardio",
		name: "Cardio",
		image:
			"https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1400&q=80",
	},
]

function HandbookExercisesPage() {
	const [searchQuery, setSearchQuery] = useState("")

	const categoriesWithCount = useMemo(
		() =>
			exerciseCategories.map((category) => ({
				...category,
				exerciseCount:
					handbookExerciseData[category.id]?.exercises?.length ?? 0,
			})),
		[],
	)

	const filteredCategories = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase()

		if (!normalizedQuery) {
			return categoriesWithCount
		}

		return categoriesWithCount.filter((category) =>
			category.name.toLowerCase().includes(normalizedQuery),
		)
	}, [categoriesWithCount, searchQuery])

	const handleSearchChange = useCallback((event) => {
		setSearchQuery(event.target.value)
	}, [])

	const isSearching = searchQuery.trim().length > 0

	return (
		<AppPageFrame>
			<div className="bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
				<section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--primary))]/20 via-[hsl(var(--primary))]/8 to-[hsl(var(--primary))]/5 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
					<div className="absolute right-0 top-0 -z-10 h-80 w-80 rounded-full bg-[hsl(var(--primary))]/5 blur-3xl" />
					<div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-[hsl(var(--primary))]/5 blur-3xl" />

					<div className="mx-auto max-w-5xl space-y-7">
						<div className="flex items-center">
							<Link
								to="/handbook"
								className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))]/70 bg-[hsl(var(--surface))]/75 px-3.5 py-1.5 text-sm font-medium text-[hsl(var(--muted))] backdrop-blur-sm transition hover:border-[hsl(var(--primary))]/30 hover:bg-[hsl(var(--surface))] hover:text-[hsl(var(--fg))]">
								<ArrowLeft className="h-4 w-4" />
								Back to Handbook
							</Link>
						</div>

						<div className="space-y-3">
							<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
								Exercises
							</h1>
							<div className="h-1 w-16 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/40" />
							<p className="max-w-3xl text-base leading-relaxed text-[hsl(var(--muted))] sm:text-lg">
								Browse muscle groups and open structured exercise lists with
								movement descriptions and target muscles.
							</p>
						</div>

						<div className="rounded-2xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--bg))]/80 p-1 backdrop-blur-md shadow-xl shadow-[hsl(var(--primary))]/5">
							<div className="relative">
								<Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[hsl(var(--primary))]" />
								<input
									type="search"
									value={searchQuery}
									onChange={handleSearchChange}
									placeholder="Search muscle groups"
									aria-label="Search muscle groups"
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
					<div className="mx-auto max-w-5xl space-y-6">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold">Muscle Groups</h2>
							<p className="text-[hsl(var(--muted))]">
								{filteredCategories.length}{" "}
								{filteredCategories.length === 1 ? "group" : "groups"} available
							</p>
						</div>

						<div className="space-y-3">
							{filteredCategories.map((category) => (
								<motion.div
									key={category.id}
									whileHover={{ y: -4 }}
									transition={{ duration: 0.2 }}>
									<Link
										to={`/handbook/exercises/${category.id}`}
										className="group relative block h-[150px] overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-sm transition hover:border-[hsl(var(--primary))]/45 hover:shadow-xl">
										<div className="absolute inset-y-0 left-0 z-10 w-[40%] bg-[hsl(var(--surface))]" />
										<img
											src={category.image}
											alt={category.name}
											loading="lazy"
											className="absolute right-0 top-1/2 h-[120%] w-[62%] -translate-y-1/2 object-cover object-center transition duration-300 group-hover:scale-[1.03]"
										/>
										<div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--surface))] via-[hsl(var(--surface))]/65 to-transparent" />

										<div className="relative z-20 flex h-full items-center justify-between px-6">
											<div>
												<h3 className="text-[30px] leading-none font-bold text-[hsl(var(--fg))] sm:text-[32px]">
													{category.name}
												</h3>
												<p className="mt-2 text-sm text-[hsl(var(--muted))]">
													{category.exerciseCount} exercises
												</p>
											</div>

											<div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[hsl(var(--surface))]/95 text-[hsl(var(--muted))] shadow-sm transition-colors group-hover:text-[hsl(var(--primary))]">
												<ChevronRight className="h-5 w-5" />
											</div>
										</div>
									</Link>
								</motion.div>
							))}
						</div>

						{filteredCategories.length === 0 && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-8 text-center">
								<p className="text-lg font-semibold">No muscle groups found.</p>
								<div className="mt-4 flex items-center justify-center">
									<button
										type="button"
										onClick={() => setSearchQuery("")}
										className="rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-sm transition hover:border-[hsl(var(--primary))]/45">
										Clear search
									</button>
								</div>
							</motion.div>
						)}
					</div>
				</div>
			</div>
		</AppPageFrame>
	)
}

export default HandbookExercisesPage
