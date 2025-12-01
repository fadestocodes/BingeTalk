import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserDialoguesPage from '../../../../../components/Screens/UserDialoguesPage'
import { useGetUserDialoguesInfinite } from '../../../../../api/dialogue'
import { useLocalSearchParams } from 'expo-router'

const UserDialogues = () => {
    const {userId} = useLocalSearchParams()

    const {data, loading, hasMore, refetch, fetchMore} = useGetUserDialoguesInfinite(userId)


    if (!userId || loading){
        return <ActivityIndicator />
    }
  return (
        <UserDialoguesPage dialogues={data} refetchDialogues={refetch} fetchMoreDialogues={fetchMore} hasMore={hasMore} loading={loading}/>
  )
}

export default UserDialogues

const styles = StyleSheet.create({})