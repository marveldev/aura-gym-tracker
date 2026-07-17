import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
	ArrowLeft,
	ChevronRight,
	Dumbbell,
	AlertTriangle,
	Lightbulb,
	Filter,
	BarChart2,
	Activity,
	Play,
	X,
} from "lucide-react"
import AppPageFrame from "../components/AppPageFrame.jsx"
import { handbookExerciseData } from "../data/handbookExercises.js"
import workoutExerciseData from "../data/workoutExerciseData.js"

/* ─────────────────────────── per-muscle rich metadata ─────────────────────── */

const MUSCLE_META = {
	chest: {
		heroImage:
			"https://images.unsplash.com/photo-1604480133080-602261a680df?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hlc3QlMjBleGVyY2lzZXxlbnwwfHwwfHx8MA%3D%3D",
		description:
			"The chest (pectoralis major & minor) is the primary pushing muscle of the upper body. A well-developed chest improves posture, pushing strength, and athletic performance.",
		stats: {
			difficultyRange: "Beginner – Advanced",
			equipment: "Barbell · Dumbbell · Cable · Bodyweight",
		},
		muscleOverview: {
			primary: [
				{
					name: "Pectoralis Major",
					function: "Horizontal pushing, arm adduction across the body",
				},
				{
					name: "Pectoralis Minor",
					function: "Stabilises the scapula, assists in depression",
				},
			],
			secondary: [
				{
					name: "Anterior Deltoid",
					function: "Front shoulder — assists in pressing movements",
				},
				{
					name: "Triceps Brachii",
					function: "Elbow extension — active in all pressing patterns",
				},
				{
					name: "Serratus Anterior",
					function: "Scapular protraction and stabilisation",
				},
			],
		},
		tips: [
			"Retract your shoulder blades before every set to protect your shoulder joints.",
			"Vary the angle (flat, incline, decline) to hit all fibres of the pectoralis major.",
			"Mind-muscle connection matters — squeeze the chest at the top of each rep.",
			"Full range of motion on flyes produces a superior stretch stimulus for hypertrophy.",
			"Progressive overload is key: add weight, reps, or sets each week.",
		],
		mistakes: [
			{
				title: "Flaring elbows too wide",
				detail:
					"Increases shoulder impingement risk. Keep elbows at 45–75° from your torso.",
			},
			{
				title: "Bouncing the bar off your chest",
				detail: "Reduces tension on the muscle and can injure ribs or sternum.",
			},
			{
				title: "Ignoring upper chest",
				detail:
					"Most lifters only do flat pressing. Add incline work 1–2× per week.",
			},
			{
				title: "Skipping full range of motion",
				detail:
					"Partial reps limit stretch-mediated hypertrophy. Lower fully under control.",
			},
			{
				title: "No warm-up sets",
				detail:
					"Always perform 2–3 progressive warm-up sets before working weight.",
			},
		],
		objectPosition: "center",
	},
	back: {
		heroImage:
			"https://plus.unsplash.com/premium_photo-1666736569172-0c435487b6ef?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmFjayUyMGV4ZXJjaXNlfGVufDB8fDB8fHww",
		description:
			"The back is the largest muscle group in the upper body, driving pulling strength, posture, and athletic power. A strong back balances chest development and protects the spine.",
		stats: {
			difficultyRange: "Beginner – Advanced",
			equipment: "Barbell · Dumbbell · Cable · Machine",
		},
		muscleOverview: {
			primary: [
				{
					name: "Latissimus Dorsi",
					function:
						"Primary pulling muscle, arm adduction and internal rotation",
				},
				{
					name: "Rhomboid Major & Minor",
					function: "Scapular retraction and elevation, upper back strength",
				},
				{
					name: "Erector Spinae",
					function: "Spinal extension and stability along the posterior chain",
				},
			],
			secondary: [
				{
					name: "Trapezius",
					function: "Upper/middle/lower back engagement, scapular stability",
				},
				{
					name: "Biceps Brachii",
					function: "Arm flexion — active in all pulling movements",
				},
				{
					name: "Posterior Deltoid",
					function: "Rear shoulder — assists in row and pull patterns",
				},
			],
		},
		tips: [
			"Think about pulling your elbows down and back, not pulling the weight towards your body.",
			"Initiate pulls with your lats by depressing and retracting your scapula.",
			"Include both vertical (pull-ups) and horizontal (rows) pulling patterns each week.",
			"The stretch at the bottom position is crucial for lat development and mobility.",
			"Use a full range of motion on rows — feel the scapular squeeze at the top.",
		],
		mistakes: [
			{
				title: "Neglecting scapular retraction",
				detail:
					"Reduces lat activation. Focus on pulling shoulder blades back before arm flexion.",
			},
			{
				title: "Rounding the lower back excessively",
				detail:
					"Increases injury risk on bent-over rows. Maintain neutral or slight curve.",
			},
			{
				title: "Using only wide grip",
				detail:
					"Vary grip width (close, neutral, wide) to hit all back angles and avoid imbalances.",
				title: "Skipping heavy deadlifts or squats",
				detail:
					"Light-only work limits strength and muscle-building potential. Use substantial load.",
			},
			{
				title: "Forgetting lower leg training",
				detail:
					"The calves and shins need direct work — 2–3 sets of calf raises/flexion per week.",
			},
		],
		objectPosition: "center",
	},
	legs: {
		heroImage:
			"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVncyUyMGV4ZXJjaXNlfGVufDB8fDB8fHww",
		description:
			"Legs contain the body's largest muscles and drive athletic performance, metabolic health, and functional strength. Comprehensive leg training improves posture, power, and fat loss.",
		stats: {
			difficultyRange: "Intermediate – Advanced",
			equipment: "Barbell · Dumbbell · Leg Machine · Bodyweight",
		},
		muscleOverview: {
			primary: [
				{
					name: "Quadriceps",
					function:
						"Knee extension, hip flexion — primary knee driver for squats",
				},
				{
					name: "Hamstrings",
					function:
						"Knee flexion, hip extension — crucial for balance and joint health",
				},
				{
					name: "Gluteus Maximus",
					function:
						"Hip extension and external rotation, athletic power output",
				},
			],
			secondary: [
				{
					name: "Adductors",
					function: "Inner thigh — assists knee flexion and stabilisation",
				},
				{
					name: "Gastrocnemius & Soleus",
					function:
						"Calf muscles — ankle plantarflexion and lower leg strength",
				},
				{
					name: "Tibialis Anterior",
					function: "Front shin — dorsiflexion and injury prevention",
				},
			],
		},
		tips: [
			"Train legs at minimum 2× per week for optimal growth and strength gains.",
			"Prioritise the squat and deadlift — they build the most muscle and strength.",
			"Use full range of motion on squats — deep squats build maximum strength and hypertrophy.",
			"Include both quad-dominant (sissy squats, leg press) and hip-dominant (RDLs, good mornings) work.",
			"Never skip hamstring and adductor work — imbalances cause injury and joint pain.",
		],
		mistakes: [
			{
				title: "Partial range of motion on squats",
				detail:
					"Limits quad and glute development. Squat deep (below parallel) when safe to do so.",
			},
			{
				title: "Quad-only training",
				detail:
					"Ignoring glutes and hamstrings creates muscle imbalances and knee overuse injuries.",
			},
			{
				title: "Training legs only once per week",
				detail:
					"Optimal leg growth requires 2+ sessions per week with different foci.",
			},
			{
				title: "Skipping heavy deadlifts or squats",
				detail:
					"Light-only work limits strength and muscle-building potential. Use substantial load.",
			},
			{
				title: "Forgetting lower leg training",
				detail:
					"The calves and shins need direct work — 2–3 sets of calf raises/flexion per week.",
			},
		],
		objectPosition: "center",
	},
	shoulders: {
		heroImage:
			"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1800&q=80",
		description:
			"The shoulders (deltoids) drive upper body strength and aesthetics, featuring three heads that each require targeted work. Healthy shoulders are built through balanced pressing and rowing.",
		stats: {
			difficultyRange: "Beginner – Advanced",
			equipment: "Barbell · Dumbbell · Cable · Machine",
		},
		muscleOverview: {
			primary: [
				{
					name: "Anterior Deltoid",
					function: "Front shoulder — arm flexion and internal rotation",
				},
				{
					name: "Lateral Deltoid",
					function: "Shoulder abduction — creates the 3D shoulder width",
				},
				{
					name: "Posterior Deltoid",
					function: "Rear shoulder — arm extension and external rotation",
				},
			],
			secondary: [
				{
					name: "Trapezius",
					function:
						"Upper back — assists in overhead pressing and shrug movements",
				},
				{
					name: "Rotator Cuff",
					function:
						"Stabiliser muscles — prevent injury and improve shoulder stability",
				},
				{
					name: "Supraspinatus & Infraspinatus",
					function:
						"Upper back stabilisers — maintain shoulder joint integrity",
				},
			],
		},
		tips: [
			"Train all three deltoid heads each session — anterior, lateral, and posterior.",
			"Use lighter weight and higher reps on lateral raises to isolate the side delts.",
			"Include horizontal rows to balance pressing and strengthen rear delts.",
			"Maintain scapular control during overhead pressing — avoid excessive arching.",
			"Prioritise shoulder health — perform rotator cuff work 2–3× per week.",
		],
		mistakes: [
			{
				title: "Pressing heavy with poor shoulder mobility",
				detail:
					"Leads to impingement and pain. Improve mobility before lifting heavy overhead.",
			},
			{
				title: "Over-training anterior delts",
				detail:
					"Neglecting rear delts creates imbalance and poor posture. Use 2:1 ratio of rear to front work.",
			},
			{
				title: "Shrugging during overhead press",
				detail:
					"Reduces shoulder joint stability and increases injury risk. Keep traps relaxed.",
			},
			{
				title: "Skipping lateral raise work",
				detail:
					"Only pressing won't build shoulder width. Add 1–2 isolation exercises per session.",
			},
			{
				title: "Ignoring rotator cuff training",
				detail:
					"Leads to chronic shoulder issues and tendinitis. Do 5–10 mins of band work weekly.",
			},
		],
		objectPosition: "center",
	},
	arms: {
		heroImage:
			"https://images.unsplash.com/photo-1683586861092-596182a95463?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFybXMlMjBleGVyY2lzZXxlbnwwfHwwfHx8MA%3D%3D",
		description:
			"The arms (biceps and triceps) are smaller muscles but respond well to direct training. Building big arms requires heavy compound work plus isolating each head of the triceps.",
		stats: {
			difficultyRange: "Beginner – Advanced",
			equipment: "Barbell · Dumbbell · Cable · Machine",
		},
		muscleOverview: {
			primary: [
				{
					name: "Biceps Brachii",
					function:
						"Elbow flexion, supination — arm curling, pulling movements",
				},
				{
					name: "Triceps Brachii",
					function:
						"Elbow extension — three heads require different angles for full development",
				},
			],
			secondary: [
				{
					name: "Brachialis",
					function:
						"Under the biceps — increases arm circumference and strength",
				},
				{
					name: "Forearm Flexors & Extensors",
					function:
						"Wrist and grip strength — critical for pulling and compound lifts",
				},
				{
					name: "Brachioradialis",
					function:
						"Forearm prominence — visible when developed with hammer curls",
				},
			],
		},
		tips: [
			"Build arm size with compound work first (rows, dips, presses) before isolation.",
			"Train triceps 2–3× per week and biceps 2× per week for optimal arm growth.",
			"Use multiple angles — flat, incline, and decline — to hit all triceps heads.",
			"Squeeze hard at the top of each curl and press — time under tension matters.",
			"Include hammer curls and reverse curls to build the brachialis and forearm.",
		],
		mistakes: [
			{
				title: "Overemphasising bicep curls",
				detail:
					"Triceps make up 2/3 of arm mass. Prioritise tricep work and heavy compound pushing.",
			},
			{
				title: "Using momentum on curls",
				detail:
					"Momentum reduces tension and limits growth. Use controlled tempos with appropriate weight.",
			},
			{
				title: "Poor mind-muscle connection",
				detail:
					"Maintain constant tension and feel the muscle working. Don't just move the weight.",
			},
			{
				title: "Insufficient training frequency",
				detail:
					"Arms need frequent stimulation. Train arms with dedicated sessions 2–3× per week.",
			},
			{
				title: "Neglecting the brachialis",
				detail:
					"Developing the brachialis pushes the biceps up and increases arm circumference. Use hammer curls.",
			},
		],
		objectPosition: "center",
	},
	core: {
		heroImage:
			"https://plus.unsplash.com/premium_photo-1733328015522-c497d190f74b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29yZSUyMGV4ZXJjaXNlfGVufDB8fDB8fHww",
		description:
			"The core stabilises the spine and transfers force between upper and lower body. Functional core training improves athletic performance, injury prevention, and posture.",
		stats: {
			difficultyRange: "Beginner – Advanced",
			equipment: "Barbell · Dumbbell · Cable · Machine · Bodyweight",
		},
		muscleOverview: {
			primary: [
				{
					name: "Rectus Abdominis",
					function:
						"Spinal flexion — the six-pack muscle responsible for trunk flexion",
				},
				{
					name: "External Obliques",
					function:
						"Lateral flexion and rotation — sides of the core, trunk rotation strength",
				},
				{
					name: "Transverse Abdominis",
					function:
						"Deep core, spinal stability — critical for injury prevention",
				},
			],
			secondary: [
				{
					name: "Erector Spinae",
					function:
						"Spinal extension — posterior chain and lower back stabilisation",
				},
				{
					name: "Quadratus Lumborum",
					function:
						"Deep lateral stabiliser — protects lower back during movement",
				},
				{
					name: "Serratus Anterior",
					function: "Lower ribcage — scapular stability and breath pattern",
				},
			],
		},
		tips: [
			"Core work isn't just ab exercises — heavy squats and deadlifts build core strength.",
			"Include anti-rotation work (Pallof presses) and anti-extension work (ab wheel) for balance.",
			"Breathe properly during heavy lifts — brace your core against the weight.",
			"Train the core 2–3× per week with varied movements and loading angles.",
			"Direct ab work (crunches, decline sits) is unnecessary — compound movements build sufficient size.",
		],
		mistakes: [
			{
				title: "Doing only crunches and sit-ups",
				detail:
					"One-directional flexion is incomplete. Include rotation, anti-rotation, and stability work.",
			},
			{
				title: "Training core in isolation",
				detail:
					"Heavy compound lifts (squats, deadlifts, overhead press) are superior for core development.",
			},
			{
				title: "Poor breathing and bracing",
				detail:
					"Holding your breath during heavy lifts creates core stability. Learn proper breathing patterns.",
			},
			{
				title: "Only doing front-side work",
				detail:
					"Neglecting erector spinae and posterior chain creates imbalance and lower back pain.",
			},
			{
				title: "Excessive spinal flexion",
				detail:
					"Too many crunches strain the lumbar spine. Prioritise anti-extension and stability.",
			},
		],
		objectPosition: "center",
	},
	cardio: {
		heroImage:
			"https://images.unsplash.com/photo-1599552683573-9dc48255fe85?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyZGlvJTIwZXhlcmNpc2V8ZW58MHx8MHx8fDA%3D",
		description:
			"Cardiovascular training strengthens the heart and lungs, improves work capacity, aids recovery, and supports overall health. Strategic cardio complements resistance training without compromising muscle.",
		stats: {
			difficultyRange: "Beginner – Advanced",
			equipment: "Treadmill · Bike · Rower · Stair Machine · Swimming",
		},
		muscleOverview: {
			primary: [
				{
					name: "Heart Muscle (Myocardium)",
					function: "Increases cardiac output and oxygen delivery to muscles",
				},
				{
					name: "Lungs & Aerobic System",
					function:
						"Improves oxygen utilisation and work capacity at all intensities",
				},
				{
					name: "Mitochondria",
					function:
						"Energy production — sustained aerobic activity builds mitochondrial density",
				},
			],
			secondary: [
				{
					name: "Leg Muscles (during running/cycling)",
					function:
						"Quads, hamstrings, and calves engage in cyclic movement patterns",
				},
				{
					name: "Core Stabilisers",
					function:
						"Spinal stability and posture maintenance during sustained effort",
				},
				{
					name: "Upper Body",
					function:
						"Engages in rowing and swimming — full-body work depending on modality",
				},
			],
		},
		tips: [
			"Use steady-state cardio (Zone 2) 2–3× per week for aerobic base without muscle loss.",
			"Include 1–2 high-intensity interval sessions weekly for cardiovascular adaptations.",
			"Taper cardio volume when prioritising strength or muscle gain — prioritise resistance training.",
			"Choose modalities that match your training goal: rowing builds power, running builds endurance.",
			"Consistency beats intensity — sustainable weekly cardio outperforms sporadic all-out efforts.",
		],
		mistakes: [
			{
				title: "Doing too much cardio while building muscle",
				detail:
					"Excessive cardio burns calories and interferes with muscle growth. Keep to 2–3 sessions weekly.",
			},
			{
				title: "Only doing high-intensity work",
				detail:
					"HIIT isn't a replacement for steady cardio. Build aerobic base with Zone 2 training.",
			},
			{
				title: "Ignoring recovery after intense cardio",
				detail:
					"Combine cardio with strength training carefully. Schedule sessions to allow recovery.",
			},
			{
				title: "Poor exercise selection for goals",
				detail:
					"Uphill treadmill walking preserves muscle; long-distance running can cause muscle loss.",
			},
			{
				title: "Neglecting proper fuelling and hydration",
				detail:
					"Cardio depletes glycogen. Eat adequately before and after intense sessions.",
			},
		],
		objectPosition: "center",
	},
}

/* ─── helpers ─── */
const ALL = "All"

// bodyPart key used in workoutExerciseData vs the URL param
const muscleToBodyPart = {
	chest: "chest",
	back: "back",
	legs: "upper legs",
	shoulders: "shoulders",
	arms: "upper arms",
	core: "waist",
	cardio: "cardio",
}

const difficultyColor = {
	beginner: "bg-green-500/15 text-green-400",
	intermediate: "bg-amber-500/15 text-amber-400",
	expert: "bg-red-500/15 text-red-400",
}

/* ────────────────────────────────── component ──────────────────────────────── */

function HandbookExerciseMusclePage() {
	const { muscle } = useParams()
	const muscleKey = muscle?.toLowerCase()
	const current = handbookExerciseData[muscleKey]
	const meta = MUSCLE_META[muscleKey] ?? null

	const [equipFilter, setEquipFilter] = useState(ALL)
	const [diffFilter, setDiffFilter] = useState(ALL)
	const [typeFilter, setTypeFilter] = useState(ALL)
	const [selectedExercise, setSelectedExercise] = useState(null)

	// Pull exercises from the library, falling back to handbook data
	const bodyPartKey = muscleToBodyPart[muscleKey] ?? muscleKey
	const exercises = useMemo(
		() =>
			(workoutExerciseData.data ?? []).filter((e) =>
				e.bodyParts?.some(
					(bp) => bp.toLowerCase() === bodyPartKey.toLowerCase(),
				),
			),
		[bodyPartKey],
	)

	const equipOptions = useMemo(
		() => [ALL, ...new Set(exercises.flatMap((e) => e.equipments ?? []))],
		[exercises],
	)
	const diffOptions = useMemo(
		() => [ALL, ...new Set(exercises.map((e) => e.difficulty).filter(Boolean))],
		[exercises],
	)
	const typeOptions = useMemo(
		() => [ALL, ...new Set(exercises.flatMap((e) => e.exerciseTypes ?? []))],
		[exercises],
	)

	const filtered = useMemo(() => {
		return exercises.filter((e) => {
			const matchEquip =
				equipFilter === ALL || (e.equipments ?? []).includes(equipFilter)
			const matchDiff = diffFilter === ALL || e.difficulty === diffFilter
			const matchType =
				typeFilter === ALL || (e.exerciseTypes ?? []).includes(typeFilter)
			return matchEquip && matchDiff && matchType
		})
	}, [exercises, equipFilter, diffFilter, typeFilter])

	const hasActiveFilters =
		equipFilter !== ALL || diffFilter !== ALL || typeFilter !== ALL

	const clearFilters = useCallback(() => {
		setEquipFilter(ALL)
		setDiffFilter(ALL)
		setTypeFilter(ALL)
	}, [])

	const handleOpenExercise = useCallback(
		(id) => {
			const ex = exercises.find((e) => e.exerciseId === id)
			if (ex) setSelectedExercise(ex)
		},
		[exercises],
	)

	/* ── not found ── */
	if (!current) {
		return (
			<AppPageFrame>
				<div className="bg-[hsl(var(--bg))] text-[hsl(var(--fg))] px-4 py-12 sm:px-6 lg:px-8">
					<div className="card p-8 max-w-lg mx-auto text-center space-y-4">
						<h1 className="text-2xl font-bold">Muscle group not found</h1>
						<p className="text-[hsl(var(--muted))]">
							This muscle group is not available yet.
						</p>
						<Link
							to="/handbook/exercises"
							className="btn btn-primary rounded-xl px-5 py-2.5 inline-flex">
							Back to Exercises
						</Link>
					</div>
				</div>
			</AppPageFrame>
		)
	}

	return (
		<AppPageFrame>
			<div className="bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
				{/* ═══════════ HERO ═══════════ */}
				<section className="relative min-h-[420px] sm:min-h-[480px] overflow-hidden flex items-end">
					<div className="absolute inset-0">
						<img
							src={
								meta?.heroImage ??
								"https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1800&q=80"
							}
							alt={`${current.title} training`}
							className={`h-full w-full object-cover ${
								meta?.objectPosition === "bottom"
									? "object-bottom"
									: "object-center"
							}`}
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--bg))] via-[hsl(var(--bg))]/70 to-transparent" />
						<div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--bg))]/60 to-transparent" />
					</div>

					<div className="relative z-10 w-full px-4 pb-10 pt-6 sm:px-6 lg:px-8">
						<Link
							to="/handbook/exercises"
							className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))]/70 bg-[hsl(var(--surface))]/70 px-3.5 py-1.5 text-sm font-medium text-[hsl(var(--muted))] backdrop-blur-sm transition hover:border-[hsl(var(--primary))]/40 hover:text-[hsl(var(--fg))]">
							<ArrowLeft className="h-4 w-4" />
							All Exercises
						</Link>

						<div className="max-w-3xl space-y-4">
							<div>
								<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--primary))]">
									Muscle Group
								</p>
								<h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
									{current.title}
								</h1>
								<div className="mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/30" />
							</div>

							{meta && (
								<p className="max-w-xl text-base leading-relaxed text-[hsl(var(--muted))] sm:text-lg">
									{meta.description}
								</p>
							)}

							<div className="flex flex-wrap gap-3 pt-1">
								<StatBadge
									icon={<Dumbbell className="h-3.5 w-3.5" />}
									label={`${exercises.length} exercises`}
								/>
								{meta && (
									<>
										<StatBadge
											icon={<BarChart2 className="h-3.5 w-3.5" />}
											label={meta.stats.difficultyRange}
										/>
										<StatBadge
											icon={<Activity className="h-3.5 w-3.5" />}
											label={meta.stats.equipment}
										/>
									</>
								)}
							</div>
						</div>
					</div>
				</section>

				{/* ═══════════ MAIN CONTENT ═══════════ */}
				<div className="px-4 py-10 sm:px-6 lg:px-8 space-y-14 max-w-5xl mx-auto">
					{/* Filter chips + Grid */}
					<section className="space-y-5">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
							<SectionHeader
								icon={<Filter className="h-5 w-5" />}
								title="All Exercises"
							/>
							{hasActiveFilters && (
								<button
									type="button"
									onClick={clearFilters}
									className="text-xs text-[hsl(var(--primary))] hover:underline self-start sm:self-auto">
									Clear all filters
								</button>
							)}
						</div>

						<div className="space-y-2.5">
							<FilterRow
								label="Equipment"
								options={equipOptions}
								active={equipFilter}
								onChange={setEquipFilter}
							/>
							<FilterRow
								label="Difficulty"
								options={diffOptions}
								active={diffFilter}
								onChange={setDiffFilter}
							/>
							<FilterRow
								label="Type"
								options={typeOptions}
								active={typeFilter}
								onChange={setTypeFilter}
							/>
						</div>

						<p className="text-sm text-[hsl(var(--muted))]">
							{filtered.length}{" "}
							{filtered.length === 1 ? "exercise" : "exercises"}
							{hasActiveFilters ? " match your filters" : ""}
						</p>

						<AnimatePresence mode="popLayout">
							{filtered.length > 0 ? (
								<motion.div
									layout
									className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
									{filtered.map((ex) => (
										<motion.div
											key={ex.exerciseId}
											layout
											initial={{ opacity: 0, scale: 0.97 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.97 }}
											transition={{ duration: 0.18 }}>
											<ExerciseGridCard
												exercise={ex}
												onClick={() => handleOpenExercise(ex.exerciseId)}
											/>
										</motion.div>
									))}
								</motion.div>
							) : (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-10 text-center space-y-3">
									<p className="text-lg font-semibold">No exercises found</p>
									<p className="text-sm text-[hsl(var(--muted))]">
										Try adjusting your filters or search query.
									</p>
									<button
										type="button"
										onClick={clearFilters}
										className="mt-2 rounded-xl border border-[hsl(var(--border))] px-4 py-2 text-sm transition hover:border-[hsl(var(--primary))]/45">
										Clear filters
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</section>

					{/* Muscle Overview — below the grid */}
					{meta?.muscleOverview && (
						<section className="space-y-5">
							<SectionHeader
								icon={<Activity className="h-5 w-5" />}
								title="Muscle Overview"
							/>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface))] p-5 space-y-3">
									<p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">
										Primary Muscles
									</p>
									<div className="space-y-3">
										{meta.muscleOverview.primary.map((m) => (
											<div key={m.name}>
												<p className="font-semibold text-sm">{m.name}</p>
												<p className="text-xs text-[hsl(var(--muted))] mt-0.5">
													{m.function}
												</p>
											</div>
										))}
									</div>
								</div>
								<div className="rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface))] p-5 space-y-3">
									<p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted))]">
										Secondary / Synergists
									</p>
									<div className="space-y-3">
										{meta.muscleOverview.secondary.map((m) => (
											<div key={m.name}>
												<p className="font-semibold text-sm">{m.name}</p>
												<p className="text-xs text-[hsl(var(--muted))] mt-0.5">
													{m.function}
												</p>
											</div>
										))}
									</div>
								</div>
							</div>
							{/* anatomy visual */}
							<div className="rounded-2xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--surface))]/60 p-5">
								<p className="mb-4 text-sm font-semibold text-[hsl(var(--muted))]">
									Anatomy at a glance
								</p>
								<div className="flex flex-wrap gap-2">
									{[
										...meta.muscleOverview.primary.map((m) => ({
											name: m.name,
											primary: true,
										})),
										...meta.muscleOverview.secondary.map((m) => ({
											name: m.name,
											primary: false,
										})),
									].map((m) => (
										<span
											key={m.name}
											className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
												m.primary
													? "bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/25"
													: "bg-[hsl(var(--surface))] border border-[hsl(var(--border))]/70 text-[hsl(var(--muted))]"
											}`}>
											<span
												className={`h-1.5 w-1.5 rounded-full ${m.primary ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--muted))]"}`}
											/>
											{m.name}
										</span>
									))}
								</div>
								<div className="mt-3 flex gap-4 text-xs text-[hsl(var(--muted))]">
									<span className="flex items-center gap-1.5">
										<span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
										Primary
									</span>
									<span className="flex items-center gap-1.5">
										<span className="h-2 w-2 rounded-full bg-[hsl(var(--muted))]/60" />
										Secondary
									</span>
								</div>
							</div>
						</section>
					)}

					{/* Training Tips */}
					{meta?.tips && (
						<section className="space-y-5">
							<SectionHeader
								icon={<Lightbulb className="h-5 w-5" />}
								title={`${current.title} Training Tips`}
							/>
							<div className="rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface))] divide-y divide-[hsl(var(--border))]/40">
								{meta.tips.map((tip, i) => (
									<div key={i} className="flex gap-4 p-4 sm:p-5">
										<span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))]/15 text-xs font-bold text-[hsl(var(--primary))]">
											{i + 1}
										</span>
										<p className="text-sm leading-relaxed text-[hsl(var(--fg))]">
											{tip}
										</p>
									</div>
								))}
							</div>
						</section>
					)}

					{/* Common Mistakes */}
					{meta?.mistakes && (
						<section className="space-y-5">
							<SectionHeader
								icon={<AlertTriangle className="h-5 w-5" />}
								title="Common Mistakes"
							/>
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{meta.mistakes.map((m) => (
									<div
										key={m.title}
										className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 space-y-1.5">
										<div className="flex items-start gap-2">
											<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
											<p className="font-semibold text-sm">{m.title}</p>
										</div>
										<p className="text-xs text-[hsl(var(--muted))] leading-relaxed pl-6">
											{m.detail}
										</p>
									</div>
								))}
							</div>
						</section>
					)}

					{/* Related Articles */}
					{meta?.relatedArticles && (
						<section className="space-y-5 pb-4">
							<SectionHeader
								icon={<BookOpen className="h-5 w-5" />}
								title="Related Handbook Articles"
							/>
							<div className="grid gap-4 sm:grid-cols-3">
								{meta.relatedArticles.map((article) => (
									<Link
										key={article.slug}
										to={`/handbook/articles/${article.slug}`}
										className="group relative overflow-hidden rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface))] transition hover:border-[hsl(var(--primary))]/40 hover:shadow-lg">
										<div className="relative h-36 overflow-hidden">
											<img
												src={article.image}
												alt={article.title}
												loading="lazy"
												className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface))]/80 to-transparent" />
											<span className="absolute bottom-2 left-3 rounded-full bg-[hsl(var(--primary))]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--primary))]">
												{article.category}
											</span>
										</div>
										<div className="p-4">
											<p className="text-sm font-semibold leading-snug group-hover:text-[hsl(var(--primary))] transition-colors">
												{article.title}
											</p>
											<div className="mt-2 flex items-center gap-1 text-xs text-[hsl(var(--muted))]">
												Read article <ChevronRight className="h-3 w-3" />
											</div>
										</div>
									</Link>
								))}
							</div>
						</section>
					)}
				</div>
			</div>

			{/* ═══════════ EXERCISE DETAIL SHEET ═══════════ */}
			<AnimatePresence>
				{selectedExercise && (
					<ExerciseDetailSheet
						exercise={selectedExercise}
						onClose={() => setSelectedExercise(null)}
					/>
				)}
			</AnimatePresence>
		</AppPageFrame>
	)
}

/* ───────────────────────── sub-components ───────────────────────── */

function ExerciseDetailSheet({ exercise, onClose }) {
	const difficulty = exercise.difficulty ?? ""

	// close on Escape
	useEffect(() => {
		const handler = (e) => {
			if (e.key === "Escape") onClose()
		}
		window.addEventListener("keydown", handler)
		return () => window.removeEventListener("keydown", handler)
	}, [onClose])

	// lock body scroll while open
	useEffect(() => {
		document.body.style.overflow = "hidden"
		return () => {
			document.body.style.overflow = ""
		}
	}, [])

	return (
		<div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
			{/* backdrop */}
			<motion.div
				key="backdrop"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* sheet */}
			<motion.div
				key="sheet"
				initial={{ y: "100%", opacity: 0.6 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: "100%", opacity: 0 }}
				transition={{ type: "spring", damping: 30, stiffness: 320 }}
				className="relative z-10 w-full max-w-2xl max-h-[90dvh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-[hsl(var(--bg))] border border-[hsl(var(--border))]/60 shadow-2xl m-0 sm:m-4 overflow-hidden">
				{/* drag handle */}
				<div className="flex justify-center pt-3 pb-1 sm:hidden">
					<div className="h-1 w-10 rounded-full bg-[hsl(var(--border))]" />
				</div>

				{/* header */}
				<div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 sm:px-6 sm:pt-5 border-b border-[hsl(var(--border))]/50">
					<div className="space-y-1">
						<h2 className="text-lg font-bold capitalize leading-tight sm:text-xl">
							{exercise.name}
						</h2>
						<div className="flex flex-wrap gap-1.5">
							{difficulty && (
								<span
									className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
										difficultyColor[difficulty] ??
										"bg-[hsl(var(--surface))] text-[hsl(var(--muted))]"
									}`}>
									{difficulty}
								</span>
							)}
							{exercise.equipments?.map((eq) => (
								<span
									key={eq}
									className="rounded-full border border-[hsl(var(--border))]/60 px-2.5 py-0.5 text-xs text-[hsl(var(--muted))] capitalize">
									{eq}
								</span>
							))}
							{exercise.exerciseTypes?.map((t) => (
								<span
									key={t}
									className="rounded-full border border-[hsl(var(--border))]/60 px-2.5 py-0.5 text-xs text-[hsl(var(--muted))] capitalize">
									{t}
								</span>
							))}
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="mt-0.5 shrink-0 rounded-full p-2 text-[hsl(var(--muted))] transition hover:bg-[hsl(var(--surface))] hover:text-[hsl(var(--fg))]">
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* scrollable body */}
				<div className="overflow-y-auto flex-1 px-5 py-5 sm:px-6 space-y-6">
					{/* gif */}
					{exercise.gifUrl && (
						<div
							className="rounded-2xl overflow-hidden bg-[hsl(var(--surface))] flex items-center justify-center"
							style={{ maxHeight: 280 }}>
							<img
								src={exercise.gifUrl}
								alt={exercise.name}
								className="w-full h-full object-contain"
								style={{ maxHeight: 280 }}
							/>
						</div>
					)}

					{/* overview */}
					{exercise.overview && (
						<p className="text-sm leading-relaxed text-[hsl(var(--muted))]">
							{exercise.overview}
						</p>
					)}

					{/* muscles */}
					{(exercise.targetMuscles?.length ||
						exercise.secondaryMuscles?.length) && (
						<div className="space-y-2">
							<p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted))]">
								Muscles
							</p>
							<div className="flex flex-wrap gap-2">
								{exercise.targetMuscles?.map((m) => (
									<span
										key={m}
										className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--primary))]/15 border border-[hsl(var(--primary))]/25 px-3 py-1 text-xs font-medium text-[hsl(var(--primary))] capitalize">
										<span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
										{m}
									</span>
								))}
								{exercise.secondaryMuscles?.map((m) => (
									<span
										key={m}
										className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))]/70 bg-[hsl(var(--surface))] px-3 py-1 text-xs text-[hsl(var(--muted))] capitalize">
										<span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--muted))]/60" />
										{m}
									</span>
								))}
							</div>
							<div className="flex gap-4 text-xs text-[hsl(var(--muted))]">
								<span className="flex items-center gap-1.5">
									<span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
									Primary
								</span>
								<span className="flex items-center gap-1.5">
									<span className="h-2 w-2 rounded-full bg-[hsl(var(--muted))]/60" />
									Secondary
								</span>
							</div>
						</div>
					)}

					{/* instructions */}
					{exercise.instructions?.length > 0 && (
						<div className="space-y-3">
							<p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted))]">
								How to perform
							</p>
							<ol className="space-y-2.5">
								{exercise.instructions.map((step, i) => {
									// strip "Step:N " prefix if present
									const text = step.replace(/^Step:\d+\s*/i, "")
									return (
										<li key={i} className="flex gap-3">
											<span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))]/15 text-xs font-bold text-[hsl(var(--primary))]">
												{i + 1}
											</span>
											<p className="text-sm leading-relaxed text-[hsl(var(--fg))]">
												{text}
											</p>
										</li>
									)
								})}
							</ol>
						</div>
					)}
				</div>
			</motion.div>
		</div>
	)
}

function StatBadge({ icon, label }) {
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface))]/70 px-3 py-1.5 text-xs font-medium text-[hsl(var(--fg))] backdrop-blur-sm">
			{icon}
			{label}
		</span>
	)
}

function SectionHeader({ icon, title }) {
	return (
		<div className="flex items-center gap-2.5">
			<span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))]">
				{icon}
			</span>
			<h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
		</div>
	)
}

function FilterRow({ label, options, active, onChange }) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<span className="text-xs font-semibold text-[hsl(var(--muted))] w-20 shrink-0">
				{label}
			</span>
			{options.map((opt) => (
				<button
					key={opt}
					type="button"
					onClick={() => onChange(opt)}
					className={`rounded-full px-3 py-1 text-xs font-medium transition border ${
						active === opt
							? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white shadow-sm"
							: "border-[hsl(var(--border))]/60 bg-[hsl(var(--surface))] text-[hsl(var(--muted))] hover:border-[hsl(var(--primary))]/40 hover:text-[hsl(var(--fg))]"
					}`}>
					{opt === "All" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}
				</button>
			))}
		</div>
	)
}

function ExerciseGridCard({ exercise, onClick }) {
	const difficulty = exercise.difficulty ?? ""
	const equipment = exercise.equipments?.[0] ?? ""
	const exType = exercise.exerciseTypes?.[0] ?? ""
	return (
		<button
			type="button"
			onClick={onClick}
			className="group w-full rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface))]/70 p-4 text-left transition hover:border-[hsl(var(--primary))]/45 hover:bg-[hsl(var(--surface))] hover:shadow-md">
			{/* gif thumbnail */}
			{exercise.gifUrl && (
				<div className="relative mb-3 h-36 overflow-hidden rounded-lg bg-[hsl(var(--surface))]">
					<img
						src={exercise.gifUrl}
						alt={exercise.name}
						loading="lazy"
						className="h-full w-full object-cover object-center"
					/>
					<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-[hsl(var(--bg))]/40">
						<Play className="h-8 w-8 text-white drop-shadow" />
					</div>
				</div>
			)}
			<div className="min-w-0">
				<h3 className="font-semibold text-sm leading-tight group-hover:text-[hsl(var(--primary))] transition-colors capitalize">
					{exercise.name}
				</h3>
				<p className="mt-1 text-xs text-[hsl(var(--muted))] leading-snug line-clamp-2">
					{exercise.overview}
				</p>
				<div className="mt-2.5 flex flex-wrap items-center gap-1.5">
					{difficulty && (
						<span
							className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
								difficultyColor[difficulty] ??
								"bg-[hsl(var(--surface))] text-[hsl(var(--muted))]"
							}`}>
							{difficulty}
						</span>
					)}
					{equipment && (
						<span className="rounded-full border border-[hsl(var(--border))]/60 px-2 py-0.5 text-[10px] text-[hsl(var(--muted))] capitalize">
							{equipment}
						</span>
					)}
					{exType && (
						<span className="rounded-full border border-[hsl(var(--border))]/60 px-2 py-0.5 text-[10px] text-[hsl(var(--muted))] capitalize">
							{exType}
						</span>
					)}
					<ChevronRight className="ml-auto h-3.5 w-3.5 text-[hsl(var(--muted))] group-hover:text-[hsl(var(--primary))] transition-colors" />
				</div>
			</div>
		</button>
	)
}

export default HandbookExerciseMusclePage
