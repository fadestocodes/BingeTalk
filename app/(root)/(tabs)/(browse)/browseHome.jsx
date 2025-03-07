import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TinderSwipeCard from '../../../../components/TinderSwipeCard/TinderSwipeCard'
import { useRouter } from 'expo-router'

const browseHome = () => {
    const router = useRouter()
    console.log('router path from browseHome', router.pathname)
  return (
    <View className='w-full h-full bg-primary'>
        <TinderSwipeCard />
    </View>
  )
}

export default browseHome

const styles = StyleSheet.create({})