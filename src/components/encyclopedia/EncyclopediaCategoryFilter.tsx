import { memo } from "react"

type EncyclopediaCategoryFilterProps = {
	categories: string[]
	selectedCategory: string
	onSelectCategory: (category: string) => void
}

function EncyclopediaCategoryFilterComponent({
	categories,
	selectedCategory,
	onSelectCategory,
}: EncyclopediaCategoryFilterProps) {
	return (
		<div className="flex gap-2 overflow-x-auto pb-1">
			{categories.map((category) => {
				const active = category === selectedCategory
				return (
					<button
						key={category}
						type="button"
						onClick={() => onSelectCategory(category)}
						className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition ${
							active
								? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))]"
								: "border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--muted))] hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--fg))]"
						}`}>
						{category}
					</button>
				)
			})}
		</div>
	)
}

const EncyclopediaCategoryFilter = memo(EncyclopediaCategoryFilterComponent)

export default EncyclopediaCategoryFilter
