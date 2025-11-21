import { View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native'
import React, { useEffect, useState } from 'react'
import { badgeIconMap, badges } from '../../constants/BadgeIcons'
import { Image } from 'expo-image'
import { useGetUser, useGetUserFull } from '../../api/auth'
import { useCheckBadgeNotifications, useCheckTastemakerProgress, useGetAuteurProgression, useGetBadges, useGetConversationalistProgression, useGetCriticProgression, useGetCuratorProgression, useGetHistorianProgression, useGetPeoplesChoiceProgression } from '../../api/user'
import { unparseDept } from '../../lib/parseFilmDept'
import { LinearGradient } from 'expo-linear-gradient';
import BadgePill from '../ui/BadgePill'
import { ArrowLeftIcon, BackIcon, CloseIcon } from '../../assets/icons/icons'
import { ArrowLeft } from 'lucide-react-native'
import { Colors } from '../../constants/Colors'
import { router, useRouter } from 'expo-router'


const UserBadgesPage = () => {
  const levels = ["NONE", "BRONZE", "SILVER", "GOLD"]

  const {user} = useGetUser()
  const {userFull} = useGetUserFull(user?.id)

  const {criticProgression} = useGetCriticProgression(user?.id)
  const {historianProgression} = useGetHistorianProgression(user?.id)
  const {curatorProgression} = useGetCuratorProgression(user?.id)
  const {auteurProgression} = useGetAuteurProgression(user?.id)
  const {conversationalistProgression} = useGetConversationalistProgression(user?.id)
  const {badgeNotifications} = useCheckBadgeNotifications(user?.id)
  const {peoplesChoiceProgression} = useGetPeoplesChoiceProgression(user?.id)
  const {progress: tastemakerProgression} = useCheckTastemakerProgress(user?.id)
  const {badgeList} = useGetBadges(user?.id)

  const [loadingProgressions, setLoadingProgressions] = useState(true)
  const [ allProgressions, setAllProgressions ] = useState({
    CRITIC : '',
    HISTORIAN : '',
    CURATOR : '',
    AUTEUR : '',
    CONVERSATIONALIST : '',
    PEOPLES_CHOICE : '',
    TASTEMAKER : ''
  })

  const router = useRouter()
  const [ showDetails, setShowDetails ] = useState('')
 


  const [tastemakerBadgeProgress, setTastemakerProgress] = useState('')

  useEffect(()=>{
    if (
      !criticProgression ||
      !historianProgression ||
      !curatorProgression ||
      !auteurProgression ||
      !conversationalistProgression ||
      !peoplesChoiceProgression ||
      !tastemakerProgression
    ) return;

    try {
      setLoadingProgressions(true)
      setAllProgressions(prev => ({
        ...prev,
        CRITIC : criticProgression?.untilNextLevel,
        HISTORIAN : historianProgression?.untilNextLevel,
        CURATOR : curatorProgression?.untilNextLevel,
        AUTEUR : auteurProgression?.untilNextLevel,
        CONVERSATIONALIST : conversationalistProgression,
        TASTEMAKER : tastemakerProgression,
        PEOPLES_CHOICE : peoplesChoiceProgression?.untilNextLevel
      }))

    } catch (e){
      console.error(e)
    }finally {
      setLoadingProgressions(false)

    }




  }, [user, criticProgression, historianProgression, curatorProgression, auteurProgression, conversationalistProgression, peoplesChoiceProgression,tastemakerProgression ])


  const handleDetails = (userBadge, badgeMapData , type, currLevel,nextLevel,progressData,image) => {


    setShowDetails({
      userBadge,
      type,
      currLevel,
      nextLevel,
      image,
      progressData,
      badgeMapData

    })
  }
  

  if (!userFull || loadingProgressions) return <ActivityIndicator />
  
  return (
    <SafeAreaView edges={['top']} className='bg-primary w-full h-full'>
        <ScrollView showsVerticalScrollIndicator={false} >
            <View className='items-center justify-start w-full gap-3 px-6'>
              <View className='self-start justify-start items-start w-full  pt-0 gap-6'>
                <TouchableOpacity onPress={()=>router.back()}>
                  <BackIcon color={Colors.mainGray} size={26} />
                </TouchableOpacity>
                <Text className='text-white text-3xl font-pbold self-start '>Badges</Text>
              </View>

              { showDetails ? (
                <View style={{}} className={`bg-primaryLight px-6 rounded-2xl justify-center items-center gap-3 relative w-full py-10  `}>
                  <TouchableOpacity onPress={()=>setShowDetails('')} className='absolute top-5 right-5 bg-primary rounded-full'>
                    <CloseIcon size={20} color={Colors.mainGray} />
                  </TouchableOpacity>
                  { showDetails.currLevel !== 'NONE' && (
                        <BadgePill level={showDetails.currLevel} />
                    )}
                  <Image
                      source={ showDetails.image}
                      width={110}
                      height={120}
                      contentFit='contain'
                      style={{ overflow:'hidden'}}
                  />
                  <View className='gap-3 w-full  justift-center items-center'>
                      <Text className='text-white font-bold text-center text-2xl'>{unparseDept(showDetails.type)}</Text>
                      <Text className='text-mainGray  text-start'>{showDetails.badgeMapData.description}</Text>
                      {/* <View className='h-[2px] bg-newDarkGray w-full mt-4' /> */}




                    <View className='bg-primary rounded-xl py-10 px-4 w-full mt-6 justify-center items-center'>
                      { showDetails.currLevel !== 'GOLD' ? (
                        <View className='flex flex-col gap-1 justify-center items-center pt-0'>
                          <Text className='text-mainGray self-start font-pbold '>Progress until {showDetails.nextLevel}:</Text>
                          <Text className='text-mainGray  self-start'>{showDetails.badgeMapData.levels[showDetails.nextLevel].levelDescription}</Text>
                        </View>
                      ) : (
                        <Text className='text-mainGray self-center  font-pbold'>All levels unlocked!</Text>
                      )}

                      {Array.from({ length: showDetails?.progressData?.numTotalRequirements || 1 }).map((_, i) => {
                        
                        return (
                          <View key={i} className='flex-row flex gap-3  items-center w-full self-start px-4 pt-4'>
                            <>
                            { showDetails.currLevel !== 'GOLD' && (
                              <Text className='text-mainGray  '>{showDetails.progressData.currentlyAt[i]} / {showDetails.progressData.toNextLevel[i]}</Text>
                            ) }
                            <View style={{}} className='w-[160px] rounded-full bg-newDarkGray h-[10px] relative '>
                              <View style={{width:showDetails.currLevel === 'GOLD' ? '100%'  :`${Math.floor((showDetails?.progressData?.currentlyAt[i]/showDetails?.progressData?.toNextLevel[i])*100) || 3}%`}} className={`${showDetails.currLevel === 'GOLD' ? 'bg-secondary' : 'bg-secondary'} rounded-full h-[10px] absolute `} />
                            </View>

                            </>
                           

                        </View>
                      )}
                    )}

                    </View>

                    <Text>

                    </Text>

                    </View>

                </View>
              ) : (


              <FlatList
                data={badgeIconMap}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item,index) => index}
                contentContainerStyle ={{flexWrap:'wrap', display:'flex', flexDirection:'row',width:'100%', gap:15, justifyContent:'start', alignItems:'center', paddingBottom:100, paddingTop:20}}
                renderItem={({item}) => {
                  const userBadge = userFull?.unlockedBadges?.find( userBadge => userBadge.badgeType === item.type )
                  const currIndex = userBadge ? levels.indexOf(userBadge?.badgeLevel) : 0
                  const currLevel = userBadge?.badgeLevel || 'NONE'
                  const nextLevel = levels[currIndex + 1] || null
                  let percentage
                  const progressData = allProgressions[item.type]

                  console.log("currLevel...", currLevel)

                  if (userBadge?.badgeLevel === 'GOLD') {
                    percentage = 100
                  } 
                  return (
                  <TouchableOpacity onPress={()=>handleDetails(userBadge,item ,item.type, currLevel,nextLevel, progressData,userBadge ? item.levels[userBadge.badgeLevel].uri : item.levels.BRONZE.uri )} className={`bg-primaryLight w-[160px] min-h-[250px] px-2 rounded-2xl justify-center items-center gap-3 relative ${userBadge ? 'opacity-100' : 'opacity-30'}  ${item.currentLevel === 'NONE' ? 'opacity-20' : ''} `}>
                    { currLevel !== 'NONE' && (
                        <BadgePill level={currLevel} />
                    )}
                      <Image
                          source={ userBadge ? item.levels[userBadge.badgeLevel].uri : item.levels.BRONZE.uri}
                          width={60}
                          height={70}
                          contentFit='contain'
                          style={{ overflow:'hidden'}}
                      />


                      {/* <View className={`w-[60px] h-[60px] rounded-full bg-primary ${item.currentLevel === 'NONE' ? 'opacity-40' : ''}`} /> */}
                    <View className='gap-3 w-full px-2 justify-center items-center'>
                      <Text className='text-white font-bold text-center'>{unparseDept(item.type)}</Text>



                      { currLevel !== 'GOLD' ? (
                        <View className='flex flex-col gap-1 justify-center items-center'>
                          <Text className='text-mainGray text-sm '>Progress until {nextLevel}</Text>
                        </View>
                      ) : (
                        <Text className='text-mainGray text-sm font-bold'>All levels unlocked!</Text>
                      )}

                      {Array.from({ length: progressData?.numTotalRequirements || 1 }).map((_, i) => {

                      return (
                        <View key={i} className='flex-row flex gap-2 justify-start w-full  items-center'>
                            <>
                            { currLevel !== 'GOLD' && (
                              <Text className='text-mainGray text-xs '>{progressData.currentlyAt[i]} / {progressData.toNextLevel[i]}</Text>
                            ) }
                            <View style={{width:80}} className='w-[80px] rounded-full bg-primary h-[10px] relative'>
                              <View style={{width:currLevel === 'GOLD' ? '100%'  :`${Math.floor((progressData?.currentlyAt[i]/progressData?.toNextLevel[i])*100) || 3}%`}} className={`${currLevel === 'GOLD' ? 'bg-secondary' : 'bg-secondary'} rounded-full h-[10px] absolute `} />
                            </View>
                            </>
                           

                        </View>
                      )}
                    )}

                    </View>
              
                  </TouchableOpacity>
                )}
                }
                  
              
              />
              ) }

            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default UserBadgesPage