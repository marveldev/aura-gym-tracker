const ENC_BOOKMARKS_KEY = "aura_encyclopedia_bookmarks"
const ENC_RECENT_KEY = "aura_encyclopedia_recent"
const ENC_CATEGORY_KEY = "aura_encyclopedia_last_category"
const ENC_SEARCH_HISTORY_KEY = "aura_encyclopedia_search_history"

function readJsonArray(key) {
	if (typeof window === "undefined") {
		return []
	}

	try {
		const raw = window.localStorage.getItem(key)
		if (!raw) {
			return []
		}

		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

function writeJsonArray(key, value) {
	if (typeof window === "undefined") {
		return
	}

	window.localStorage.setItem(key, JSON.stringify(value))
}

export function getBookmarkedArticleIds() {
	return readJsonArray(ENC_BOOKMARKS_KEY)
}

export function toggleBookmarkedArticleId(articleId) {
	const current = getBookmarkedArticleIds()
	const next = current.includes(articleId)
		? current.filter((id) => id !== articleId)
		: [articleId, ...current]

	writeJsonArray(ENC_BOOKMARKS_KEY, next)
	return next
}

export function getRecentlyViewedArticleIds() {
	return readJsonArray(ENC_RECENT_KEY).slice(0, 5)
}

export function addRecentlyViewedArticleId(articleId) {
	const current = getRecentlyViewedArticleIds()
	const next = [articleId, ...current.filter((id) => id !== articleId)].slice(
		0,
		5,
	)
	writeJsonArray(ENC_RECENT_KEY, next)
	return next
}

export function getLastSelectedEncyclopediaCategory() {
	if (typeof window === "undefined") {
		return "All"
	}

	return window.localStorage.getItem(ENC_CATEGORY_KEY) || "All"
}

export function setLastSelectedEncyclopediaCategory(category) {
	if (typeof window === "undefined") {
		return
	}

	window.localStorage.setItem(ENC_CATEGORY_KEY, category)
}

export function getEncyclopediaSearchHistory() {
	return readJsonArray(ENC_SEARCH_HISTORY_KEY)
}

export function addToEncyclopediaSearchHistory(query) {
	const normalized = query.trim()
	if (!normalized) {
		return getEncyclopediaSearchHistory()
	}

	const current = getEncyclopediaSearchHistory()
	const next = [
		normalized,
		...current.filter(
			(item) => item.toLowerCase() !== normalized.toLowerCase(),
		),
	].slice(0, 8)

	writeJsonArray(ENC_SEARCH_HISTORY_KEY, next)
	return next
}
