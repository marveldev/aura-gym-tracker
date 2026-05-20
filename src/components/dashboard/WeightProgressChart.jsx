import {
	LineChart,
	Line,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts"

function WeightProgressChart({ data, isLoading = false }) {
	if (isLoading) {
		return (
			<div className="h-64 animate-pulse rounded-2xl bg-[hsl(var(--border))]" />
		)
	}

	return (
		<div className="h-64 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
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
					<Line
						type="monotone"
						dataKey="weight"
						stroke="hsl(var(--primary))"
						strokeWidth={2.5}
						dot={{ fill: "hsl(var(--primary))", r: 4 }}
						activeDot={{ r: 6 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}

export default WeightProgressChart
