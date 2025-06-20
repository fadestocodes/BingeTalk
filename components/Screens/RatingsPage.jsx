import {  StyleSheet, Text, View, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useUser } from '@clerk/clerk-expo'
import { Colors } from '../../constants/Colors'
import { Image } from 'expo-image'
import { useLocalSearchParams } from 'expo-router'
import { getYear } from '../../lib/formatDate'
import { userRatingsCategories } from '../../lib/CategoryOptions'
import { ThreeDotsIcon, BackIcon, FilmIcon, TVIcon } from '../../assets/icons/icons'

const RatingsPage = () => {
    const { type, tab, ratingsId }  = useLocalSearchParams()
    console.log('testinghere', type, tab,  ratingsId)

  return (
    <SafeAreaView className="w-full h-full bg-primary">
        <View style={{paddingHorizontal:15, paddingBottom:220}}>

        
      
        <View className="gap-0">
      <TouchableOpacity onPress={()=>router.back()} style={{paddingBottom:10}}>
              <BackIcon size={26} color={Colors.mainGray}/>
            </TouchableOpacity>
          <View className='flex-row  justify-start items-center'>

            <Text className='text-white font-pbold text-3xl'>{firstName}'s ratings</Text>
          </View>
          <Text className='text-mainGray font-pmedium'>A look at their taste in films & shows</Text>
          <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={userRatingsCategories}
          keyExtractor={(item,index) => index}
          contentContainerStyle={{ gap:10 , paddingTop:15}}
          renderItem={({item}) => (
            <TouchableOpacity onPress={()=>{setSelected(item) }} style={{ borderRadius:15, backgroundColor:selected===item ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
              <Text className=' font-pmedium' style={{ color : selected===item ? Colors.primary : 'white' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />

      </View>

        <FlatList
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={refetch}
                    tintColor={Colors.secondary}
                />
            }
            showsVerticalScrollIndicator={false}
            data={filteredData}
            keyExtractor={item => item.id}
            contentContainerStyle={{gap:15, paddingTop:30}}
            onEndReached={getMore}
            onEndReachedThreshold={0}
            renderItem={({item}) => {
                console.log('flatlistitem', item)
                return(
                <View>
                   <View className="flex-row justify-between items-center gap-2">
                        <TouchableOpacity  onPress={()=>handlePress(item)} className='flex-row gap-2 justify-center items-center'>
                            <View className='flex-row gap-3 justify-center items-center'>
                                <Image
                                source={{ uri: `${posterURL}${item.movie ? item.movie.posterPath : item.tv && item.tv.posterPath }` }}
                                contentFit='cover'
                                style={{ width:40, height:55, borderRadius:8 }}
                                />
                                <View className='flex-row gap-2' style={{width:180}}>
                                    { item.movie ? (
                                        <FilmIcon size={16} color={Colors.secondary} />
                                    ) : item.tv && (
                                        <TVIcon size={16} color={Colors.secondary} />
                                    ) }
                                    <Text className='text-mainGray text-sm font-pbold'>{item?.movie?.title || item?.tv?.title} ({ getYear(item?.movie?.releaseDate || item?.tv?.releaseDate)})</Text>
                                    <Text></Text>
                                </View>
                            </View>
                               
                        </TouchableOpacity>
                        <View className='flex-row gap-5 justify-center items-center'>
                            <Text className='text-mainGray text-xl font-pbold'>{item.rating}</Text>
                            { isOwnersPage ? (
                            <TouchableOpacity onPress={()=>handleThreeDots(item)}>
                                <ThreeDotsIcon size={18} color={Colors.mainGray} />
                            </TouchableOpacity>
                            ) : (
                                <View />
                            ) }
                        </View>

                    </View>
                </View>
            )}}

        />
        </View>
    </SafeAreaView>
  )
}

export default RatingsPage

const styles = StyleSheet.create({})