import { Redirect, Stack } from 'expo-router'

import { checkIsSignedIn, useCheckSignedIn } from '../../api/auth'

export default function AuthRoutesLayout() {
  
  const {isSignedIn} = useCheckSignedIn()
  console.log(isSignedIn)

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