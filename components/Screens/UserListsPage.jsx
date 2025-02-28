import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native'
import React from 'react'
import { useFetchUsersLists, listInteraction } from '../../api/list'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake } from 'lucide-react-native';
import {  MessageIcon, RepostIcon, ThreeDotsIcon} from '../../assets/icons/icons'
import { useFetchOwnerUser } from '../../api/user';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';


const UserListsPage = ( { userId } ) => {
  
    const { data : lists, refetch, isFetching } = useFetchUsersLists(userId);
    console.log('lists are', lists)
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const { user : clerkUser } = useUser()
    const router = useRouter();

    const { data : ownerUser } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })




    const handleInteraction =  async (type, item) => {
        console.log('type', type)
        const data = {
            type,
            listId : item.id,
            userId : ownerUser.id
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


    return (
        <SafeAreaView className='w-full h-full' style={{ paddingTop : 70, paddingHorizontal : 20 }}>
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
                <Text className='text-mainGray text-xs font-pbold '>Recommended</Text>
                <Handshake color={Colors.mainGray} strokeWidth={2}/>
            </TouchableOpacity>
        </View>
        <FlatList
        refreshControl={
            <RefreshControl
                tintColor={Colors.secondary}
                refreshing={isFetching}
                onRefresh={refetch}
            />
        }
            data={lists}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{ gap:15 }}
            renderItem={ ({item}) => {
                console.log('each list', item)
                
                const alreadyUpvoted = item.listInteractions.some( i => i.interactionType === 'UPVOTE' && i.userId === ownerUser.id )
                const alreadyDownvoted = item.listInteractions.some( i => i.interactionType === 'DOWNVOTE'  && i.userId === ownerUser.id )
                const alreadyReposted = item.listInteractions.some( i => i.interactionType === 'REPOST'  && i.userId === ownerUser.id )

                
                return (
                <View className='w-full' >
                    <TouchableOpacity onPress={()=>handleListPress(item)}  style={{  borderRadius:10, backgroundColor:Colors.mainGrayDark,paddingVertical:15, paddingHorizontal:15, gap:15 }} >
                        <View className=''>
                            <Text className='text-white font-pbold text-xl' >{ item.title }</Text>
                            <Text className='text-mainGray text-sm font-pregular' numberOfLines={2}>{ item.caption }</Text>
                        </View>

                            <View style={{ flexDirection:'row', gap:10}} >
                        { item.listItem.slice(0,5).map( (element, index) => {
                        console.log('EACH ELEMENT', element)
                        return (

                            <View key={index} className='flex-row gap-2' > 

                                <Image
                                    source={{ uri : element.movie ? `${posterURL}${element.movie.posterPath}` : element.tv ? `${posterURL}${element.tv.posterPath}` : `${posterURL}${element.castCrew.posterPath}` }}
                                    resizeMode='cover'
                                    style= {{ borderRadius : 10, width:40, height:60 }}
                                />
                            </View>
                        )} ) }
                        { item.listItem.length - 5 > 0 && (
                        <View
                            style={{ width:40, height : 60, borderRadius:10, backgroundColor:Colors.lightBlack, padding:5 }}
                        >
                            <Text className='text-sm text-mainGray font-pbold'>+ {item.listItem.length - 5 } more</Text>
                            </View>

                        ) }
                        </View>
                        <View className='w-full flex-row justify-between items-center'>
                            <View className='flex-row gap-5 justify-center items-center'>
                                <TouchableOpacity onPress={()=> handleInteraction('upvotes',item) } >
                                    <View className='flex-row gap-1 justify-center items-center'>
                                        <ThumbsUp size={16} color={ alreadyUpvoted ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                                        <Text className='text-xs font-pbold ' style={{ color: alreadyUpvoted ? Colors.secondary : Colors.mainGray }}>{ item.upvotes }</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={()=> handleInteraction('downvotes',item) } >
                                <View className='flex-row gap-1 justify-center items-center'>
                                    <ThumbsDown size={18}  color={ alreadyDownvoted ? Colors.secondary :  Colors.mainGray}></ThumbsDown>
                                    <Text  className='text-xs font-pbold text-mainGray' style={{ color: alreadyDownvoted ? Colors.secondary : Colors.mainGray }}>{ item.downvotes }</Text>
                                </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                <View className='flex-row gap-1 justify-center items-center'>
                                    <MessageIcon size={18} color={Colors.mainGray}></MessageIcon>
                                    <Text className='text-xs font-pbold text-mainGray'>{ item.comments.length}</Text>
                                    </View>
                                </TouchableOpacity>

                                
                                <TouchableOpacity onPress={()=> handleInteraction('reposts',item) } >
                                <View className='flex-row gap-1 justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                                    <RepostIcon className='' size='14'  color={ alreadyReposted ? Colors.secondary :  Colors.mainGray}/>
                                    <Text className='text-xs font-pbold text-gray-400  'style={{ color: alreadyReposted ? Colors.secondary : Colors.mainGray }}> {item.reposts}</Text>
                                </View>

                                </TouchableOpacity>
                            </View>
                            <View className='relative' >
                                <TouchableOpacity   >
                                    <ThreeDotsIcon className='' size='14' color={Colors.mainGray} />
                                </TouchableOpacity>
                            </View>
                            
                        </View>


                    </TouchableOpacity>
                </View>
            )} }
        />

    </View>
    </SafeAreaView>
  )
}

export default UserListsPage

const styles = StyleSheet.create({})