import { useEffect, useMemo, useRef, useState } from "react"

type FlatListProps<T> = {
	data: T[]
	renderItem: (item: T, index: number) => JSX.Element
	keyExtractor: (item: T, index: number) => string
	className?: string
	contentClassName?: string
	emptyComponent?: JSX.Element
	initialNumToRender?: number
	batchSize?: number
	onEndReachedThreshold?: number
	onEndReached?: () => void
	listFooterComponent?: JSX.Element
}

function FlatList<T>({
	data,
	renderItem,
	keyExtractor,
	className = "",
	contentClassName = "",
	emptyComponent,
	initialNumToRender = 14,
	batchSize = 12,
	onEndReachedThreshold = 260,
	onEndReached,
	listFooterComponent,
}: FlatListProps<T>) {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [visibleCount, setVisibleCount] = useState(
		Math.min(initialNumToRender, data.length),
	)

	useEffect(() => {
		setVisibleCount(Math.min(initialNumToRender, data.length))
	}, [data.length, initialNumToRender])

	const visibleData = useMemo(
		() => data.slice(0, visibleCount),
		[data, visibleCount],
	)

	const maybeLoadMore = () => {
		const node = containerRef.current
		if (!node) return

		const distanceFromBottom =
			node.scrollHeight - node.scrollTop - node.clientHeight
		if (distanceFromBottom <= onEndReachedThreshold) {
			// Load more into visible window from existing data
			if (visibleCount < data.length) {
				setVisibleCount((current) => Math.min(current + batchSize, data.length))
			}
			// Trigger external data fetch if callback provided
			if (onEndReached) {
				onEndReached()
			}
		}
	}

	if (!data.length && emptyComponent) {
		return emptyComponent
	}

	return (
		<div
			ref={containerRef}
			onScroll={maybeLoadMore}
			className={`overflow-y-auto ${className}`}>
			<div className={contentClassName}>
				{visibleData.map((item, index) => (
					<div key={keyExtractor(item, index)}>{renderItem(item, index)}</div>
				))}
				{listFooterComponent && <div>{listFooterComponent}</div>}
			</div>
		</div>
	)
}

export default FlatList
