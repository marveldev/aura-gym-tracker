function ExerciseItem({ exercise }) {
	const setsText = exercise.sets
		.map((set) => `${set.reps}x${set.weight}`)
		.join(", ")

	return (
		<div className="text-sm border-t border-[hsl(var(--border))] py-2 flex justify-between">
			<span className="font-medium text-[hsl(var(--fg))]">{exercise.name}</span>
			<span className="font-mono text-[hsl(var(--muted))]">{setsText}</span>
		</div>
	)
}

export default ExerciseItem
