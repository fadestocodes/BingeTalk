// import { SafeAreaView, StyleSheet, Text, View, FlatList, RefreshControl, TouchableOpacity } from 'react-native'
// import { Image } from 'expo-image'
// import React from 'react'
// import { useLocalSearchParams, useRouter } from 'expo-router'
// import { useFetchSpecificList } from '../../../../../api/list'
// import { Colors } from '../../../../../constants/Colors'
// import { getYear } from '../../../../../lib/formatDate'

// const ListId = () => {

//     const { listId } = useLocalSearchParams();
//     const { data:list, refetch, isFetching } = useFetchSpecificList(listId);
//     console.log('LIST FOR LISTID PAGE')
//     const posterURL = 'https://image.tmdb.org/t/p/original';
//     const posterURLlow = 'https://image.tmdb.org/t/p/w500';
//     const router = useRouter()

//     if (isFetching){
//         return (
//             <View className='h-full bg-primary'>
//         <RefreshControl tintColor={Colors.secondary} />
//         </View>
//     )
//     }

//     const handlePress = (item) => {
        
//         if ( item.movie ){
//             router.push(`/movie/${item.movie.tmdbId}`)
//         } else if (item.tv) {
//             router.push(`/tv/${item.tv.tmdbId}`)
//         } else {
//             router.push(`/cast/${item.castCrew.tmdbId}`)
//         }
//     }

//   return (
//     <SafeAreaView style={{ backgroundColor : Colors.primary, width:'100%', height : '100%'}} >
//         <View className='w-full justify-center ' >
//         <FlatList
//             data={list.listItem}
//             keyExtractor={item => item.id}
//             columnWrapperStyle={{ justifyContent: 'flex-start', gap: 10, paddingHorizontal: 15 }}  
            
//             numColumns={4}
//             contentContainerStyle={{ paddingVertical:50, marginLeft:20, rowGap:20, height:'100%'}}
//             renderItem={({item}) => {
//                 // console.log('item from flatlist', item)
//                 return (
//                 <TouchableOpacity onPress={()=>handlePress(item)}  >
//                     <Image 
//                         source = {{ uri : item.movie ? `${posterURL}${item.movie.posterPath}` : item.tv ? `${posterURL}${item.tv.posterPath}` : item.castCrew &&  `${posterURL}${item.castCrew.posterPath}` }}
//                         placeholder = {{ uri : item.movie ? `${posterURLlow}${item.movie.posterPath}` : item.tv ? `${posterURLlow}${item.tv.posterPath}` : item.castCrew &&  `${posterURLlow}${item.castCrew.posterPath}` }}
//                         placeholderContentFit='cover'
//                         style= {{ width: 70, height :100, borderRadius:10  }}
//                         contentFit='cover'
//                         transition={300}
//                     />
//                     <Text className='text-mainGray text-sm font-pbold' style={{width:70 }} numberOfLines={2}>{ item.castCrew ? `${item.castCrew.name}` : item.movie ? `${item.movie.title}` : item.tv && `${item.tv.title}` }</Text>
//                     <Text className='text-mainGray text-xs'>{ item.castCrew ? `(${getYear(item.castCrew.dob)})` : item.movie ? `(${getYear(item.movie.releaseDate)})` : item.tv && `(${ getYear(item.tv.releaseDate) })` }</Text>
//                 </TouchableOpacity>
//             )}}
//         />
//         </View>
//     </SafeAreaView>
//   )
// }

// export default ListId

// const styles = StyleSheet.create({})

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useFetchSpecificList } from '../../../../../api/list'
import { useLocalSearchParams } from 'expo-router'
import TinderSwipeCard from '../../../../../components/TinderSwipeCard/TinderSwipeCard'

const ListPage = () => {
    const {listId} = useLocalSearchParams();
    const { data:list, isLoading,  } = useFetchSpecificList(Number(listId))
   
  return (
<View className='h-full bg-primary'>
    { !list ? (
      <View className='justify-center items-center h-full'>
      <ActivityIndicator />
      </View>
    ) : (
      <TinderSwipeCard listItems={list.listItem} creator={list.user} listId={listId}/>
    )}
    </View>
  )
}

export default ListPage

const styles = StyleSheet.create({})