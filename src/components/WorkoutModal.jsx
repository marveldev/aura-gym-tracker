import { useEffect, useMemo, useState } from "react"
import { generateId } from "../services/workoutStorage.js"
import { getTodayDate } from "../utils/workoutUtils.js"

const createSet = () => ({ id: generateId(), weight: "", reps: "" })
const createExercise = () => ({
	id: generateId(),
	name: "",
	sets: [createSet()],
})

const focusOptions = [
	"Chest",
	"Back",
	"Legs",
	"Shoulders",
	"Arms",
	"Core",
	"Full Body",
]

function WorkoutModal({
	isOpen,
	onClose,
	onSave,
	onError,
	initialExerciseName = "",
	initialFocus = "",
}) {
	const [date, setDate] = useState(getTodayDate())
	const [focus, setFocus] = useState("Chest")
	const [exercises, setExercises] = useState([createExercise()])

	const resetForm = () => {
		setDate(getTodayDate())
		setFocus(focusOptions.includes(initialFocus) ? initialFocus : "Chest")
		setExercises([
			{
				...createExercise(),
				name: initialExerciseName,
			},
		])
	}

	useEffect(() => {
		if (isOpen) {
			resetForm()
		}
	}, [isOpen, initialExerciseName, initialFocus])

	const canRemoveExercise = useMemo(
		() => exercises.length > 1,
		[exercises.length],
	)

	const addExercise = () => {
		setExercises((current) => [...current, createExercise()])
	}

	const removeExercise = (exerciseId) => {
		setExercises((current) =>
			current.filter((exercise) => exercise.id !== exerciseId),
		)
	}

	const updateExerciseName = (exerciseId, name) => {
		setExercises((current) =>
			current.map((exercise) =>
				exercise.id === exerciseId ? { ...exercise, name } : exercise,
			),
		)
	}

	const addSet = (exerciseId) => {
		setExercises((current) =>
			current.map((exercise) =>
				exercise.id === exerciseId
					? { ...exercise, sets: [...exercise.sets, createSet()] }
					: exercise,
			),
		)
	}

	const removeSet = (exerciseId, setId) => {
		setExercises((current) =>
			current.map((exercise) => {
				if (exercise.id !== exerciseId) {
					return exercise
				}

				return {
					...exercise,
					sets: exercise.sets.filter((set) => set.id !== setId),
				}
			}),
		)
	}

	const updateSet = (exerciseId, setId, field, value) => {
		setExercises((current) =>
			current.map((exercise) => {
				if (exercise.id !== exerciseId) {
					return exercise
				}

				return {
					...exercise,
					sets: exercise.sets.map((set) =>
						set.id === setId ? { ...set, [field]: value } : set,
					),
				}
			}),
		)
	}

	const handleSave = () => {
		if (!date || !focus) {
			onError("Please fill out Date and Focus")
			return
		}

		let hasNameValidationError = false
		const parsedExercises = exercises
			.map((exercise) => {
				const name = exercise.name.trim()
				if (!name) {
					hasNameValidationError = true
					return null
				}

				const sets = exercise.sets
					.filter((set) => set.weight !== "" && set.reps !== "")
					.map((set) => ({
						weight: parseFloat(set.weight),
						reps: parseInt(set.reps, 10),
					}))
					.filter((set) => !Number.isNaN(set.weight) && !Number.isNaN(set.reps))

				return sets.length > 0 ? { id: exercise.id, name, sets } : null
			})
			.filter(Boolean)

		if (hasNameValidationError || parsedExercises.length === 0) {
			onError("Please provide an exercise name and at least one set.")
			return
		}

		onSave({ date, focus, exercises: parsedExercises })
	}

	if (!isOpen) {
		return null
	}

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center">
			<button
				className="absolute inset-0 bg-black/60 backdrop-blur-sm modal-overlay"
				onClick={onClose}></button>

			<div className="card w-full max-w-2xl max-h-[90vh] flex flex-col relative z-10 m-4 shadow-2xl animate-slide-up">
				<div className="flex justify-between items-center p-6 border-b border-[hsl(var(--border))]">
					<h2 className="text-2xl font-bold">Log Session</h2>
					<button
						onClick={onClose}
						className="p-2 text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] transition-colors rounded-lg hover:bg-[hsl(var(--bg))]">
						<i className="ph ph-x text-xl"></i>
					</button>
				</div>

				<div className="p-6 overflow-y-auto flex-1 space-y-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div>
							<label className="label">Date</label>
							<input
								type="date"
								className="input-field"
								required
								value={date}
								onChange={(event) => setDate(event.target.value)}
							/>
						</div>

						<div>
							<label className="label">Primary Focus</label>
							<select
								className="input-field"
								required
								value={focus}
								onChange={(event) => setFocus(event.target.value)}>
								{focusOptions.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="space-y-8">
						{exercises.map((exercise) => (
							<div
								key={exercise.id}
								className="bg-[hsl(var(--bg))] border border-[hsl(var(--border))] rounded-xl p-5 exercise-block">
								<div className="flex justify-between items-center mb-4">
									<input
										type="text"
										placeholder="Exercise Name (e.g. Bench Press)"
										className="input-field font-bold text-lg bg-transparent border-none px-0 focus:ring-0 w-full ex-name"
										required
										value={exercise.name}
										onChange={(event) =>
											updateExerciseName(exercise.id, event.target.value)
										}
									/>
									<button
										type="button"
										className="text-[hsl(var(--danger))] p-2 hover:bg-[hsl(var(--danger))]/10 rounded-lg"
										onClick={() => removeExercise(exercise.id)}
										disabled={!canRemoveExercise}>
										<i className="ph ph-trash"></i>
									</button>
								</div>

								<div className="space-y-2 sets-container">
									<div className="grid grid-cols-12 gap-3 items-center text-xs font-semibold text-[hsl(var(--muted))] px-2 uppercase tracking-wider">
										<div className="col-span-2">Set</div>
										<div className="col-span-4">Weight</div>
										<div className="col-span-4">Reps</div>
										<div className="col-span-2 text-center">Action</div>
									</div>

									{exercise.sets.map((set, index) => (
										<div
											key={set.id}
											className="grid grid-cols-12 gap-3 items-center set-row group">
											<div className="col-span-2 flex justify-center">
												<span className="w-6 h-6 rounded-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] flex items-center justify-center text-xs font-bold text-[hsl(var(--muted))]">
													{index + 1}
												</span>
											</div>

											<div className="col-span-4 relative">
												<input
													type="number"
													placeholder="0"
													className="input-field set-weight"
													required
													min="0"
													step="any"
													value={set.weight}
													onChange={(event) =>
														updateSet(
															exercise.id,
															set.id,
															"weight",
															event.target.value,
														)
													}
												/>
												<span className="absolute right-3 top-2.5 text-xs text-[hsl(var(--muted))]">
													lbs
												</span>
											</div>

											<div className="col-span-4 relative">
												<input
													type="number"
													placeholder="0"
													className="input-field set-reps"
													required
													min="1"
													value={set.reps}
													onChange={(event) =>
														updateSet(
															exercise.id,
															set.id,
															"reps",
															event.target.value,
														)
													}
												/>
												<span className="absolute right-3 top-2.5 text-xs text-[hsl(var(--muted))]">
													reps
												</span>
											</div>

											<div className="col-span-2 flex justify-center">
												<button
													type="button"
													className="text-[hsl(var(--muted))] hover:text-[hsl(var(--danger))] transition-colors p-1"
													onClick={() => removeSet(exercise.id, set.id)}>
													<i className="ph ph-x"></i>
												</button>
											</div>
										</div>
									))}
								</div>

								<button
									type="button"
									className="mt-4 text-sm text-[hsl(var(--primary))] font-medium flex items-center gap-1 hover:underline"
									onClick={() => addSet(exercise.id)}>
									<i className="ph ph-plus"></i>
									Add Set
								</button>
							</div>
						))}
					</div>

					<button
						type="button"
						onClick={addExercise}
						className="w-full py-4 border-2 border-dashed border-[hsl(var(--border))] rounded-xl text-[hsl(var(--muted))] hover:text-[hsl(var(--primary))] hover:border-[hsl(var(--primary))]/50 transition-colors font-medium flex items-center justify-center gap-2">
						<i className="ph ph-plus-circle text-xl"></i>
						Add Exercise
					</button>
				</div>

				<div className="p-6 border-t border-[hsl(var(--border))] flex justify-end gap-3 bg-[hsl(var(--bg))]/50 rounded-b-2xl">
					<button className="btn btn-secondary" onClick={onClose}>
						Cancel
					</button>
					<button className="btn btn-primary" onClick={handleSave}>
						Save Workout
					</button>
				</div>
			</div>
		</div>
	)
}

export default WorkoutModal
