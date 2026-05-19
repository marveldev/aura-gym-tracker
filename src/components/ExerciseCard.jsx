import { useState } from "react"

function ExerciseCard({ exercise, onClick }) {
	const [imgLoaded, setImgLoaded] = useState(false)
	const [imgError, setImgError] = useState(false)

	const bodyPart = exercise.bodyParts?.[0] ?? "general"
	const equipment = exercise.equipments?.[0] ?? "—"
	const muscle = exercise.targetMuscles?.[0] ?? "—"

	const bodyPartColor = {
		back: "bg-blue-500/15 text-blue-400",
		chest: "bg-red-500/15 text-red-400",
		shoulders: "bg-purple-500/15 text-purple-400",
		waist: "bg-yellow-500/15 text-yellow-400",
		cardio: "bg-green-500/15 text-green-400",
		"upper arms": "bg-orange-500/15 text-orange-400",
		"upper legs": "bg-pink-500/15 text-pink-400",
		"lower legs": "bg-teal-500/15 text-teal-400",
	}

	const chipClass =
		bodyPartColor[bodyPart.toLowerCase()] ??
		"bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))]"

	return (
		<button
			type="button"
			onClick={() => onClick(exercise)}
			className="group text-left w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] overflow-hidden transition-all duration-200 hover:border-[hsl(var(--primary))]/50 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]">
			{/* GIF area */}
			<div className="relative w-full aspect-square bg-[hsl(var(--bg))] overflow-hidden">
				{!imgLoaded && !imgError && (
					<div className="absolute inset-0 skeleton-loader" />
				)}
				{imgError ? (
					<div className="absolute inset-0 flex items-center justify-center text-[hsl(var(--muted))]">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-10 h-10 opacity-40"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				) : (
					<img
						src={exercise.gifUrl}
						alt={exercise.name}
						onLoad={() => setImgLoaded(true)}
						onError={() => setImgError(true)}
						className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
					/>
				)}
			</div>

			{/* Info */}
			<div className="p-4">
				<h3 className="font-semibold text-[hsl(var(--fg))] leading-snug capitalize line-clamp-2 mb-3 group-hover:text-[hsl(var(--primary))] transition-colors">
					{exercise.name}
				</h3>
				<div className="flex flex-wrap gap-1.5">
					<span
						className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${chipClass}`}>
						{bodyPart}
					</span>
					<span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--border))]/60 text-[hsl(var(--muted))] capitalize">
						{equipment}
					</span>
				</div>
				<p className="mt-2.5 text-xs text-[hsl(var(--muted))] capitalize">
					<span className="font-medium text-[hsl(var(--fg))]/70">Target: </span>
					{muscle}
				</p>
			</div>
		</button>
	)
}

export default ExerciseCard
