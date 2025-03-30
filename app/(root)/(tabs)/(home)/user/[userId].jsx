import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import ProfileHomepage from '../../../../../components/Screens/UserPage'
import { useLocalSearchParams } from 'expo-router'
import { useFetchUser } from '../../../../../api/user'
import { fetchUser } from '../../../../../api/user'

const userIdPage = () => {
    const { userId } = useLocalSearchParams();

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

export default userIdPage

const styles = StyleSheet.create({})