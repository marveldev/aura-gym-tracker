import { memo, useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

function FeaturedTopicsCarouselComponent({ topics }) {
	const containerRef = useRef(null)
	const [activeIndex, setActiveIndex] = useState(0)

	const updateActiveIndex = useCallback(() => {
		const container = containerRef.current
		if (!container || topics.length === 0) return

		const cardWidth = container.clientWidth * 0.84
		const nextIndex = Math.round(container.scrollLeft / Math.max(cardWidth, 1))
		setActiveIndex(Math.min(Math.max(nextIndex, 0), topics.length - 1))
	}, [topics.length])

	useEffect(() => {
		updateActiveIndex()
	}, [updateActiveIndex])

	const scrollToIndex = (index) => {
		const container = containerRef.current
		if (!container) return
		const cardWidth = container.clientWidth * 0.84
		container.scrollTo({ left: index * cardWidth, behavior: "smooth" })
	}

	if (topics.length === 0) {
		return null
	}

	return (
		<div className="space-y-4">
			<div
				ref={containerRef}
				onScroll={updateActiveIndex}
				className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
				{topics.map((topic) => (
					<motion.div
						key={topic.id}
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						className="min-w-[84%] snap-start sm:min-w-[55%] lg:min-w-[40%]">
						<Link
							to={`/encyclopedia/${topic.id}`}
							className="group block overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-sm transition hover:border-[hsl(var(--primary))]/45 hover:shadow-xl">
							<div className="relative h-64">
								<img
									src={topic.coverImage}
									alt={topic.title}
									loading="lazy"
									className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
								<div className="absolute inset-x-0 bottom-0 p-4 text-white">
									<div className="mb-2 flex items-center justify-between gap-2 text-xs">
										<span className="rounded-full bg-white/20 px-2.5 py-1 font-semibold backdrop-blur-sm">
											{topic.category}
										</span>
										<span>{topic.readTime}</span>
									</div>
									<h3 className="text-xl font-bold leading-tight">
										{topic.title}
									</h3>
								</div>
							</div>
						</Link>
					</motion.div>
				))}
			</div>

			<div className="flex items-center justify-center gap-2">
				{topics.map((topic, index) => (
					<button
						key={`${topic.id}-dot`}
						type="button"
						onClick={() => scrollToIndex(index)}
						className={`h-2.5 rounded-full transition-all ${
							activeIndex === index
								? "w-6 bg-[hsl(var(--primary))]"
								: "w-2.5 bg-[hsl(var(--border))]"
						}`}
						aria-label={`Go to featured topic ${index + 1}`}
					/>
				))}
			</div>
		</div>
	)
}

const FeaturedTopicsCarousel = memo(FeaturedTopicsCarouselComponent)

export default FeaturedTopicsCarousel
