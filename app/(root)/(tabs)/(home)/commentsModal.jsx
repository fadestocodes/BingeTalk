import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommentsComponent from '../../../../components/CommentsComponent'
import { useLocalSearchParams } from 'expo-router'

const commentsModalFromHome = () => {
  const {dialogueId, threadId, listId, activityId, reviewId, setDayId} = useLocalSearchParams()
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
  } else if (setDayId){
    postType = 'setDay'
  }
  return (
    <CommentsComponent postType={postType} dialogueId={dialogueId} setDayId = {setDayId} listId={listId}  activityId={activityId} reviewId={reviewId} fromModal={true}/>
  )
}

export default commentsModalFromHome
