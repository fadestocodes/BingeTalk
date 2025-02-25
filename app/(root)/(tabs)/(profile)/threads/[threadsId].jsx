
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import ThreadsIdPage from '../../../../../components/Screens/ThreadsPage'
import { fetchSingleThread } from '../../../../../api/thread'

const threadsId = () => {
    

  return (
   
    <ThreadsIdPage ></ThreadsIdPage>
  )

}

export default threadsId

const styles = StyleSheet.create({})