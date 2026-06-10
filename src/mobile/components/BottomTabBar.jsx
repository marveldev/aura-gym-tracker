import { memo, useMemo } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

const tabs = [
	{ key: "Workouts", icon: "barbell-outline", route: "Workouts" },
	{ key: "Feed", icon: "newspaper-outline", route: "Feed" },
	{ key: "Messages", icon: "chatbubble-ellipses-outline", route: "Messages" },
	{ key: "Handbook", icon: "book-outline", route: "Handbook" },
	{ key: "More", icon: "ellipsis-horizontal-circle-outline", route: "More" },
]

const ACTIVE_COLOR = "#00D4FF"
const INACTIVE_COLOR = "#8A8A8A"

const BottomTabBar = memo(function BottomTabBar({ activeTab, onTabPress }) {
	const activeKey = useMemo(() => activeTab || "Handbook", [activeTab])

	return (
		<View style={styles.container}>
			{tabs.map((tab) => {
				const isActive = tab.key === activeKey
				const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR

				return (
					<Pressable
						key={tab.key}
						onPress={() => onTabPress(tab.route)}
						style={styles.tabButton}
						hitSlop={8}>
						<Ionicons name={tab.icon} size={21} color={color} />
						<Text style={[styles.tabLabel, { color }]}>{tab.key}</Text>
					</Pressable>
				)
			})}
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		height: 84,
		backgroundColor: "#0A0A0A",
		borderTopWidth: 1,
		borderTopColor: "#1E1E1E",
		paddingTop: 8,
		paddingHorizontal: 8,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	tabButton: {
		flex: 1,
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		gap: 4,
	},
	tabLabel: {
		fontSize: 12,
		fontWeight: "600",
	},
})

export default BottomTabBar
