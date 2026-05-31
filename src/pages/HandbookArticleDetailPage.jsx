import { useEffect, useRef, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Clock, Zap } from "lucide-react"
import { motion } from "framer-motion"
import handbookArticles from "../data/handbookArticles"
import AppPageFrame from "../components/AppPageFrame.jsx"

function HandbookArticleDetailPage({ slugOverride = null }) {
	const { slug, section } = useParams()
	const articleSlug = slugOverride || slug || section
	const [readProgress, setReadProgress] = useState(0)
	const contentRef = useRef(null)

	const article = handbookArticles.find((a) => a.slug === articleSlug)

	// Calculate reading progress
	useEffect(() => {
		const handleScroll = () => {
			if (!contentRef.current) return

			const windowHeight = window.innerHeight
			const docHeight = contentRef.current.scrollHeight
			const totalScroll = window.scrollY

			// Start progress from when content comes into view
			const startOfContent = contentRef.current.offsetTop
			const contentScroll = Math.max(0, totalScroll - startOfContent)
			const scrollableHeight = docHeight - windowHeight

			const progress =
				scrollableHeight > 0 ? (contentScroll / scrollableHeight) * 100 : 0
			setReadProgress(Math.min(progress, 100))
		}

		window.addEventListener("scroll", handleScroll, { passive: true })
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	if (!article) {
		return (
			<AppPageFrame>
				<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))] flex items-center justify-center px-4">
					<div className="text-center">
						<h1 className="text-2xl font-bold mb-2">Article not found</h1>
						<p className="text-[hsl(var(--muted))] mb-4">
							This article doesn't exist.
						</p>
						<Link
							to="/handbook"
							className="inline-flex items-center gap-2 text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-hover))]">
							<ArrowLeft className="w-4 h-4" />
							Back to Handbook
						</Link>
					</div>
				</div>
			</AppPageFrame>
		)
	}

	// Get related articles (same category, exclude current)
	const relatedArticles = handbookArticles
		.filter(
			(a) =>
				a.category === article.category &&
				a.slug !== article.slug &&
				a.featured,
		)
		.slice(0, 3)

	// Difficulty color mapping
	const getDifficultyColor = (difficulty) => {
		switch (difficulty.toLowerCase()) {
			case "beginner":
				return "bg-green-500/10 text-green-600"
			case "intermediate":
				return "bg-amber-500/10 text-amber-600"
			case "advanced":
				return "bg-red-500/10 text-red-600"
			default:
				return "bg-blue-500/10 text-blue-600"
		}
	}

	return (
		<AppPageFrame>
			<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
				{/* Hero Image Banner */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-[hsl(var(--surface))]">
					{article.coverImage ? (
						<>
							<img
								src={article.coverImage}
								alt={article.title}
								className="w-full h-full object-cover"
								loading="eager"
							/>
							<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/60" />
						</>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5" />
					)}
					<Link
						to="/handbook"
						className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/50">
						<ArrowLeft className="w-4 h-4" />
						Handbook
					</Link>
				</motion.div>

				{/* Main Content */}
				<div className="relative -mt-16 z-10">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						{/* Article Header Card */}
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 sm:p-8 mb-8">
							<div className="flex gap-2 mb-4 flex-wrap">
								<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[hsl(var(--primary))]/10 text-xs font-medium text-[hsl(var(--primary))]">
									{article.category}
								</span>
								<span
									className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
										article.difficulty,
									)}`}>
									{article.difficulty}
								</span>
								<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-xs font-medium">
									<Clock className="w-3 h-3" />
									{article.readTime} min read
								</span>
							</div>

							<h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
								{article.title}
							</h1>

							<p className="text-base text-[hsl(var(--muted))] leading-relaxed max-w-2xl">
								{article.excerpt}
							</p>
						</motion.div>

						{/* Article Content */}
						<motion.div
							ref={contentRef}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.1 }}
							className="prose prose-invert max-w-none mb-12">
							<div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 sm:p-8 space-y-8">
								{article.sections.map((section, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: 8 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, margin: "-100px" }}
										transition={{ delay: index * 0.05 }}>
										<div className="flex gap-4">
											<div className="flex-shrink-0">
												<div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-semibold text-sm">
													{index + 1}
												</div>
											</div>
											<div className="flex-grow">
												<h2 className="text-xl sm:text-2xl font-bold mb-3 text-[hsl(var(--fg))]">
													{section.title}
												</h2>
												<p className="text-[hsl(var(--muted))] leading-relaxed whitespace-pre-wrap">
													{section.content}
												</p>
											</div>
										</div>

										{index < article.sections.length - 1 && (
											<div className="mt-8 h-px bg-[hsl(var(--border))]" />
										)}
									</motion.div>
								))}
							</div>
						</motion.div>

						{/* Related Exercises */}
						{article.relatedExercises &&
							article.relatedExercises.length > 0 && (
								<motion.section
									initial={{ opacity: 0, y: 16 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									className="mb-12">
									<h2 className="text-2xl sm:text-3xl font-bold mb-4">
										Related Exercises
									</h2>
									<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
										{article.relatedExercises.map((exerciseId) => (
											<Link
												key={exerciseId}
												to={`/handbook/exercises/chest/${exerciseId}`}
												className="group rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 transition hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/5">
												<div className="flex items-center gap-3">
													<div className="h-10 w-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center">
														<Zap className="w-5 h-5 text-[hsl(var(--primary))]" />
													</div>
													<div className="flex-grow min-w-0">
														<p className="font-semibold text-sm capitalize group-hover:text-[hsl(var(--primary))] transition">
															{exerciseId.replace(/-/g, " ")}
														</p>
														<p className="text-xs text-[hsl(var(--muted))]">
															View form guide
														</p>
													</div>
												</div>
											</Link>
										))}
									</div>
								</motion.section>
							)}

						{/* Related Articles */}
						{relatedArticles.length > 0 && (
							<motion.section
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}>
								<h2 className="text-2xl sm:text-3xl font-bold mb-4">
									Related Articles
								</h2>
								<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{relatedArticles.map((relatedArticle) => (
										<Link
											key={relatedArticle.slug}
											to={`/handbook/${relatedArticle.slug}`}
											className="group rounded-xl border border-[hsl(var(--border))] overflow-hidden transition hover:border-[hsl(var(--primary))] hover:shadow-lg">
											<div className="h-40 bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5 overflow-hidden">
												{relatedArticle.coverImage && (
													<img
														src={relatedArticle.coverImage}
														alt={relatedArticle.title}
														className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
													/>
												)}
											</div>
											<div className="p-4">
												<p className="text-xs font-medium text-[hsl(var(--primary))] mb-2 uppercase tracking-wide">
													{relatedArticle.category}
												</p>
												<h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-[hsl(var(--primary))] transition">
													{relatedArticle.title}
												</h3>
												<p className="text-xs text-[hsl(var(--muted))] line-clamp-2">
													{relatedArticle.excerpt}
												</p>
												<div className="mt-3 pt-3 border-t border-[hsl(var(--border))] flex items-center gap-2 text-xs text-[hsl(var(--muted))]">
													<Clock className="w-3 h-3" />
													{relatedArticle.readTime} min read
												</div>
											</div>
										</Link>
									))}
								</div>
							</motion.section>
						)}
					</div>
				</div>
			</div>
		</AppPageFrame>
	)
}

export default HandbookArticleDetailPage
