
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThreadsIdPage from '../../../../../components/Screens/ThreadsPage'
import { useLocalSearchParams } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { fetchSingleThread } from '../../../../../api/thread'

const threadsId = () => {
    
  return (
   
    <ThreadsIdPage  ></ThreadsIdPage>
  )
}

export default threadsId

const styles = StyleSheet.create({})