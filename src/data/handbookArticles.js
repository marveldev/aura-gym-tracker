import handbookArticlesJson from "./handbookArticles.json"

const fallbackCoverImage =
	"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1800&q=80"

export function getArticleImagePrompt(article) {
	const promptMap = {
		"7-day-strength-form-reset":
			"athletic gym coaching session, strength training, professional fitness photography",
		"beginners-guide-to-progressive-overload":
			"athlete adding weight plates to a barbell, modern gym",
		"nutrition-fundamentals":
			"healthy meal prep, fitness nutrition, macro-friendly foods",
		"protein-intake-explained":
			"high protein foods, chicken, eggs, greek yogurt",
		"mastering-the-squat": "athlete performing a deep barbell squat",
		"deadlift-form-guide":
			"athlete performing a deadlift with proper technique",
		"recovery-and-sleep":
			"athlete sleeping and recovering, wellness photography",
		"building-your-first-workout-plan":
			"fitness planning, workout journal, gym environment",
	}

	return (
		promptMap[article.slug] ||
		`${article.category.toLowerCase()} fitness editorial, premium gym photography`
	)
}

function getArticleImageUrl(article) {
	const imageMap = {
		"7-day-strength-form-reset":
			"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1800&q=80",
		"beginners-guide-to-progressive-overload":
			"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1800&q=80",
		"nutrition-fundamentals":
			"https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=1800&q=80",
		"protein-intake-explained":
			"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1800&q=80",
		"mastering-the-squat":
			"https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1800&q=80",
		"deadlift-form-guide":
			"https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=1800&q=80",
		"recovery-and-sleep":
			"https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1800&q=80",
		"building-your-first-workout-plan":
			"https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1800&q=80",
	}

	return article.coverImage || imageMap[article.slug] || fallbackCoverImage
}

const handbookArticles = handbookArticlesJson.map((article) => ({
	...article,
	imagePrompt: getArticleImagePrompt(article),
	coverImage: getArticleImageUrl(article),
}))

export default handbookArticles
