import {
	Home,
	Dumbbell,
	ChartNoAxesCombined,
	Apple,
	UserRound,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const tabs = [
	{ key: "home", label: "Home", icon: Home, to: "/dashboard" },
	{ key: "workouts", label: "Workouts", icon: Dumbbell, to: "/workout" },
	{
		key: "progress",
		label: "Progress",
		icon: ChartNoAxesCombined,
		to: "/analytics",
	},
	{ key: "nutrition", label: "Nutrition", icon: Apple, to: "/handbook/food" },
	{ key: "profile", label: "Profile", icon: UserRound, to: "/dashboard" },
]

function BottomNavigation() {
	const location = useLocation()

	return (
		<nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-zinc-950/95 px-2 pb-safe backdrop-blur md:hidden">
			<div className="grid grid-cols-5 gap-1 py-2">
				{tabs.map((tab) => {
					const Icon = tab.icon
					const isActive =
						(tab.to === "/dashboard" && location.pathname === "/dashboard") ||
						(tab.to !== "/dashboard" && location.pathname.startsWith(tab.to))
					return (
						<Link
							key={tab.key}
							to={tab.to}
							className={`flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition active:scale-95 ${
								isActive ? "text-orange-400" : "text-zinc-500"
							}`}>
							<Icon className="h-4.5 w-4.5" />
							<span className="text-[10px] font-medium">{tab.label}</span>
						</Link>
					)
				})}
			</div>
		</nav>
	)
}

export default BottomNavigation
