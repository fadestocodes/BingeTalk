import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useFetchSpecificList } from '../../../../../api/list'
import { useLocalSearchParams } from 'expo-router'
import TinderSwipeCard from '../../../../../components/TinderSwipeCard/TinderSwipeCard'

const ListPage = () => {
    const {listId} = useLocalSearchParams();
    const { data:list, isLoading,  } = useFetchSpecificList(Number(listId))
    
    if (!list){
        return <ActivityIndicator/>
    }
    console.log('Hello from List Page')
  return (
   <TinderSwipeCard listItems={list.listItem} creator={list.user} listId={listId}/>
  )
}

export default ListPage

const styles = StyleSheet.create({})