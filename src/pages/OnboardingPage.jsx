import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../firebase.js"

const SCALE_ITEM_HEIGHT = 56
const VISIBLE_ITEMS = 5
const CONTAINER_HEIGHT = SCALE_ITEM_HEIGHT * VISIBLE_ITEMS
const SCROLL_PADDING = CONTAINER_HEIGHT / 2 - SCALE_ITEM_HEIGHT / 2

function StepHeader({ title }) {
	return (
		<h1 className="text-[34px] sm:text-[48px] lg:text-[56px] leading-[0.95] font-bold tracking-[-0.03em] text-[hsl(var(--fg))]">
			What&apos;s Your
			<span className="block text-[hsl(var(--primary))]">{title}?</span>
		</h1>
	)
}

function ScrollWheelScale({
	min,
	max,
	step,
	value,
	onValueChange,
	formatValue,
	disabled = false,
}) {
	const containerRef = useRef(null)
	const frameRef = useRef(null)
	const numericMin = Number(min)
	const numericMax = Number(max)
	const numericStep = Number(step)
	const precision = String(step).includes(".")
		? String(step).split(".")[1].length
		: 0

	const values = useMemo(() => {
		const total = Math.floor((numericMax - numericMin) / numericStep) + 1
		return Array.from({ length: total }, (_, index) =>
			Number((numericMin + index * numericStep).toFixed(precision)),
		)
	}, [numericMax, numericMin, numericStep, precision])

	const selectedIndex = useMemo(() => {
		const rawIndex = Math.round((Number(value) - numericMin) / numericStep)
		return Math.min(values.length - 1, Math.max(0, rawIndex))
	}, [numericMin, numericStep, value, values.length])

	useLayoutEffect(() => {
		const container = containerRef.current
		if (!container) {
			return
		}

		const nextScrollTop = selectedIndex * SCALE_ITEM_HEIGHT
		container.scrollTop = nextScrollTop
	}, [selectedIndex])

	useEffect(() => {
		return () => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current)
			}
		}
	}, [])

	const handleScroll = () => {
		if (frameRef.current) {
			cancelAnimationFrame(frameRef.current)
		}

		frameRef.current = requestAnimationFrame(() => {
			const container = containerRef.current
			if (!container) {
				return
			}

			const rawIndex = Math.round(container.scrollTop / SCALE_ITEM_HEIGHT)
			const nextIndex = Math.min(values.length - 1, Math.max(0, rawIndex))
			const nextValue = values[nextIndex]

			if (Number(nextValue) !== Number(value)) {
				onValueChange(nextValue)
			}
		})
	}

	return (
		<div>
			<div className="px-1 sm:px-3 flex flex-col items-center">
				<div
					className="relative w-full overflow-hidden"
					style={{ height: CONTAINER_HEIGHT }}>
					<div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[hsl(var(--bg))] via-[hsl(var(--bg))]/95 to-transparent z-30 lg:hidden"></div>
					<div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[hsl(var(--bg))] via-[hsl(var(--bg))]/95 to-transparent z-30 lg:hidden"></div>
					<div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[56px] rounded-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] lg:bg-[hsl(var(--bg))] lg:border-[hsl(var(--border))] z-20"></div>

					<div
						ref={containerRef}
						onScroll={handleScroll}
						className={`relative z-[25] h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${disabled ? "pointer-events-none" : ""}`}>
						<div
							className="flex flex-col items-center"
							style={{
								paddingTop: SCROLL_PADDING,
								paddingBottom: SCROLL_PADDING,
							}}>
							{values.map((scaleValue, index) => {
								const isSelected = index === selectedIndex
								const displayValue = formatValue
									? formatValue(scaleValue)
									: scaleValue

								return (
									<div
										key={`${scaleValue}-${index}`}
										className="h-[56px] w-full shrink-0 snap-center flex items-center justify-center">
										<div
											className={`px-3 leading-none font-semibold tabular-nums transition-all ${
												isSelected
													? "text-[hsl(var(--primary))] text-3xl sm:text-4xl scale-110"
													: "text-[hsl(var(--muted))]/65 text-xl sm:text-2xl scale-95"
											}`}>
											{displayValue}
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function OnboardingPage() {
	const { currentUser } = useAuth()
	const navigate = useNavigate()

	const [step, setStep] = useState(1)
	const [age, setAge] = useState(25)
	const [weightKg, setWeightKg] = useState(70)
	const [heightCm, setHeightCm] = useState(170)
	const [weightUnit, setWeightUnit] = useState("kg")
	const [heightUnit, setHeightUnit] = useState("cm")
	const [gender, setGender] = useState("male")
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")

	const totalSteps = 4
	const progress = (step / totalSteps) * 100

	const cmToFeetInches = (cm) => {
		const totalInches = Math.round(cm / 2.54)
		const feet = Math.floor(totalInches / 12)
		const inches = totalInches % 12
		return { feet, inches, totalInches }
	}

	const inchesToCm = (inches) => Math.round(inches * 2.54)
	const kgToLb = (kg) => Math.round(kg * 2.20462)
	const lbToKg = (lb) => Math.round((lb / 2.20462) * 10) / 10

	const currentWeightDisplay =
		weightUnit === "kg" ? weightKg.toFixed(1) : kgToLb(weightKg)
	const { feet, inches, totalInches } = cmToFeetInches(heightCm)

	const saveProfile = async () => {
		setError("")

		if (age < 13 || age > 120) {
			setError("Age must be between 13 and 120")
			return
		}

		if (weightKg < 20 || weightKg > 500) {
			setError("Weight must be between 20 and 500 kg")
			return
		}

		if (heightCm < 100 || heightCm > 300) {
			setError("Height must be between 100 and 300 cm")
			return
		}

		try {
			setIsLoading(true)

			if (currentUser && currentUser.uid) {
				const userProfileRef = doc(db, "users", currentUser.uid)
				await setDoc(
					userProfileRef,
					{
						age,
						weight: weightKg,
						height: heightCm,
						gender,
						updatedAt: new Date(),
					},
					{ merge: true },
				)
			}

			navigate("/dashboard", { replace: true })
		} catch (err) {
			console.error("Failed to save profile:", err)
			setError("Failed to save profile. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	const handleContinue = async () => {
		setError("")

		if (step < totalSteps) {
			setStep((prev) => prev + 1)
			return
		}

		await saveProfile()
	}

	const handleBack = () => {
		setError("")
		if (step > 1) {
			setStep((prev) => prev - 1)
			return
		}
		navigate("/auth", { replace: true })
	}

	const renderStep = () => {
		if (step === 1) {
			return (
				<>
					<StepHeader title="Age" />
					<div className="mt-16">
						<div className="text-center text-[52px] sm:text-[64px] lg:text-[72px] font-bold text-[hsl(var(--primary))] tabular-nums tracking-[-0.04em]">
							{age}
							<span className="text-2xl sm:text-3xl font-medium text-[hsl(var(--muted))] ml-2 tracking-normal">
								yrs
							</span>
						</div>
					</div>
					<ScrollWheelScale
						disabled={isLoading}
						min="13"
						max="120"
						step="1"
						value={age}
						onValueChange={setAge}
						formatValue={(scaleValue) => scaleValue}
					/>
				</>
			)
		}

		if (step === 2) {
			return (
				<>
					<StepHeader title="Weight" />

					<div className="mt-12 flex justify-center">
						<div className="inline-flex p-1 rounded-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))]">
							<button
								type="button"
								onClick={() => setWeightUnit("kg")}
								className={`px-7 py-2.5 rounded-full font-medium transition-all ${
									weightUnit === "kg"
										? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))]"
										: "text-[hsl(var(--fg))]"
								}`}>
								KG
							</button>
							<button
								type="button"
								onClick={() => setWeightUnit("lb")}
								className={`px-7 py-2.5     vassdm,mbczzd,;;ieq oee\y4wqqfrounded-full font-medium transition-all ${
									weightUnit === "lb"
										? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))]"
										: "text-[hsl(var(--fg))]"
								}`}>
								LB
							</button>
						</div>
					</div>

					<div className="mt-8 text-center text-[52px] sm:text-[64px] lg:text-[72px] font-bold text-[hsl(var(--primary))] tabular-nums tracking-[-0.04em]">
						{currentWeightDisplay}
						<span className="text-2xl sm:text-3xl font-medium text-[hsl(var(--muted))] ml-2 uppercase tracking-normal">
							{weightUnit}
						</span>
					</div>

					<ScrollWheelScale
						disabled={isLoading}
						min={weightUnit === "kg" ? "20" : "44"}
						max={weightUnit === "kg" ? "500" : "1102"}
						step={weightUnit === "kg" ? "0.5" : "1"}
						value={weightUnit === "kg" ? weightKg : kgToLb(weightKg)}
						onValueChange={(nextValue) => {
							if (weightUnit === "kg") {
								setWeightKg(nextValue)
								return
							}
							setWeightKg(lbToKg(nextValue))
						}}
						formatValue={(scaleValue) =>
							weightUnit === "kg"
								? scaleValue.toFixed(1)
								: Math.round(scaleValue)
						}
					/>
				</>
			)
		}

		if (step === 3) {
			return (
				<>
					<StepHeader title="Height" />

					<div className="mt-12 flex justify-center">
						<div className="inline-flex p-1 rounded-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))]">
							<button
								type="button"
								onClick={() => setHeightUnit("ft")}
								className={`px-7 py-2.5 rounded-full font-medium transition-all ${
									heightUnit === "ft"
										? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))]"
										: "text-[hsl(var(--fg))]"
								}`}>
								FT
							</button>
							<button
								type="button"
								onClick={() => setHeightUnit("cm")}
								className={`px-7 py-2.5 rounded-full font-medium transition-all ${
									heightUnit === "cm"
										? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))]"
										: "text-[hsl(var(--fg))]"
								}`}>
								CM
							</button>
						</div>
					</div>

					<div className="mt-8 text-center text-[52px] sm:text-[64px] lg:text-[72px] font-bold text-[hsl(var(--primary))] tabular-nums tracking-[-0.04em]">
						{heightUnit === "cm" ? (
							<>
								{heightCm.toFixed(1)}
								<span className="text-2xl sm:text-3xl font-medium text-[hsl(var(--muted))] ml-2 tracking-normal">
									cm
								</span>
							</>
						) : (
							<>
								{feet}
								<span className="text-2xl sm:text-3xl font-medium text-[hsl(var(--muted))] mx-1 tracking-normal">
									ft
								</span>
								{inches}
								<span className="text-2xl sm:text-3xl font-medium text-[hsl(var(--muted))] ml-1 tracking-normal">
									in
								</span>
							</>
						)}
					</div>

					<ScrollWheelScale
						disabled={isLoading}
						min={heightUnit === "cm" ? "100" : "39"}
						max={heightUnit === "cm" ? "300" : "118"}
						step="1"
						value={heightUnit === "cm" ? heightCm : totalInches}
						onValueChange={(nextValue) => {
							if (heightUnit === "cm") {
								setHeightCm(nextValue)
								return
							}
							setHeightCm(inchesToCm(nextValue))
						}}
						formatValue={(scaleValue) => {
							if (heightUnit === "cm") {
								return scaleValue
							}
							const feetPart = Math.floor(scaleValue / 12)
							const inchesPart = scaleValue % 12
							return `${feetPart}'${String(inchesPart).padStart(2, "0")}`
						}}
					/>
				</>
			)
		}

		const genderOptions = [
			{ value: "male", label: "Male", icon: "ph-gender-male" },
			{ value: "female", label: "Female", icon: "ph-gender-female" },
			{ value: "other", label: "Other", icon: "ph-gender-neuter" },
		]

		return (
			<>
				<StepHeader title="Gender" />
				<div className="mt-16 flex flex-col gap-4">
					{genderOptions.map((opt) => (
						<button
							key={opt.value}
							type="button"
							disabled={isLoading}
							onClick={() => setGender(opt.value)}
							className={`flex items-center gap-5 w-full px-6 py-5 rounded-2xl border-2 transition-all ${
								gender === opt.value
									? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10"
									: "border-[hsl(var(--border))] bg-[hsl(var(--surface))] hover:border-[hsl(var(--primary))]/50"
							}`}>
							<i
								className={`ph ${opt.icon} text-3xl ${
									gender === opt.value
										? "text-[hsl(var(--primary))]"
										: "text-[hsl(var(--muted))]"
								}`}></i>
							<span
								className={`text-xl font-semibold ${
									gender === opt.value
										? "text-[hsl(var(--primary))]"
										: "text-[hsl(var(--fg))]"
								}`}>
								{opt.label}
							</span>
							{gender === opt.value && (
								<i className="ph ph-check-circle text-2xl text-[hsl(var(--primary))] ml-auto"></i>
							)}
						</button>
					))}
				</div>
			</>
		)
	}

	return (
		<div className="min-h-screen relative overflow-hidden bg-[hsl(var(--bg))] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex">
			<div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--surface))]/35 via-transparent to-[hsl(var(--bg))] pointer-events-none"></div>
			<div className="absolute right-0 top-24 w-72 h-72 rounded-full bg-[hsl(var(--primary))]/8 blur-[120px] pointer-events-none"></div>
			<div className="absolute left-0 bottom-20 w-72 h-72 rounded-full bg-[hsl(var(--primary))]/7 blur-[140px] pointer-events-none"></div>

			<div className="w-full max-w-4xl mx-auto flex flex-col lg:justify-center lg:items-center relative z-10">
				<div className="w-full lg:max-w-3xl lg:rounded-3xl lg:border lg:border-[hsl(var(--border))] lg:bg-[hsl(var(--surface))]/70 lg:backdrop-blur-sm lg:px-8 lg:py-8">
					<div className="w-full max-w-2xl mx-auto flex items-center gap-4 mb-10">
						<span className="text-[32px] font-semibold text-[hsl(var(--fg))] tabular-nums">
							{String(step).padStart(2, "0")}
						</span>
						<div className="flex-1 h-2 rounded-full bg-[hsl(var(--border))] overflow-hidden">
							<div
								className="h-full bg-[hsl(var(--primary))] rounded-full transition-all duration-300"
								style={{ width: `${progress}%` }}
							/>
						</div>
						<span className="text-[32px] font-semibold text-[hsl(var(--muted))] tabular-nums">
							{String(totalSteps).padStart(2, "0")}
						</span>
					</div>

					<div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-between min-h-[600px] lg:min-h-[640px]">
						<div className="w-full">{renderStep()}</div>

						{error && (
							<div className="mt-6 flex items-center gap-2 text-sm text-[hsl(var(--danger))] lg:justify-center">
								<i className="ph ph-warning-circle text-base"></i>
								<span>{error}</span>
							</div>
						)}
					</div>

					<div className="mt-8 w-full max-w-2xl mx-auto flex items-center gap-3">
						<button
							type="button"
							onClick={handleBack}
							disabled={isLoading}
							className="w-14 h-14 rounded-full border border-[hsl(var(--border))] text-[hsl(var(--fg))] grid place-items-center hover:bg-[hsl(var(--surface))] transition-colors disabled:opacity-60">
							<i className="ph ph-caret-left text-xl"></i>
						</button>
						<button
							type="button"
							onClick={handleContinue}
							disabled={isLoading}
							className="flex-1 h-14 rounded-full inline-flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-fg))] hover:bg-[hsl(var(--primary-hover))] shadow-md shadow-[hsl(var(--primary))]/20 transition-all focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
							{isLoading
								? "Saving..."
								: step === totalSteps
									? "Finish"
									: "Continue"}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
