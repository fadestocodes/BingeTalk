import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image';
import React , {useEffect} from 'react'
import { useFetchUsersLists, listInteraction, useFetchUsersListsInfinite } from '../../api/list'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake } from 'lucide-react-native';
import {  BackIcon, LayersIcon, MessageIcon, RepostIcon, ThreeDotsIcon} from '../../assets/icons/icons'
import { useFetchOwnerUser } from '../../api/user';

import { useRouter } from 'expo-router';
import { usePostRemoveContext } from '../../lib/PostToRemoveContext';
import ListCard from '../ListCard';
import { useGetUser, useGetUserFull } from '../../api/auth';


const UserListsPage = ( { userId, firstName } ) => {
    const { data : lists, refetch, loading , removeItem, fetchMore, hasMore} = useFetchUsersListsInfinite(userId, 10);
    const posterURL = 'https://image.tmdb.org/t/p/w500';

    const {user:userSimple} = useGetUser()
    const {userFull:ownerUser} = useGetUserFull(userSimple?.id)

    const router = useRouter();
    const { postToRemove, updatePostToRemove } = usePostRemoveContext()


    useEffect(() => {
        removeItem(postToRemove)
    },[postToRemove])



    const handleInteraction =  async (type, item) => {
        console.log('type', type)
        const data = {
            type,
            listId : item.id,
            userId : ownerUser?.id
        }
        const updatedDialogue = await listInteraction(data)
        refetch();
    }

    const handleListPress = ( item ) => {
        router.push(`/list/${item.id}`)
    }

    const handleRecentlyWatchedPress = (userId) => {
        router.push(`/list/recently-watched/${userId}`)
    }

    const handleWatchlistPress = (userId) => {
        router.push(`/list/watchlist/${userId}`)
    }

    const handleInterestedPress = (userId) => {
        router.push(`/list/interested/${userId}`)
    }
    const handleRecommendedPress = (userId) => {
        router.push(`/list/recommended/${userId}`)
    }


    if ( !ownerUser || !lists){
        return (
            <View className='h-full justify-center items-center bg-primary'>
                <ActivityIndicator/>
            </View>
        )
    }


    return (
        <SafeAreaView edges={['top']} className='w-full h-full px-4 bg-primary' style={{ paddingTop : 0 }}>
            <TouchableOpacity onPress={()=>router.back()} style={{paddingBottom:10}}>
              <BackIcon size={26} color={Colors.mainGray}/>
            </TouchableOpacity>
    <View style={{ height:'100%', gap:15, paddingTop:10}} >
        <Text className='text-white font-bold text-3xl'>{firstName ? `${firstName}'s Lists` : 'Lists'}</Text>

        {/* <View className='flex-row justify-evenly items-center gap-1 '>
            <TouchableOpacity onPress={()=>handleRecentlyWatchedPress(userId)} className='justify-center items-center gap-3' style={{backgroundColor:Colors.mainGrayDark, width:80, height:80, padding:8, borderRadius:15}}>
                <Text className='text-mainGray text-xs font-pbold '>Recently Watched</Text>
                <Clock9 color={Colors.mainGray} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity  onPress={()=>handleWatchlistPress(userId)}  className='justify-center items-center gap-3' style={{backgroundColor:Colors.mainGrayDark, width:80, height:80, padding:8, borderRadius:15}}>
                <Text className='text-mainGray text-xs font-pbold '>Watchlist</Text>
                <ListChecks  color={Colors.mainGray} strokeWidth={2.5}/>
            </TouchableOpacity>
            <TouchableOpacity  onPress={()=>handleInterestedPress(userId)}  className='justify-center items-center gap-3'style={{backgroundColor:Colors.mainGrayDark, width:80, height:80, padding:8, borderRadius:15}}>
                <Text className='text-mainGray text-xs font-pbold '>Interested</Text>
                <BadgeHelp color={Colors.mainGray} strokeWidth={2}/>
            </TouchableOpacity>
            <TouchableOpacity  onPress={()=>handleRecommendedPress(userId)}  className='justify-center items-center gap-3' style={{backgroundColor:Colors.mainGrayDark, width:80, height:80, padding:8, borderRadius:15}}>
                <Text className='text-mainGray text-xs font-pbold '>Recommendations</Text>
                <Handshake color={Colors.mainGray} strokeWidth={2}/>
            </TouchableOpacity>
        </View> */}
        <FlatList
        refreshControl={
            <RefreshControl
                tintColor={Colors.secondary}
                refreshing={loading}
                onRefresh={refetch}
            />
        }
            data={lists}
            showsVerticalScrollIndicator={false}
            onEndReached={()=> {
                if (hasMore){
                    fetchMore(userId, 10)
                }
            }}
            onEndReachedThreshold={0.2}
            keyExtractor={item => item.id}
            contentContainerStyle={{ gap:15 ,paddingBottom:100}}
            renderItem={ ({item}) => {
                return (
                <ListCard list={item} />
            )} }
        />

    </View>
    </SafeAreaView>
  )
}

export default UserListsPage

const styles = StyleSheet.create({})