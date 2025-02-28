import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useFetchRecentlyWatched } from '../../../../../../api/user'
import { useLocalSearchParams } from 'expo-router'
import { Colors } from '../../../../../../constants/Colors'

const RecentlyWatchedFromProfile = () => {
    const {userId} = useLocalSearchParams();
    const { data:recentlyWatched, refetch, isFetching } = useFetchRecentlyWatched(userId);
    console.log('recently watched array', recentlyWatched)

    if (isFetching){
        return <RefreshControl tintColor={Colors.secondary}   />
    }

  return (
    <SafeAreaView className='w-full h-full bg-primary justify-start items-center' style={{  paddingTop:100, paddingHorizontal:15 }}>
       <View style={{ paddingTop:30, gap:15 }}>
            <View className='justify-center items-center'>
                <Text className='text-white text-2xl font-pbold'>Recently Watched</Text>
                <Text className='text-mainGray text-center '>Recently watched titles from @{recentlyWatched.user.username}</Text>
            </View>
            <View style={{ paddingTop:50 }}>
            { recentlyWatched.listItem.length < 1 ? (
                <View>
                    <Text className='text-mainGray text-center text-xl font-pmedium' >(List is empty)</Text>
                </View>
            ) : (
                <FlatList
                    data={recentlyWatched.listItem}
                    keyExtractor={item => item.id}
                    renderItem={({item})=>(
                        <View>
                            
                        </View>
                    )}
                />
            )  }
                </View>
        </View>
    </SafeAreaView>
  )
}

export default RecentlyWatchedFromProfile

const styles = StyleSheet.create({})