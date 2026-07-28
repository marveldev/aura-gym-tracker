import { useEffect, useRef, useState } from "react"
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
]

const isActiveRoute = (pathname, to) => {
	if (to === "/dashboard") return pathname === "/dashboard"
	if (to === "/handbook") return pathname.startsWith("/handbook")
	return pathname === to
}

const HIDE_BACK_BUTTON_ROUTES = new Set([
	"/dashboard",
	"/history",
	"/nutrition",
	"/workout",
	"/handbook",
])

function AppPageFrame({ children }) {
	const location = useLocation()
	const navigate = useNavigate()
	const { isGuest, logout } = useAuth()
	const [isDarkTheme, setIsDarkTheme] = useState(true)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const mobileMenuRef = useRef(null)
	const mobileMenuButtonRef = useRef(null)
	const isHandbookRoute = location.pathname.startsWith("/handbook/")
	const shouldShowBackButton =
		!HIDE_BACK_BUTTON_ROUTES.has(location.pathname) && !isHandbookRoute

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
		setIsMobileMenuOpen(false)
		await logout()
		navigate(isGuest ? "/auth" : "/", { replace: true })
	}

	useEffect(() => {
		setIsMobileMenuOpen(false)
	}, [location.pathname])

	useEffect(() => {
		if (!isMobileMenuOpen) {
			return undefined
		}

		const handleClickOutside = (event) => {
			const target = event.target
			if (
				mobileMenuRef.current?.contains(target) ||
				mobileMenuButtonRef.current?.contains(target)
			) {
				return
			}

			setIsMobileMenuOpen(false)
		}

		document.addEventListener("mousedown", handleClickOutside)
		document.addEventListener("touchstart", handleClickOutside)

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
			document.removeEventListener("touchstart", handleClickOutside)
		}
	}, [isMobileMenuOpen])

	const handleBack = () => {
		if (window.history.length > 1) {
			navigate(-1)
			return
		}

		navigate("/dashboard", { replace: true })
	}

	return (
		<div className="app-container">
			<nav className="fixed w-full top-0 z-50 transition-all duration-300 backdrop-blur-md bg-[hsl(var(--bg))]/80 border-b border-[hsl(var(--border))]/50">
				<div className="px-4 md:px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-3">
						{shouldShowBackButton && (
							<button
								type="button"
								onClick={handleBack}
								className="btn-secondary h-10 px-3 rounded flex items-center gap-2 text-sm font-semibold"
								aria-label="Go back">
								<i className="ph ph-arrow-left text-base" />
								Back
							</button>
						)}
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
					</div>

					<div className="flex items-center gap-2 sm:gap-3">
						{isGuest && (
							<span
								className="inline-flex md:hidden items-center rounded-full border border-[hsl(var(--primary))]/45 bg-[hsl(var(--primary))]/10 px-2.5 py-1 text-[11px] font-semibold text-[hsl(var(--primary))]"
								aria-label="Guest Mode"
								title="Guest Mode">
								Guest
							</span>
						)}
						{isGuest && (
							<span className="hidden md:inline-flex items-center rounded-full border border-[hsl(var(--primary))]/45 bg-[hsl(var(--primary))]/10 px-2.5 py-1 text-xs font-semibold text-[hsl(var(--primary))]">
								Guest Mode
							</span>
						)}
						<button
							className="hidden md:flex btn-secondary h-10 w-10 rounded items-center justify-center"
							onClick={toggleTheme}
							aria-label={
								isDarkTheme ? "Switch to light theme" : "Switch to dark theme"
							}>
							<i
								className={`ph text-lg ${isDarkTheme ? "ph-sun" : "ph-moon"}`}></i>
						</button>
						<button
							type="button"
							ref={mobileMenuButtonRef}
							className="md:hidden btn-secondary h-10 w-10 rounded flex items-center justify-center"
							onClick={() => setIsMobileMenuOpen((open) => !open)}
							aria-label="Open menu"
							aria-expanded={isMobileMenuOpen}>
							<i
								className={`ph text-lg ${isMobileMenuOpen ? "ph-x" : "ph-list"}`}
							/>
						</button>
						<button
							className="hidden md:inline-flex btn-secondary py-2 px-3 sm:px-4 text-sm rounded font-bold whitespace-nowrap"
							onClick={handleSignOut}>
							{isGuest ? "Exit Guest Mode" : "Sign Out"}
						</button>
					</div>
				</div>

				{isMobileMenuOpen && (
					<div
						ref={mobileMenuRef}
						className="md:hidden absolute right-4 top-[calc(100%+0.5rem)] w-[min(92vw,20rem)] overflow-hidden rounded-2xl border border-[hsl(var(--border))]/70 bg-[hsl(var(--surface))]/95 shadow-2xl shadow-black/20 backdrop-blur-xl">
						<div className="border-b border-[hsl(var(--border))]/70 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
							Account
						</div>
						<div className="p-2 space-y-1.5">
							<button
								type="button"
								onClick={() => {
									toggleTheme()
									setIsMobileMenuOpen(false)
								}}
								className="w-full rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--bg))]/60 px-3.5 py-2.5 text-left text-sm font-semibold text-[hsl(var(--fg))] transition hover:border-[hsl(var(--primary))]/40 hover:bg-[hsl(var(--primary))]/10">
								<i
									className={`ph mr-2 ${isDarkTheme ? "ph-sun" : "ph-moon"}`}
								/>
								{isDarkTheme ? "Switch to Light" : "Switch to Dark"}
							</button>
							<button
								type="button"
								onClick={handleSignOut}
								className="w-full rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--bg))]/60 px-3.5 py-2.5 text-left text-sm font-semibold text-[hsl(var(--fg))] transition hover:border-[hsl(var(--primary))]/40 hover:bg-[hsl(var(--primary))]/10">
								<i className="ph ph-sign-out mr-2" />
								{isGuest ? "Exit Guest Mode" : "Sign Out"}
							</button>
						</div>
					</div>
				)}
			</nav>

			{/* Desktop sidebar */}
			<aside className="sidebar pt-16">
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
			<main className="main-content pt-16">{children}</main>
		</div>
	)
}

export default AppPageFrame
