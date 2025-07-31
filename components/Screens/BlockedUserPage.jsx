import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import { Colors } from '../../constants/Colors'
import { BackIcon } from '../../assets/icons/icons'
import { useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../api/user'
import { blockUser } from '../../api/user'
import { avatarFallback } from '../../lib/fallbackImages'


const BlockedUserPage = () => {
    const router = useRouter()
    const {user:clerkUser} = useUser()
    const { data: ownerUser, refetch, isLoading} = useFetchOwnerUser({email: clerkUser.emailAddresses[0].emailAddress})
    const [ blockedUsers, setBlockedUsers ] = useState([])

    useEffect(() => {
        if (ownerUser){
            const blockedUsersData = ownerUser.blockedUsers
            setBlockedUsers(blockedUsersData)
        }
    }, [ownerUser])

    const removeBlock = async (item) => {
        try {
            const params = {
                blockedBy : ownerUser.id,
                userBeingBlocked : item.userBlocked.id 
            }
            await blockUser(params)
            refetch()
            setBlockedUsers( prev => prev.filter( i => i.userBlocked.id !== item.userBlocked.id ) )
        } catch (err){
            console.log(err)
        }
    }


    if (!ownerUser){
        return (
            <View className='w-full h-full justify-center items-center'>
                <ActivityIndicator />
            </View>
        )
    }


  return (
    <SafeAreaView className='h-full w-full bg-primary'>
    <View className='w-full h-full  bg-primary  px-4 gap-5' style={{paddingBottom:200}}>

          <TouchableOpacity onPress={()=>router.back()}>
            <BackIcon size={26} color={Colors.mainGray} />
        </TouchableOpacity>
        <View className="gap-5">
            <View className='flex-row gap-2 justify-start items-center'>

              <Text className='text-white font-pbold text-3xl'>Blocked users</Text>
            </View>
            <FlatList
                refreshControl={
                    <RefreshControl 
                        refreshing = {isLoading}
                        onRefresh={refetch}
                        tintColor={Colors.secondary}
                    />
                }
                data={blockedUsers}
                keyExtractor={item => item.id}
                contentContainerStyle={{gap:15}}
                renderItem={({item}) => {
                    return (
                    <View>
                   <View className="flex-row justify-between items-center gap-2">
                        <TouchableOpacity  onPress={()=>router.push(`/user/${item.userBlocked.id}`)} className='flex-row gap-2 justify-center items-center'>
                                <Image
                                source={{ uri : item.userBlocked.profilePic || avatarFallback }}
                                contentFit='cover'
                                style={{ width:40, height:40, borderRadius:50 }}
                                />
                                <View>
                                    <Text className='text-mainGray font-pbold'>@{item.userBlocked.username}</Text>
                                    <Text className='text-white font-pregular'>{item.userBlocked.firstName } { item.userBlocked.lastName}</Text>

                                </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>removeBlock(item)} style={{backgroundColor:Colors.secondary, borderWidth:1, borderColor:Colors.secondary,borderRadius:10, padding:5}}>
                            <Text className='   font-pbold text-sm' style={{color: Colors.primary}}>Unblock</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                )}}
            />
        </View>
        </View>
        </SafeAreaView>
        
  )
}

export default BlockedUserPage

const styles = StyleSheet.create({})