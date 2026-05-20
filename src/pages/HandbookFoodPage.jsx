import { Link } from "react-router-dom"
import AppPageFrame from "../components/AppPageFrame.jsx"

const foodCategories = [
	{
		name: "Grains & Snacks",
		slug: "grains-snacks",
		description: "Breads, cereals, rice, pasta, and convenient snack options.",
		icon: "ph-bread",
	},
	{
		name: "Dairy & Eggs",
		slug: "dairy-eggs",
		description:
			"Milk, yogurt, cheese, and egg products for protein and calcium.",
		icon: "ph-egg",
	},
]

function HandbookFoodPage() {
	return (
		<AppPageFrame>
			<div className="bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
				<div className="w-full">
					<div className="flex items-center justify-between mb-8">
						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
							Food & Calories
						</h1>
						<Link
							to="/handbook"
							className="btn btn-secondary rounded-lg px-4 py-2">
							Back
						</Link>
					</div>

					<div className="card p-6 sm:p-8">
						<div className="space-y-6">
							<p className="text-[hsl(var(--muted))] leading-relaxed">
								Browse common foods with calorie and macronutrient information
								to support your nutrition planning.
							</p>

							<div className="grid gap-3 sm:gap-4">
								{foodCategories.map((category) => (
									<Link
										key={category.slug}
										to={`/handbook/food/${category.slug}`}
										className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4 flex items-center justify-between transition-colors hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--primary))]">
										<div className="flex items-center gap-4">
											<i
												className={`ph ${category.icon} text-2xl text-[hsl(var(--primary))]`}></i>
											<div>
												<h2 className="font-semibold text-lg">
													{category.name}
												</h2>
												<p className="text-[hsl(var(--muted))] text-sm mt-1">
													{category.description}
												</p>
											</div>
										</div>
										<i
											className="ph ph-caret-right text-lg flex-shrink-0"
											aria-hidden="true"></i>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</AppPageFrame>
	)
}

export default HandbookFoodPage
