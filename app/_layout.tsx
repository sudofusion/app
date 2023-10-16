import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Link, SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import { format } from 'date-fns';

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();
	const currentDateTime = new Date();
	const date = format(currentDateTime, 'dd MMM yyyy');

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen
					name="(tabs)"
					options={{
						headerShown: false,
						// headerTitle: date,
						// headerRight: () => (
						// 	<Link href="/login" asChild>
						// 		<Pressable>
						// 			{({ pressed }) => (
						// 				<FontAwesome
						// 					name="user"
						// 					size={25}
						// 					color={Colors[colorScheme ?? 'light'].text}
						// 					style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
						// 				/>
						// 			)}
						// 		</Pressable>
						// 	</Link>
						// ),
					}}
				/>
				<Stack.Screen name="account" options={{ presentation: 'modal' }} />
				<Stack.Screen name="modal" options={{ presentation: 'modal' }} />
			</Stack>
		</ThemeProvider>
	);
}
