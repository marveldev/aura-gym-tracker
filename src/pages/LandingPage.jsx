import { Link } from "react-router-dom"

function LandingPage() {
	return (
		<div className="overflow-x-hidden selection:bg-[hsl(var(--primary))] selection:text-white">
			<nav className="fixed w-full top-0 z-50 transition-all duration-300 backdrop-blur-md bg-[hsl(var(--bg))]/80 border-b border-[hsl(var(--border))]/50">
				<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<img src="/logo.svg" alt="Aura Logo" className="w-8 h-8" />
						<span className="text-xl font-bold tracking-tight text-[hsl(var(--fg))]">
							Aura
						</span>
					</div>
					<div className="flex items-center gap-6">
						<Link to="/dashboard" className="btn-primary py-2.5 px-6 text-sm">
							Launch App <i className="ph ph-arrow-right ml-2"></i>
						</Link>
					</div>
				</div>
			</nav>

			<section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
				<div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-[hsl(var(--primary))]/10 rounded-full blur-[120px] -z-10 translate-x-1/3"></div>
				<div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] -z-10 -translate-x-1/2"></div>

				<div className="max-w-7xl mx-auto px-6 w-full flex flex-col relative z-10">
					<div className="max-w-4xl animate-slide-up">
						<h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter leading-[0.9] text-[hsl(var(--fg))]">
							STRENGTH <br />
							IS A <span className="text-gradient italic">SCIENCE.</span>
						</h1>
						<p className="mt-8 text-xl md:text-2xl text-[hsl(var(--muted))] font-light max-w-2xl leading-relaxed">
							Stop guessing your progress. Aura is the brutally efficient,
							deeply analytical tracker built for those obsessed with
							progression.
						</p>
						<div className="mt-12 flex flex-col sm:flex-row gap-4">
							<Link to="/dashboard" className="btn-primary text-lg">
								Start Tracking Now
							</Link>
							<a href="#features" className="btn-outline text-lg">
								Explore Features
							</a>
						</div>
					</div>
				</div>
			</section>

			<div className="w-full border-y border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-6 overflow-hidden flex whitespace-nowrap">
				<div className="animate-[marquee_20s_linear_infinite] inline-flex items-center gap-12 text-[hsl(var(--muted))] font-mono text-sm uppercase tracking-widest">
					<span>Volume Load: +12.4%</span> •{" "}
					<span>Bench Press 1RM: 315lbs</span> •<span>Weekly Sets: 112</span> •{" "}
					<span>Recovery Status: Optimal</span> •
					<span>Volume Load: +12.4%</span> •{" "}
					<span>Bench Press 1RM: 315lbs</span> •<span>Weekly Sets: 112</span> •{" "}
					<span>Recovery Status: Optimal</span>
				</div>
			</div>

			<section id="features" className="py-32 relative max-w-5xl mx-auto px-6">
				<div
					className="mb-20 animate-slide-up"
					style={{ animationDelay: "0.2s" }}>
					<h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[hsl(var(--fg))]">
						Built to eliminate friction.
					</h2>
					<p className="mt-4 text-[hsl(var(--muted))] text-xl max-w-xl">
						Every feature is engineered to get out of your way and let you focus
						on the lift.
					</p>
				</div>

				<div className="relative pb-32">
					<div
						className="stack-card w-full rounded-3xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))] p-10 md:p-16 shadow-2xl shadow-black/5 flex flex-col md:flex-row gap-12 items-center z-10"
						style={{ top: "120px" }}>
						<div className="flex-1">
							<div className="w-16 h-16 rounded-2xl bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] mb-8">
								<i className="ph ph-lightning text-3xl"></i>
							</div>
							<h3 className="text-3xl font-bold text-[hsl(var(--fg))] mb-4">
								Lightning Fast Logging
							</h3>
							<p className="text-[hsl(var(--muted))] text-lg leading-relaxed">
								Log sets, reps, and weight in seconds. Our keyboard-optimized
								interface means you spend less time tapping screens and more
								time lifting.
							</p>
						</div>
						<div className="flex-1 w-full bg-[hsl(var(--bg))] rounded-2xl p-6 border border-[hsl(var(--border))]">
							<div className="space-y-4 opacity-70">
								<div className="flex justify-between border-b border-[hsl(var(--border))] pb-2">
									<span className="text-[hsl(var(--fg))]">1. Bench Press</span>
									<span className="text-[hsl(var(--muted))]">Chest</span>
								</div>
								<div className="flex justify-between items-center bg-[hsl(var(--surface))] p-3 rounded-lg border border-[hsl(var(--primary))]">
									<span className="text-[hsl(var(--muted))]">Set 1</span>
									<span className="font-mono text-[hsl(var(--fg))]">
										8 reps × 225 lbs
									</span>
									<i className="ph-fill ph-check-circle text-[hsl(var(--primary))]"></i>
								</div>
								<div className="flex justify-between items-center bg-[hsl(var(--surface))] p-3 rounded-lg border border-[hsl(var(--border))]">
									<span className="text-[hsl(var(--muted))]">Set 2</span>
									<span className="font-mono text-[hsl(var(--muted))]">
										...
									</span>
									<i className="ph ph-circle text-[hsl(var(--muted))]"></i>
								</div>
							</div>
						</div>
					</div>

					<div
						className="stack-card w-full rounded-3xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))] p-10 md:p-16 shadow-2xl shadow-black/5 flex flex-col md:flex-row-reverse gap-12 items-center z-20 mt-12"
						style={{ top: "140px" }}>
						<div className="flex-1">
							<div className="w-16 h-16 rounded-2xl bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] mb-8">
								<i className="ph ph-chart-line-up text-3xl"></i>
							</div>
							<h3 className="text-3xl font-bold text-[hsl(var(--fg))] mb-4">
								Deep Analytics
							</h3>
							<p className="text-[hsl(var(--muted))] text-lg leading-relaxed">
								Visualize your progression. Track 1RM estimates, total volume
								load, and muscle group frequency with interactive, beautiful
								charts.
							</p>
						</div>
						<div className="flex-1 w-full flex items-end h-48 gap-3 border-b border-[hsl(var(--border))] pb-0 px-6">
							<div className="w-1/6 bg-[hsl(var(--border))] rounded-t-md h-1/4"></div>
							<div className="w-1/6 bg-[hsl(var(--border))] rounded-t-md h-2/4"></div>
							<div className="w-1/6 bg-[hsl(var(--primary))]/40 rounded-t-md h-3/5"></div>
							<div className="w-1/6 bg-[hsl(var(--primary))]/70 rounded-t-md h-4/5"></div>
							<div className="w-1/6 bg-[hsl(var(--primary))] rounded-t-md h-full relative">
								<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[hsl(var(--fg))] text-[hsl(var(--bg))] text-xs font-bold py-1 px-2 rounded">
									PR
								</div>
							</div>
						</div>
					</div>

					<div
						className="stack-card w-full rounded-3xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))] p-10 md:p-16 shadow-2xl shadow-black/5 flex flex-col md:flex-row gap-12 items-center z-30 mt-12"
						style={{ top: "160px" }}>
						<div className="flex-1">
							<div className="w-16 h-16 rounded-2xl bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] mb-8">
								<i className="ph ph-lock-key text-3xl"></i>
							</div>
							<h3 className="text-3xl font-bold text-[hsl(var(--fg))] mb-4">
								Your Data. Local.
							</h3>
							<p className="text-[hsl(var(--muted))] text-lg leading-relaxed">
								Aura works entirely in your browser using local storage. Zero
								latency. Instant loads. Full privacy. Your metrics stay yours.
							</p>
						</div>
						<div className="flex-1 w-full flex justify-center">
							<div className="w-32 h-32 rounded-full border-4 border-[hsl(var(--border))] border-t-[hsl(var(--primary))] animate-spin"></div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-32 bg-[hsl(var(--surface))] border-t border-[hsl(var(--border))]">
				<div className="max-w-4xl mx-auto px-6 text-center">
					<h2 className="text-5xl md:text-7xl font-bold tracking-tight text-[hsl(var(--fg))] mb-8">
						Ready to grow?
					</h2>
					<p className="text-xl text-[hsl(var(--muted))] mb-12 max-w-2xl mx-auto">
						Join thousands of serious lifters who have ditched their
						spreadsheets for Aura.
					</p>
					<Link to="/dashboard" className="btn-primary text-xl px-12 py-6">
						Enter Dashboard
					</Link>
				</div>
			</section>

			<footer className="border-t border-[hsl(var(--border))] py-12 bg-[hsl(var(--bg))]">
				<div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
					<div className="flex items-center gap-2">
						<img
							src="/logo.svg"
							alt="Aura Logo"
							className="w-6 h-6 grayscale opacity-50"
						/>
						<span className="text-[hsl(var(--muted))] font-medium">
							Aura Tracker
						</span>
					</div>
					<p className="text-[hsl(var(--muted))] text-sm">
						Built with precision by{" "}
						<a
							href="https://teda.dev"
							className="text-[hsl(var(--primary))] hover:underline">
							Teda.dev
						</a>
						.
					</p>
				</div>
			</footer>
		</div>
	)
}

export default LandingPage
