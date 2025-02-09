import { Stack, useRouter } from 'expo-router';

export default function ExploreLayout() {
  return (
    <Stack
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarStyle: route.name === 'explorePage' ? { display: 'none' } : undefined, // Hide tabs for `explorePage`
      })}
    >
      <Stack.Screen name="explorePage" options={{ headerShown: false, presentation:'modal' }} />
    </Stack>
  );
}
