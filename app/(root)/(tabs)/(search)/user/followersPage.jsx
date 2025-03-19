import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, {useState} from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useGetFollowersListInfinite, useGetFollowingListInfinite } from '../../../../../api/user'
import FollowersFollowingsList from '../../../../../components/Screens/FollowersFollowingsList'

const followersPage = () => {
    const { userId, listType } = useLocalSearchParams()
    const [ whichList, setWhichList ] = useState(listType)
    console.log('userId, listType', userId, listType)



  return (
    <FollowersFollowingsList limit={10} userId={userId} whichList={whichList} setWhichList={setWhichList}/>
  )
}

export default followersPage

const styles = StyleSheet.create({})