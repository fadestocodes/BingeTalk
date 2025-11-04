

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProfileHomepage from '../../../../components/Screens/UserPage'


import { useFetchOwnerUser } from '../../../../api/user'
import { useGetUser, useGetUserFull } from '../../../../api/auth'

const UserIDPage = () => {
  const { user:userSimple, refetch } = useGetUser();
  const {userFull, refetch:refetchUser, loading} = useGetUserFull(userSimple?.id)


  return (
    <View className='bg-primary h-full'>
      { !userSimple ? (
        <View className='h-full justify-center items-center'>
        <ActivityIndicator/>
        </View>
      ) : (
        <ProfileHomepage user={userFull} refetchUser={refetchUser} isFetchingUser={loading}  />
      )}
    </View>
  )
}

export default UserIDPage

const styles = StyleSheet.create({})