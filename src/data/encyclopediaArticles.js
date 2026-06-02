const FEATURED_ENCYCLOPEDIA_TITLES = [
	"Understanding Progressive Overload",
	"Protein Explained",
	"Muscle Recovery Basics",
	"Compound vs Isolation Exercises",
	"How to Build Muscle",
	"Fat Loss Fundamentals",
]

const CATEGORY_ORDER = [
	"Exercises",
	"Muscles",
	"Nutrition",
	"Recovery",
	"Equipment",
	"Training Methods",
]

const slugify = (value) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.trim()
		.replace(/\s+/g, "-")

const createImageUrl = (query) =>
	`https://source.unsplash.com/1200x800/?fitness,${encodeURIComponent(query)}`

const createArticle = ({
	title,
	category,
	summary,
	readingTime,
	difficulty,
	relatedTopics,
	keywords,
	exerciseName,
}) => {
	const id = slugify(title)
	const content = `${title}\n\n${summary}\n\nWhy It Matters\n${category} knowledge helps you make better decisions, train with more intent, and progress safely over time. Focus on consistent execution, quality reps, and sustainable habits.\n\nHow to Apply It\nStart by setting one clear goal for this topic, then use a simple weekly plan to track improvement. Prioritize technique, recovery, and progressive challenge instead of random intensity.\n\nCommon Mistakes\nRushing progression, ignoring recovery, and copying plans without adjustment often stall results. Keep your approach personalized and review outcomes weekly.`

	return {
		id,
		title,
		category,
		summary,
		content,
		image: createImageUrl(`${title} ${category}`),
		readingTime,
		difficulty,
		relatedTopics,
		keywords,
		...(exerciseName ? { exerciseName } : {}),
	}
}

const exerciseArticles = [
	{
		title: "Push-Up Fundamentals",
		summary: "Master setup, body alignment, and tempo for stronger push-ups.",
		exerciseName: "push-up",
		relatedTopics: ["chest", "triceps", "bodyweight"],
		keywords: ["push-up", "pressing", "chest", "bodyweight"],
	},
	{
		title: "Squat Pattern Essentials",
		summary: "Improve squat depth, stability, and force transfer.",
		exerciseName: "squat",
		relatedTopics: ["quads", "glutes", "mobility"],
		keywords: ["squat", "legs", "form", "strength"],
	},
	{
		title: "Deadlift Setup and Bracing",
		summary: "Build safer pulling mechanics with consistent setup cues.",
		exerciseName: "deadlift",
		relatedTopics: ["posterior chain", "hinge", "brace"],
		keywords: ["deadlift", "hip hinge", "back", "strength"],
	},
	{
		title: "Bench Press Technique Guide",
		summary: "Learn pressing mechanics for chest strength and shoulder safety.",
		exerciseName: "bench press",
		relatedTopics: ["chest", "triceps", "scapular control"],
		keywords: ["bench press", "barbell", "chest", "strength"],
	},
	{
		title: "Overhead Press Mechanics",
		summary: "Refine bar path and core control for vertical pressing.",
		exerciseName: "overhead press",
		relatedTopics: ["delts", "core", "triceps"],
		keywords: ["overhead press", "shoulders", "strength", "core"],
	},
	{
		title: "Pull-Up Progression Ladder",
		summary: "Use scalable variations to build strict pull-up strength.",
		exerciseName: "pull-up",
		relatedTopics: ["lats", "grip", "bodyweight"],
		keywords: ["pull-up", "back", "lats", "calisthenics"],
	},
	{
		title: "Romanian Deadlift Form",
		summary: "Target hamstrings effectively with controlled hinge mechanics.",
		exerciseName: "romanian deadlift",
		relatedTopics: ["hamstrings", "hinge", "posterior chain"],
		keywords: ["RDL", "hamstrings", "deadlift variation", "glutes"],
	},
	{
		title: "Lunge Variations for Stability",
		summary: "Choose the right lunge variation for strength and balance.",
		exerciseName: "lunge",
		relatedTopics: ["single-leg", "glutes", "quads"],
		keywords: ["lunge", "split stance", "legs", "balance"],
	},
	{
		title: "Hip Thrust Performance Tips",
		summary: "Increase glute activation and lockout quality.",
		exerciseName: "hip thrust",
		relatedTopics: ["glutes", "posterior chain", "power"],
		keywords: ["hip thrust", "glutes", "barbell", "strength"],
	},
	{
		title: "Plank and Anti-Extension Control",
		summary: "Build resilient core stability with smarter plank execution.",
		exerciseName: "plank",
		relatedTopics: ["core", "stability", "posture"],
		keywords: ["plank", "core stability", "anti-extension"],
	},
	{
		title: "Lat Pulldown Setup",
		summary: "Optimize grip and torso angle for better lat engagement.",
		relatedTopics: ["lats", "back", "machine"],
		keywords: ["lat pulldown", "back", "machine exercise"],
	},
	{
		title: "Rowing Patterns Explained",
		summary:
			"Compare barbell, cable, and dumbbell rows for balanced development.",
		relatedTopics: ["mid-back", "scapula", "pulling"],
		keywords: ["rows", "back thickness", "scapular retraction"],
	},
	{
		title: "Dips: Form and Progression",
		summary: "Perform dips safely while managing shoulder stress.",
		relatedTopics: ["triceps", "chest", "shoulders"],
		keywords: ["dips", "bodyweight", "triceps", "pressing"],
	},
	{
		title: "Calf Raise Variations",
		summary: "Use seated and standing patterns to train lower leg strength.",
		relatedTopics: ["calves", "ankle", "tempo"],
		keywords: ["calf raise", "lower legs", "ankle strength"],
	},
	{
		title: "Leg Press Execution",
		summary:
			"Use foot placement and depth cues for efficient lower-body training.",
		relatedTopics: ["quads", "glutes", "machine"],
		keywords: ["leg press", "quads", "machine", "legs"],
	},
	{
		title: "Front Squat Positioning",
		summary: "Improve torso position and rack comfort for front squats.",
		exerciseName: "front squat",
		relatedTopics: ["quads", "core", "mobility"],
		keywords: ["front squat", "rack position", "leg strength"],
	},
	{
		title: "Goblet Squat Coaching Cues",
		summary: "Use goblet squats to groove pattern quality and depth control.",
		exerciseName: "goblet squat",
		relatedTopics: ["beginner strength", "mobility", "core"],
		keywords: ["goblet squat", "dumbbell", "form"],
	},
	{
		title: "Cable Fly Tension Control",
		summary: "Keep chest tension high through full range with cable flys.",
		relatedTopics: ["chest", "isolation", "tempo"],
		keywords: ["cable fly", "chest isolation", "hypertrophy"],
	},
	{
		title: "Lateral Raise Precision",
		summary: "Train shoulder width with stricter raise mechanics.",
		relatedTopics: ["delts", "isolation", "control"],
		keywords: ["lateral raise", "shoulders", "deltoids"],
	},
	{
		title: "Bicep Curl Variations",
		summary: "Understand curl variations and elbow positioning.",
		relatedTopics: ["biceps", "forearms", "tempo"],
		keywords: ["bicep curl", "arm training", "hypertrophy"],
	},
	{
		title: "Triceps Pushdown Technique",
		summary: "Maximize triceps stimulus with cleaner cable execution.",
		relatedTopics: ["triceps", "elbow path", "cable"],
		keywords: ["triceps pushdown", "cable", "arm training"],
	},
	{
		title: "Kettlebell Swing Basics",
		summary: "Learn explosive hinge mechanics for power and conditioning.",
		relatedTopics: ["power", "hinge", "conditioning"],
		keywords: ["kettlebell swing", "hip hinge", "conditioning"],
	},
	{
		title: "Step-Up for Athletic Strength",
		summary: "Use step-ups to build unilateral leg strength and control.",
		relatedTopics: ["single-leg", "glutes", "balance"],
		keywords: ["step-up", "legs", "unilateral"],
	},
	{
		title: "Face Pull Shoulder Health",
		summary: "Improve scapular mechanics and rear-delt strength.",
		relatedTopics: ["rear delts", "posture", "upper back"],
		keywords: ["face pull", "shoulder health", "rear delts"],
	},
	{
		title: "Bulgarian Split Squat Depth",
		summary: "Dial in split squat setup for glute and quad bias.",
		relatedTopics: ["single-leg", "glutes", "quads"],
		keywords: ["bulgarian split squat", "legs", "balance"],
	},
	{
		title: "Farmer Carry Bracing",
		summary: "Develop grip, posture, and core stiffness with loaded carries.",
		relatedTopics: ["grip", "core", "posture"],
		keywords: ["farmer carry", "core", "grip strength"],
	},
	{
		title: "Chin-Up Strength Strategy",
		summary: "Use volume and frequency to progress chin-up reps.",
		relatedTopics: ["lats", "biceps", "bodyweight"],
		keywords: ["chin-up", "back", "biceps"],
	},
	{
		title: "Glute Bridge Execution",
		summary: "Improve posterior-chain control with efficient bridge mechanics.",
		relatedTopics: ["glutes", "pelvis", "core"],
		keywords: ["glute bridge", "posterior chain", "glutes"],
	},
	{
		title: "Machine vs Free-Weight Pressing",
		summary: "Understand tradeoffs between stability and coordination demands.",
		relatedTopics: ["strength", "exercise selection", "hypertrophy"],
		keywords: ["machine press", "free weights", "chest training"],
	},
	{
		title: "Compound vs Isolation Exercises",
		summary: "Choose the right movement type for your current training goal.",
		relatedTopics: ["programming", "hypertrophy", "strength"],
		keywords: ["compound", "isolation", "exercise selection"],
	},
]

const muscleArticles = [
	"Pectoral Function and Training",
	"Latissimus Dorsi Mechanics",
	"Quadriceps Hypertrophy Basics",
	"Hamstring Strength Development",
	"Glute Max Activation",
	"Deltoid Anatomy for Lifters",
	"Trapezius Training Roles",
	"Biceps Structure and Function",
	"Triceps Long Head Emphasis",
	"Forearm Strength Essentials",
	"Core Muscles and Bracing",
	"Obliques and Rotation Control",
	"Calf Muscle Training Principles",
	"Lower Back Endurance",
	"Hip Flexor Mobility",
	"Adductors in Squat Patterns",
	"Abductors for Knee Stability",
	"Rotator Cuff Protection",
	"Neck and Posture Mechanics",
	"Serratus Anterior for Pressing",
].map((title) => ({
	title,
	summary: `${title} explained with practical cues for training and injury prevention.`,
	relatedTopics: ["muscle anatomy", "movement quality", "strength"],
	keywords: [
		"muscle",
		"anatomy",
		"training",
		...title.toLowerCase().split(" "),
	],
}))

const nutritionArticles = [
	"Protein Explained",
	"Fat Loss Fundamentals",
	"Carbohydrate Timing for Training",
	"Healthy Fats and Hormone Support",
	"Hydration for Performance",
	"Meal Prep for Consistency",
	"Fiber Intake and Digestion",
	"Micronutrients for Recovery",
	"Pre-Workout Meal Strategy",
	"Post-Workout Nutrition",
	"How to Read Nutrition Labels",
	"Managing Hunger During Fat Loss",
	"Bulking Nutrition Basics",
	"Calorie Tracking Accuracy",
	"Supplements: What Actually Helps",
	"Creatine Monohydrate Guide",
	"Electrolytes and Sweat Loss",
	"High-Protein Breakfast Ideas",
	"Nutrition for Rest Days",
	"Building Sustainable Eating Habits",
].map((title) => ({
	title,
	summary: `${title} with evidence-informed guidance you can apply immediately.`,
	relatedTopics: ["calories", "macros", "habits"],
	keywords: [
		"nutrition",
		"diet",
		"calories",
		...title.toLowerCase().split(" "),
	],
}))

const recoveryArticles = [
	"Muscle Recovery Basics",
	"Sleep Quality for Athletes",
	"Deload Week Planning",
	"Managing Training Fatigue",
	"Stress and Performance",
	"Active Recovery Sessions",
	"Mobility vs Stretching",
	"Cold Therapy: Pros and Cons",
	"Rest Day Optimization",
	"Injury Warning Signs",
].map((title) => ({
	title,
	summary: `${title} to help you recover faster and train with better consistency.`,
	relatedTopics: ["sleep", "stress", "adaptation"],
	keywords: ["recovery", "sleep", "rest", ...title.toLowerCase().split(" ")],
}))

const equipmentArticles = [
	"Barbell Setup and Safety",
	"Dumbbell Selection Guide",
	"Kettlebell Training Basics",
	"Cable Machine Fundamentals",
	"Smith Machine Use Cases",
	"Resistance Bands Programming",
	"Weightlifting Belt Explained",
	"Lifting Straps and Grip Aids",
	"Foam Roller Usage Guide",
	"Choosing the Right Shoes",
].map((title) => ({
	title,
	summary: `${title} so you can choose and use equipment more effectively.`,
	relatedTopics: ["gym equipment", "safety", "setup"],
	keywords: ["equipment", "gear", "gym", ...title.toLowerCase().split(" ")],
}))

const trainingMethodArticles = [
	"Understanding Progressive Overload",
	"How to Build Muscle",
	"Periodization for Beginners",
	"Volume vs Intensity",
	"RPE and Reps in Reserve",
	"Linear Progression Plans",
	"Circuit Training Structure",
	"HIIT vs Steady Cardio",
	"Strength vs Hypertrophy Blocks",
	"How to Break Plateaus",
].map((title) => ({
	title,
	summary: `${title} with practical programming strategies for long-term progress.`,
	relatedTopics: ["programming", "progression", "training"],
	keywords: [
		"training methods",
		"programming",
		"strength",
		...title.toLowerCase().split(" "),
	],
}))

const withMeta = (items, category, startReadingTime = 4) =>
	items.map((item, index) =>
		createArticle({
			title: item.title,
			category,
			summary: item.summary,
			readingTime: startReadingTime + (index % 5),
			difficulty:
				index % 3 === 0
					? "Beginner"
					: index % 3 === 1
						? "Intermediate"
						: "Advanced",
			relatedTopics: item.relatedTopics,
			keywords: item.keywords,
			exerciseName: item.exerciseName,
		}),
	)

export const encyclopediaArticles = [
	...withMeta(exerciseArticles, "Exercises", 5),
	...withMeta(muscleArticles, "Muscles", 4),
	...withMeta(nutritionArticles, "Nutrition", 4),
	...withMeta(recoveryArticles, "Recovery", 4),
	...withMeta(equipmentArticles, "Equipment", 3),
	...withMeta(trainingMethodArticles, "Training Methods", 5),
]

export const encyclopediaCategories = ["All", ...CATEGORY_ORDER]

export const featuredEncyclopediaArticles = FEATURED_ENCYCLOPEDIA_TITLES.map(
	(title) => encyclopediaArticles.find((article) => article.title === title),
).filter(Boolean)

export const encyclopediaArticleById = Object.fromEntries(
	encyclopediaArticles.map((article) => [article.id, article]),
)

export const TOTAL_ENCYCLOPEDIA_ARTICLES = encyclopediaArticles.length
