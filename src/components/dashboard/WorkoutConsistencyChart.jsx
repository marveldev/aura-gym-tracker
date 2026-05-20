import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"

function WorkoutConsistencyChart({ data, isLoading = false }) {
	if (isLoading) {
		return <div className="h-64 animate-pulse rounded-2xl bg-zinc-800" />
	}

	return (
		<div className="h-64 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					data={data}
					margin={{ left: -18, right: 8, top: 10, bottom: 4 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
					<XAxis
						dataKey="week"
						stroke="#71717a"
						tickLine={false}
						axisLine={false}
					/>
					<YAxis stroke="#71717a" tickLine={false} axisLine={false} />
					<Tooltip
						contentStyle={{
							background: "#18181b",
							border: "1px solid #3f3f46",
							borderRadius: "12px",
							color: "#e4e4e7",
						}}
					/>
					<Bar dataKey="workouts" fill="#f97316" radius={[8, 8, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}

export default WorkoutConsistencyChart
