import { memo } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

function EncyclopediaCardComponent({ topic, to }) {
	return (
		<motion.article whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
			<Link
				to={to}
				className="group block h-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-sm transition duration-300 hover:shadow-xl hover:border-[hsl(var(--primary))]/45">
				<img
					src={topic.coverImage}
					alt={topic.title}
					loading="lazy"
					className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
				/>
				<div className="space-y-3 p-4">
					<div className="flex items-center justify-between gap-2 text-xs">
						<span className="inline-flex rounded-full border border-[hsl(var(--primary))]/35 bg-[hsl(var(--primary))]/10 px-2.5 py-1 font-semibold text-[hsl(var(--primary))]">
							{topic.category}
						</span>
						<span className="text-[hsl(var(--muted))]">{topic.readTime}</span>
					</div>
					<h3 className="text-base font-bold leading-tight text-[hsl(var(--fg))]">
						{topic.title}
					</h3>
					<p className="line-clamp-3 text-sm text-[hsl(var(--muted))]">
						{topic.summary}
					</p>
				</div>
			</Link>
		</motion.article>
	)
}

const EncyclopediaCard = memo(EncyclopediaCardComponent)

export default EncyclopediaCard
