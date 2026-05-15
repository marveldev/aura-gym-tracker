import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

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
	const navigate = useNavigate()
	const { logout } = useAuth()
	const [isDarkTheme, setIsDarkTheme] = useState(true)

	useEffect(() => {
		const savedTheme = localStorage.getItem("aura_theme") || "dark"
		const dark = savedTheme === "dark"
		setIsDarkTheme(dark)
		document.documentElement.classList.toggle("dark", dark)
	}, [])

	const toggleTheme = () => {
		const nextDark = !isDarkTheme
		setIsDarkTheme(nextDark)
		document.documentElement.classList.toggle("dark", nextDark)
		localStorage.setItem("aura_theme", nextDark ? "dark" : "light")
	}

	const handleSignOut = async () => {
		await logout()
		navigate("/", { replace: true })
	}

	return (
		<div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
			<nav className="fixed w-full top-0 z-50 transition-all duration-300 backdrop-blur-md bg-[hsl(var(--bg))]/80 border-b border-[hsl(var(--border))]/50">
				<div className="px-4 md:px-6 h-16 flex items-center justify-between">
					<Link to="/" className="flex items-center gap-3">
						<img
							src="/logo.svg"
							alt="Aura Logo"
							className="w-7 h-7 sm:w-8 sm:h-8"
						/>
						<span className="text-lg sm:text-xl font-bold tracking-tight text-[hsl(var(--fg))]">
							Aura
						</span>
					</Link>

					<div className="flex items-center gap-2 sm:gap-3">
						<button
							className="btn-secondary h-10 w-10 rounded flex items-center justify-center"
							onClick={toggleTheme}
							aria-label={
								isDarkTheme ? "Switch to light theme" : "Switch to dark theme"
							}>
							<i
								className={`ph text-lg ${isDarkTheme ? "ph-sun" : "ph-moon"}`}></i>
						</button>
						<button
							className="btn-secondary py-2 px-3 sm:px-4 text-sm rounded font-bold whitespace-nowrap"
							onClick={handleSignOut}>
							Sign Out
						</button>
					</div>
				</div>
			</nav>

			<main className="pt-20 md:pt-24 pb-24 md:pb-8">{children}</main>

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
		</div>
	)
}

export default AppPageFrame
