import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ActivityCard from '../../../../../components/ActivityCard'
import { useLocalSearchParams } from 'expo-router'
import { useFetchActivityId } from '../../../../../api/activity'

const ActivityPage = () => {

    const { activityId } = useLocalSearchParams();
    const {  data:activity , refetch, loading } = useFetchActivityId(activityId)

  return (
    <SafeAreaView className='w-full h-full bg-primary'>
      { loading ? (
        <View className='h-full justify-center items-center'>
          <ActivityIndicator/>
        </View>
      ) : (
        <View className='px-4'>
        <ActivityCard activity={activity} refetch={refetch}  />
        </View>
      ) }
    </SafeAreaView>
  )
}

export default ActivityPage

const styles = StyleSheet.create({})