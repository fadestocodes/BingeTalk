import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommentsComponent from '../../../../components/CommentsComponent'
import { useLocalSearchParams } from 'expo-router'

const commentsModalFromHome = () => {
  const {dialogueId, threadId, listId, reviewId} = useLocalSearchParams()
  let postType
  if (dialogueId){
    postType = 'dialogue'
  } else if (threadId){
    postType = 'thread'
  } else if (listId){
    postType = 'list'
  }else if (reviewId){
    postType = 'review'
  }
  return (
    <CommentsComponent postType={postType} dialogueId={dialogueId} threadId={threadId} listId={listId} fromModal={true} />
  )
}

export default commentsModalFromHome
