// import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import ProfileHomepage from '../../../../../components/Screens/UserPage'
// import { useLocalSearchParams } from 'expo-router'
// import { useFetchUser } from '../../../../../api/user'
// import { fetchUser } from '../../../../../api/user'

// const userIdPage = () => {
//     const { userId } = useLocalSearchParams();

//     const { data:user, refetch:refetchUser, isFetching:isFetchingUser } = useFetchUser( { id : Number(userId)} )
   


//   return (
//     < View className='w-full h-full bg-primary' >
//     { !user ? (
//       <View className='h-full justify-center items-center'>
//       <ActivityIndicator />
//       </View>
//     ) : (
//       <ProfileHomepage user={user} refetchUser={refetchUser} isFetchingUser={isFetchingUser}  />
//     ) }
//   </View>
//   )
// }

// export default userIdPage

// const styles = StyleSheet.create({})



import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useGetUser, useGetUserFull } from '../../../../../api/auth'
import ProfilePage from '../../../../../components/Screens/ProfilePage'
import { useFetchUserProfile } from '../../../../../api/user'
import { useLocalSearchParams } from 'expo-router'

const UserIDPage = () => {
  // const { user:userSimple, refetch } = useGetUser();
  const {userId} = useLocalSearchParams()
  // const {userFull, refetch:refetchUser, loading} = useGetUserFull(userSimple?.id)
  const {userData, refetchUserFetched,loading} = useFetchUserProfile(userId)

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