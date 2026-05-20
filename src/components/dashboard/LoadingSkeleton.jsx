function LoadingSkeleton({ className = "" }) {
	return (
		<div
			className={`animate-pulse rounded-2xl bg-zinc-800/80 ${className}`}
			aria-hidden="true"
		/>
	)
}

export default LoadingSkeleton
