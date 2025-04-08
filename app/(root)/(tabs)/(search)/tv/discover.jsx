import { SafeAreaView, StyleSheet, Text, View , FlatList, TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import { getYear } from '../../../../../lib/formatDate'
import { LinearGradient } from 'expo-linear-gradient'
import { TVIcon , BackIcon} from '../../../../../assets/icons/icons'
import { movieCategories } from '../../../../../lib/CategoryOptions'
import { Colors } from '../../../../../constants/Colors'
import { tvCategories } from '../../../../../lib/CategoryOptions'
import { useGetTrendingTVFull, useGetUpcomingTV } from '../../../../../api/tmdb'
import { useRouter } from 'expo-router'

const MovieIndex = () => {
  const [ selected, setSelected ] = useState('Trending')
  const { trendingShows, refetch } = useGetTrendingTVFull()
  const { upcomingShows, refetch: refetchShows } = useGetUpcomingTV()

  const posterURL = 'https://image.tmdb.org/t/p/w780';
  const posterURLlow = 'https://image.tmdb.org/t/p/w342';
  const router = useRouter()


    // console.log('trendingmovies', trendingMovies)
  const handlePress = (item) => {
    if (item.tv){
      router.push(`/tv/${item.tv.tmdbId}`)
    } else  {
      router.push(`/tv/${item.id}`)
    }
  }


  return (
    <SafeAreaView className='w-full h-full bg-primary'>
      <View className='w-full  px-6 gap-5' style={{paddingBottom:200}}>
      <TouchableOpacity onPress={()=>router.back()}>
              <BackIcon size={22} color={Colors.mainGray}/>
            </TouchableOpacity>
        <View className="gap-3">
            <View className='flex-row gap-2 justify-start items-center'>

              <TVIcon size={30} color='white' />
              <Text className='text-white font-pbold text-3xl'>TV</Text>
            </View>
            <Text className='text-mainGray font-pmedium'>Check out the most bingeable shows right now.</Text>
        </View>

        <View className='w-full  gap-3' style={{paddingBottom:180}}>
        <FlatList
          horizontal
          data={movieCategories}
          keyExtractor={(item,index) => index}
          contentContainerStyle={{ gap:10 }}
          renderItem={({item}) => (
            <TouchableOpacity onPress={()=>{setSelected(item)}} style={{ borderRadius:15, backgroundColor:selected===item ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
              <Text className=' font-pmedium' style={{ color : selected===item ? Colors.primary : 'white' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        { selected === 'Trending' ? (
          <FlatList
          data = { trendingShows }
          keyExtractor={item => item.id + new Date().getTime().toString()}
          contentContainerStyle={{gap:15, marginTop:30}}
          renderItem={({item}) => {
            
            // console.log('item is', item.id, item.title)

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
             />
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
                        <TVIcon color={Colors.secondary}/> 
                        <Text className='text-white text font-pbold'>{ item.tvId ? `${item.tv.title} (${getYear(item.tv.releaseDate)})` : `${item.title} (${getYear(item.first_air_date)})` }</Text>
                    </View>
                </TouchableOpacity>
                            
            </View>
            <View className='flex-row gap-3 items-center justify-center ' >
                    
                    </View>
            </View>
        </TouchableOpacity>
          )}}
        />
        ) : selected === 'Upcoming' && (
<FlatList
          data = {  upcomingShows }
          keyExtractor={item => item.id + new Date().getTime().toString()}
          contentContainerStyle={{gap:15, marginTop:30}}
          renderItem={({item}) => {
            

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
             />
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
                        <TVIcon color={Colors.secondary}/> 
                        <Text className='text-white text font-pbold'>{ item.tvId ? `${item.tv.title} (${getYear(item.tv.releaseDate)})` : `${item.title} (${getYear(item.first_air_date)})` }</Text>
                    </View>
                </TouchableOpacity>
                            
            </View>
            <View className='flex-row gap-3 items-center justify-center ' >
                    
                    </View>
            </View>
        </TouchableOpacity>
          )}}
        />
        ) }
        
        
      </View>

      </View>
    </SafeAreaView>
  )
}

export default MovieIndex

const styles = StyleSheet.create({})