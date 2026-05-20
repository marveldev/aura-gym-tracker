import { useEffect, useMemo, useState } from "react"
import AnalyticsPanel from "../components/AnalyticsPanel.jsx"
import AppPageFrame from "../components/AppPageFrame.jsx"
import { initMockDataIfEmpty } from "../data/mockData.js"
import {
	getExerciseHistory,
	getUniqueExercises,
	getWorkouts,
} from "../services/workoutStorage.js"

function AnalyticsPage() {
	const [workouts, setWorkouts] = useState([])
	const [selectedExercise, setSelectedExercise] = useState("")
	const [isDarkTheme, setIsDarkTheme] = useState(true)

	useEffect(() => {
		initMockDataIfEmpty()
		const nextWorkouts = getWorkouts()
		setWorkouts(nextWorkouts)

		const savedTheme = localStorage.getItem("aura_theme") || "dark"
		setIsDarkTheme(savedTheme === "dark")
	}, [])

	const exercises = useMemo(() => getUniqueExercises(workouts), [workouts])

	useEffect(() => {
		if (!exercises.length) {
			setSelectedExercise("")
			return
		}

		if (!selectedExercise || !exercises.includes(selectedExercise)) {
			setSelectedExercise(exercises[0])
		}
	}, [exercises, selectedExercise])

	const history = useMemo(
		() =>
			selectedExercise ? getExerciseHistory(selectedExercise, workouts) : [],
		[selectedExercise, workouts],
	)

	return (
		<AppPageFrame>
			<div className="pb-24">
				<div className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
						Analytics
					</h1>
					<AnalyticsPanel
						exercises={exercises}
						selectedExercise={selectedExercise}
						onSelectExercise={setSelectedExercise}
						history={history}
						isDarkTheme={isDarkTheme}
					/>
				</div>
			</div>
		</AppPageFrame>
	)
}

export default AnalyticsPage
