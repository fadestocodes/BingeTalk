import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Keyboard, Platform,TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { UpIcon, DownIcon, MessageIcon, RepostIcon, ThreeDotsIcon } from '../../assets/icons/icons'
import React, {useState, useEffect} from 'react'
import { formatDate } from '../../lib/formatDate'
import { Colors } from '../../constants/Colors'
import { useUserDB } from '../../lib/UserDBContext'
import { useUser } from '@clerk/clerk-expo'
import { useFetchUser } from '../../api/user'
import { useRouter } from 'expo-router'
import { fetchSingleDialogue } from '../../api/dialogue'
import { ThumbsDown, ThumbsUp } from 'lucide-react-native';


const DialogueCard = (  {dialogue} ) => {


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
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const router = useRouter();
    const tag = dialogue.tag;
    
  

    const handleMentionPress = (mention) => {
        if (mention.movie) {
            router.push(`/movie/${mention.tmdbId}`)
        } else if (mention.tv) {
            router.push(`/tv/${mention.tmdbId}`)
        } else {
            router.push(`/cast/${mention.tmdbId}`)
        }
    }


    const handleComment = (dialogue) => {
        console.log('userDB', userDB.id)

        router.push({
            pathname:`/commentsModal`,
            params : { userId : userDB.id, dialogueId : dialogue.id }
        })
    }



  return (

   
    <View  className=''  style={{ backgroundColor:Colors.mainGrayDark ,paddingVertical:12, paddingHorizontal:15, borderRadius:15, marginBottom:15, gap:15 }}  >
            <View className='flex justify-center items-start gap-3  mb-1 w-full '>
           
                <View className='flex-row w-full justify-between items-center'>
                        <View className="flex-row items-center gap-2">
                            <Image
                                source={{ uri: userDB.profilePic }}
                                resizeMode='cover'
                                style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
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

                    <Text className='text-third font-pcourier text-custom text-left w-full'> { dialogue.content } </Text>
                </View>

                    
               
            <View className=' flex-row items-end justify-between  w-full '>
                <View className='flex-row gap-4 items-end justify-between w-full '>


                

                <View className='flex-row gap-3  item-center justify-center' >
                { dialogue.mentions && dialogue.mentions.length > 0 && dialogue.mentions.map( mention => (
                    <TouchableOpacity key={mention.id}  onPress={()=>handleMentionPress(mention)}  className=' items-center'>
                        <Image
                            source={{ uri: `${posterURL}${mention.movie ? mention.movie.posterPath : mention.tv ? mention.tv.posterPath : mention.castCrew.posterPath}` }}
                            resizeMode='cover'
                            style={{ width:35, height:45, borderRadius:10, overflow:'hidden' }}
                        />
                    </TouchableOpacity>
                ) ) 
                }
                </View>
               

                

                    <View className='flex-row gap-3 justify-center items-center'>
                    <TouchableOpacity  >
                                    <View className='flex-row gap-2 justify-center items-center'>
                                        <ThumbsUp size={16} color={Colors.mainGray} ></ThumbsUp>
                                        <Text className='text-xs font-pbold text-mainGray'>{ dialogue.upvotes }</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity  >

                                <View className='flex-row gap-2 justify-center items-center'>
                                    <ThumbsDown size={18} color={Colors.mainGray} ></ThumbsDown>
                                    <Text  className='text-xs font-pbold text-mainGray'>{ dialogue.downvotes }</Text>
                                </View>
                                </TouchableOpacity>
                        <TouchableOpacity >
                        <View className='flex-row  justify-center items-center  py-1 px-2 ' style={{height:32, borderColor:Colors.mainGray}}>
                            <MessageIcon  onPress={()=>handleComment(dialogue)} className='' size='18' color={Colors.mainGray} />
                            { dialogue.downVotes && dialogue.downVotes > 0 && (
                            <Text className='text-xs font-pbold text-gray-400  '> {dialogue.downVotes}</Text>
                            )  }
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity >
                        <View className='flex-row  justify-center items-center  py-1 px-2' style={{height:32, borderColor:Colors.mainGray}}>
                            <RepostIcon className='' size='14' color={Colors.mainGray} />
                            { dialogue.credits && dialogue.reposts > 0 && (
                            <Text className='text-xs font-pbold text-gray-400  '> {dialogue.reposts}</Text>
                            )  }
                        </View>

                        </TouchableOpacity>
                        <View className='relative' >
                            <TouchableOpacity   >
                            <View className='flex-row  justify-center items-center  py-1 px-2' style={{height:32, borderColor:Colors.mainGray}}>
                                <ThreeDotsIcon className='' size='14' color={Colors.mainGray} />
                            </View>
                            </TouchableOpacity>
                        </View>
                            
                    </View>
                </View>
                
            </View>
            

            {/* <View  className='w-full border-t-[.3px] border-mainGrayDark mt-2'/> */}

            </View>
        </View>
     
  )
}

export default DialogueCard

const styles = StyleSheet.create({})