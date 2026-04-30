function ToastContainer({ toasts }) {
	return (
		<div className="fixed bottom-20 md:bottom-10 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
			{toasts.map((toast) => {
				const icon =
					toast.type === "success" ? "ph-check-circle" : "ph-warning-circle"
				const color =
					toast.type === "success"
						? "text-[hsl(var(--success))]"
						: "text-[hsl(var(--danger))]"

				return (
					<div
						key={toast.id}
						className="toast-notification bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-xl shadow-xl p-4 flex items-center gap-3 w-72 pointer-events-auto">
						<i className={`ph ${icon} ${color} text-2xl`}></i>
						<span className="text-sm font-medium text-[hsl(var(--fg))]">
							{toast.message}
						</span>
					</div>
				)
			})}
		</div>
	)
}

export default ToastContainer
