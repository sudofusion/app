import { StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';
import ChatMessages from '../../components/ChatMessages';

export default function NewChatScreen() {
	return (
		<View style={styles.container}>
			<ChatMessages />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
