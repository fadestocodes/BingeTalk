// import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, ScrollView , Image, TouchableOpacity} from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { useLocalSearchParams } from 'expo-router'
// import { useFetchSingleDialogue, fetchSingleDialogue, useCustomFetchSingleDialogue } from '../../../../../api/dialogue'
// import DialogueCard from '../../../../../components/DialogueCard'
// import { useDialogueContext } from '../../../../../lib/DialoguePostContext'
// import { useRouter } from 'expo-router'
// import { Colors } from '../../../../../constants/Colors'
// import { formatDate } from '../../../../../lib/formatDate'
// import { UpIcon,  DownIcon, MessageIcon, RepostIcon, ThreeDotsIcon } from '../../../../../assets/icons/icons'

// const DialoguePageFromSearch = () => {
//     console.log('hello from dialogue page from search tab')
//     const { dialogueId } = useLocalSearchParams();
//     console.log('dialogueID', dialogueId)
//     // const { dialogue, updateDialogue } = useDialogueContext();


   

//     // const { dialogue, isLoading, error } = useCustomFetchSingleDialogue( Number(dialogueId) )
//     const [ dialogue, setDialogue ] = useState(null)
//     const [ isFetching ,setIsFetching  ] = useState(false)
//     const posterURL = 'https://image.tmdb.org/t/p/original';

   

//     useEffect(()=>{
//         if (!dialogueId) return
//         const getSingleDialogue = async () => {
//             setIsFetching(true)
            
//             const dialogue = await fetchSingleDialogue( Number(dialogueId) );
//             setDialogue(dialogue);
//             // updateDialogue(dialogue)
//             setIsFetching(false)
//         }
//         getSingleDialogue();
//     }, [])

//     if (!dialogue){
//         return <ActivityIndicator></ActivityIndicator>
//     }

//     const userDB = dialogue.user;

//     // const router = useRouter();
//     const tag = dialogue.tag;
    
  

//     const handleMentionPress = (mention) => {
//         if (mention.movie) {
//             router.push(`/movie/${mention.tmdbId}`)
//         } else if (mention.tv) {
//             router.push(`/tv/${mention.tmdbId}`)
//         } else {
//             router.push(`/cast/${mention.tmdbId}`)
//         }
//     }


//     const handleComment = (dialogue) => {
//         console.log('userDB', userDB.id)

//         router.push({
//             pathname:`/commentsModal`,
//             params : { userId : userDB.id, dialogueId : dialogue.id }
//         })
//     }



//   return (
//     <SafeAreaView className='w-full h-full bg-primary'>
//         <ScrollView style={{paddingHorizontal:15}}>
            
//         <View  className=''  style={{ backgroundColor:Colors.mainGrayDark ,paddingVertical:12, paddingHorizontal:15, borderRadius:15, marginBottom:15, gap:15 }}  >
//             <View className='flex justify-center items-start gap-2  mb-1 w-full '>
           
//                 <View className='flex-row w-full justify-between items-center'>
//                         <View className="flex-row items-center gap-2">
//                             <Image
//                                 source={{ uri: userDB.profilePic }}
//                                 resizeMode='cover'
//                                 style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
//                             />
//                             <Text className='text-mainGrayDark   ' >@{userDB.username}</Text>
//                         </View>
//                     <Text className='text-mainGrayDark '>{formatDate(dialogue.createdAt)}</Text>
                    
//                 </View>
//                 { tag && (
//                         <View className=' '>
//                             <Text className= 'font-pbold text-primary text-xs ' style={{ backgroundColor: tag.color , padding:5, borderRadius:10}} >{tag.tagName}</Text>
//                         </View>
//                     ) }
//                 <View className='my-0 justify-center items-center w-full gap-3  mb-6'>
//                     <View className='flex gap-2 justify-center items-center'>
                        
//                         <View className='justify-center items-center gap-0'>
//                             <Text className='text-secondary font-pcourier uppercase text-lg' >{userDB.firstName}</Text>
//                         </View>
                        
//                     </View>

//                     <Text className='text-third font-pcourier leading-5 text-left w-full'> { dialogue.content } </Text>
//                 </View>

                    
               
//             <View className=' flex-row items-end justify-between  w-full '>
//                 <View className='flex-row gap-4 items-end justify-between w-full '>


                

//                 <View className='flex-row gap-3  item-center justify-center' >
//                 { dialogue.mentions && dialogue.mentions.length > 0 && dialogue.mentions.map( mention => (
//                     <TouchableOpacity key={mention.id}  onPress={()=>handleMentionPress(mention)}  className=' items-center'>
//                         <Image
//                             source={{ uri: `${posterURL}${mention.movie ? mention.movie.posterPath : mention.tv ? mention.tv.posterPath : mention.castCrew.posterPath}` }}
//                             resizeMode='cover'
//                             style={{ width:35, height:45, borderRadius:10, overflow:'hidden' }}
//                         />
//                     </TouchableOpacity>
//                 ) ) 
//                 }
//                 </View>
               

                

//                     <View className='flex-row gap-3 '>
//                         <TouchableOpacity >
//                         <View className='flex-row  justify-center items-center  py-1 px-2 ' style={{height:32, borderColor:Colors.mainGray}}>
//                             <UpIcon className=' ' size='18' color={Colors.mainGray} />
//                             { dialogue.upVotes && dialogue.upVotes > 0 && (
//                             <Text className='text-xs font-pbold text-gray-400  '> {dialogue.upVotes}</Text>
//                             )  }
//                         </View>
//                         </TouchableOpacity>
//                         <TouchableOpacity >
//                         <View  className='flex-row  justify-center items-center  py-1 px-2 ' style={{height:32, borderColor:Colors.mainGray}}>
//                             <DownIcon className=' ' size='18' color={Colors.mainGray} />
//                             { dialogue.downVotes && dialogue.downVotes > 0 && (
//                             <Text className='text-xs font-pbold text-gray-400  '> {dialogue.downVotes}</Text>
//                             )  }
//                         </View>
//                         </TouchableOpacity>
//                         <TouchableOpacity >
//                         <View className='flex-row  justify-center items-center  py-1 px-2 ' style={{height:32, borderColor:Colors.mainGray}}>
//                             <MessageIcon  onPress={()=>handleComment(dialogue)} className='' size='18' color={Colors.mainGray} />
//                             { dialogue.downVotes && dialogue.downVotes > 0 && (
//                             <Text className='text-xs font-pbold text-gray-400  '> {dialogue.downVotes}</Text>
//                             )  }
//                         </View>
//                         </TouchableOpacity>
//                         <TouchableOpacity >
//                         <View className='flex-row  justify-center items-center  py-1 px-2' style={{height:32, borderColor:Colors.mainGray}}>
//                             <RepostIcon className='' size='14' color={Colors.mainGray} />
//                             { dialogue.credits && dialogue.reposts > 0 && (
//                             <Text className='text-xs font-pbold text-gray-400  '> {dialogue.reposts}</Text>
//                             )  }
//                         </View>

//                         </TouchableOpacity>
//                         <View className='relative' >
//                             <TouchableOpacity onPress={()=>setMenuOpen(prev => !prev)}  >
//                             <View className='flex-row  justify-center items-center  py-1 px-2' style={{height:32, borderColor:Colors.mainGray}}>
//                                 <ThreeDotsIcon className='' size='14' color={Colors.mainGray} />
//                             </View>
//                             </TouchableOpacity>
//                         </View>
                            
//                     </View>
//                 </View>
                
//             </View>
            

//             {/* <View  className='w-full border-t-[.3px] border-mainGrayDark mt-2'/> */}

//             </View>
//         </View>


//       </ScrollView>
//       </SafeAreaView>
//   )
// }

// export default DialoguePageFromSearch

// const styles = StyleSheet.create({})


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DialogueScreen from '../../../../../components/Screens/DialoguePage'

const DialogueIdPage = () => {
  return (
    <DialogueScreen />
  )
}

export default DialogueIdPage

const styles = StyleSheet.create({})