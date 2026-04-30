import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import { formatDate } from "../utils/workoutUtils.js"

function ProgressChart({ history, isDarkTheme }) {
	const canvasRef = useRef(null)
	const chartRef = useRef(null)

	useEffect(() => {
		if (!canvasRef.current || history.length === 0) {
			return
		}

		const labels = history.map((item) => formatDate(item.date))
		const dataPoints = history.map((item) => item.maxWeight)

		const gridColor = isDarkTheme
			? "rgba(255,255,255,0.05)"
			: "rgba(0,0,0,0.05)"
		const textColor = isDarkTheme ? "#999" : "#666"
		const primaryColor = "hsl(22, 100%, 50%)"
		const primaryBg = "hsla(22, 100%, 50%, 0.1)"

		if (chartRef.current) {
			chartRef.current.destroy()
		}

		chartRef.current = new Chart(canvasRef.current, {
			type: "line",
			data: {
				labels,
				datasets: [
					{
						label: "Est. 1RM / Max Weight (lbs)",
						data: dataPoints,
						borderColor: primaryColor,
						backgroundColor: primaryBg,
						borderWidth: 3,
						pointBackgroundColor: primaryColor,
						pointBorderColor: isDarkTheme ? "#171717" : "#fff",
						pointBorderWidth: 2,
						pointRadius: 5,
						pointHoverRadius: 7,
						fill: true,
						tension: 0.4,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: isDarkTheme ? "#171717" : "#fff",
						titleColor: isDarkTheme ? "#fff" : "#000",
						bodyColor: isDarkTheme ? "#999" : "#666",
						borderColor: isDarkTheme ? "#262626" : "#e5e5e5",
						borderWidth: 1,
						padding: 12,
						displayColors: false,
					},
				},
				scales: {
					x: {
						grid: { display: false, drawBorder: false },
						ticks: { color: textColor, font: { family: "Inter" } },
					},
					y: {
						grid: { color: gridColor, drawBorder: false },
						ticks: { color: textColor, font: { family: "Inter" }, padding: 10 },
					},
				},
			},
		})

		return () => {
			if (chartRef.current) {
				chartRef.current.destroy()
			}
		}
	}, [history, isDarkTheme])

	return <canvas ref={canvasRef}></canvas>
}

export default ProgressChart
