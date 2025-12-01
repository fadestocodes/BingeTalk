

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProfileHomepage from '../../../../components/Screens/UserPage'


import { useFetchOwnerUser, useFetchUserProfile } from '../../../../api/user'
import { useGetUser, useGetUserFull } from '../../../../api/auth'
import ProfilePage from '../../../../components/Screens/ProfilePage'

const UserIDPage = () => {
  const { user:userSimple, refetch } = useGetUser();
  // const {userFull, refetch:refetchUser, loading} = useGetUserFull(userSimple?.id)
  const {userData, refetchUserFetched,loading} = useFetchUserProfile(userSimple?.id)

  if (!userData || loading){
    return(

      <View className='flex-1 bg-primary justify-center items-center'>
        <ActivityIndicator />
      </View>
    ) 
  }
  return (
      <ProfilePage userFetched={userData} refetchUserFetched={refetchUserFetched} loadingUser = {loading}/>
  )
}

export default UserIDPage

const styles = StyleSheet.create({})