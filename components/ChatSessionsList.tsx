import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const MESSAGES_KEY = 'chat_sessions';

export default function ChatSessionsList() {
	const [sessions, setSessions] = useState([]);
	const router = useRouter();

	useEffect(() => {
		const loadSessions = async () => {
			try {
				const storedSessions = await AsyncStorage.getItem(MESSAGES_KEY);
				if (storedSessions) {
					setSessions(JSON.parse(storedSessions));
				}
			} catch (error) {
				console.error('Failed to load sessions:', error);
			}
		};

		loadSessions();
	}, []);

	return (
		<View style={{ flex: 1, padding: 10 }}>
			<FlatList
				data={sessions}
				renderItem={({ item, index }) => (
					<View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
						<Text>Chat {index + 1}</Text>
						<Button
							title="View Chat"
							onPress={() =>
								//TODO:
								// navigation.navigate('ChatSession', { session: item })
								router.push({ pathname: '/modal', params: { session: item } })
							}
						/>
					</View>
				)}
				keyExtractor={(item, index) => index.toString()}
			/>
			{sessions.length > 0 ? (
				<Button
					title="Clear Chats"
					onPress={() =>
						AsyncStorage.removeItem(MESSAGES_KEY)
							.then(() => setSessions([]))
							.catch((error) => console.error('Failed to clear chats:', error))
					}
				/>
			) : null}
		</View>
	);
}
