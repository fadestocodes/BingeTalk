import { StyleSheet, Text, View, TouchableOpacity , FlatList} from 'react-native'
import React from 'react'
import { TVIcon, FilmIcon } from '../assets/icons/icons'
import { formatDate } from '../lib/formatDate'
import { Colors } from '../constants/Colors'

const InfiniteScroll = ( { data, hasNextPage, isFetchingNextPage, fetchNextPage, isFetching } ) => {

  if (isFetching){
    return(
        <View style={{ backgroundColor:Colors.primary, width:'100%', height:'100%' }}>
     <RefreshControl tintColor={Colors.secondary}   />
     </View>
)
}
  return (
    <View>
        <FlatList
            scrollEnabled={true}
            data={data}
            keyExtractor={item => item.id}
            contentContainerStyle={{ width:'100%', gap:50, paddingBottom:100 }}
            // onEndReached={()=>reachedEnd()}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
              }
          }}
           
            
            onEndReachedThreshold={0.2}
            // ListFooterComponent={hasMore && loading ? <ActivityIndicator /> : <TouchableOpacity onPress={reachedEnd}><Text className='text-white'>Load more</Text></TouchableOpacity>}
            renderItem={({item})=>{
                return (
                    <View className='gap-20'>
                <TouchableOpacity onPress={()=>handlePress(item)  } className = 'flex-row gap-5 justify-start items-center w-full' >
                    <Text className='text-mainGray text-sm '>{formatDate(item.createdAt)}</Text>
                    <View className='flex-row gap-1 justify-center items-center'>
                        { item.movieId ? <FilmIcon color={Colors.secondary}/> : <TVIcon color={Colors.secondary} /> }
                        <Text className='text-white text font-pbold'>{ item.movieId ? `${item.movie.title}` : `${item.tv.title}` }</Text>
                    </View>
                </TouchableOpacity>
                    <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/>
                    </View>
            )}}
        
        />

    </View>
  )
}

export default InfiniteScroll

const styles = StyleSheet.create({})