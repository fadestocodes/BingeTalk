import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()
  console.log('from auth layout', isSignedIn)

  if (isSignedIn) {
    return <Redirect href='/' />
  }

  return (
  <Stack>
    <Stack.Screen name='signIn' options={{headerShown:false}} />
    <Stack.Screen name='signUp' options={{headerShown:false}} />
  </Stack>

    )

}