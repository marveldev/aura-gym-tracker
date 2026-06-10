import { memo, useCallback } from "react"
import { Image, StyleSheet, Text } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, {
	FadeInUp,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated"

const AnimatedPressable = Animated.createAnimatedComponent(Animated.Pressable)

const ExerciseCategoryCard = memo(function ExerciseCategoryCard({
	item,
	onPress,
	index,
}) {
	const scale = useSharedValue(1)

	const animatedCardStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}))

	const handlePressIn = useCallback(() => {
		scale.value = withSpring(0.97, {
			stiffness: 320,
			damping: 22,
			mass: 0.8,
		})
	}, [scale])

	const handlePressOut = useCallback(() => {
		scale.value = withSpring(1, {
			stiffness: 320,
			damping: 22,
			mass: 0.8,
		})
	}, [scale])

	const handlePress = useCallback(() => {
		onPress(item)
	}, [item, onPress])

	return (
		<Animated.View
			entering={FadeInUp.delay(index * 70)
				.duration(500)
				.springify()
				.damping(16)}>
			<AnimatedPressable
				onPress={handlePress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				style={[styles.card, animatedCardStyle]}>
				<Image source={{ uri: item.image }} style={styles.muscleImage} />
				<LinearGradient
					colors={["rgba(0,0,0,0.30)", "rgba(0,0,0,0.05)", "rgba(0,0,0,0)"]}
					start={{ x: 0, y: 0.5 }}
					end={{ x: 1, y: 0.5 }}
					style={styles.readabilityOverlay}
				/>
				<LinearGradient
					colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.22)"]}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
					style={styles.depthOverlay}
				/>

				<Text numberOfLines={1} style={styles.title}>
					{item.name}
				</Text>
			</AnimatedPressable>
		</Animated.View>
	)
})

const styles = StyleSheet.create({
	card: {
		height: 150,
		borderRadius: 18,
		backgroundColor: "#003554",
		marginHorizontal: 16,
		marginVertical: 8,
		overflow: "hidden",
		justifyContent: "center",
		paddingLeft: 20,
		position: "relative",
	},
	title: {
		fontSize: 31,
		lineHeight: 35,
		fontWeight: "700",
		color: "#FFFFFF",
		maxWidth: "45%",
		zIndex: 5,
	},
	muscleImage: {
		position: "absolute",
		right: -12,
		top: -6,
		width: "62%",
		height: "115%",
		resizeMode: "contain",
	},
	readabilityOverlay: {
		...StyleSheet.absoluteFillObject,
	},
	depthOverlay: {
		...StyleSheet.absoluteFillObject,
	},
})

export default ExerciseCategoryCard
