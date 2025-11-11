import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View , FlatList, TouchableOpacity, ScrollView} from 'react-native'
import React, {useState,useEffect} from 'react'
import { getTrending, getTrendingMovie, getTrendingTV } from '../../api/tmdb'
import { Image } from 'expo-image'
import { getYear } from '../../lib/formatDate'
import { Eye, EyeOff, ListChecks, Handshake, Star, Ellipsis, Plus } from 'lucide-react-native'
import { Colors } from '../../constants/Colors'
import { PlusIcon, FilmIcon, TVIcon } from '../../assets/icons/icons'
import ArrowNextButton from '../../components/ui/ArrowNextButton'
import { useGetUser } from '../../api/auth'
import { updateWatchedBatch } from '../../api/user'
import { useRouter } from 'expo-router'


const RecentlyWatched = () => {

    const [trending, setTrending] = useState([])
    const [loading, setLoading] = useState(true)
    const [ watched, setWatched ] = useState([])
    const [uploading, setUploading] = useState(false)
    const {user} = useGetUser()
    const router = useRouter()
    console.log('user from here', user)

    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';

    const getTrendingTitles = async () => {
        try {
            setLoading(true)
            const res = await getTrending()
            const data = res
            setTrending(data)
        } catch(err){
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTrendingTitles()
    }, [])

    const handleWatch = (isWatched, item) => {
        if (isWatched){
            setWatched(prev => prev.filter(i => i.id !== item.id) )
        } else {
            setWatched(prev => [...prev, item])
        }
    }

    const handleNext = async () => {
        const params = {
            itemsToWatch : watched
        }
        try {
            setUploading(true)
            const successfullyWatched = await updateWatchedBatch(params)
        } catch (err){
            console.error(er)
        } finally {
            setUploading(false)
            router.replace('/')
        }
    }
    

    if (loading){
        return <ActivityIndicator />
    }

  return (
    <SafeAreaView className='bg-primary w-full h-full'>
        <View className='flex h-full flex-col gap-3 px-10 py-10'>
            <Text className='text-3xl font-bold text-white '>Add some titles to you recently watched list</Text>
            <Text className='pt-4  font-medium text-mainGray pb-10'>These will be displayed on your profile. You can hide them later if you'd like.</Text>
            { uploading ? (
                <ActivityIndicator/>
            ) : (
                <>
                    { trending.length > 0 && (
                        <FlatList
                            data={trending}
                            contentContainerStyle={{gap:30, paddingBottom:50}}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={item=>item.id}
                            renderItem={({item}) => {
                                // console.log(item)
                                const isWatched = watched.some( i => i.id === item.id )
                                return (
                                    <View className='flex flex-row gap-5 justify-between items-center w-full'>
                                        <View className=' flex flex-row gap-5 justify-center items-center '>
                                            <Image
                                                source={{uri:`${posterURLlow}${item.poster_path}`}}
                                                width={75}
                                                height={120}
                                                style={{borderRadius:15}}
                                            />
                                            <View className='flex flex-col gap-3 justify-center items-start'>
                                                { item.media_type === 'movie' ? <FilmIcon size={20} color={Colors.newDarkGray} /> : <TVIcon size={20} color={Colors.newDarkGray} /> }
                                                <Text className='text-mainGray font-bold w-[130px]'>{item?.original_title || item?.name} ({getYear(item?.release_date) || getYear(item?.first_air_date)})</Text>
                                            </View>
                                        </View>
    
                                        <View className='justify-center items-center'>
                                            {isWatched ? (
                                                <TouchableOpacity onPress={()=>handleWatch(isWatched, item)} className='bg-newLightGray p-3 rounded-xl'>
                                                    <EyeOff color={Colors.primaryLight}/>
                                                </TouchableOpacity>
                                                ) : (
                                                <TouchableOpacity onPress={()=>handleWatch(isWatched, item)} className='bg-primaryLight p-3 rounded-xl'>
                                                    <Eye color={Colors.newLightGray}/> 
                                                </TouchableOpacity>
                                                )}
                                        </View>
    
    
                                    </View>
                            )}}
                        />
                    
                    ) }
                </>


            )}
            <View className='self-center pt-10'>
                <ArrowNextButton  onPress={handleNext} />
            </View>
        </View>

    </SafeAreaView>
  )
}

export default RecentlyWatched

const styles = StyleSheet.create({})