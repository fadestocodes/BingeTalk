import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useGetUser, useGetUserFull } from '../../../../api/auth'
import RecommendationListScreen from '../../../../components/Screens/RecommendationListScreen'

const recsHome = () => {

  return (
    <RecommendationListScreen />
  )
}

export default recsHome

const styles = StyleSheet.create({})