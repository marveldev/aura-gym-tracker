import { Link } from "react-router-dom"
import { Apple, Calculator, ChevronRight } from "lucide-react"
import AppPageFrame from "../components/AppPageFrame.jsx"
import BaseCard from "../components/dashboard/BaseCard"

const nutritionSections = [
	{
		title: "Sport Nutrition",
		description: "Macro guides, timing, hydration, and recovery nutrition.",
		to: "/handbook/sport-nutrition",
		icon: Apple,
	},
	{
		title: "Food & Calories",
		description: "Browse food categories with calorie and macro breakdowns.",
		to: "/handbook/food",
		icon: Calculator,
	},
]

function NutritionPage() {
	return (
		<AppPageFrame>
			<div className="pb-24">
				<main className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
					<div>
						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
							Nutrition
						</h1>
						<p className="mt-1 text-sm text-[hsl(var(--muted))]">
							Choose a nutrition area to continue.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{nutritionSections.map((section) => {
							const Icon = section.icon
							return (
								<Link key={section.title} to={section.to}>
									<BaseCard className="p-5 transition hover:border-[hsl(var(--primary))]/40 hover:bg-[hsl(var(--bg))]">
										<div className="flex items-start justify-between gap-4">
											<span className="rounded-2xl bg-[hsl(var(--bg))] p-2.5 text-[hsl(var(--primary))]">
												<Icon className="h-5 w-5" />
											</span>
											<ChevronRight className="h-5 w-5 text-[hsl(var(--muted))]" />
										</div>
										<h2 className="mt-4 text-lg font-semibold">
											{section.title}
										</h2>
										<p className="mt-1 text-sm text-[hsl(var(--muted))] leading-relaxed">
											{section.description}
										</p>
									</BaseCard>
								</Link>
							)
						})}
					</div>
				</main>
			</div>
		</AppPageFrame>
	)
}

export default NutritionPage
