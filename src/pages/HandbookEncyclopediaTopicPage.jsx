import { Link, useParams } from "react-router-dom"
import { encyclopediaTopics } from "../data/encyclopediaTopics.js"

function HandbookEncyclopediaTopicPage() {
	const { topic } = useParams()
	const selectedTopic = encyclopediaTopics.find((item) => item.slug === topic)

	if (!selectedTopic) {
		return (
			<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-4xl mx-auto">
					<div className="flex items-center justify-between mb-8">
						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
							Topic not found
						</h1>
						<Link
							to="/handbook/encyclopedia"
							className="btn btn-secondary rounded-lg px-4 py-2">
							Back
						</Link>
					</div>
					<div className="card p-6 sm:p-8">
						<p className="text-[hsl(var(--muted))] mb-6">
							This encyclopedia topic does not exist.
						</p>
						<Link
							to="/handbook/encyclopedia"
							className="btn btn-primary rounded-lg px-4 py-2">
							Back to Encyclopedia
						</Link>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
						{selectedTopic.name}
					</h1>
					<Link
						to="/handbook/encyclopedia"
						className="btn btn-secondary rounded-lg px-4 py-2">
						Back
					</Link>
				</div>
				<div className="card p-6 sm:p-8">
					<div className="space-y-6">
						<p className="text-[hsl(var(--muted))] leading-relaxed">
							{selectedTopic.description}
						</p>

						{selectedTopic.importantInfo?.length > 0 && (
							<div>
								<h2 className="text-xl font-semibold mb-3">
									Important Information
								</h2>
								<ul className="space-y-2 text-[hsl(var(--muted))]">
									{selectedTopic.importantInfo.map((point) => (
										<li key={point} className="flex items-start gap-2">
											<span className="mt-2 h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]"></span>
											<span>{point}</span>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default HandbookEncyclopediaTopicPage
