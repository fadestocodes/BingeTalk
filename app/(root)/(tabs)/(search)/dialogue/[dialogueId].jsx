import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useFetchSingleDialogue, fetchSingleDialogue } from '../../../../../api/dialogue'
import DialogueCard from '../../../../../components/Screens/DialoguePage'

const DialoguePageFromSearch = () => {
    console.log('hello from dialogue page from search tab')
    const { dialogueId, movieId } = useLocalSearchParams();
    console.log('dialogueId and movieID', dialogueId, movieId)
    const [ dialogue, setDialogue ] = useState(null)
    

    useEffect(()=>{
        const getSingleDialogue = async () => {
            const dialogue = await fetchSingleDialogue( Number(dialogueId) );
            setDialogue(dialogue);
        }
        getSingleDialogue();
    }, [])
    // const { data:dialogue, refetch, isFetching } = useFetchSingleDialogue(Number(dialogueId))
    console.log('SELECTED dialogue from search page', dialogue);

    if (!dialogue) {
        return <ActivityIndicator></ActivityIndicator>
    }

  return (
    <SafeAreaView className='w-full h-full bg-primary'>
        <ScrollView style={{paddingHorizontal:15}}>
            <DialogueCard dialogue={dialogue} ></DialogueCard>
      </ScrollView>
      </SafeAreaView>
  )
}

export default DialoguePageFromSearch

const styles = StyleSheet.create({})