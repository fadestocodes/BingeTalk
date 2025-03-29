import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useFetchSpecificList } from '../../../../../api/list'
import { useLocalSearchParams } from 'expo-router'
import TinderSwipeCard from '../../../../../components/TinderSwipeCard/TinderSwipeCard'

const ListPage = () => {
    const {listId} = useLocalSearchParams();
    const { data:list, isLoading,  } = useFetchSpecificList(Number(listId))
   
  return (
<View className='h-full bg-primary'>
    { !list ? (
      <View className='justify-center items-center h-full'>
      <ActivityIndicator />
      </View>
    ) : (
      <TinderSwipeCard listItems={list.listItem} creator={list.user} listId={listId} listObj={list}/>
    )}
    </View>
  )
}

export default ListPage

const styles = StyleSheet.create({})