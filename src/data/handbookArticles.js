import handbookArticlesJson from "./handbookArticles.json"

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
	return `https://source.unsplash.com/featured/1600x900/?${encodeURIComponent(
		getArticleImagePrompt(article),
	)}`
}

const handbookArticles = handbookArticlesJson.map((article) => ({
	...article,
	imagePrompt: getArticleImagePrompt(article),
	coverImage: getArticleImageUrl(article),
}))

export default handbookArticles
