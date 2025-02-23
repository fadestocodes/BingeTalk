import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView, ScrollView,Keyboard, Platform, TouchableWithoutFeedback } from 'react-native'
import React, {useState} from 'react'
import DialogueCard from '../../../../../components/Screens/DialoguePage'
import { useLocalSearchParams } from 'expo-router'
import { useFetchDialogues } from '../../../../../api/dialogue'
import { useFetchOwnerUser } from '../../../../../api/user'
import { useUser } from '@clerk/clerk-expo'


const dialoguePage = () => {
    const {dialogueId} = useLocalSearchParams();
    const [ textInputFocus, setTextInputFocus ] = useState(false);
    const { user:clerkUser } = useUser()
    const {data:user  } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })

    console.log(dialogueId)
    const { data:dialogues, isFetching } = useFetchDialogues( user.id );
    console.log('dialogue array', dialogues)
    const dialogue = dialogues?.find( item => item.id === Number(dialogueId) )
    console.log('founde dialogue', dialogue)


    
  return (

    <SafeAreaView className='w-full h-full   bg-primary' style ={{height:'100%', height:'100%' , justifyContent:'center', alignItems:'center'}}>
        <KeyboardAvoidingView
            style={{ flex: 1, width:'100%', height:'100%' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView  className='bg-primary' style={{ width:'100%', height:'100%' }}>
                <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} style={{width:'100%', height:'100%'}}>

                    <View className='' style={{paddingHorizontal:15, gap:30}} >
                        <DialogueCard dialogue={dialogue} />
                    </View>

                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default dialoguePage

const styles = StyleSheet.create({})