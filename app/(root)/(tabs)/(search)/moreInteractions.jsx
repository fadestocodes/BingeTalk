import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React from 'react'
import { Colors } from '../../../../constants/Colors'
import { ProgressCheckIcon } from '../../../../assets/icons/icons'
import { BadgeHelp, List, BadgeMinus } from 'lucide-react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../../../api/user'
import { markTVInterested, markTVCurrentlyWatching, markTVWatchlist } from '../../../../api/tv'

const moreInteractions = () => {
    const router = useRouter()
    const { DBtvId, tmdbId } = useLocalSearchParams();
    console.log('DBtvId', DBtvId)
    const { user : clerkUser } = useUser()
    const { data : ownerUser, refetch } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress });
    console.log(ownerUser.interestedItems)
    const alreadyInterested = ownerUser.interestedItems.some( item => item.tvId === Number(DBtvId) )
    const alreadyWatching = ownerUser.currentlyWatchingItems.some( item => item.tvId === Number(DBtvId) )


    const handleInterested = async (  ) => {
        console.log('owneruserid', ownerUser.id)
        await markTVInterested({ tvId : DBtvId, userId : ownerUser.id })
        refetch();
    }

    const handleCurrentlyWatching = async () => {
        await markTVCurrentlyWatching({ tvId : DBtvId, userId : ownerUser.id })
        refetch()
    }

    const handleAddToList = () => {
        router.push({
            pathname : '/addToListModal',
            params : { tmdbId, DBtvId }
        })
    }



  return (
    <View className='w-full h-full bg-primary justify-center items-center relative' style={{borderRadius:30}} >

        <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20 }} />
        <View className="buttons flex gap-4 w-full items-center mb-6 " style={{paddingHorizontal:50}}>
                    <TouchableOpacity onPress={handleCurrentlyWatching}  >
                    <View  className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-80 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyWatching ? 'none' : Colors.secondary }} >                        
                    { alreadyWatching ? <ProgressCheckIcon color={Colors.secondary} size={20}/> : <ProgressCheckIcon color={Colors.primary} size={20}/>  }                        
                    <Text className='text-primary font-pbold text-sm' style={{ color : alreadyWatching ? Colors.secondary : Colors.primary }}>{ alreadyWatching ? 'Remove from Currently Watching' : 'Add to Currently Watching' }</Text>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={handleInterested } >
                        <View  className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-80 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyInterested ? 'none' : Colors.secondary }} >
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