import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

const MESSAGES_KEY = 'chat_sessions';

export default function ChatSession({ loadSession }) {
	const { sessionIndex } = useLocalSearchParams();
	const [session, setSession] = useState([]);

	useEffect(() => {
		const loadSession = async () => {
			try {
				const storedSessions = await AsyncStorage.getItem(MESSAGES_KEY);
				if (storedSessions) {
					const allSessions = JSON.parse(storedSessions);
					setSession(allSessions[sessionIndex]);
				}
			} catch (error) {
				console.error('Failed to load session:', error);
			}
		};

		loadSession();
	}, [sessionIndex]);

	return (
		<ScrollView style={{ padding: 10 }}>
			{messages.map((message, index) => (
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
	);
}
