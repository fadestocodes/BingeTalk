import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useFetchWatchlist } from '../../../../../../api/user'
import { useLocalSearchParams } from 'expo-router'
import { Colors } from '../../../../../../constants/Colors'

const WatchlistFromProfile = () => {
    const {userId} = useLocalSearchParams();
    const { data:watchlist, refetch, isFetching } = useFetchWatchlist(userId);
    console.log("WATCHLIST", watchlist)

    if (isFetching){
        return <RefreshControl tintColor={Colors.secondary}   />
    }

  return (
    <SafeAreaView className='w-full h-full bg-primary justify-start items-center' style={{  paddingTop:100, paddingHorizontal:15 }}>
        <View style={{ paddingTop:30, gap:5 }}>
        <View className='justify-center items-center'>
                <Text className='text-white text-2xl font-pbold'>Watchlist</Text>
                <Text className='text-mainGray text-center '>Titles to watch next</Text>
            </View>
            <View style={{ paddingTop:50 }}>
            { watchlist.listItem.length < 1 ? (
                <View>
                    <Text className='text-mainGray text-center text-xl font-pmedium' >(List is empty)</Text>
                </View>
            ) : (
                <FlatList
                    data={watchlist.listItem}
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

export default WatchlistFromProfile

const styles = StyleSheet.create({})