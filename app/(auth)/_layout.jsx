import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href='/' />
  }

  return (
  <Stack>
    <Stack.Screen name='signIn' options={{headerShown:false}} />
    <Stack.Screen name='resetPassword' options={{headerShown:false}} />
  </Stack>

    )

}