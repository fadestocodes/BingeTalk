import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../constants/Colors'
import { blockUser, useFetchOwnerUser } from '../../api/user'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { BackIcon } from '../../assets/icons/icons'
import { reportPost } from '../../api/report'
import ToastMessage from '../ui/ToastMessage'
import { useUser } from '@clerk/clerk-expo'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'



const BlockModalPage = () => {
    const { blockedBy, userBeingBlocked } = useLocalSearchParams()
    const router = useRouter()
    const { user:clerkUser } = useUser()
    const { data: ownerUser, refetch } = useFetchOwnerUser({email: clerkUser.emailAddresses[0].emailAddress})
    const [message, setMessage] = useState(null)
    const [ isBlocking, setIsBlocking ] = useState(false)


    useEffect(() => {
        if (ownerUser){
            const userBlockList = ownerUser?.blockedUsers
            const alreadyBlocking = userBlockList?.some( item => item?.userBeingBlocked === Number(userBeingBlocked)  )
            setIsBlocking(alreadyBlocking)
        }
    },[ownerUser])

//   useFocusEffect(
//     useCallback(() => {
//       if (refetch) refetch();
//     }, [refetch])
//   );

    const handleReport = async () => {
        const data = {
            reporterId : Number(blockedBy),
            userToReportId : Number(userBeingBlocked),
            description: "Reported user"
        }
        const reported = await reportPost(data)
        setMessage(reported.message)
        setTimeout(()=>{
            router.back()
        }, 1500)
    }
    
    const handleBlock = async () => {
        const data = {
            blockedBy : Number(blockedBy),
            userBeingBlocked : Number(userBeingBlocked)
        }
        const blocked = await blockUser(data)
        setIsBlocking(prev => !prev)
        refetch()
        setMessage(blocked.message)
        setTimeout(() => {
            router.back()
        },1500)
    }

    if (!ownerUser){
        return (
            <View className='w-full h-full justify-center items-center'>
                <ActivityIndicator/>
            </View>
        )
    }
    

  return (
    <View className='w-full h-full bg-primary'>
        <ToastMessage message={message}  onComplete={()=>setMessage(null)}   />

        <View style={{paddingHorizontal:30, paddingTop:70, paddingBottom:150, gap:12, borderRadius:30}}>
        <TouchableOpacity onPress={()=>router.back()} style={{paddingBottom:20}}>
              <BackIcon size={22} color={Colors.mainGray}/>
            </TouchableOpacity>
            <View className='gap-5 pt-10'>
                <TouchableOpacity onPress={handleReport} style={{backgroundColor:Colors.secondary, borderRadius:30, width:250, alignSelf:'center', paddingHorizontal:30, paddingVertical:15}}>
                    <Text className='font-pbold text-center'>Report user</Text>

                </TouchableOpacity>
                <TouchableOpacity onPress={handleBlock} style={{backgroundColor: isBlocking ? 'none' : Colors.secondary, borderWidth:1, borderColor:Colors.secondary, borderRadius:30, width:250, alignSelf:'center', paddingHorizontal:30, paddingVertical:15}}>
                    <Text className='font-pbold text-center' style={{color:isBlocking ? Colors.secondary : Colors.primary}}>{isBlocking ? 'Unblock user' : 'Block user'}</Text>

                </TouchableOpacity>
            </View>
         </View>
    </View>
  )
}

export default BlockModalPage

const styles = StyleSheet.create({})