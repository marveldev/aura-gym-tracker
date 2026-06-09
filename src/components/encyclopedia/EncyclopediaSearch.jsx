import { memo } from "react"
import { Search, X } from "lucide-react"

function EncyclopediaSearchComponent({ value, onChange, onClear }) {
	return (
		<div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg))]/90 p-3 backdrop-blur-md">
			<div className="relative">
				<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted))]" />
				<input
					type="search"
					value={value}
					onChange={(event) => onChange(event.target.value)}
					placeholder="Search by title, category, or tags"
					className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-3 pl-9 pr-10 text-sm text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30"
				/>
				{value.trim().length > 0 && (
					<button
						type="button"
						onClick={onClear}
						className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-[hsl(var(--border))] p-1.5 text-[hsl(var(--muted))] transition hover:border-[hsl(var(--primary))]/45 hover:text-[hsl(var(--fg))]"
						aria-label="Clear search">
						<X className="h-3.5 w-3.5" />
					</button>
				)}
			</div>
		</div>
	)
}

const EncyclopediaSearch = memo(EncyclopediaSearchComponent)

export default EncyclopediaSearch
