import ExerciseApiImage from "./ExerciseApiImage.jsx"

const BODYWEIGHT_KEYWORDS = [
	"plank",
	"crunch",
	"push-up",
	"pull-up",
	"lunge",
	"mountain climber",
	"burpee",
	"air squat",
	"jumping jack",
	"high knees",
	"dead bug",
]

const CARDIO_KEYWORDS = ["sprint", "cardio", "jump", "battle ropes", "rowing"]

const CORE_KEYWORDS = ["plank", "crunch", "twist", "dead bug", "leg raise"]

const getEquipmentLabel = (exerciseName) => {
	const normalizedName = (exerciseName || "").toLowerCase()

	if (BODYWEIGHT_KEYWORDS.some((keyword) => normalizedName.includes(keyword))) {
		return "Bodyweight"
	}

	if (normalizedName.includes("barbell")) {
		return "Barbell"
	}

	if (normalizedName.includes("dumbbell")) {
		return "Dumbbell"
	}

	if (normalizedName.includes("kettlebell")) {
		return "Kettlebell"
	}

	if (normalizedName.includes("cable")) {
		return "Cable"
	}

	if (normalizedName.includes("machine") || normalizedName.includes("press")) {
		return "Machine"
	}

	if (normalizedName.includes("band")) {
		return "Band"
	}

	return "Bodyweight"
}

const getVolumeLabel = (exerciseName, targetSets) => {
	const normalizedName = (exerciseName || "").toLowerCase()
	const sets = targetSets ?? 3

	if (CORE_KEYWORDS.some((keyword) => normalizedName.includes(keyword))) {
		return `${sets} sets • 30 sec`
	}

	if (CARDIO_KEYWORDS.some((keyword) => normalizedName.includes(keyword))) {
		return `${sets} sets • 20 sec`
	}

	return `${sets} sets • 8-12 reps`
}

function ExerciseRow({ exercise }) {
	return (
		<div className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
			<ExerciseApiImage
				exerciseName={exercise?.name}
				exerciseId={
					Number.isFinite(exercise?.id)
						? Number(exercise.id)
						: Number.isFinite(exercise?.exerciseId)
							? Number(exercise.exerciseId)
							: undefined
				}
			/>
			<div className="min-w-0 flex-1">
				<h3 className="truncate text-base font-semibold text-[hsl(var(--fg))]">
					{exercise.name}
				</h3>
				<p className="mt-0.5 text-sm text-[hsl(var(--muted))]">
					{getEquipmentLabel(exercise.name)}
				</p>
				<p className="mt-1 text-sm font-medium text-[hsl(var(--fg))]/85">
					{getVolumeLabel(exercise.name, exercise.targetSets)}
				</p>
			</div>
		</div>
	)
}

export default ExerciseRow
