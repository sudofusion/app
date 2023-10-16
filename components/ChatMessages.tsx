import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MESSAGES_KEY = 'chat_sessions';

export default function ChatMessages() {
	const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>>([]);
	const [currentMessage, setCurrentMessage] = useState('');

	const storeSession = async (newMessages: any) => {
		try {
			const existingSessions = await AsyncStorage.getItem(MESSAGES_KEY);
			let sessions = existingSessions ? existingSessions : [];

			sessions = [...sessions, newMessages];

			await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(sessions));
		} catch (error) {
			console.error('Failed to store messages:', error);
		}
	};

	const handleSendMessage = async () => {
		if (currentMessage.trim() === '') return;

		const updatedMessages = [...messages, { role: 'user', content: currentMessage, timestamp: new Date().toISOString() }];
		setMessages(updatedMessages);

		try {
			const payload = {
				model: 'gpt-3.5-turbo',
				messages: updatedMessages.map((msg) => {
					return { role: msg.role, content: msg.content };
				}),
			};

			const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
				headers: {
					Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`,
					'Content-Type': 'application/json',
				},
			});

			const botResponse = response.data.choices[0].message.content.trim();
			const finalUpdatedMessages = [...updatedMessages, { role: 'assistant', content: botResponse, timestamp: new Date().toISOString() }];
			setMessages(finalUpdatedMessages);

			setCurrentMessage('');
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		return () => {
			storeSession(messages);
		};
	}, []);

	return (
		<View style={{ flex: 1 }}>
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
							{new Date(message.timestamp).toLocaleTimeString()}
						</Text>
					</View>
				))}
			</ScrollView>
			<View style={styles.inputContainer}>
				<TextInput value={currentMessage} onChangeText={setCurrentMessage} style={styles.textInput} placeholder="Type a message..." />
				<Button title="Send" onPress={handleSendMessage} />
			</View>
		</View>
	);
}

const styles = {
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		borderTopWidth: 1,
		borderTopColor: '#ccc',
	},
	textInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		marginRight: 10,
		minHeight: 40,
	},
};
