import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { useLocalSearchParams } from 'expo-router';

export default function ModalScreen() {
	const { session } = useLocalSearchParams();
	console.log(JSON.parse(session));
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Modal</Text>
			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

			<View style={{ flex: 1, padding: 10 }}>
				<ScrollView style={{ padding: 10 }}>
					{session.map((message, index) => (
						<View key={index} style={{ marginBottom: 10 }}>
							<Text style={{ color: message.type === 'user' ? 'blue' : 'green', alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start' }}>
								{message.type === 'user' ? 'You:' : 'LLM Bot:'}
							</Text>
							<Text style={{ color: message.type === 'user' ? 'blue' : 'green', alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start' }}>
								{message.content}
							</Text>
							<Text style={{ fontSize: 10, color: 'gray', alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start' }}>
								{new Date(message.timestamp).toLocaleTimeString()}
							</Text>
						</View>
					))}
				</ScrollView>
			</View>

			{/* Use a light status bar on iOS to account for the black space above the modal */}
			<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
});
