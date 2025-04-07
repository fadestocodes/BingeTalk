import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommentsModalPage from '../../../../components/Screens/CommentsModalPage'
import CommentsComponent from '../../../../components/CommentsComponent'
import { useLocalSearchParams } from 'expo-router'

const commentsModalFromHome = () => {
  const {dialogueId, threadId, listId, activityId} = useLocalSearchParams()
  let postType
  if (dialogueId){
    postType = 'dialogue'
  } else if (threadId){
    postType = 'thread'
  } else if (listId){
    postType = 'list'
  } else if (activityId){
    postType = 'activity'
  }
  return (
    <CommentsComponent postType={postType} dialogueId={dialogueId} threadId={threadId} listId={listId}  activityId={activityId}/>
  )
}

export default commentsModalFromHome
