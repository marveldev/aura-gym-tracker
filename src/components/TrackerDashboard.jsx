import {
	computeWorkoutVolume,
	formatDate,
	getDateGreeting,
} from "../utils/workoutUtils.js"

function TrackerDashboard({ workouts, stats, onOpenModal, onViewHistory }) {
	const recentWorkouts = workouts.slice(0, 4)

	return (
		<div className="animate-fade-in">
			<header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0">
					<h1 className="text-3xl font-bold tracking-tight">Overview</h1>
					<p className="text-[hsl(var(--muted))] mt-1">{getDateGreeting()}</p>
				</div>
				<button
					className="btn btn-primary w-full sm:w-auto shrink-0 justify-center px-5 py-3"
					onClick={onOpenModal}>
					<i className="ph ph-plus-bold"></i>
					<span>Log Workout</span>
				</button>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
				<div className="card p-6">
					<div className="flex justify-between items-center mb-4">
						<span className="text-[hsl(var(--muted))] text-sm font-medium">
							Total Workouts
						</span>
						<div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center">
							<i className="ph ph-lightning text-[hsl(var(--primary))] text-xl"></i>
						</div>
					</div>
					<div className="text-4xl font-bold">{stats.totalWorkouts}</div>
				</div>

				<div className="card p-6">
					<div className="flex justify-between items-center mb-4">
						<span className="text-[hsl(var(--muted))] text-sm font-medium">
							Volume Load (lbs)
						</span>
						<div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center">
							<i className="ph ph-barbell text-[hsl(var(--primary))] text-xl"></i>
						</div>
					</div>
					<div className="text-4xl font-bold">
						{stats.totalVolume.toLocaleString()}
					</div>
				</div>

				<div className="card p-6">
					<div className="flex justify-between items-center mb-4">
						<span className="text-[hsl(var(--muted))] text-sm font-medium">
							Sets Completed
						</span>
						<div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center">
							<i className="ph ph-stack text-[hsl(var(--primary))] text-xl"></i>
						</div>
					</div>
					<div className="text-4xl font-bold">{stats.totalSets}</div>
				</div>
			</div>

			<div>
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-bold">Recent Activity</h2>
					<button
						className="text-[hsl(var(--primary))] text-sm font-medium hover:underline"
						onClick={onViewHistory}>
						View All
					</button>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
					{recentWorkouts.length === 0 ? (
						<div className="col-span-full text-center py-10 text-[hsl(var(--muted))]">
							No recent activity. Log a workout to start.
						</div>
					) : (
						recentWorkouts.map((workout) => (
							<button
								key={workout.id}
								className="card p-5 text-left hover:border-[hsl(var(--primary))]/50 transition-colors cursor-pointer"
								onClick={onViewHistory}>
								<div className="flex justify-between items-start mb-3">
									<div>
										<h4 className="font-bold text-lg">
											{workout.focus} Session
										</h4>
										<span className="text-xs text-[hsl(var(--muted))]">
											{formatDate(workout.date)}
										</span>
									</div>
									<span className="bg-[hsl(var(--bg))] border border-[hsl(var(--border))] text-xs px-2 py-1 rounded font-medium text-[hsl(var(--muted))]">
										{workout.exercises.length} Exercises
									</span>
								</div>
								<div className="text-sm text-[hsl(var(--muted))]">
									Volume:{" "}
									<span className="font-mono text-[hsl(var(--fg))]">
										{computeWorkoutVolume(workout).toLocaleString()} lbs
									</span>
								</div>
							</button>
						))
					)}
				</div>
			</div>
		</div>
	)
}

export default TrackerDashboard
