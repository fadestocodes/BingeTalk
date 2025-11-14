import { Redirect, Stack } from 'expo-router'

import { checkIsSignedIn, useCheckSignedIn } from '../../api/auth'
import { Colors } from '../../constants/Colors'

export default function AuthRoutesLayout() {
  
  const {isSignedIn} = useCheckSignedIn()
  console.log(isSignedIn)

  if (isSignedIn) {
    return <Redirect href='/' />
  }

  return (
  <Stack screenOptions={{contentStyle:{backgroundColor : Colors.primary}}}>
    <Stack.Screen name='signIn' options={{headerShown:false}} />
    <Stack.Screen name='resetPassword' options={{headerShown:false}} />
  </Stack>

    )

}