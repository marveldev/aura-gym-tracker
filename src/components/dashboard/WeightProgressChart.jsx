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
		return <div className="h-64 animate-pulse rounded-2xl bg-zinc-800" />
	}

	return (
		<div className="h-64 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
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
					<Line
						type="monotone"
						dataKey="weight"
						stroke="#f97316"
						strokeWidth={2.5}
						dot={{ fill: "#fb923c", r: 4 }}
						activeDot={{ r: 6 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}

export default WeightProgressChart
