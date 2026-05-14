/**
 * WGER Exercise API client
 * Public API — no key required.
 * Docs: https://wger.de/en-gb/software/api
 */

const BASE_URL = "https://wger.de/api/v2"
const CACHE_PREFIX = "aura_wger_"
const IMAGE_CACHE_PREFIX = "aura_wger_img_"
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WgerMuscle {
	id: number
	name: string
	name_en: string
	is_front: boolean
}

export interface WgerEquipment {
	id: number
	name: string
}

export interface WgerCategory {
	id: number
	name: string
}

export interface WgerImage {
	id: number
	uuid: string
	exercise_base: number
	exercise?: number
	image: string // absolute URL
	is_main: boolean
	status: string
	style: string
}

export interface WgerTranslation {
	id: number
	name: string
	description: string
	language: number
}

export interface WgerExerciseInfo {
	id: number
	uuid: string
	category: WgerCategory
	muscles: WgerMuscle[]
	muscles_secondary: WgerMuscle[]
	equipment: WgerEquipment[]
	images: WgerImage[]
	translations: WgerTranslation[]
}

/** Simplified shape exposed to the rest of the app */
export interface WgerExercise {
	id: number
	name: string
	category: string
	muscles: string
	musclesSecondary: string
	equipment: string
	imageUrl: string
	allImageUrls: string[]
}

// ---------------------------------------------------------------------------
// Name mapping  (local title-case → WGER query string)
// ---------------------------------------------------------------------------

const NAME_MAP: Record<string, string> = {
	"jump squat": "jump squat",
	burpees: "burpee",
	"mountain climbers": "mountain climber",
	"bench press": "bench press",
	"incline bench press": "incline bench press",
	"decline bench press": "decline bench press",
	"dumbbell bench press": "dumbbell bench press",
	"incline dumbbell press": "incline dumbbell press",
	"chest fly (dumbbell)": "dumbbell flyes",
	"cable fly": "cable crossover flyes",
	"push-up": "push-up",
	"push up": "push-up",
	"overhead press": "overhead press",
	"dumbbell shoulder press": "dumbbell shoulder press",
	"lateral raise": "side raise",
	"front raise": "front raise",
	"face pull": "face pull",
	"upright row": "upright row",
	"pull-up": "pull-up",
	"chin-up": "chin-up",
	"lat pulldown": "lat pulldown",
	"seated cable row": "seated row",
	"bent over row": "bent over row",
	"dumbbell row": "one-arm dumbbell row",
	deadlift: "deadlift",
	"romanian deadlift": "romanian deadlift",
	squat: "barbell squat",
	"goblet squat": "goblet squat",
	"leg press": "leg press",
	"leg extension": "leg extension",
	"leg curl": "leg curl",
	lunge: "lunge",
	"dumbbell lunge": "dumbbell lunge",
	"calf raise": "calf raise",
	"seated calf raise": "seated calf raise",
	"bicep curl": "barbell curl",
	"dumbbell curl": "dumbbell curl",
	"hammer curl": "hammer curl",
	"preacher curl": "preacher curl",
	"tricep pushdown": "triceps pushdown",
	"skull crusher": "skull crusher",
	"overhead tricep extension": "triceps extension",
	dips: "dips",
	plank: "plank",
	crunch: "crunch",
	"sit-up": "sit-up",
	"mountain climber": "mountain climber",
	"bicycle crunch": "bicycle crunch",
	"russian twist": "russian twist",
	"hip thrust": "hip thrust",
	"glute bridge": "glute bridge",
}

const normalizeExerciseName = (name: string): string =>
	name
		.trim()
		.toLowerCase()
		.replace(/[()]/g, "")
		.replace(/\s+/g, " ")

const buildSearchVariants = (name: string): string[] => {
	const normalized = normalizeExerciseName(name)
	if (!normalized) return []

	const variants = new Set<string>()
	variants.add(normalized)

	const mapped = NAME_MAP[normalized]
	if (mapped) variants.add(mapped)

	if (normalized.endsWith("ies") && normalized.length > 3) {
		const singular = `${normalized.slice(0, -3)}y`
		variants.add(singular)
		const singularMapped = NAME_MAP[singular]
		if (singularMapped) variants.add(singularMapped)
	}

	if (normalized.endsWith("s") && !normalized.endsWith("ss")) {
		const singular = normalized.slice(0, -1)
		variants.add(singular)
		const singularMapped = NAME_MAP[singular]
		if (singularMapped) variants.add(singularMapped)
	}

	return [...variants]
}

const resolveQuery = (name: string): string => {
	const normalized = normalizeExerciseName(name)
	return NAME_MAP[normalized] ?? normalized
}

// ---------------------------------------------------------------------------
// Cache helpers
// ---------------------------------------------------------------------------

type CacheEntry = { storedAt: number; value: WgerExercise }
type ImageCacheEntry = { storedAt: number; value: string | null }

const cacheKey = (query: string) =>
	`${CACHE_PREFIX}${query.trim().toLowerCase()}`

const imageCacheKey = (key: string) =>
	`${IMAGE_CACHE_PREFIX}${key.trim().toLowerCase()}`

const readCache = (query: string): WgerExercise | null => {
	if (typeof window === "undefined") return null
	const raw = window.localStorage.getItem(cacheKey(query))
	if (!raw) return null
	try {
		const entry: CacheEntry = JSON.parse(raw)
		if (Date.now() - entry.storedAt > CACHE_TTL_MS) {
			window.localStorage.removeItem(cacheKey(query))
			return null
		}
		return entry.value
	} catch {
		window.localStorage.removeItem(cacheKey(query))
		return null
	}
}

const writeCache = (query: string, value: WgerExercise) => {
	if (typeof window === "undefined") return
	const entry: CacheEntry = { storedAt: Date.now(), value }
	window.localStorage.setItem(cacheKey(query), JSON.stringify(entry))
}

const readImageCache = (key: string): string | null | undefined => {
	if (typeof window === "undefined") return undefined
	const raw = window.localStorage.getItem(imageCacheKey(key))
	if (!raw) return undefined
	try {
		const entry: ImageCacheEntry = JSON.parse(raw)
		if (Date.now() - entry.storedAt > CACHE_TTL_MS) {
			window.localStorage.removeItem(imageCacheKey(key))
			return undefined
		}
		return entry.value
	} catch {
		window.localStorage.removeItem(imageCacheKey(key))
		return undefined
	}
}

const writeImageCache = (key: string, value: string | null) => {
	if (typeof window === "undefined") return
	const entry: ImageCacheEntry = { storedAt: Date.now(), value }
	window.localStorage.setItem(imageCacheKey(key), JSON.stringify(entry))
}

// ---------------------------------------------------------------------------
// Shape converters
// ---------------------------------------------------------------------------

const joinNames = (items: { name: string; name_en?: string }[]): string =>
	items
		.map((m) => ("name_en" in m && m.name_en ? m.name_en : m.name))
		.filter(Boolean)
		.join(", ") || "—"

const cleanEquipment = (name: string): string =>
	name.replace(/\(.*?\)/g, "").trim()

const toHttps = (url: string): string => {
	if (!url) return ""
	if (url.startsWith("//")) return `https:${url}`
	return url
}

const toWgerExercise = (
	raw: WgerExerciseInfo,
	queryName: string,
): WgerExercise => {
	// Prefer the English translation that best matches our query
	const enTranslation =
		raw.translations.find(
			(t) =>
				t.language === 2 &&
				t.name.toLowerCase().includes(queryName.split(" ")[0]),
		) ||
		raw.translations.find((t) => t.language === 2) ||
		raw.translations[0]

	const mainImage =
		raw.images.find((img) => img.is_main) ?? raw.images[0] ?? null

	return {
		id: raw.id,
		name: enTranslation?.name ?? queryName,
		category: raw.category?.name ?? "—",
		muscles: joinNames(raw.muscles),
		musclesSecondary: joinNames(raw.muscles_secondary),
		equipment:
			raw.equipment.map((e) => cleanEquipment(e.name)).join(", ") ||
			"Bodyweight",
		imageUrl: toHttps(mainImage?.image ?? ""),
		allImageUrls: raw.images.map((img) => toHttps(img.image)),
	}
}

type WgerImageListResponse =
	| { count: number; results: WgerImage[] }
	| WgerImage[]

const normalizeImageResults = (data: WgerImageListResponse): WgerImage[] => {
	if (Array.isArray(data)) return data
	return Array.isArray(data.results) ? data.results : []
}

const fetchExerciseImagesById = async (
	exerciseId: number,
): Promise<WgerImage[]> => {
	const params = new URLSearchParams({
		format: "json",
		exercise_base: String(exerciseId),
	})

	const response = await fetch(
		`${BASE_URL}/exerciseimage/?${params.toString()}`,
	)
	if (!response.ok) {
		throw new Error(`WGER API error ${response.status}: ${response.statusText}`)
	}

	const data: WgerImageListResponse = await response.json()
	const images = normalizeImageResults(data)

	if (images.length) return images

	const fallbackParams = new URLSearchParams({
		format: "json",
		exercise: String(exerciseId),
	})
	const fallbackResponse = await fetch(
		`${BASE_URL}/exerciseimage/?${fallbackParams.toString()}`,
	)
	if (!fallbackResponse.ok) {
		throw new Error(
			`WGER API error ${fallbackResponse.status}: ${fallbackResponse.statusText}`,
		)
	}

	const fallbackData: WgerImageListResponse = await fallbackResponse.json()
	return normalizeImageResults(fallbackData)
}

const pickImageUrl = (images: WgerImage[]): string => {
	if (!images.length) return ""
	const preferred = images.find((img) => img.is_main) ?? images[0]
	return toHttps(preferred.image)
}

export const getExerciseImageFromApi = async ({
	exerciseId,
	exerciseName,
}: {
	exerciseId?: number
	exerciseName?: string
}): Promise<string> => {
	const normalizedName = normalizeExerciseName(exerciseName ?? "")
	const lookupKey = `${exerciseId ?? "none"}:${normalizedName || "none"}`
	const cached = readImageCache(lookupKey)
	if (cached !== undefined) {
		console.log(
			`[WGER:image] Matched (cache) "${exerciseName ?? "unknown"}" -> "${cached ?? "fallback"}"`,
		)
		return cached ?? ""
	}

	let resolvedExerciseId = exerciseId
	if (!resolvedExerciseId && normalizedName) {
		const variants = buildSearchVariants(normalizedName)
		for (const variant of variants) {
			const byName = await getExerciseByName(variant)
			if (byName?.id) {
				resolvedExerciseId = byName.id
				break
			}
		}
	}

	if (!resolvedExerciseId) {
		writeImageCache(lookupKey, null)
		console.log(
			`[WGER:image] Matched "${exerciseName ?? "unknown"}" -> "fallback"`,
		)
		return ""
	}

	const images = await fetchExerciseImagesById(resolvedExerciseId)
	const imageUrl = pickImageUrl(images)

	writeImageCache(lookupKey, imageUrl || null)
	if (normalizedName) {
		writeImageCache(`none:${normalizedName}`, imageUrl || null)
	}

	console.log(
		`[WGER:image] Matched "${exerciseName ?? "unknown"}" -> "${imageUrl || "fallback"}"`,
	)

	return imageUrl
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const getExerciseByName = async (
	exerciseName: string,
): Promise<WgerExercise | null> => {
	const queryName = resolveQuery(exerciseName)
	console.log(`[WGER] Fetching: "${exerciseName}" → query: "${queryName}"`)

	const cached = readCache(queryName)
	if (cached) {
		console.log(`[WGER] Cache hit for "${queryName}"`, cached)
		return cached
	}

	const url = `${BASE_URL}/exerciseinfo/?format=json&language=2&name=${encodeURIComponent(queryName)}`
	console.log(`[WGER] GET ${url}`)

	const response = await fetch(url)
	console.log(`[WGER] Response status: ${response.status}`)

	if (!response.ok) {
		throw new Error(`WGER API error ${response.status}: ${response.statusText}`)
	}

	const data: { count: number; results: WgerExerciseInfo[] } =
		await response.json()
	console.log(`[WGER] Results count: ${data.count}`, data.results)

	if (!data.results.length) {
		console.warn(`[WGER] No results for "${queryName}"`)
		return null
	}

	// Pick the result whose English translation name is the closest match
	const sorted = [...data.results].sort((a, b) => {
		const nameA =
			a.translations.find((t) => t.language === 2)?.name?.toLowerCase() ?? ""
		const nameB =
			b.translations.find((t) => t.language === 2)?.name?.toLowerCase() ?? ""
		const scoreA = nameA === queryName ? 2 : nameA.includes(queryName) ? 1 : 0
		const scoreB = nameB === queryName ? 2 : nameB.includes(queryName) ? 1 : 0
		return scoreB - scoreA
	})

	const exercise = toWgerExercise(sorted[0], queryName)
	console.log(`[WGER] Resolved exercise:`, exercise)
	console.log(`[WGER] imageUrl: "${exercise.imageUrl}"`)

	writeCache(queryName, exercise)
	return exercise
}

export const getExerciseImageUrl = (exercise: WgerExercise | null): string =>
	exercise?.imageUrl ?? ""

/** Clear all WGER entries from localStorage */
export const clearWgerCache = () => {
	if (typeof window === "undefined") return
	const keys: string[] = []
	for (let i = 0; i < window.localStorage.length; i++) {
		const k = window.localStorage.key(i)
		if (k?.startsWith(CACHE_PREFIX) || k?.startsWith(IMAGE_CACHE_PREFIX)) {
			keys.push(k)
		}
	}
	keys.forEach((k) => window.localStorage.removeItem(k))
	console.log(`[WGER] Cleared ${keys.length} cached entries.`)
}
