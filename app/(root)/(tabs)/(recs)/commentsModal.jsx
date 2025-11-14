import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommentsComponent from '../../../../components/CommentsComponent'
import { useLocalSearchParams } from 'expo-router'

const commentsModalFromHome = () => {
  const {dialogueId, threadId, listId, activityId, reviewId} = useLocalSearchParams()
  let postType
  if (dialogueId){
    postType = 'dialogue'
  } else if (threadId){
    postType = 'thread'
  } else if (listId){
    postType = 'list'
  } else if (activityId){
    postType = 'activity'
  } else if (reviewId){
    postType = 'review'
  }
  return (
    <CommentsComponent postType={postType} dialogueId={dialogueId} threadId={threadId} listId={listId}  activityId={activityId} reviewId={reviewId}/>
  )
}

export default commentsModalFromHome
