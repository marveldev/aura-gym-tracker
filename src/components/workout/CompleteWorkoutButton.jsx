import { Loader2, CheckCircle2 } from "lucide-react"

function CompleteWorkoutButton({
	onClick,
	disabled = false,
	isSaving = false,
	isSuccess = false,
	className = "",
}) {
	const isDisabled = disabled || isSaving || isSuccess

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isDisabled}
			aria-disabled={isDisabled}
			aria-busy={isSaving}
			className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
				isSuccess
					? "bg-emerald-500 text-white"
					: "bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))] hover:bg-[hsl(var(--primary-hover))]"
			} ${isDisabled ? "opacity-80 cursor-not-allowed" : "active:scale-[0.98]"} ${className}`}>
			{isSaving ? (
				<>
					<Loader2 className="h-4 w-4 animate-spin" />
					Saving...
				</>
			) : isSuccess ? (
				<>
					<CheckCircle2 className="h-4 w-4" />
					Completed
				</>
			) : (
				"Complete Workout"
			)}
		</button>
	)
}

export default CompleteWorkoutButton
