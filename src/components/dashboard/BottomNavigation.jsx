import {
	Home,
	Dumbbell,
	ChartNoAxesCombined,
	Apple,
	UserRound,
} from "lucide-react"

const tabs = [
	{ key: "home", label: "Home", icon: Home },
	{ key: "workouts", label: "Workouts", icon: Dumbbell },
	{ key: "progress", label: "Progress", icon: ChartNoAxesCombined },
	{ key: "nutrition", label: "Nutrition", icon: Apple },
	{ key: "profile", label: "Profile", icon: UserRound },
]

function BottomNavigation() {
	return (
		<nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-zinc-950/95 px-2 pb-safe backdrop-blur md:hidden">
			<div className="grid grid-cols-5 gap-1 py-2">
				{tabs.map((tab, index) => {
					const Icon = tab.icon
					const isActive = index === 0
					return (
						<button
							key={tab.key}
							className={`flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition active:scale-95 ${
								isActive ? "text-orange-400" : "text-zinc-500"
							}`}>
							<Icon className="h-4.5 w-4.5" />
							<span className="text-[10px] font-medium">{tab.label}</span>
						</button>
					)
				})}
			</div>
		</nav>
	)
}

export default BottomNavigation
