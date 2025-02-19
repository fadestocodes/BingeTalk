import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Keyboard, Platform,TouchableWithoutFeedback } from 'react-native'
import { UpIcon, DownIcon, MessageIcon, RepostIcon } from '../../assets/icons/icons'
import React, {useState} from 'react'
import { formatDate } from '../../lib/formatDate'
import { Colors } from '../../constants/Colors'
import { useUserDB } from '../../lib/UserDBContext'
import { useRouter } from 'expo-router'

const DialogueCard = ( { dialogue } ) => {

    const { userDB, updateUserDB } = useUserDB();
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const router = useRouter();
    const [ textInputFocus, setTextInputFocus ] = useState(false);
    const [ input, setInput ] = useState('')
    const [height, setHeight] = useState(25);
    

    const handleMentionPress = (mention) => {
        if (mention.movie) {
            router.push(`/movie/${mention.tmdbId}`)
        } else if (mention.tv) {
            router.push(`/tv/${mention.tmdbId}`)
        } else {
            router.push(`/cast/${mention.tmdbId}`)
        }
    }

    const handleInput = (text) => {
        setInput( prev => text)
    }

    const handleComment = (dialogue) => {
        router.push(`/commentsModal?id=${dialogue.id}`)
    }


  return (

   
    <View  className=''   >
            <View className='flex justify-center items-start gap-2 mt-4 mb-1 w-full '>
           
                <View>
                    <Text className='text-mainGray '>{formatDate(dialogue.createdAt)}</Text>
                </View>
                <View className='my-2 justify-center items-center w-full gap-3 '>
                    <View className='flex gap-3 justify-center items-center'>
                        <Image
                            source={{ uri: userDB.profilePic }}
                            resizeMode='cover'
                            style={{ borderRadius:'50%', overflow:'hidden', width:35, height:35 }}
                        />
                        <Text className='text-secondary font-pcourier uppercase text-lg' >@{userDB.username}</Text>
                        
                    </View>

                    <Text className='text-third font-pcourier leading-5 text-left w-full'> { dialogue.content } </Text>
                </View>

                    
               
            <View  className='w-full border-t-[.5px] border-mainGray'/>
            <View className=' flex-row items-end justify-between  w-full '>
                <View className='flex-row gap-4 items-center justify-center '>
                    <TouchableOpacity >
                    <View className='flex-row  justify-center items-center  py-1 px-2 ' style={{height:32, borderColor:Colors.mainGray}}>
                        <UpIcon className=' ' size='18' color={Colors.mainGray} />
                        { dialogue.upVotes && dialogue.upVotes > 0 && (
                        <Text className='text-xs font-pbold text-gray-400  '> {dialogue.upVotes}</Text>
                        )  }
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity >
                    <View  className='flex-row  justify-center items-center  py-1 px-2 ' style={{height:32, borderColor:Colors.mainGray}}>
                        <DownIcon className=' ' size='18' color={Colors.mainGray} />
                        { dialogue.downVotes && dialogue.downVotes > 0 && (
                        <Text className='text-xs font-pbold text-gray-400  '> {dialogue.downVotes}</Text>
                        )  }
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity >
                    <View className='flex-row  justify-center items-center  py-1 px-2 ' style={{height:32, borderColor:Colors.mainGray}}>
                        <MessageIcon  onPress={handleComment} className='' size='18' color={Colors.mainGray} />
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
                    <TouchableOpacity >
                   
                    </TouchableOpacity>
                </View>
                
            </View>
            <View className='flex-row gap-3 w-full item-center justify-start' >
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

                {/* { textInputFocus && (
                    <View style={{width:'100%'}} >
                        <View className='border-t-[0.5px] w-full border-mainGray my-5'  />
                        <View style={{flexGrow:1, flexDirection:'column-reverse'}} >
                        <TextInput
                            multiline
                            placeholder='Add reply'
                            placeholderTextColor={ Colors.mainGray }
                            // onContentSizeChange={(event) =>
                            //     setHeight(event.nativeEvent.contentSize.height)
                            //   }
                              scrollEnabled={false}
                            value={ input }
                            onChangeText={ (text) => handleInput(text) }
                            style ={{ width:'100%', borderRadius:10, borderWidth:.5, paddingHorizontal:15, paddingVertical:15 ,
                                borderColor:Colors.mainGray, color:'white', fontFamily:'courier',
                                textAlignVertical:'top', minHeight:height
                            }}
                        />
                        </View>
                    </View>

                ) } */}

            </View>
            {/* <View className='w-full border-t-[.5px] border-mainGray items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGray}}/> */}
        </View>
     
  )
}

export default DialogueCard

const styles = StyleSheet.create({})