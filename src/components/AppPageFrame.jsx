import { Link, useLocation } from "react-router-dom"

const NAV_ITEMS = [
	{
		key: "dashboard",
		label: "Dashboard",
		icon: "ph-squares-four",
		to: "/dashboard",
	},
	{ key: "workout", label: "Workout", icon: "ph-barbell", to: "/workout" },
	{ key: "handbook", label: "Handbook", icon: "ph-book-open", to: "/handbook" },
	{
		key: "history",
		label: "History",
		icon: "ph-clock-counter-clockwise",
		to: "/history",
	},
	{
		key: "analytics",
		label: "Analytics",
		icon: "ph-chart-line-up",
		to: "/analytics",
	},
]

const isActiveRoute = (pathname, to) => {
	if (to === "/dashboard") return pathname === "/dashboard"
	if (to === "/handbook") return pathname.startsWith("/handbook")
	return pathname === to
}

function AppPageFrame({ children }) {
	const location = useLocation()

	return (
		<div className="app-container">
			{/* Desktop sidebar */}
			<aside className="sidebar">
				<div className="p-6">
					<nav className="flex flex-col gap-2">
						{NAV_ITEMS.map((item) => (
							<Link
								key={item.key}
								to={item.to}
								replace
								className={`nav-link ${isActiveRoute(location.pathname, item.to) ? "active" : ""}`}>
								<i className={`ph text-xl ${item.icon}`} />
								{item.label}
							</Link>
						))}
					</nav>
				</div>
			</aside>

			{/* Mobile bottom nav */}
			<nav className="mobile-nav">
				{NAV_ITEMS.map((item) => (
					<div key={item.key} className="contents">
						<Link
							to={item.to}
							replace
							className={`mobile-link ${isActiveRoute(location.pathname, item.to) ? "active" : ""}`}>
							<i className={`ph text-2xl ${item.icon}`}></i>
							<span>{item.label}</span>
						</Link>
					</div>
				))}
			</nav>

			{/* Main content */}
			<main className="main-content">{children}</main>
		</div>
	)
}

export default AppPageFrame
