import { StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';
import ChatHistory from '../../components/ChatSessionsList';

export default function ChatHistoryScreen() {
	return (
		<View style={styles.container}>
			<ChatHistory />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
