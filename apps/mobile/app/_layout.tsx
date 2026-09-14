import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#030303' } }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
