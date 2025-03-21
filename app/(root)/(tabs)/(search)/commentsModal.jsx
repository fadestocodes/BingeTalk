import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommentsModalPage from '../../../../components/Screens/CommentsModalPage'
import CommentsComponent from '../../../../components/CommentsComponent'
import { useLocalSearchParams } from 'expo-router'

const commentsModalFromHome = () => {
  const {dialogueId, threadId, listId} = useLocalSearchParams()
  let postType
  if (dialogueId){
    postType = 'dialogue'
  } else if (threadId){
    postType = 'thread'
  } else if (listId){
    postType = 'list'
  }
  return (
    <CommentsComponent postType={postType} dialogueId={dialogueId} threadId={threadId} listId={listId} />
  )
}

export default commentsModalFromHome
