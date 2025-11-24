import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useGetSetDaysInfinite } from '../../api/setDay'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { formatDate, getYear } from '../../lib/formatDate'

const SetDaysPage = () => {
    const {userId} = useLocalSearchParams()
    const {data, loading, refetch, fetchMore, hasMore} = useGetSetDaysInfinite(Number(userId))
    const router = useRouter()
    
    const handleIdPress = (item) => {
        router.push(`/setDay/${item.id}`)
    }

    if (!data){
        return <ActivityIndicator />
    }
  return (
    <SafeAreaView edges={['top']} >
      <View className='h-full w-full px-8 py-4 justify-start items-center gap-3 ' >
          <Text className='text-3xl text-white font-pbold self-start'>SetDays</Text>
          <Text className=' text-mainGray font-medium self-start'>See a log of your days on set</Text>

          {data?.length > 0 ? (
            <View>
                <FlatList 
                    refreshControl={
                        <RefreshControl 
                            refreshing={loading}
                            onRefresh={refetch}
                        />
                    }
                    data={data}
                    keyExtractor={(item) => item.id}
                    onEndReached={()=>fetchMore}
                    contentContainerStyle={{gap:15, paddingVertical:15}}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={()=>handleIdPress(item)} className='flex flex-row gap-3 justify-between items-center w-full '>
                            <View className='flex flex-row justify-center items-center gap-3 '>
                                <Image 
                                    source={item.image}
                                    width={45}
                                    height={60}
                                    style={{borderRadius:5}}
                                />
                                <View className='flex flex-col gap-0 justify-center items-start'>
                                    <Text className='text-mainGrayDark font-medium text-sm'>Production:</Text>
                                    <Text className='text-mainGray font-medium text-sm'>{item.production}</Text>
                                </View>
                            </View>
                            <Text className='text-sm text-mainGrayDark'>{formatDate(item.createdAt)}</Text>

                        </TouchableOpacity>
                    )}

                />
            </View>
          ) : (
            <View>
                <Text className='text-mainGray text-xl font-semibold'>Nothing to show...</Text>
            </View>
          )  }

          
      </View>
    </SafeAreaView>
  )
}

export default SetDaysPage

const styles = StyleSheet.create({})