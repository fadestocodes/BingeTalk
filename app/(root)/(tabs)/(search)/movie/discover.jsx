import { SafeAreaView, StyleSheet, Text, View , FlatList, TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Image } from 'expo-image'
import { EllipsisVertical } from 'lucide-react-native'
import { FilmIcon } from '../../../../../assets/icons/icons'
import { movieCategories } from '../../../../../lib/CategoryOptions'
import { Colors } from '../../../../../constants/Colors'
import { useGetTrendingMoviesInfinite, useGetTrendingMoviesTest, useGetUpcomingMovies } from '../../../../../api/tmdb'
import { getYear } from '../../../../../lib/formatDate'
import { useRouter } from 'expo-router'
import { cache } from 'react'


const MovieIndex = () => {
  const [ selected, setSelected ] = useState('Trending')
  const { trendingMovies, refetch } = useGetTrendingMoviesTest()
  const { upcomingMovies, refetch: refetchUpcoming } = useGetUpcomingMovies()
  console.log('upcomingmovies', upcomingMovies)
  
  const posterURL = 'https://image.tmdb.org/t/p/w780';
  const posterURLlow = 'https://image.tmdb.org/t/p/w342';
  const router = useRouter()


    // console.log('trendingmovies', trendingMovies)
  const handlePress = (item) => {
    console.log('tmbdbId', item.tmdbId)
    if (item.movie){
      router.push(`/movie/${item.movie.tmdbId}`)
    } else  {
      router.push(`/movie/${item.id}`)
    }
  }

  return (
    <SafeAreaView className='w-full h-full bg-primary'>
      <View className='w-full  pt-10 px-6 gap-5' style={{paddingBottom:200}}>
        <View className="gap-3">
            <View className='flex-row gap-2 justify-start items-center'>

              <FilmIcon size={30} color='white' />
              <Text className='text-white font-pbold text-3xl'>Movies</Text>
            </View>
            <Text className='text-mainGray font-pmedium'>All about films and cinema here.</Text>
        </View>

        <View className='w-full my-5 gap-3' style={{paddingBottom:100}}>
        <FlatList
          horizontal
          data={movieCategories}
          keyExtractor={(item,index) => index}
          contentContainerStyle={{ gap:10 }}
          renderItem={({item}) => (
            <TouchableOpacity onPress={()=>{setSelected(item) }} style={{ borderRadius:15, backgroundColor:selected===item ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
              <Text className=' font-pmedium' style={{ color : selected===item ? Colors.primary : 'white' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        <FlatList
          data = { selected === 'Trending' ? trendingMovies : selected === 'Upcoming' && upcomingMovies  }
          keyExtractor={item => item.id + new Date().getTime().toString()}
          contentContainerStyle={{gap:15, marginTop:30}}
          // onEndReached={() => {
          //   if (selected === 'Trending'){
          //     refetchTrending()
          //   }
          // }}
          // onEndReachedThreshold={0}
          // windowSize={10}
          // removeClippedSubviews={true}
          renderItem={({item}) => {
            console.log('item is', item.id, item.title)
            
            return (
            <TouchableOpacity onPress={()=>handlePress(item)} className='gap-10 relative' style={{ backgroundColor:Colors.mainGrayDark, borderRadius:15, height:150, overflow:'hidden' }}>
            <Image
                style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                }}
                source={{ uri: `${posterURL}${ item.backdrop_path  }` }}
                placeholder={{ uri: `${posterURLlow}${ item.backdrop_path }`  }}
                placeholderContentFit="cover"
                contentFit="cover" // Same as resizeMode='cover'
                // transition={300} // Optional: Adds a fade-in effect
r            />
            <LinearGradient
                colors={['transparent', 'black']}
                style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                }}
            />
            <View className='flex-row justify-between items-end w-full h-full' style={{paddingHorizontal:15, paddingVertical:15}}>

            <View  className='justify-end items-start  h-full' style={{maxWidth:220}} > 
                <TouchableOpacity onPress={()=>handlePress(item)  } className = 'flex-row gap-5 justify-start items-center w-full' >
                
                    <View className='flex-row gap-1 justify-center items-center'>
                        <FilmIcon color={Colors.secondary}/> 
                        <Text className='text-white text font-pbold'>{ item.movieId ? `${item.movie.title} (${getYear(item.movie.releaseDate)})` : `${item.title} (${getYear(item.release_date)})` }</Text>
                    </View>
                </TouchableOpacity>
                            
            </View>
            <View className='flex-row gap-3 items-center justify-center ' >
                        {/* <TouchableOpacity  style={{ backgroundColor : Colors.secondary, paddingHorizontal:8, paddingVertical:5, borderRadius:10 }}>
                            <Text className='text-primary font-pbold text-sm'>Remove</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <EllipsisVertical size={20} color={Colors.mainGray} />
                        </TouchableOpacity> */}
                    </View>
            </View>
        {/* <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/> */}
        </TouchableOpacity>
          )}}
        />
      </View>

      </View>
    </SafeAreaView>
  )
}

export default MovieIndex

const styles = StyleSheet.create({})