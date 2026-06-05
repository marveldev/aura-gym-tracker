import { Bookmark, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { ENCYCLOPEDIA_FALLBACK_IMAGE } from "../../data/encyclopediaArticles.js"

function EncyclopediaArticleCard({
	article,
	isBookmarked,
	onToggleBookmark,
	to,
}) {
	return (
		<Link
			to={to}
			className="group overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-sm transition hover:border-[hsl(var(--primary))]/45 hover:shadow-md">
			<div className="relative h-40 w-full overflow-hidden">
				<img
					src={article.image}
					alt={article.title}
					loading="lazy"
					onError={(event) => {
						console.error("[EncyclopediaImageError][Card]", {
							title: article.title,
							image: article.image,
						})
						event.currentTarget.src = ENCYCLOPEDIA_FALLBACK_IMAGE
					}}
					className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
				/>
				<button
					type="button"
					onClick={(event) => {
						event.preventDefault()
						event.stopPropagation()
						onToggleBookmark(article.id)
					}}
					aria-label={isBookmarked ? "Remove bookmark" : "Save article"}
					className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition ${
						isBookmarked
							? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))]"
							: "border-[hsl(var(--border))] bg-black/35 text-white hover:border-[hsl(var(--primary))]/45"
					}`}>
					<Bookmark
						className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
					/>
				</button>
			</div>
			<div className="space-y-3 p-4">
				<div className="flex items-start justify-between gap-3">
					<h3 className="line-clamp-2 text-base font-semibold group-hover:text-[hsl(var(--primary))] transition">
						{article.title}
					</h3>
					<span className="shrink-0 rounded-full bg-[hsl(var(--primary))]/10 px-2 py-0.5 text-xs font-medium text-[hsl(var(--primary))]">
						{article.category}
					</span>
				</div>
				<p className="line-clamp-3 text-sm text-[hsl(var(--muted))]">
					{article.summary}
				</p>
				<div className="flex items-center justify-between text-xs text-[hsl(var(--muted))]">
					<span className="inline-flex items-center gap-1">
						<Clock className="h-3.5 w-3.5" /> {article.readingTime} min
					</span>
					<span>{article.difficulty}</span>
				</div>
			</div>
		</Link>
	)
}

export default EncyclopediaArticleCard
