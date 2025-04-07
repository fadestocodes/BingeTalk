import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import ActivityCard from '../../../../../components/ActivityCard'
import ActivityCard2 from '../../../../../components/ActivityCard2'
import { useLocalSearchParams } from 'expo-router'
import { useFetchActivityId } from '../../../../../api/activity'
import ActivityPage from '../../../../../components/Screens/ActivityPage'

const ActivityId = () => {

    const { activityId } = useLocalSearchParams();
    const {  data:activity , refetch, loading } = useFetchActivityId(activityId)

  return (
    <>
     
        <ActivityPage />
      </>
  )
}

export default ActivityId

const styles = StyleSheet.create({})