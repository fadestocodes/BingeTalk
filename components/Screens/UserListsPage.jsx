import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image';
import React , {useEffect} from 'react'
import { useFetchUsersLists, listInteraction, useFetchUsersListsInfinite } from '../../api/list'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake } from 'lucide-react-native';
import {  LayersIcon, MessageIcon, RepostIcon, ThreeDotsIcon} from '../../assets/icons/icons'
import { useFetchOwnerUser } from '../../api/user';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { usePostRemoveContext } from '../../lib/PostToRemoveContext';
import ListCard from '../ListCard';


const UserListsPage = ( { userId } ) => {
    const { data : lists, refetch, loading , removeItem, fetchMore, hasMore} = useFetchUsersListsInfinite(userId, 10);
    const posterURL = 'https://image.tmdb.org/t/p/w500';
    const { user : clerkUser } = useUser()
    const router = useRouter();
    const { postToRemove, updatePostToRemove } = usePostRemoveContext()
    const { data : ownerUser } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })


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


    if ( !ownerUser){
        return (
            <View className='h-full justify-center items-center bg-primary'>
                <ActivityIndicator/>
            </View>
        )
    }


    return (
        <SafeAreaView className='w-full h-full px-4' style={{ paddingTop : 70 }}>
    <View style={{ height:'100%', gap:15 }} >

        <View className='flex-row justify-evenly items-center gap-1 '>
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
        </View>
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
            contentContainerStyle={{ gap:15 }}
            renderItem={ ({item}) => {
                // console.log('each list', item)
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