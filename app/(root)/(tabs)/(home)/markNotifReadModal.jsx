import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Colors } from '../../../../constants/Colors'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { markAllRead, useGetAllNotifs } from '../../../../api/notification'
import { useNotificationCountContext } from '../../../../lib/NotificationCountContext'
import { useGetUser, useGetUserFull } from '../../../../api/auth'


const markNotifReadModal = () => {
    const { userId  } = useLocalSearchParams()
    const {updateNotifCount} = useNotificationCountContext()

    const {user} = useGetUser()
    const {userFull:ownerUser} = useGetUserFull(user?.id)
    
    const router = useRouter()
    const {refetch} = useGetAllNotifs(ownerUser?.id, 10)

    const handleConfirm = async () => {
        const data = {
            recipientId : Number(userId)
        }
        const response = await markAllRead(data)
        updateNotifCount(0)
        router.back()
    }

  return (
    <View className="pt-20 px-10 gap-5 ">
        <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20, alignSelf:'center' }} />

      <Text className="text-white font-pbold text-3xl">Mark all notifications as read?</Text>
      <TouchableOpacity onPress={handleConfirm} style={{ backgroundColor:Colors.secondary, borderRadius:30, paddingHorizontal:30, paddingVertical:10, width:200, justifyContent:'center', alignItems:'center', alignSelf:'center' }}>
        <Text className="text-primary font-pbold">Confirm</Text>
      </TouchableOpacity>
    </View>
  )
}

export default markNotifReadModal

const styles = StyleSheet.create({})