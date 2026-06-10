import { useEffect, useMemo } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, Tag } from "lucide-react"
import AppPageFrame from "../components/AppPageFrame.jsx"
import articlesData from "../data/sportsNutritionArticles.json"

function SportsNutritionDetail() {
	const { id } = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		const mainContent = document.querySelector(".main-content")
		if (mainContent) {
			mainContent.scrollTo({ top: 0, left: 0, behavior: "auto" })
		}
		window.scrollTo({ top: 0, left: 0, behavior: "auto" })
	}, [id])

	const article = useMemo(() => articlesData.find((a) => a.id === id), [id])

	const relatedArticles = useMemo(() => {
		if (!article) return []
		return articlesData
			.filter((a) => a.category === article.category && a.id !== article.id)
			.slice(0, 3)
	}, [article])

	if (!article) {
		return (
			<AppPageFrame>
				<div className="flex min-h-96 flex-col items-center justify-center px-4">
					<h1 className="text-2xl font-bold">Article not found</h1>
					<button
					onClick={() => navigate("/handbook/sport-nutrition")}
						className="mt-4 rounded-lg border border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 px-4 py-2 font-semibold text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))]/20">
						Back to Sports Nutrition
					</button>
				</div>
			</AppPageFrame>
		)
	}

	return (
		<AppPageFrame>
			<div className="bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
				{/* Hero Section */}
				<section className="relative h-80 w-full overflow-hidden sm:h-96">
					<img
						src={article.coverImage}
						alt={article.title}
						className="h-full w-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
					<Link
						to="/handbook"
						className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/50">
						<ArrowLeft className="w-4 h-4" />
						Handbook
					</Link>

					<div className="absolute inset-x-0 bottom-0 px-4 py-8 sm:px-6 lg:px-8">
						<div className="mx-auto max-w-3xl">
							<div className="mb-4 flex items-center gap-3 text-white">
								<span className="inline-flex rounded-full bg-[hsl(var(--primary))]/20 px-3 py-1 text-sm font-semibold backdrop-blur-sm">
									{article.category}
								</span>
								<div className="flex items-center gap-1 text-sm">
									<Clock className="h-3.5 w-3.5" />
									<span>{article.readTime} min read</span>
								</div>
							</div>
							<h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
								{article.title}
							</h1>
						</div>
					</div>
				</section>

				{/* Content */}
				<div className="px-4 py-12 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl space-y-10">
						{/* Summary */}
						<section>
							<p className="text-lg leading-relaxed text-[hsl(var(--muted))]">
								{article.summary}
							</p>
						</section>

						{/* Intro */}
						{article.content?.intro && (
							<motion.section
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="space-y-4">
								<p className="leading-relaxed text-[hsl(var(--fg))]">
									{article.content.intro}
								</p>
							</motion.section>
						)}

						{/* Content Sections */}
						{article.content?.sections &&
							article.content.sections.length > 0 && (
								<div className="space-y-8">
									{article.content.sections.map((section, idx) => (
										<motion.section
											key={idx}
											initial={{ opacity: 0, y: 10 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true }}
											className="space-y-3">
											<h2 className="text-xl font-bold">{section.heading}</h2>
											<ul className="space-y-2">
												{section.points?.map((point, pidx) => (
													<li
														key={pidx}
														className="flex gap-3 text-[hsl(var(--fg))]">
														<span className="mt-1 flex-shrink-0 text-[hsl(var(--primary))]">
															•
														</span>
														<span>{point}</span>
													</li>
												))}
											</ul>
										</motion.section>
									))}
								</div>
							)}

						{/* Key Takeaways */}
						{article.content?.keyTakeaways &&
							article.content.keyTakeaways.length > 0 && (
								<motion.section
									initial={{ opacity: 0, y: 10 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									className="rounded-2xl border border-[hsl(var(--primary))]/30 bg-[hsl(var(--primary))]/5 p-6">
									<h3 className="mb-4 text-lg font-bold">Key Takeaways</h3>
									<ul className="space-y-2">
										{article.content.keyTakeaways.map((takeaway, idx) => (
											<li
												key={idx}
												className="flex gap-3 text-[hsl(var(--fg))]">
												<span className="flex-shrink-0 font-bold text-[hsl(var(--primary))]">
													✓
												</span>
												<span>{takeaway}</span>
											</li>
										))}
									</ul>
								</motion.section>
							)}

						{/* Tags */}
						{article.tags && article.tags.length > 0 && (
							<section className="border-t border-[hsl(var(--border))] pt-6">
								<div className="flex flex-wrap gap-2">
									{article.tags.map((tag) => (
										<span
											key={tag}
											className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-3 py-1 text-xs font-medium text-[hsl(var(--muted))]">
											<Tag className="h-3 w-3" />
											{tag}
										</span>
									))}
								</div>
							</section>
						)}
					</div>
				</div>

				{/* Related Articles */}
				{relatedArticles.length > 0 && (
					<section className="border-t border-[hsl(var(--border))] px-4 py-12 sm:px-6 lg:px-8">
						<div className="mx-auto max-w-7xl">
							<h2 className="mb-8 text-2xl font-bold">Related Articles</h2>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{relatedArticles.map((relatedArticle) => (
									<motion.div
										key={relatedArticle.id}
										whileHover={{ y: -6 }}
										transition={{ duration: 0.2 }}>
										<Link
											to={`/handbook/sport-nutrition/${relatedArticle.id}`}
											className="group block h-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-sm transition duration-300 hover:shadow-xl hover:border-[hsl(var(--primary))]/45">
											<img
												src={relatedArticle.coverImage}
												alt={relatedArticle.title}
												loading="lazy"
												className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
											/>
											<div className="space-y-3 p-4">
												<div className="flex items-center justify-between gap-2 text-xs">
													<span className="inline-flex rounded-full border border-[hsl(var(--primary))]/35 bg-[hsl(var(--primary))]/10 px-2.5 py-1 font-semibold text-[hsl(var(--primary))]">
														{relatedArticle.category}
													</span>
													<span className="text-[hsl(var(--muted))]">
														{relatedArticle.readTime} min
													</span>
												</div>
												<h3 className="font-bold leading-tight">
													{relatedArticle.title}
												</h3>
												<p className="line-clamp-2 text-xs text-[hsl(var(--muted))]">
													{relatedArticle.summary}
												</p>
											</div>
										</Link>
									</motion.div>
								))}
							</div>
						</div>
					</section>
				)}
			</div>
		</AppPageFrame>
	)
}

export default SportsNutritionDetail
