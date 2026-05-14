import defaultIllustration from "../assets/exercises/default.svg"
import cardioIllustration from "../assets/exercises/cardio.svg"
import lowerBodyIllustration from "../assets/exercises/lower-body.svg"
import upperBodyIllustration from "../assets/exercises/upper-body.svg"
import coreIllustration from "../assets/exercises/core.svg"
import carryIllustration from "../assets/exercises/carry.svg"

const EXERCISE_ILLUSTRATIONS = {
	"jump squat": lowerBodyIllustration,
	burpees: cardioIllustration,
	"mountain climbers": cardioIllustration,
	"high knees": cardioIllustration,
	"walking lunges": lowerBodyIllustration,
	"jumping jacks": cardioIllustration,
	"battle ropes": cardioIllustration,
	"box jumps": lowerBodyIllustration,
	"rowing sprint": cardioIllustration,
	"bench press": upperBodyIllustration,
	"pull-up": upperBodyIllustration,
	"seated shoulder press": upperBodyIllustration,
	"back squat": lowerBodyIllustration,
	"leg press": lowerBodyIllustration,
	"bulgarian split squat": lowerBodyIllustration,
	deadlift: lowerBodyIllustration,
	"goblet squat": lowerBodyIllustration,
	"push-up": upperBodyIllustration,
	"dumbbell row": upperBodyIllustration,
	"barbell hip thrust": lowerBodyIllustration,
	"romanian deadlift": lowerBodyIllustration,
	"cable kickback": lowerBodyIllustration,
	"bodyweight glute bridge": lowerBodyIllustration,
	"step-up": lowerBodyIllustration,
	"banded lateral walk": lowerBodyIllustration,
	"sumo deadlift": lowerBodyIllustration,
	"walking lunge": lowerBodyIllustration,
	"smith machine hip thrust": lowerBodyIllustration,
	crunch: coreIllustration,
	plank: coreIllustration,
	"leg raise": coreIllustration,
	"dead bug": coreIllustration,
	"russian twist": coreIllustration,
	"side plank": coreIllustration,
	"incline dumbbell press": upperBodyIllustration,
	"cable fly": upperBodyIllustration,
	"weighted dip": upperBodyIllustration,
	"flat dumbbell press": upperBodyIllustration,
	"lat pulldown": upperBodyIllustration,
	"barbell row": upperBodyIllustration,
	"face pull": upperBodyIllustration,
	"weighted pull-up": upperBodyIllustration,
	"t-bar row": upperBodyIllustration,
	"rack pull": lowerBodyIllustration,
	"front squat": lowerBodyIllustration,
	"leg extension": lowerBodyIllustration,
	"calf raise": lowerBodyIllustration,
	"barbell curl": upperBodyIllustration,
	"tricep pushdown": upperBodyIllustration,
	"hammer curl": upperBodyIllustration,
	"skull crusher": upperBodyIllustration,
	"preacher curl": upperBodyIllustration,
	"close-grip bench press": upperBodyIllustration,
	"overhead press": upperBodyIllustration,
	"lateral raise": upperBodyIllustration,
	"rear delt fly": upperBodyIllustration,
	"arnold press": upperBodyIllustration,
	"front raise": upperBodyIllustration,
	"kettlebell swing": lowerBodyIllustration,
	"air squat": lowerBodyIllustration,
	thruster: upperBodyIllustration,
	"burpee pull-up": cardioIllustration,
	"farmer carry": carryIllustration,
}

function getIllustrationForExercise(exerciseName) {
	const normalizedName = (exerciseName || "").trim().toLowerCase()

	if (EXERCISE_ILLUSTRATIONS[normalizedName]) {
		return EXERCISE_ILLUSTRATIONS[normalizedName]
	}

	if (normalizedName.includes("plank") || normalizedName.includes("crunch")) {
		return coreIllustration
	}

	if (
		normalizedName.includes("run") ||
		normalizedName.includes("jump") ||
		normalizedName.includes("burpee")
	) {
		return cardioIllustration
	}

	if (
		normalizedName.includes("squat") ||
		normalizedName.includes("lunge") ||
		normalizedName.includes("deadlift")
	) {
		return lowerBodyIllustration
	}

	if (
		normalizedName.includes("press") ||
		normalizedName.includes("row") ||
		normalizedName.includes("pull")
	) {
		return upperBodyIllustration
	}

	return defaultIllustration
}

function ExerciseIllustration({ exerciseName, className = "" }) {
	const source = getIllustrationForExercise(exerciseName)

	return (
		<div
			className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] ${className}`}
			aria-hidden="true">
			<img
				src={source}
				alt=""
				className="h-full w-full object-cover"
				loading="lazy"
			/>
		</div>
	)
}

export default ExerciseIllustration
