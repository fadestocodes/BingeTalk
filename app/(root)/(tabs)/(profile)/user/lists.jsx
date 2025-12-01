import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserListsPage from '../../../../../components/Screens/UserListsPage'
import { useLocalSearchParams } from 'expo-router'

const lists = () => {
    const {userId, firstName} = useLocalSearchParams()
  return (
    <UserListsPage userId={userId} firstName={firstName}/>
  )
}

export default lists

const styles = StyleSheet.create({})