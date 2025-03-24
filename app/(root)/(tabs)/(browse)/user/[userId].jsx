import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import ProfileHomepage from '../../../../../components/Screens/UserPage'
import { useLocalSearchParams } from 'expo-router'
import { useFetchUser } from '../../../../../api/user'
import { fetchUser } from '../../../../../api/user'

const userIdPageBrowse = () => {
    const { userId } = useLocalSearchParams();
    console.log('id is ', userId);

    const { data:user, refetch:refetchUser, isFetching:isFetchingUser } = useFetchUser( { id : Number(userId)} )
   


  return (
    < View className='w-full h-full bg-primary' >
    { !user ? (
      <View className='h-full justify-center items-center'>
      <ActivityIndicator />
      </View>
    ) : (
      <ProfileHomepage user={user} refetchUser={refetchUser} isFetchingUser={isFetchingUser}  />
    ) }
  </View>
  )
}

export default userIdPageBrowse

const styles = StyleSheet.create({})