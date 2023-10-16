import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Pressable } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { useFocusEffect } from 'expo-router';

const CHAT_SESSIONS_KEY = 'chat_sessions';

export default function ChatMessages() {
	const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; date: string; timestamp: string }>>([]);
	const [currentMessage, setCurrentMessage] = useState('');

	const handleSendMessage = async () => {
		if (currentMessage.trim() === '') return;

		const currentDateTime = new Date();
		const date = format(currentDateTime, 'dd-MM-yyyy');
		const timestamp = format(currentDateTime, 'HH:mm:ss');

		const userMessage = {
			role: 'user',
			content: currentMessage,
			date,
			timestamp,
		};

		const updatedMessages = [...messages, userMessage];
		setMessages(updatedMessages);

		try {
			const payload = {
				messages: updatedMessages.map((msg) => {
					return { role: msg.role, content: msg.content };
				}),
				model: 'gpt-3.5-turbo',
			};

			const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
				headers: {
					Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`,
					'Content-Type': 'application/json',
				},
			});

			const botResponse = response.data.choices[0].message.content.trim();
			const botMessage = {
				role: 'assistant',
				content: botResponse,
				date,
				timestamp,
			};

			const finalUpdatedMessages = [...updatedMessages, botMessage];
			setMessages(finalUpdatedMessages);

			setCurrentMessage('');
		} catch (error) {
			console.error(error);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			return saveChatSession;
		}, [messages])
	);

	const saveChatSession = async () => {
		try {
			const storedSessions = await AsyncStorage.getItem(CHAT_SESSIONS_KEY);
			let allSessions = storedSessions ? JSON.parse(storedSessions) : [];

			if (messages.length > 0) {
				allSessions.push(messages);
				await AsyncStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(allSessions));
			}
		} catch (error) {
			console.error('Failed to save chat:', error);
		}
	};

	const handleClearChat = () => {
		setMessages([]);
	};

	return (
		<View style={{ flex: 1 }}>
			<Pressable style={styles.clearButton} onPress={handleClearChat}>
				<Text style={styles.clearButtonText}>Clear</Text>
			</Pressable>
			<ScrollView style={{ padding: 10 }}>
				{messages.map((message, index) => (
					<View key={index} style={{ marginBottom: 10 }}>
						<Text style={{ color: message.role === 'user' ? 'blue' : 'green', alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
							{message.role === 'user' ? 'You:' : 'LLM Bot:'}
						</Text>
						<Text style={{ color: message.role === 'user' ? 'blue' : 'green', alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
							{message.content}
						</Text>
						<Text style={{ fontSize: 10, color: 'gray', alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start' }}>{message.timestamp}</Text>
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
	clearButton: {
		width: 50,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'red',
		borderRadius: 15,
	},
	clearButtonText: {
		color: 'white',
	},
};
