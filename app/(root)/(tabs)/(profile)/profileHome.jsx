

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProfileHomepage from '../../../../components/Screens/UserPage'

import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../../../api/user'

const UserIDPage = () => {
  const { user:clerkUser } = useUser();

  const { data:user, refetch: refetchUser, isFetching: isFetchingUser } = useFetchOwnerUser( {email : clerkUser?.emailAddresses[0].emailAddress} )
  
  


  return (
    <View className='bg-primary h-full'>
      { !user ? (
        <View className='h-full justify-center items-center'>
        <ActivityIndicator/>
        </View>
      ) : (
        <ProfileHomepage user={user} refetchUser={refetchUser} isFetchingUser={isFetchingUser}  />
      )}
    </View>
  )
}

export default UserIDPage

const styles = StyleSheet.create({})