import { Link, useParams } from "react-router-dom"
import { encyclopediaTopics } from "../data/encyclopediaTopics.js"

const sectionMeta = {
	exercises: {
		title: "Exercises",
		intro: "Select a muscle group to explore focused exercise options.",
		muscleGroups: [
			{ name: "Chest", slug: "chest" },
			{ name: "Back", slug: "back" },
			{ name: "Legs", slug: "legs" },
			{ name: "Shoulders", slug: "shoulders" },
			{ name: "Arms", slug: "arms" },
		],
	},
	"sport-nutrition": {
		title: "Sport Nutrition",
		intro:
			"Macronutrients provide energy and support training adaptation and recovery.",
		macros: [
			{
				name: "Protein",
				description:
					"Supports muscle repair, recovery, and retention of lean mass.",
			},
			{
				name: "Carbohydrates",
				description:
					"Primary training fuel source, especially for moderate to high intensity work.",
			},
			{
				name: "Fats",
				description:
					"Essential for hormone function, nutrient absorption, and long-duration energy.",
			},
		],
		energyBalance: {
			surplus:
				"Caloric surplus means eating more calories than you burn, typically used to support weight gain and muscle growth.",
			deficit:
				"Caloric deficit means eating fewer calories than you burn, typically used to reduce body weight over time.",
		},
	},
	encyclopedia: {
		title: "Encyclopedia",
		intro: "Quick-reference definitions for commonly used fitness concepts.",
		terms: encyclopediaTopics,
	},
}

function SectionLayout({ title, children, backTo = "/handbook" }) {
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

function HandbookSectionPage() {
	const { section } = useParams()
	const sectionKey = section?.toLowerCase()
	const current = sectionMeta[sectionKey]

	if (!current) {
		return (
			<SectionLayout title="Section not found">
				<p className="text-[hsl(var(--muted))] mb-6">
					This handbook section does not exist.
				</p>
				<Link to="/handbook" className="btn btn-primary rounded-lg px-4 py-2">
					Back to Handbook
				</Link>
			</SectionLayout>
		)
	}

	return (
		<SectionLayout title={current.title}>
			<div className="space-y-6">
				<p className="text-[hsl(var(--muted))] leading-relaxed">
					{current.intro}
				</p>

				{current.muscleGroups && (
					<div className="grid gap-3 sm:gap-4">
						{current.muscleGroups.map((muscle) => (
							<Link
								key={muscle.slug}
								to={`/handbook/exercises/${muscle.slug}`}
								className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4 flex items-center justify-between transition-colors hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--primary))]">
								<h2 className="font-semibold text-lg">{muscle.name}</h2>
								<i className="ph ph-caret-right text-lg" aria-hidden="true"></i>
							</Link>
						))}
					</div>
				)}

				{current.macros && (
					<div className="space-y-4">
						<div className="grid gap-3 sm:gap-4">
							{current.macros.map((macro) => (
								<Link
									key={macro.name}
									to={`/handbook/nutrition/${macro.name.toLowerCase()}`}
									className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4 flex items-center justify-between transition-colors hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--primary))]">
									<div>
										<h2 className="font-semibold text-lg">{macro.name}</h2>
										<p className="text-[hsl(var(--muted))] mt-1">
											{macro.description}
										</p>
									</div>
									<i
										className="ph ph-caret-right text-lg flex-shrink-0"
										aria-hidden="true"></i>
								</Link>
							))}
						</div>
						<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4 space-y-3">
							<p className="text-[hsl(var(--muted))]">
								<span className="font-semibold text-[hsl(var(--fg))]">
									Caloric surplus:
								</span>{" "}
								{current.energyBalance.surplus}
							</p>
							<p className="text-[hsl(var(--muted))]">
								<span className="font-semibold text-[hsl(var(--fg))]">
									Caloric deficit:
								</span>{" "}
								{current.energyBalance.deficit}
							</p>
						</div>
					</div>
				)}

				{current.terms && (
					<div className="space-y-3">
						{current.terms.map((item) => (
							<Link
								key={item.slug}
								to={`/handbook/encyclopedia/${item.slug}`}
								className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4 flex items-center justify-between transition-colors hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--primary))]">
								<div>
									<h2 className="font-semibold text-lg">{item.name}</h2>
									<p className="text-[hsl(var(--muted))] mt-1">
										{item.description}
									</p>
								</div>
								<i className="ph ph-caret-right text-lg" aria-hidden="true"></i>
							</Link>
						))}
					</div>
				)}
			</div>
		</SectionLayout>
	)
}

export default HandbookSectionPage
