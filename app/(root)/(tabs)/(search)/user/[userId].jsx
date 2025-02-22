import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ProfileHomepage from '../../../../../components/Screens/UserPage'
import { useLocalSearchParams } from 'expo-router'
import { useFetchUser } from '../../../../../api/user'
import { fetchUser } from '../../../../../api/user'

const userIdPage = () => {
    const { userId } = useLocalSearchParams();
    console.log('id is ', userId);

    const { data:user, refetch:refetchUser, isFetching:isFetchingUser } = useFetchUser( { id : Number(userId)} )
   


  return (
        <ProfileHomepage user={user} refetchUser={refetchUser} isFetchingUser={isFetchingUser}  />
  )
}

export default userIdPage

const styles = StyleSheet.create({})