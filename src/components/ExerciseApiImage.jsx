import { useEffect, useState } from "react"
import { getExerciseImageFromApi } from "../api/wger.ts"
import defaultIllustration from "../assets/exercises/default.svg"

function ExerciseApiImage({
	exerciseName,
	exerciseId,
	className = "",
	containerClassName = "",
}) {
	const [imageUrl, setImageUrl] = useState("")
	const [isImageLoading, setIsImageLoading] = useState(true)
	const [hasImageError, setHasImageError] = useState(false)

	useEffect(() => {
		let isMounted = true

		const loadImage = async () => {
			setIsImageLoading(true)
			setHasImageError(false)
			try {
				const url = await getExerciseImageFromApi({
					exerciseId: Number.isFinite(exerciseId)
						? Number(exerciseId)
						: undefined,
					exerciseName,
				})
				if (!isMounted) return
				setImageUrl(url)
				setHasImageError(!url)
			} catch {
				if (!isMounted) return
				setImageUrl("")
				setHasImageError(true)
			} finally {
				if (isMounted) setIsImageLoading(false)
			}
		}

		loadImage()

		return () => {
			isMounted = false
		}
	}, [exerciseId, exerciseName])

	return (
		<div
			className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] ${containerClassName}`}>
			{isImageLoading ? (
				<div className="h-full w-full animate-pulse bg-[hsl(var(--surface))]/70" />
			) : imageUrl && !hasImageError ? (
				<img
					src={imageUrl}
					alt={exerciseName || "Exercise"}
					className={`h-full w-full object-contain p-1 ${className}`}
					loading="lazy"
					onError={() => {
						setHasImageError(true)
						setImageUrl("")
					}}
				/>
			) : (
				<img
					src={defaultIllustration}
					alt={exerciseName || "Exercise"}
					className={`h-full w-full object-contain p-1 ${className}`}
					loading="lazy"
				/>
			)}
		</div>
	)
}

export default ExerciseApiImage
