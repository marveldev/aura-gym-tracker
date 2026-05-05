import { Link, useParams } from "react-router-dom"

const nutritionData = {
	protein: {
		name: "Protein",
		description:
			"Supports muscle repair, recovery, and retention of lean mass.",
		details: {
			overview:
				"Protein is a macronutrient composed of amino acids that are essential for building and repairing muscle tissue. It plays a critical role in recovery after training and helps maintain lean mass during caloric deficits.",
			functions: [
				"Muscle repair and synthesis after training",
				"Hormone and enzyme production",
				"Transport of nutrients and oxygen",
				"Support for immune function",
				"Maintenance of lean body mass",
			],
			sources: [
				"Animal-based: Chicken, beef, fish, eggs, milk, yogurt",
				"Plant-based: Legumes, tofu, tempeh, nuts, seeds",
				"Supplements: Protein powder, protein shakes",
			],
			recommendations:
				"For muscle building, typically 0.7-1g per pound of body weight daily is recommended during a caloric surplus. During a deficit, aim for the higher end to preserve muscle.",
			timing:
				"While total daily protein intake matters most, consuming 20-40g of protein within a 2-3 hour window after training can support recovery.",
		},
	},
	carbohydrates: {
		name: "Carbohydrates",
		description:
			"Primary training fuel source, especially for moderate to high intensity work.",
		details: {
			overview:
				"Carbohydrates are the primary fuel source for high-intensity training. They are broken down into glucose, which provides energy for your muscles and brain. Carbs also support recovery and muscle glycogen replenishment.",
			functions: [
				"Primary energy source for moderate to high intensity exercise",
				"Muscle glycogen replenishment for recovery",
				"Brain and central nervous system fuel",
				"Support for metabolic rate and hormonal function",
				"Enhanced strength and power output",
			],
			sources: [
				"Complex: Oats, rice, beans, sweet potatoes, whole grains",
				"Fruits: Bananas, berries, apples, oranges",
				"Vegetables: Broccoli, spinach, peppers",
				"Processed: Bread, pasta (best consumed around training)",
			],
			recommendations:
				"For athletes, 3-7g per kilogram of body weight daily is typical, depending on training intensity. Higher intake supports intense training; lower intake suits rest days.",
			timing:
				"Consuming carbs 1-3 hours before training provides energy. Post-workout carbs paired with protein enhance recovery and glycogen resynthesis.",
		},
	},
	fats: {
		name: "Fats",
		description:
			"Essential for hormone function, nutrient absorption, and long-duration energy.",
		details: {
			overview:
				"Dietary fats are essential for hormone production, nutrient absorption, and sustained energy. They support cardiovascular health, brain function, and nutrient uptake for fat-soluble vitamins (A, D, E, K).",
			functions: [
				"Hormone production (testosterone, estrogen, cortisol)",
				"Fat-soluble vitamin absorption (A, D, E, K)",
				"Cell membrane structure and function",
				"Sustained energy, especially during low-intensity activity",
				"Brain health and cognitive function",
				"Anti-inflammatory effects",
			],
			sources: [
				"Unsaturated: Olive oil, avocados, nuts, seeds, fatty fish",
				"Saturated: Coconut oil, butter, fatty meats (consume in moderation)",
				"Omega-3: Salmon, mackerel, walnuts, flax seeds",
				"Omega-6: Sunflower oil, nuts, seeds",
			],
			recommendations:
				"Typically 0.5-1.5g per pound of body weight daily. Ensure at least 20-35% of total calories come from fat for hormonal health.",
			timing:
				"Fat slows digestion, so timing is less critical than protein and carbs. Consuming some fat with carbs can slow glucose absorption, providing more sustained energy.",
		},
	},
}

function SectionLayout({
	title,
	children,
	backTo = "/handbook/sport-nutrition",
}) {
	return (
		<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
						{title}
					</h1>
					<Link to={backTo} className="btn btn-secondary rounded-lg px-4 py-2">
						Back
					</Link>
				</div>

				<div className="card p-6 sm:p-8">{children}</div>
			</div>
		</div>
	)
}

function HandbookNutritionPage() {
	const { macro } = useParams()
	const macroKey = macro?.toLowerCase()
	const current = nutritionData[macroKey]

	if (!current) {
		return (
			<SectionLayout title="Macronutrient not found">
				<p className="text-[hsl(var(--muted))] mb-6">
					This macronutrient page does not exist.
				</p>
				<Link
					to="/handbook/sport-nutrition"
					className="btn btn-primary rounded-lg px-4 py-2">
					Back to Sport Nutrition
				</Link>
			</SectionLayout>
		)
	}

	return (
		<SectionLayout title={current.name}>
			<div className="space-y-8">
				<p className="text-lg text-[hsl(var(--muted))] leading-relaxed italic">
					{current.description}
				</p>

				<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-6">
					<h2 className="text-xl font-semibold mb-3">Overview</h2>
					<p className="text-[hsl(var(--muted))] leading-relaxed">
						{current.details.overview}
					</p>
				</div>

				<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-6">
					<h2 className="text-xl font-semibold mb-4">Key Functions</h2>
					<ul className="space-y-2">
						{current.details.functions.map((func) => (
							<li key={func} className="flex items-start gap-3">
								<span className="mt-2 h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))] flex-shrink-0"></span>
								<span className="text-[hsl(var(--muted))]">{func}</span>
							</li>
						))}
					</ul>
				</div>

				<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-6">
					<h2 className="text-xl font-semibold mb-4">Primary Sources</h2>
					<ul className="space-y-2">
						{current.details.sources.map((source) => (
							<li key={source} className="flex items-start gap-3">
								<span className="mt-2 h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))] flex-shrink-0"></span>
								<span className="text-[hsl(var(--muted))]">{source}</span>
							</li>
						))}
					</ul>
				</div>

				<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-6">
					<h2 className="text-xl font-semibold mb-3">Daily Recommendations</h2>
					<p className="text-[hsl(var(--muted))] leading-relaxed">
						{current.details.recommendations}
					</p>
				</div>

				<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-6">
					<h2 className="text-xl font-semibold mb-3">Timing Considerations</h2>
					<p className="text-[hsl(var(--muted))] leading-relaxed">
						{current.details.timing}
					</p>
				</div>
			</div>
		</SectionLayout>
	)
}

export default HandbookNutritionPage
