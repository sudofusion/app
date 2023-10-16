import { StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';
import ChatSessionsList from '../../components/ChatSessionsList';

export default function ChatHistoryScreen() {
	return (
		<View style={styles.container}>
			<ChatSessionsList />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
