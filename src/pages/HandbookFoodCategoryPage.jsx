import { Link, useParams } from "react-router-dom"
import { foodData } from "../data/foodData.js"

function HandbookFoodCategoryPage() {
	const { category } = useParams()
	const categoryKey = category?.toLowerCase()
	const categoryInfo = foodData[categoryKey]

	if (!categoryInfo) {
		return (
			<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="flex items-center justify-between mb-8">
						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
							Category not found
						</h1>
						<Link
							to="/handbook/food"
							className="btn btn-secondary rounded-lg px-4 py-2">
							Back
						</Link>
					</div>

					<div className="card p-6 sm:p-8">
						<p className="text-[hsl(var(--muted))] mb-6">
							This food category does not exist.
						</p>
						<Link
							to="/handbook/food"
							className="btn btn-primary rounded-lg px-4 py-2">
							Back to Food & Calories
						</Link>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
						{categoryInfo.name}
					</h1>
					<Link
						to="/handbook/food"
						className="btn btn-secondary rounded-lg px-4 py-2">
						Back
					</Link>
				</div>

				<div className="card p-6 sm:p-8">
					<div className="space-y-3">
						{categoryInfo.foods.map((food) => (
							<div
								key={food.name}
								className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4 hover:bg-[hsl(var(--surface))]/75 transition-colors">
								<div>
									<h2 className="font-semibold text-lg text-[hsl(var(--fg))]">
										{food.name}
									</h2>
								</div>
								<div className="text-right">
									<p className="text-sm text-[hsl(var(--muted))]">per 100g</p>
									<p className="text-xl font-semibold text-[hsl(var(--primary))]">
										{food.calories}
										<span className="text-sm text-[hsl(var(--muted))] ml-1">
											kcal
										</span>
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default HandbookFoodCategoryPage
