import { Link } from "react-router-dom"

const handbookSections = [
	{
		title: "Exercises",
		slug: "exercises",
		description: "Movement guides, form cues, and training fundamentals.",
		icon: "ph-barbell",
	},
	{
		title: "Sport Nutrition",
		slug: "sport-nutrition",
		description: "Fueling principles, meal timing, hydration, and recovery.",
		icon: "ph-apple-logo",
	},
	{
		title: "Pharmacology",
		slug: "pharmacology",
		description: "Educational references and safety-focused terminology.",
		icon: "ph-pill",
	},
	{
		title: "Encyclopedia",
		slug: "encyclopedia",
		description: "A-Z fitness and health glossary with concise definitions.",
		icon: "ph-book-open-text",
	},
]

function HandbookPage() {
	return (
		<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
			<div className="max-w-5xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
						Handbook
					</h1>
					<Link
						to="/dashboard"
						className="btn btn-primary rounded-lg px-4 py-2">
						Dashboard
					</Link>
				</div>

				<div className="grid gap-4 sm:gap-5 md:grid-cols-2">
					{handbookSections.map((section) => (
						<Link
							key={section.slug}
							to={`/handbook/${section.slug}`}
							className="card group p-6 sm:p-7 transition-all hover:border-[hsl(var(--primary))]/45 hover:bg-[hsl(var(--surface))]/95">
							<div className="flex items-center justify-between mb-4">
								<i
									className={`ph ${section.icon} text-2xl text-[hsl(var(--primary))]`}></i>
								<i className="ph ph-arrow-up-right text-lg text-[hsl(var(--muted))] group-hover:text-[hsl(var(--primary))] transition-colors"></i>
							</div>
							<h2 className="text-xl font-semibold tracking-tight mb-2">
								{section.title}
							</h2>
							<p className="text-sm sm:text-base text-[hsl(var(--muted))] leading-relaxed">
								{section.description}
							</p>
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}

export default HandbookPage
