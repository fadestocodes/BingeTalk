import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard, Platform,TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import { UpIcon, DownIcon, MessageIcon, RepostIcon, ThreeDotsIcon } from '../assets/icons/icons'
import React, {useState, useEffect} from 'react'
import { formatDate } from '../lib/formatDate'
import { Colors } from '../constants/Colors'
import { useUserDB } from '../lib/UserDBContext'
import { useUser } from '@clerk/clerk-expo'
import { useFetchUser } from '../api/user'
import { useRouter } from 'expo-router'
import { fetchSingleDialogue } from '../api/dialogue'
import { ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { dialogueInteraction } from '../api/dialogue'
import { useFetchOwnerUser } from '../api/user'



const DialogueCard = (  {dialogue, refetch , isBackground, disableCommentsModal,fromHome} ) => {


    // const [ dialogue, setDialogue ] = useState(null)

    // useEffect(()=>{
    //     const getSingleDialogue = async () => {
    //         const dialogue = await fetchSingleDialogue( Number(dialogueId) );
    //         setDialogue(dialogue);
    //     }
    //     getSingleDialogue();
    // }, [dialogueId])
    // if (!dialogue) {

    //     return <ActivityIndicator></ActivityIndicator>
    // }


    // const { data: userDB, refetch } = useFetchUser( {email : clerkUser.emailAddresses[0].emailAddress} )
    const userDB = dialogue.user
    const posterURL = 'https://image.tmdb.org/t/p/w342';
    const router = useRouter();
    const tag = dialogue.tag;
    const { user: clerkUser } = useUser()
    const { data : ownerUser  } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress}  )

    
    const alreadyUpvoted = dialogue.dialogueInteractions?.some( item => item.interactionType === 'UPVOTE' && item.userId === ownerUser.id )
    const alreadyDownvoted = dialogue.dialogueInteractions?.some( item => item.interactionType === 'DOWNVOTE'  && item.userId === ownerUser.id )
    const alreadyReposted = dialogue.dialogueInteractions?.some( item => item.interactionType === 'REPOST'  && item.userId === ownerUser.id )
  

    const handleMentionPress = (mention) => {
        if (mention.movie) {
            if (fromHome){
                router.push(`(home)/movie/${mention.tmdbId}`)
            } else {
                router.push(`/movie/${mention.tmdbId}`)
            }
        } else if (mention.tv) {
            if (fromHome){
                router.push(`(home)/movie/${mention.tmdbId}`)
            } else {
                router.push(`/tv/${mention.tmdbId}`)
            }
        } else {
            if (fromHome){
                router.push(`(home)/cast/${mention.tmdbId}`)
            } else {
                router.push(`/cast/${mention.tmdbId}`)
            }
        }
    }


    const handleComment = (dialogue) => {
        console.log('userDB', userDB.id)

        router.push({
            pathname:`/commentsModal`,
            params : { userId : userDB.id, dialogueId : dialogue.id }
        })
    }

    const handleInteraction =  async (type, dialogue) => {
        console.log('type', type)
        const data = {
            type,
            dialogueId : dialogue.id,
            userId : ownerUser.id
        }
        const updatedDialogue = await dialogueInteraction(data)
        refetch();
    }

    if (!dialogue) {
        return <ActivityIndicator></ActivityIndicator>
    }




  return (

   
    <View  className=''  style={{ backgroundColor:isBackground && Colors.mainGrayDark, paddingVertical:isBackground && 12, paddingHorizontal: isBackground && 15, borderRadius:15, marginBottom:15, gap:15 }}  >
            <View className='flex justify-center items-start gap-3  mb-1 w-full '>
           
                <View className='flex-row w-full justify-between items-center'>
                        <View className="flex-row items-center gap-2">
                            <Image
                                source={{ uri: userDB.profilePic }}
                                contentFit='cover'
                                style={{ borderRadius:'50%', overflow:'hidden', width:30, height:30 }}
                            />
                            <Text className='text-mainGrayDark   ' >@{userDB.username}</Text>
                        </View>
                    <Text className='text-mainGrayDark '>{formatDate(dialogue.createdAt)}</Text>
                    
                </View>
                { tag && (
                        <View className=' '>
                            <Text className= 'font-pbold text-primary text-xs ' style={{ backgroundColor: tag.color , padding:5, borderRadius:10}} >{tag.tagName}</Text>
                        </View>
                    ) }
                <View className='my-0 justify-center items-center w-full gap-3  mb-6'>
                    <View className='flex gap-2 justify-center items-center'>
                        
                        <View className='justify-center items-center gap-0'>
                            <Text className='text-secondary font-pcourier uppercase text-lg' >{userDB.firstName}</Text>
                        </View>
                        
                    </View>

                    <Text className='text-third font-pcourier text-custom text-left w-full' numberOfLines={3}> { dialogue.content } </Text>
                </View>

                    
               
            <View className=' flex-row items-end justify-between  w-full '>
                <View className='flex-row gap-4 items-end justify-between w-full '>


                

                <View className='flex-row gap-3  item-center justify-center' >
                { dialogue.mentions && dialogue.mentions.length > 0 && dialogue.mentions.map( mention => (
                    <TouchableOpacity key={mention.id}  onPress={()=>handleMentionPress(mention)}  className=' items-center'>
                        <Image
                            source={{ uri: `${posterURL}${mention.movie ? mention.movie.posterPath : mention.tv ? mention.tv.posterPath : mention.castCrew && mention.castCrew.posterPath}` }}
                            contentFit='cover'
                            style={{ width:35, height:45, borderRadius:10, overflow:'hidden' }}
                        />
                    </TouchableOpacity>
                ) ) 
                }
                </View>

                    <View className='flex-row gap-5 justify-center items-center'>
                        <TouchableOpacity onPress={()=> handleInteraction('upvotes',dialogue) } >
                            <View className='flex-row gap-1 justify-center items-center'>
                                <ThumbsUp size={16} color={ alreadyUpvoted ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                                <Text className='text-xs font-pbold ' style={{ color: alreadyUpvoted ? Colors.secondary : Colors.mainGray }}>{ dialogue.upvotes }</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=> handleInteraction('downvotes',dialogue) } >
                        <View className='flex-row gap-1 justify-center items-center'>
                            <ThumbsDown size={18}  color={ alreadyDownvoted ? Colors.secondary :  Colors.mainGray}></ThumbsDown>
                            <Text  className='text-xs font-pbold text-mainGray' style={{ color: alreadyDownvoted ? Colors.secondary : Colors.mainGray }}>{ dialogue.downvotes }</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handleComment(dialogue)} disabled={disableCommentsModal} >
                        <View className='flex-row gap-1  justify-center items-center   ' style={{height:32, borderColor:Colors.mainGray}}>
                            <MessageIcon   className='' size='18'  color={   Colors.mainGray}/>
                            <Text className='text-xs font-pbold text-gray-400  '> {dialogue?.comments?.length}</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> handleInteraction('reposts',dialogue) } >
                        <View className='flex-row gap-1 justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                            <RepostIcon className='' size='14'  color={ alreadyReposted ? Colors.secondary :  Colors.mainGray}/>
                            <Text className='text-xs font-pbold text-gray-400  'style={{ color: alreadyReposted ? Colors.secondary : Colors.mainGray }}> {dialogue.reposts}</Text>
                        </View>

                        </TouchableOpacity>
                        <View className='relative' >
                            <TouchableOpacity   >
                            <View className='flex-row  justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                                <ThreeDotsIcon className='' size='14' color={Colors.mainGray} />
                            </View>
                            </TouchableOpacity>
                        </View>
                            
                    </View>
                </View>
                
            </View>
            

            </View>
        </View>
     
  )
}

export default DialogueCard

const styles = StyleSheet.create({})