import { useEffect, useMemo } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import AppPageFrame from "../components/AppPageFrame.jsx"
import type { EncyclopediaTopic } from "../components/encyclopedia/EncyclopediaCard"
import { encyclopediaArticles } from "../data/encyclopediaArticles.js"

type DetailTopic = EncyclopediaTopic & {
	content?:
		| string
		| {
				intro?: string
				sections?: Array<{ heading: string; points: string[] }>
				keyTakeaways?: string[]
		  }
	relatedTopics?: string[]
}

const topics = encyclopediaArticles.map(
	(article) =>
		({
			id: article.id,
			title: article.title,
			category: article.category,
			readTime: `${article.readingTime} min read`,
			summary: article.summary,
			coverImage: article.image,
			featured: false,
			content: article.content,
			relatedTopics: article.relatedTopics,
		}) as DetailTopic,
)
const topicById = new Map(topics.map((topic) => [topic.id, topic]))

const RECENTLY_VIEWED_KEY = "encyclopedia_recently_viewed"

function getRelatedTopics(topic: DetailTopic) {
	const relatedByKeyword = (topic.relatedTopics || [])
		.map((relatedKeyword) =>
			topics.find(
				(candidate) =>
					candidate.id !== topic.id &&
					candidate.title.toLowerCase().includes(relatedKeyword.toLowerCase()),
			),
		)
		.filter(Boolean) as DetailTopic[]

	if (relatedByKeyword.length >= 3) {
		return relatedByKeyword.slice(0, 3)
	}

	const categoryRelated = topics.filter(
		(item) => item.category === topic.category && item.id !== topic.id,
	)

	return [...relatedByKeyword, ...categoryRelated].slice(0, 3)
}

function EncyclopediaDetail() {
	const { id } = useParams()
	const topic = useMemo(() => (id ? topicById.get(id) : undefined), [id])

	useEffect(() => {
		if (!topic) {
			return
		}

		const parsed = JSON.parse(
			window.localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]",
		)
		const next = [
			topic.id,
			...parsed.filter((entry) => entry !== topic.id),
		].slice(0, 20)
		window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next))
	}, [topic])

	if (!topic) {
		return <Navigate to="/encyclopedia" replace />
	}

	const relatedTopics = getRelatedTopics(topic)
	const structuredContent =
		typeof topic.content === "object" && topic.content
			? topic.content
			: undefined
	const plainContent = typeof topic.content === "string" ? topic.content : ""

	return (
		<AppPageFrame>
			<div className="bg-[hsl(var(--bg))] px-4 py-8 text-[hsl(var(--fg))] sm:px-6 lg:px-8">
				<div className="mx-auto max-w-7xl space-y-8">
					<section className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))]">
						<img
							src={topic.coverImage}
							alt={topic.title}
							className="h-[300px] w-full object-cover sm:h-[360px]"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-transparent" />
						<div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
							<div className="mb-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
								<span className="rounded-full bg-white/15 px-2.5 py-1 font-semibold backdrop-blur-sm">
									{topic.category}
								</span>
								<span>{topic.readTime}</span>
							</div>
							<h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
								{topic.title}
							</h1>
						</div>
					</section>

					<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
						<article className="space-y-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-5 sm:p-6">
							<p className="text-sm leading-relaxed text-[hsl(var(--muted))] sm:text-base whitespace-pre-line">
								{structuredContent?.intro || plainContent || topic.summary}
							</p>

							{(structuredContent?.sections || []).map((section) => (
								<section key={section.heading} className="space-y-3">
									<h2 className="text-xl font-bold">{section.heading}</h2>
									<ul className="space-y-2 text-sm text-[hsl(var(--muted))] sm:text-base">
										{section.points.map((point) => (
											<li key={point} className="flex gap-2 leading-relaxed">
												<span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
												<span>{point}</span>
											</li>
										))}
									</ul>
								</section>
							))}

							<div className="rounded-xl border border-[hsl(var(--primary))]/20 bg-[hsl(var(--primary))]/10 p-4">
								<h3 className="text-base font-bold">Key Takeaways</h3>
								<ul className="mt-2 space-y-2 text-sm text-[hsl(var(--fg))]">
									{(structuredContent?.keyTakeaways || []).map((takeaway) => (
										<li key={takeaway} className="flex gap-2">
											<span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
											<span>{takeaway}</span>
										</li>
									))}
								</ul>
							</div>
						</article>

						<aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
							<div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4">
								<p className="text-xs uppercase tracking-wide text-[hsl(var(--muted))]">
									Category
								</p>
								<p className="mt-2 text-sm font-semibold">{topic.category}</p>
							</div>

							<div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4">
								<h3 className="text-sm font-bold">Related Topics</h3>
								<div className="mt-3 space-y-2">
									{relatedTopics.map((relatedTopic) => (
										<Link
											key={relatedTopic.id}
											to={`/encyclopedia/${relatedTopic.id}`}
											className="block rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-sm transition hover:border-[hsl(var(--primary))]/45 hover:bg-[hsl(var(--primary))]/5">
											{relatedTopic.title}
										</Link>
									))}
								</div>
							</div>
						</aside>
					</div>

					<section className="space-y-4">
						<h2 className="text-xl font-bold">Related Articles</h2>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{relatedTopics.map((relatedTopic) => (
								<motion.div
									key={`bottom-${relatedTopic.id}`}
									whileHover={{ y: -4 }}>
									<Link
										to={`/encyclopedia/${relatedTopic.id}`}
										className="block rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 shadow-sm transition hover:border-[hsl(var(--primary))]/45 hover:shadow-lg">
										<p className="text-xs text-[hsl(var(--muted))]">
											{relatedTopic.category}
										</p>
										<p className="mt-1 text-base font-semibold">
											{relatedTopic.title}
										</p>
										<p className="mt-2 text-sm text-[hsl(var(--muted))] line-clamp-2">
											{relatedTopic.summary}
										</p>
									</Link>
								</motion.div>
							))}
						</div>

						<div>
							<Link
								to="/encyclopedia"
								className="inline-flex items-center rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-2 text-sm font-medium transition hover:border-[hsl(var(--primary))]/45 hover:bg-[hsl(var(--primary))]/5">
								Back to Encyclopedia
							</Link>
						</div>
					</section>
				</div>
			</div>
		</AppPageFrame>
	)
}

export default EncyclopediaDetail
