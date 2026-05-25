import { useEffect, useRef, useState } from "react"

function ExerciseDetailModal({
	exercise,
	onClose,
	onCompleteWorkout,
	isCompleting = false,
	isCompleted = false,
	completeWorkoutError = "",
}) {
	const overlayRef = useRef(null)
	const [imgLoaded, setImgLoaded] = useState(false)
	const [imgError, setImgError] = useState(false)

	useEffect(() => {
		const prev = document.body.style.overflow
		document.body.style.overflow = "hidden"

		const onKeyDown = (e) => {
			if (e.key === "Escape") onClose()
		}
		document.addEventListener("keydown", onKeyDown)

		return () => {
			document.body.style.overflow = prev
			document.removeEventListener("keydown", onKeyDown)
		}
	}, [onClose])

	const handleOverlayClick = (e) => {
		if (e.target === overlayRef.current) onClose()
	}

	if (!exercise) return null

	const allMuscles = [
		...(exercise.targetMuscles ?? []),
		...(exercise.secondaryMuscles ?? []),
	]

	const muscleChipColors = [
		"bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))]",
		"bg-purple-500/15 text-purple-400",
		"bg-blue-500/15 text-blue-400",
		"bg-green-500/15 text-green-400",
		"bg-orange-500/15 text-orange-400",
	]

	return (
		<div
			ref={overlayRef}
			onClick={handleOverlayClick}
			className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
			<div className="relative w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))] shadow-2xl">
				{/* Close button */}
				<button
					type="button"
					onClick={onClose}
					aria-label="Close"
					className="absolute top-3 right-3 z-10 p-2 rounded-full bg-[hsl(var(--bg))]/80 text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--border))] transition-colors">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-5 h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				{/* Drag handle (mobile) */}
				<div className="sm:hidden flex justify-center pt-3 pb-1">
					<div className="w-10 h-1 rounded-full bg-[hsl(var(--border))]" />
				</div>

				{/* GIF */}
				<div className="relative w-full aspect-video bg-[hsl(var(--bg))] overflow-hidden sm:rounded-t-2xl">
					{!imgLoaded && !imgError && (
						<div className="absolute inset-0 skeleton-loader" />
					)}
					{imgError ? (
						<div className="absolute inset-0 flex items-center justify-center text-[hsl(var(--muted))]">
							<span className="text-sm">Preview unavailable</span>
						</div>
					) : (
						<img
							src={exercise.gifUrl}
							alt={exercise.name}
							onLoad={() => setImgLoaded(true)}
							onError={() => setImgError(true)}
							className={`w-full h-full object-contain transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
						/>
					)}
				</div>

				{/* Content */}
				<div className="p-5 sm:p-6 space-y-5">
					<div>
						<h2 className="text-2xl font-bold capitalize leading-snug text-[hsl(var(--fg))]">
							{exercise.name}
						</h2>
						<div className="flex flex-wrap gap-2 mt-3">
							{(exercise.bodyParts ?? []).map((bp) => (
								<span
									key={bp}
									className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))]">
									{bp}
								</span>
							))}
							{(exercise.equipments ?? []).map((eq) => (
								<span
									key={eq}
									className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-[hsl(var(--border))]/80 text-[hsl(var(--muted))]">
									{eq}
								</span>
							))}
						</div>
					</div>

					{/* Overview */}
					<div>
						<h3 className="text-sm font-semibold text-[hsl(var(--muted))] uppercase tracking-widest mb-2">
							Overview
						</h3>
						<p className="text-sm leading-relaxed text-[hsl(var(--fg))]/80 bg-[hsl(var(--bg))]/60 border border-[hsl(var(--border))] rounded-2xl p-4 min-h-16">
							{exercise.overview?.trim() || "—"}
						</p>
					</div>

					{/* Muscles */}
					<div>
						<h3 className="text-sm font-semibold text-[hsl(var(--muted))] uppercase tracking-widest mb-2">
							Muscles Worked
						</h3>
						<div className="flex flex-wrap gap-2">
							{allMuscles.map((m, i) => (
								<span
									key={m}
									className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${muscleChipColors[i % muscleChipColors.length]}`}>
									{m}
									{exercise.targetMuscles?.includes(m) && (
										<span className="ml-1 opacity-60">★</span>
									)}
								</span>
							))}
						</div>
						<p className="text-xs text-[hsl(var(--muted))] mt-1.5">
							★ = primary target
						</p>
					</div>

					{/* Instructions */}
					{exercise.instructions?.length > 0 && (
						<div>
							<h3 className="text-sm font-semibold text-[hsl(var(--muted))] uppercase tracking-widest mb-3">
								Instructions
							</h3>
							<ol className="space-y-3">
								{exercise.instructions.map((step, idx) => {
									const text = step.replace(/^Step:\d+\s*/i, "").trim()
									return (
										<li key={idx} className="flex gap-3">
											<span className="flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))] text-xs font-bold flex items-center justify-center">
												{idx + 1}
											</span>
											<p className="text-sm text-[hsl(var(--fg))]/80 leading-relaxed pt-0.5">
												{text}
											</p>
										</li>
									)
								})}
							</ol>
						</div>
					)}

					{typeof onCompleteWorkout === "function" && (
						<div className="pt-1">
							<button
								type="button"
								onClick={onCompleteWorkout}
								disabled={isCompleting || isCompleted}
								className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
									isCompleted
										? "bg-emerald-500 text-white"
										: "bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))] hover:bg-[hsl(var(--primary-hover))]"
								} ${isCompleting || isCompleted ? "opacity-80 cursor-not-allowed" : "active:scale-[0.98]"}`}>
								{isCompleting
									? "Completing..."
									: isCompleted
										? "Workout Completed"
										: "Complete Workout"}
							</button>
							{completeWorkoutError && (
								<p className="mt-2 text-sm text-[hsl(var(--danger))]">
									{completeWorkoutError}
								</p>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ExerciseDetailModal
