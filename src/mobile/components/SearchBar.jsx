import { memo } from "react"
import { StyleSheet, TextInput, View } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

const SearchBar = memo(function SearchBar({
	value,
	onChangeText,
	placeholder,
}) {
	return (
		<View style={styles.container}>
			<Ionicons name="search-outline" size={20} color="#8A8A8A" />
			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor="#8A8A8A"
				autoCapitalize="none"
				autoCorrect={false}
				style={styles.input}
			/>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		height: 54,
		borderRadius: 24,
		backgroundColor: "#171717",
		paddingHorizontal: 16,
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	input: {
		flex: 1,
		color: "#FFFFFF",
		fontSize: 16,
		paddingVertical: 0,
	},
})

export default SearchBar
