import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_SESSIONS_KEY = 'chat_sessions';

export default function ModalScreen() {
	const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; date: string; timestamp: string }>>([]);
	const { sessionIndex } = useLocalSearchParams();
	console.log(typeof sessionIndex);
	console.log(sessionIndex);

	const loadSession = async () => {
		try {
			const storedSessions = await AsyncStorage.getItem(CHAT_SESSIONS_KEY);
			if (storedSessions) {
				const allSessions = JSON.parse(storedSessions);
				console.log('Loaded session:', allSessions[+sessionIndex]);
				setMessages(allSessions[+sessionIndex]);
			}
		} catch (error) {
			console.error('Failed to load session:', error);
		}
	};
	useEffect(() => {
		loadSession();
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Modal</Text>
			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

			<View style={{ flex: 1, padding: 10 }}>
				<ScrollView style={{ padding: 10 }}>
					{messages.map((message, index) => (
						<View key={index} style={{ marginBottom: 10 }}>
							<Text style={{ color: message.role === 'user' ? 'blue' : 'green', alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
								{message.role === 'user' ? 'You:' : 'LLM Bot:'}
							</Text>
							<Text style={{ color: message.role === 'user' ? 'blue' : 'green', alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
								{message.content}
							</Text>
							<Text style={{ fontSize: 10, color: 'gray', alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
								{message.timestamp}
							</Text>
						</View>
					))}
				</ScrollView>
			</View>

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
