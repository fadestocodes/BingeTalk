import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import ProfileHomepage from '../../../../../components/Screens/UserPage'
import { useLocalSearchParams } from 'expo-router'
import { useFetchUser, useFetchUserProfile } from '../../../../../api/user'
import { fetchUser } from '../../../../../api/user'
import ProfilePage from '../../../../../components/Screens/ProfilePage'

const userIdPage = () => {
    const { userId } = useLocalSearchParams();
    const { userData:user, refetchUserFetched:refetchUser, loading:isFetchingUser } = useFetchUserProfile(  userId )



  if (!user || isFetchingUser){
    return(

      <View className='h-full w-full bg-primary justify-center items-center'>
        <ActivityIndicator />
      </View>
    ) 
  }
   


  return (
        <ProfilePage userFetched={user} refetchUserFetched={refetchUser} isFetchingUser={isFetchingUser}  />
  )
}

export default userIdPage

const styles = StyleSheet.create({})