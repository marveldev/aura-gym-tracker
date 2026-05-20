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
		return (
			<div className="h-64 animate-pulse rounded-2xl bg-[hsl(var(--border))]" />
		)
	}

	return (
		<div className="h-64 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					data={data}
					margin={{ left: -18, right: 8, top: 10, bottom: 4 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
					<XAxis
						dataKey="week"
						stroke="hsl(var(--muted))"
						tickLine={false}
						axisLine={false}
					/>
					<YAxis stroke="hsl(var(--muted))" tickLine={false} axisLine={false} />
					<Tooltip
						contentStyle={{
							background: "hsl(var(--surface))",
							border: "1px solid hsl(var(--border))",
							borderRadius: "12px",
							color: "hsl(var(--fg))",
						}}
					/>
					<Bar
						dataKey="workouts"
						fill="hsl(var(--primary))"
						radius={[8, 8, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}

export default WorkoutConsistencyChart
