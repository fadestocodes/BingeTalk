import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants/Colors'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { deleteUser } from '../../api/user'
import { useSignOutUser } from '../../api/auth'


const DeleteAccountPage = () => {
    const [ whichStep, setWhichStep ] = useState('one')
    const {userId} = useLocalSearchParams()
    const {signOutUser} = useSignOutUser()
    const router = useRouter()

    const handleDelete = async () => {
        
        const deletedUser = await deleteUser({userId})
        await signOutUser()
        router.replace('/')
    }

  return (
    <SafeAreaView className='w-full h-full bg-primary' style={{borderRadius:30}}>
        <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20, alignSelf:'center' }} />
        <View style={{paddingHorizontal:30, paddingTop:70, paddingBottom:150, gap:12, borderRadius:30}}>

        { whichStep === 'one' ? (
            <View className='gap-3 '>
                <Text className='text-white font-pbold text-2xl'>Are you sure you want to delete your account?</Text>
                <Text className='text-mainGray'>Once you delete your account, all your data will be permanently erased. Please note that this action is irreversible.</Text>
                <TouchableOpacity onPress={()=>setWhichStep('two')} style={{ backgroundColor:Colors.secondary, borderRadius:30, paddingHorizontal:30, paddingVertical:12, marginTop:30, width:250, alignSelf:'center' }}>
                    <Text className='font-pbold text-center'>Delete</Text>
                </TouchableOpacity>
            </View>
        ) : whichStep === 'two' && (

            <View className='gap-3 '> 
                <Text className='text-white font-pbold text-2xl'>Confirm to delete your account</Text>
                <Text className='text-mainGray'>There will be no way to recover your data after this.</Text>
              <TouchableOpacity onPress={handleDelete} style={{ backgroundColor:Colors.secondary, borderRadius:30, paddingHorizontal:30, paddingVertical:12, marginTop:30, width:250, alignSelf:'center' }}>
                <Text className='font-pbold text-center'>Delete my account</Text>
              </TouchableOpacity>
            
            </View>
        )}
        </View>
    </SafeAreaView>
  )
}

export default DeleteAccountPage

const styles = StyleSheet.create({})