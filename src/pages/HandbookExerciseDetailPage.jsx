import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { handbookExerciseData } from "../data/handbookExercises.js"
import { getExerciseByName, getExerciseImageUrl } from "../api/wger.ts"

function HandbookExerciseDetailPage() {
	const navigate = useNavigate()
	const { muscle, exercise } = useParams()
	const muscleKey = muscle?.toLowerCase()
	const exerciseKey = exercise?.toLowerCase()
	const muscleGroup = handbookExerciseData[muscleKey]
	const selectedExercise = muscleGroup?.exercises.find(
		(item) => item.slug === exerciseKey,
	)
	const [wgerData, setWgerData] = useState(null)
	const [isExerciseLoading, setIsExerciseLoading] = useState(false)
	const [exerciseError, setExerciseError] = useState("")
	const [imageLoadError, setImageLoadError] = useState(false)

	useEffect(() => {
		let isMounted = true
		setImageLoadError(false)

		const loadExercise = async () => {
			if (!selectedExercise?.name) return

			setIsExerciseLoading(true)
			setExerciseError("")

			try {
				const result = await getExerciseByName(selectedExercise.name)
				if (!isMounted) return

				setWgerData(result)
				if (!result) setExerciseError("No WGER match found.")
			} catch (error) {
				if (!isMounted) return
				console.error(
					`[ExerciseDetail] API error for "${selectedExercise.name}":`,
					error,
				)
				setWgerData(null)
				setExerciseError(
					error instanceof Error ? error.message : "Unable to load WGER data.",
				)
			}
			setIsExerciseLoading(false)
		}

		loadExercise()

		return () => {
			isMounted = false
		}
	}, [selectedExercise?.name])

	const instructionSteps = selectedExercise?.instructions || [
		`Set up your ${selectedExercise?.name || "exercise"} with stable posture and controlled breathing.`,
		"Perform each repetition with a full, pain-free range of motion.",
		"Use a controlled tempo and maintain form from start to finish.",
		"Stop the set when technique quality starts to break down.",
	]
	const safetyWarnings = selectedExercise?.warnings || [
		"Warm up first and start with a manageable load.",
		"Avoid sudden jerking or using momentum to force reps.",
		"Pause and reassess if you feel sharp pain or joint discomfort.",
	]
	const howToTips = selectedExercise?.howToTips || []
	const exerciseImageUrl = getExerciseImageUrl(wgerData)

	if (!muscleGroup || !selectedExercise) {
		return (
			<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-4xl mx-auto card p-6 sm:p-8">
					<h1 className="text-2xl sm:text-3xl font-bold mb-3">
						Exercise not found
					</h1>
					<p className="text-[hsl(var(--muted))] mb-6">
						This exercise is not available for the selected muscle group.
					</p>
					<Link
						to={`/handbook/exercises/${muscleKey || "chest"}`}
						className="btn btn-primary rounded-lg px-4 py-2">
						Back to Muscle Group
					</Link>
				</div>
			</div>
		)
	}

	const handleStartWorkout = () => {
		navigate("/dashboard", {
			state: {
				openWorkoutModal: true,
				prefillWorkout: {
					exercise: {
						name: selectedExercise.name,
						description: selectedExercise.description,
						targetMuscles: selectedExercise.targetMuscles,
					},
					focus: muscleGroup.title,
				},
			},
		})
	}

	return (
		<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 sm:px-6 lg:px-8 py-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
						{selectedExercise.name}
					</h1>
					<Link
						to={`/handbook/exercises/${muscleKey}`}
						className="btn btn-secondary rounded-lg px-4 py-2">
						Back
					</Link>
				</div>

				<div className="card p-6 sm:p-8 space-y-4">
					<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/40 p-4 sm:p-6">
						<div className="overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
							{exerciseImageUrl && !imageLoadError ? (
								<img
									src={exerciseImageUrl}
									alt={selectedExercise.name}
									className="h-auto w-full object-contain"
									loading="lazy"
									onError={(e) => {
										console.error(
											`[ExerciseDetail] Image failed to load: "${exerciseImageUrl}"`,
											e,
										)
										setImageLoadError(true)
									}}
								/>
							) : (
								<div className="aspect-video w-full flex flex-col items-center justify-center text-center px-4 py-10">
									<i className="ph ph-image-square text-3xl text-[hsl(var(--muted))] mb-2"></i>
									<p className="text-sm font-medium text-[hsl(var(--fg))]">
										{isExerciseLoading
											? "Loading WGER preview..."
											: imageLoadError
												? "Image failed to load"
												: "Preview unavailable"}
									</p>
									<p className="text-xs text-[hsl(var(--muted))] mt-1">
										{imageLoadError
											? exerciseImageUrl
											: exerciseError || "Using local exercise details."}
									</p>
								</div>
							)}
						</div>
					</div>

					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
						<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4">
							<p className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--muted))]">
								Name
							</p>
							<p className="mt-2 font-semibold text-[hsl(var(--fg))]">
								{wgerData?.name || selectedExercise.name}
							</p>
						</div>
						<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4">
							<p className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--muted))]">
								Category
							</p>
							<p className="mt-2 font-semibold text-[hsl(var(--fg))]">
								{wgerData?.category || muscleGroup.title}
							</p>
						</div>
						<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4">
							<p className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--muted))]">
								Equipment
							</p>
							<p className="mt-2 font-semibold text-[hsl(var(--fg))]">
								{wgerData?.equipment || "Bodyweight"}
							</p>
						</div>
						<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4 sm:col-span-2 xl:col-span-1">
							<p className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--muted))]">
								Target Muscle
							</p>
							<p className="mt-2 font-semibold text-[hsl(var(--fg))]">
								{wgerData?.muscles || selectedExercise.targetMuscles}
							</p>
						</div>
					</div>

					<p className="text-[hsl(var(--muted))] leading-relaxed">
						{selectedExercise.description}
					</p>
					<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4">
						<p className="text-sm text-[hsl(var(--primary))]">
							Target muscles: {selectedExercise.targetMuscles}
						</p>
						<p className="text-sm text-[hsl(var(--muted))] mt-2">
							Muscle group: {muscleGroup.title}
						</p>
					</div>

					<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4">
						<h2 className="text-lg font-semibold mb-3">
							Step-by-step instructions
						</h2>
						<ol className="space-y-2 text-[hsl(var(--muted))] list-decimal pl-5">
							{instructionSteps.map((step) => (
								<li key={step}>{step}</li>
							))}
						</ol>
					</div>

					<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4">
						<h2 className="text-lg font-semibold mb-3">
							Warnings & safety tips
						</h2>
						<ul className="space-y-2 text-[hsl(var(--muted))]">
							{safetyWarnings.map((warning) => (
								<li key={warning} className="flex items-start gap-2">
									<span className="mt-2 h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]"></span>
									<span>{warning}</span>
								</li>
							))}
						</ul>
					</div>

					{howToTips.length > 0 && (
						<div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50 p-4">
							<h2 className="text-lg font-semibold mb-3">How to tips</h2>
							<ul className="space-y-2 text-[hsl(var(--muted))]">
								{howToTips.map((tip) => (
									<li key={tip} className="flex items-start gap-2">
										<span className="mt-2 h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]"></span>
										<span>{tip}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					<div className="pt-2">
						<button
							type="button"
							onClick={handleStartWorkout}
							className="btn btn-primary rounded-lg px-5 py-2.5">
							Log Workout
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HandbookExerciseDetailPage
