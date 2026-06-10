import { useCallback, useMemo, useState } from "react"
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Ionicons from "react-native-vector-icons/Ionicons"
import Animated, { FadeIn } from "react-native-reanimated"
import SearchBar from "../components/SearchBar"
import ExerciseCategoryCard from "../components/ExerciseCategoryCard"
import BottomTabBar from "../components/BottomTabBar"

const EXERCISE_CATEGORIES = [
	{
		id: "chest",
		name: "Chest",
		image:
			"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
		exerciseCount: 34,
	},
	{
		id: "back",
		name: "Back",
		image:
			"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
		exerciseCount: 38,
	},
	{
		id: "legs",
		name: "Legs",
		image:
			"https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=900&q=80",
		exerciseCount: 42,
	},
	{
		id: "gluteus",
		name: "Gluteus",
		image:
			"https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80",
		exerciseCount: 22,
	},
	{
		id: "shoulders",
		name: "Shoulders",
		image:
			"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
		exerciseCount: 26,
	},
	{
		id: "arms",
		name: "Arms",
		image:
			"https://images.unsplash.com/photo-1517963628607-235ccdd5476d?auto=format&fit=crop&w=900&q=80",
		exerciseCount: 29,
	},
	{
		id: "core",
		name: "Core",
		image:
			"https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=900&q=80",
		exerciseCount: 24,
	},
	{
		id: "cardio",
		name: "Cardio",
		image:
			"https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=900&q=80",
		exerciseCount: 31,
	},
]

function ExerciseHandbookScreen({ navigation }) {
	const [searchQuery, setSearchQuery] = useState("")

	const filteredCategories = useMemo(() => {
		const normalized = searchQuery.trim().toLowerCase()

		if (!normalized) {
			return EXERCISE_CATEGORIES
		}

		return EXERCISE_CATEGORIES.filter((category) =>
			category.name.toLowerCase().includes(normalized),
		)
	}, [searchQuery])

	const handleCardPress = useCallback(
		(category) => {
			navigation.navigate("ExerciseList", {
				muscleGroup: category,
			})
		},
		[navigation],
	)

	const handleBackPress = useCallback(() => {
		navigation.goBack()
	}, [navigation])

	const handleTabPress = useCallback(
		(route) => {
			if (route === "Handbook") {
				return
			}

			navigation.navigate(route)
		},
		[navigation],
	)

	const renderCategory = useCallback(
		({ item, index }) => (
			<ExerciseCategoryCard item={item} index={index} onPress={handleCardPress} />
		),
		[handleCardPress],
	)

	const keyExtractor = useCallback((item) => item.id, [])

	return (
		<SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
			<Animated.View entering={FadeIn.duration(420)} style={styles.container}>
				<View style={styles.header}>
					<Pressable
						onPress={handleBackPress}
						style={styles.iconButton}
						hitSlop={8}>
						<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
					</Pressable>

					<Text style={styles.headerTitle}>Exercises</Text>

					<View style={styles.rightActions}>
						<Pressable style={styles.iconButton} hitSlop={8}>
							<Ionicons name="bookmark-outline" size={22} color="#FFFFFF" />
						</Pressable>
						<Pressable style={styles.iconButton} hitSlop={8}>
							<Ionicons name="options-outline" size={22} color="#FFFFFF" />
						</Pressable>
					</View>
				</View>

				<View style={styles.searchContainer}>
					<SearchBar
						value={searchQuery}
						onChangeText={setSearchQuery}
						placeholder="Search"
					/>
				</View>

				<FlatList
					data={filteredCategories}
					keyExtractor={keyExtractor}
					renderItem={renderCategory}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.listContent}
				/>
			</Animated.View>

			<BottomTabBar activeTab="Handbook" onTabPress={handleTabPress} />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#000000",
	},
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},
	header: {
		height: 56,
		paddingHorizontal: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	headerTitle: {
		position: "absolute",
		left: 0,
		right: 0,
		textAlign: "center",
		fontSize: 22,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	iconButton: {
		height: 36,
		width: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
	},
	rightActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	searchContainer: {
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 10,
	},
	listContent: {
		paddingTop: 4,
		paddingBottom: 20,
	},
})

export default ExerciseHandbookScreen