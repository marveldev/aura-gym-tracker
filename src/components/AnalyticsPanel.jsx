import ProgressChart from "./ProgressChart.jsx"

function AnalyticsPanel({
	exercises,
	selectedExercise,
	onSelectExercise,
	history,
	isDarkTheme,
}) {
	return (
		<div className="animate-fade-in">
			<header className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
				<p className="text-[hsl(var(--muted))] mt-1">
					Track your progressive overload.
				</p>
			</header>

			<div className="card p-6 mb-8">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
					<h3 className="text-lg font-bold">Weight Progression</h3>
					<select
						className="input-field w-full sm:w-64"
						value={selectedExercise}
						onChange={(event) => onSelectExercise(event.target.value)}>
						{exercises.length === 0 ? (
							<option value="">No data available</option>
						) : (
							exercises.map((exercise) => (
								<option key={exercise} value={exercise}>
									{exercise}
								</option>
							))
						)}
					</select>
				</div>

				<div className="relative w-full h-[400px]">
					{history.length > 0 ? (
						<ProgressChart history={history} isDarkTheme={isDarkTheme} />
					) : (
						<div className="h-full w-full flex items-center justify-center text-[hsl(var(--muted))] text-sm">
							Select an exercise with enough history to visualize progress.
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default AnalyticsPanel
