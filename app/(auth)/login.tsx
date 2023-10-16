import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = () => {
		if (email.trim() && password.trim()) {
			//TODO: implement auth
		} else {
			Alert.alert('Error', 'Please enter a valid email and password.');
		}
	};

	return (
		<View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
			<TextInput
				style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<TextInput
				style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			<Button title="Login" onPress={handleLogin} />
		</View>
	);
};

export default LoginScreen;
