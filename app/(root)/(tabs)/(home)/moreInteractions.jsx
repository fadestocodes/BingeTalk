
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React , {useState}from 'react'
import { Colors } from '../../../../constants/Colors'
import { ProgressCheckIcon } from '../../../../assets/icons/icons'
import { BadgeHelp, List, BadgeMinus } from 'lucide-react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../../../api/user'
import { markTVInterested, markTVCurrentlyWatching, markTVWatchlist } from '../../../../api/tv'
import { markMovieInterested, markMovieCurrentlyWatching, markMovieWatchlist } from '../../../../api/movie'
import ToastMessage from '../../../../components/ui/ToastMessage'

const moreInteractions = () => {
    const router = useRouter()
    const { DBtvId, DBMovieId, tmdbId } = useLocalSearchParams();
    const { user : clerkUser } = useUser()
    const { data : ownerUser, refetch } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress });
    console.log(ownerUser.interestedItems)
    const alreadyInterested = ownerUser.interestedItems.some( item => item.tvId === Number(DBtvId) || item.movieId === Number(DBMovieId) )
    const alreadyWatching = ownerUser.currentlyWatchingItems.some( item => item.tvId === Number(DBtvId) || item.movieId === Number(DBMovieId) )
    const [ message, setMessage ] = useState(null)
    const [ toastIcon, setToastIcon ] = useState(null)


    const handleInterested = async (  ) => {
        console.log('owneruserid', ownerUser.id)
        if (DBtvId){
            await markTVInterested({ tvId : DBtvId, userId : ownerUser.id })
        } else if (DBMovieId){
            await markMovieInterested({ movieId : DBMovieId, userId : ownerUser.id })
        }
        if (alreadyInterested){
            setMessage('Removed from Interested')
        } else {
            setMessage('Marked as Interested')
        }
        setToastIcon(<BadgeHelp size={30} color={Colors.secondary}/>)
        refetch();
    }

    const handleCurrentlyWatching = async () => {
        if (DBtvId){
            await markTVCurrentlyWatching({ tvId : DBtvId, userId : ownerUser.id })
        } else if (DBMovieId){
            await markMovieCurrentlyWatching({ movieId : DBMovieId, userId : ownerUser.id })
        }
        if (alreadyWatching){
            setMessage('Removed from Currently Watching')
        } else {
            setMessage('Added to Currently Watching')
        }
        setToastIcon(<ProgressCheckIcon size={30} color={Colors.secondary}/>)
        refetch()
    }

    const handleAddToList = () => {
        router.push({
            pathname : '/addToListModal',
            params : { tmdbId, DBtvId, DBMovieId }
        })
    }



  return (
    <View className='w-full h-full bg-primary justify-center items-center relative' style={{borderRadius:30}} >
        <ToastMessage message={message} onComplete={()=>{setMessage(null); setToastIcon(null)}} icon={toastIcon}  />

        <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20 }} />
        <View className="buttons flex gap-4 w-full items-center mb-6 " style={{paddingHorizontal:50}}>
                    <TouchableOpacity onPress={handleCurrentlyWatching}  >
                    <View  className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-80 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyWatching ? 'transparent' : Colors.secondary }} >                        
                    { alreadyWatching ? <ProgressCheckIcon color={Colors.secondary} size={20}/> : <ProgressCheckIcon color={Colors.primary} size={20}/>  }                        
                    <Text className='text-primary font-pbold text-sm' style={{ color : alreadyWatching ? Colors.secondary : Colors.primary }}>{ alreadyWatching ? 'Remove from Currently Watching' : 'Add to Currently Watching' }</Text>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={handleInterested } >
                        <View  className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-80 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyInterested ? 'transparent' : Colors.secondary }} >
                        { alreadyInterested ? <BadgeMinus color = {Colors.secondary} size={20}/> : <BadgeHelp color={Colors.primary} size={20}/>  }
                        <Text className='text-primary font-pbold text-sm' style={{ color : alreadyInterested ? Colors.secondary : Colors.primary }}>{ alreadyInterested ? 'Remove from Interested' : 'Mark as Interested' }</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={handleAddToList}  >
                        <View  className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-80 items-center flex-row gap-3 justify-center'>
                        <List color={Colors.primary} size={20}/>
                        <Text className='text-primary font-pbold text-sm'>Add to a list</Text>
                        </View>
                    </TouchableOpacity>
        </View>
    </View>
  )
}

export default moreInteractions

const styles = StyleSheet.create({})