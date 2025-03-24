import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard, Platform,TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import { UpIcon, DownIcon, MessageIcon, RepostIcon, ThreeDotsIcon } from '../assets/icons/icons'
import React, {useState, useEffect} from 'react'
import { formatDate, formatDateNotif } from '../lib/formatDate'
import { Colors } from '../constants/Colors'
import { useUserDB } from '../lib/UserDBContext'
import { useUser } from '@clerk/clerk-expo'
import { useFetchUser } from '../api/user'
import { useRouter } from 'expo-router'
import { fetchSingleDialogue } from '../api/dialogue'
import { MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { dialogueInteraction } from '../api/dialogue'
import { useFetchOwnerUser } from '../api/user'



const DialogueCard = (  {dialogue, refetch , isBackground, disableCommentsModal, fromHome, activity, isReposted} ) => {


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
    
    const [ interactions, setInteractions ] = useState({
        upvotes : {
            alreadyPressed : alreadyUpvoted,
            count : dialogue.upvotes
        } ,
        downvotes :{
            alreadyPressed : alreadyDownvoted,
            count : dialogue.downvotes
        } ,
        reposts : {
            alreadyPressed : alreadyReposted,
            count : dialogue.reposts
        } 
    })

    const handleMentionPress = (mention) => {
        if (mention.movie) {
            if (fromHome){
                router.push(`(home)/movie/${mention.tmdbId}`)
            } else {
                router.push(`/movie/${mention.tmdbId}`)
            }
        } else if (mention.tv) {
            if (fromHome){
                router.push(`(home)/tv/${mention.tmdbId}`)
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
        if (fromHome){

            router.push({
                pathname:`(home)/commentsModal`,
                params : { userId : userDB.id, dialogueId : dialogue.id }
            })
        } else {
            router.push({
                pathname:`/commentsModal`,
                params : { userId : userDB.id, dialogueId : dialogue.id }
            })

        }
    }

    const handleInteraction =  async (type, dialogue) => {
        console.log('type', type)
        setInteractions(prev => ({
            ...prev,
            [type]: {
              ...prev[type],
              alreadyPressed: !prev[type].alreadyPressed,
              count : prev[type].alreadyPressed ? prev[type].count -1 : prev[type].count +1
            }
          }))
     
        console.log("ITEM", dialogue)
        let description
        if ( type === 'upvotes' ){
            description = `upvoted your dialogue "${dialogue.content}"`
            
        } else if (type === 'downvotes'){
            description = `downvoted your dialogue "${dialogue.content}"`
           
        }else  if ( type === 'reposts' ){
            description = `reposted your dialogue "${dialogue.content}"`
           
        }
        console.log('made it this far')
        const data = {
            type,
            dialogueId : dialogue.id,
            userId : ownerUser.id,
            description,
            recipientId : dialogue.user.id
        }
        const updatedDialogue = await dialogueInteraction(data)
        refetch();
    }

    const handleUserPress = () => {
        if (fromHome){
            router.push(`/(home)/user/${userDB.id}`)
        } else {
            router.push(`/user/${userDB.id}`)
        }
    }

    const handleThreeDots = (item) => {

        const fromOwnPost = item.userId === ownerUser.id
        console.log('fromownpost ', fromOwnPost)
        router.push({
            pathname:'/postOptions',
            params: { fromOwnPost : fromOwnPost ? 'true' : 'false', ownerId : ownerUser.id, postType : 'DIALOGUE', postId : item.id, postUserId : item.userId}
        })
    }

    if (!dialogue) {
        return <ActivityIndicator></ActivityIndicator>
    }





  return (

   
    <View  className=''  style={{ backgroundColor:isBackground && Colors.mainGrayDark, paddingVertical:isBackground && 12, paddingHorizontal: isBackground && 15, borderRadius:15, gap:15 }}  >
            <View className='flex justify-center items-start  mb-1 w-full ' style={{gap:5}}>
              
                <View className='flex-row w-full justify-between items-center'>
                        <View className="flex-row items-center gap-2">
                        { isReposted && (
                    <RepostIcon size={18} color={Colors.mainGray} style={{marginRight:10}}/>
                ) }
                            <TouchableOpacity onPress={()=>{handleUserPress}} style={{ flexDirection:'row', gap:5, justifyContent:'center', alignItems:'center' }}>
                            <Image
                                source={{ uri: userDB.profilePic }}
                                contentFit='cover'
                                style={{ borderRadius:'50%', overflow:'hidden', width:30, height:30 }}
                            />
                            <Text className='text-mainGrayDark   ' >@{userDB.username}</Text>
                            </TouchableOpacity>
                        </View>
                    <Text className='text-mainGrayDark '>{formatDateNotif(dialogue.createdAt)}</Text>
                    
                </View>
                {/* { activity && (
                                <View className='flex-row gap-2'>
                                    <MessageSquare size={18} color={Colors.secondary} />
                                    <Text className='text-mainGray '>{dialogue.user.firstName} { activity }</Text>
                                </View>
                ) } */}
                { tag && (
                        <View className=' my-3'>
                            <Text className= 'font-pbold text-primary text-xs ' style={{ backgroundColor: tag.color , padding:5, borderRadius:10}} >{tag.tagName}</Text>
                        </View>
                    ) }
                <View className='my-0 justify-center items-center w-full gap-3  '>
                    <View className='flex gap-2 justify-center items-center'>
                        
                        <View className='justify-center items-center gap-0'>
                            <Text className='text-secondary font-pcourier uppercase text-lg' >{userDB.firstName}</Text>
                        </View>
                        
                    </View>

                    <Text className='text-third font-pcourier text-custom text-left w-full' numberOfLines={3}> { dialogue.content } </Text>
                </View>

                <View className='flex-row gap-3  item-center justify-center mt-3' >
                { dialogue.mentions && dialogue.mentions.length > 0 && dialogue.mentions.map( mention => (
                    <TouchableOpacity key={mention.id}  onPress={()=>handleMentionPress(mention)}  className=' items-center'>
                        <Image
                            source={{ uri: `${posterURL}${mention.movie ? mention.movie.posterPath : mention.tv ? mention.tv.posterPath : mention.castCrew && mention.castCrew.posterPath}` }}
                            contentFit='cover'
                            style={{ width:35, height:40, borderRadius:10, overflow:'hidden' }}
                        />
                    </TouchableOpacity>
                ) ) 
                }
                </View>

                    
               
            <View className=' flex-row items-end justify-between  w-full '>
                <View className='flex-row gap-4 items-end justify-between w-full '>


                

              

                    <View className='flex-row gap-5 justify-center items-center'>
                        <TouchableOpacity onPress={()=> handleInteraction('upvotes',dialogue) } >
                            <View className='flex-row gap-1 justify-center items-center'>
                                <ThumbsUp size={20} color={ interactions.upvotes.alreadyPressed ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                                <Text className='text-xs font-pbold ' style={{ color: interactions.upvotes.alreadyPressed ? Colors.secondary : Colors.mainGray }}>{ interactions.upvotes.count }</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=> handleInteraction('downvotes',dialogue) } >
                        <View className='flex-row gap-1 justify-center items-center'>
                            <ThumbsDown size={20}  color={ interactions.downvotes.alreadyPressed ? Colors.secondary :  Colors.mainGray}></ThumbsDown>
                            <Text  className='text-xs font-pbold text-mainGray' style={{ color: interactions.downvotes.alreadyPressed ? Colors.secondary : Colors.mainGray }}>{ interactions.downvotes.count }</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handleComment(dialogue)} disabled={disableCommentsModal} >
                        <View className='flex-row gap-1  justify-center items-center   ' style={{height:32, borderColor:Colors.mainGray}}>
                            <MessageIcon   className='' size={20}  color={   Colors.mainGray}/>
                            <Text className='text-xs font-pbold text-gray-400  '> {dialogue?.comments?.length}</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> handleInteraction('reposts',dialogue) } >
                        <View className='flex-row gap-1 justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                            <RepostIcon className='' size={20}  color={ interactions.reposts.alreadyPressed ? Colors.secondary :  Colors.mainGray}/>
                            <Text className='text-xs font-pbold text-gray-400  'style={{ color: interactions.reposts.alreadyPressed ? Colors.secondary : Colors.mainGray }}> {interactions.reposts.count}</Text>
                        </View>

                        </TouchableOpacity>
                            
                    </View>
                    
                        <View className='relative' >
                            <TouchableOpacity onPress={()=>handleThreeDots(dialogue)}  >
                            <View className='flex-row  justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                                <ThreeDotsIcon className='' size='16' color={Colors.mainGray} />
                            </View>
                            </TouchableOpacity>
                        </View>
                </View>
                
            </View>
            

            </View>
        </View>
     
  )
}

export default DialogueCard

const styles = StyleSheet.create({})