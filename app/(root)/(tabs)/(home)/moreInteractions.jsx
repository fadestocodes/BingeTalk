import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React from 'react'
import { Colors } from '../../../../constants/Colors'
import { ProgressCheckIcon } from '../../../../assets/icons/icons'
import { BadgeHelp, List } from 'lucide-react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../../../api/user'

const moreInteractions = () => {
    const router = useRouter()
    const { DBtvId } = useLocalSearchParams();
    const { user : clerkUser } = useUser()
    const { data : ownerUser, refetch } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress });
    const alreadyInterested = ownerUser.interestedItems.some( item => item.tvId === Number(DBtvId) )


  return (
    <View className='w-full h-full bg-primary justify-center items-center relative' style={{borderRadius:30}} >

        <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20 }} />
        <View className="buttons flex gap-4 w-full items-center mb-6 " style={{paddingHorizontal:50}}>
                    <TouchableOpacity  >
                        {/* <View  className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyWatched ? 'none' : Colors.secondary }} >
                            <Text className='text-primary font-pbold text-sm' style={{ color : alreadyWatched ? Colors.secondary : Colors.primary }}>{ alreadyWatched ? 'Remove from watched' : 'Mark as watched' }</Text>
                        </View> */}
                        <View  className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-80 items-center flex-row gap-3 justify-center'>
                        <ProgressCheckIcon color={Colors.primary} size={20}/>
                        <Text className='text-primary font-pbold text-sm'>Add to Currently Watching</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>{ router.push('/addToList') }} >
                        {/* <View  className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-80 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyWatched ? 'none' : Colors.secondary }} >
                            <Text className='text-primary font-pbold text-sm' style={{ color : alreadyWatched ? Colors.secondary : Colors.primary }}>{ alreadyWatched ? 'Remove from watched' : 'Mark as watched' }</Text>
                        </View> */}
                        <View  className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-80 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyInterested ? 'none' : Colors.secondary }} >
                        <BadgeHelp color={Colors.primary} size={20}/>
                        <Text className='text-primary font-pbold text-sm' style={{ color : alreadyInterested ? Colors.secondary : Colors.primary }}>{ alreadyInterested ? 'Remove from Interested' : 'Mark as Interested' }</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity  >
                        {/* <View  className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-80 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyWatched ? 'none' : Colors.secondary }} >
                            <Text className='text-primary font-pbold text-sm' style={{ color : alreadyWatched ? Colors.secondary : Colors.primary }}>{ alreadyWatched ? 'Remove from watched' : 'Mark as watched' }</Text>
                        </View> */}
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