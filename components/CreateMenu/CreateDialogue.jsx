import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Keyboard, SectionList, Pressable, Linking, Touchable } from 'react-native'
import { Image } from 'expo-image'
import React, { useState, useEffect, useRef } from 'react'
import { Colors } from '../../constants/Colors'
import { SlateIcon, PeopleIcon, ThreadsIcon,UploadPictureIcon, CloseIcon } from '../../assets/icons/icons'
import { pickSingleImage } from '../../lib/pickImage'
import { searchAll } from '../../api/tmdb'
import { MentionInput } from 'react-native-controlled-mentions'
import { createDialogue } from '../../api/dialogue'
import debounce from 'lodash.debounce'
import { useUserDB } from '../../lib/UserDBContext'
import { findOrCreateEntity } from '../../api/db'
import { addActivity } from '../../api/activity'
import { useFetchDialogues } from '../../api/dialogue'
import { FilmIcon, TVIcon, PersonIcon } from '../../assets/icons/icons'
import { useFetchOwnerUser, useFetchUser } from '../../api/user'
import { router, useLocalSearchParams } from 'expo-router'
import { useTagsContext } from '../../lib/TagsContext'
import { formatDate } from '../../lib/formatDate'
import { createDialogueSchema } from '../../lib/zodSchemas'
import ToastMessage from '../ui/ToastMessage'
import { MessageSquare, FileImage, Link , ExternalLink} from 'lucide-react-native'
import { getLinkPreview } from '../../api/linkPreview'
import { useCreateContext } from '../../lib/CreateContext'
import { LinearGradient } from 'expo-linear-gradient'
import { avatarFallback } from '../../lib/fallbackImages'
import { avatarFallbackCustom, moviePosterFallback } from '../../constants/Images'
import { useGetUser, useGetUserFull } from '../../api/auth'


const toPascalCase = (str) => {
        return str
            .replace(/[^a-zA-Z0-9 ]/g, '') // Remove non-alphanumeric characters except spaces
            .split(' ') // Split words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
            .join(''); // Join words without spaces
    };

const CreateDialogue = ( {flatlistVisible, setFlatlistVisible, dialogueMaxError,dialogueItems, setDialogueMaxError, setDialogueItems ,handleSearch, results, setResults, resultsOpen, setResultsOpen, searchQuery, setSearchQuery} ) => {

    const [ input, setInput ] = useState('')
    const [image, setImage] = useState(null);
    const [ loadingImage, setLoadingImage ] = useState(false);
    // const [ results, setResults ] = useState([]);
    // const [ resultsOpen, setResultsOpen ] = useState(false);
    const [ textParts, setTextParts ] = useState([])
    const [ mentions, setMentions ] = useState([])
    const [ suggestionOpen, setSuggestionOpen ] = useState(true)
    const inputRef = useRef(null);  // Create a ref for the MentionInput
    const [ uploadingPost, setUploadingPost ] = useState(false);
    // const { id } = useLocalSearchParams();
    const { tags, setTags } = useTagsContext();
    const [ autoCorrect, setAutoCorrect ] = useState(true)
    const [isMentioning, setIsMentioning] = useState(false);
    const [errors, setErrors] = useState(null)
    const [ message, setMessage ] = useState(null)
    const { url, updateUrl } = useCreateContext()



   
    useEffect(()=>{
        setTags({})
    }, [])



    // const { userDB, updateUserDB } = useUserDB();
    const {user:userDB} = useGetUser()
    const {userFull:ownerUser, loading:refetchUser, loading:isFetchingUser} = useGetUserFull(userDB?.id)


    const { data : dialogues, refetch, isFetching } = useFetchDialogues(userDB?.id);
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(?:\/[^\s]*)?/;


    const userId = userDB?.id
    const posterURL = 'https://image.tmdb.org/t/p/w500';

   

    useEffect(() => {
      
        mentions.forEach( mention => {
            if (!input.includes(mention.pascalName)){
                console.log(' the mentino to remove is ', mention.pascalName)
            }
        }  )
        setMentions(prev => prev.filter( item => input.includes(item.pascalName) ) )
        // console.log('Mentions after filtering', filteredMentions);
    }, [input]);  // Watching both input and mentions

    useEffect(() => {
        if (dialogueItems.length < 4 ){
            setDialogueMaxError(null)
        } else if (dialogueItems.length === 3){
            setDialogueMaxError(true)
        }
    },[dialogueItems])


    const handleURLPreview = debounce( async (param) => {

        const linkPreview = await getLinkPreview(param);
        const previewImage = linkPreview.imageUrl

    } , 1200)

    const handleInput = async (text) => {
        setInput(text);
        const words = text.split(' ');
        const lastMentionIndex = text.lastIndexOf('/');
    
        if (lastMentionIndex !== -1) {
          const mentionText = text.slice(lastMentionIndex + 1);
          setIsMentioning(mentionText.length > 0); // Still in mention mode if text exists after '/'
        } else {
          setIsMentioning(false); // Reset when there's no '/'
        }


        const urlMatch = text.match(urlPattern);
        if (urlMatch) {
            console.log('url match!',urlMatch)
            let normalizedURL = ''
            let url = urlMatch[0];  // Get the matched URL
          if (!/^https?:\/\//i.test(url)) {
            // Step 2: Check if the URL has 'www.' prefix
            if (/^www\./i.test(url)) {
                // If 'www.' is present, prepend 'https://'
                url = 'https://' + url;
            } else {
                // Otherwise, prepend 'https://'
                url = 'https://www.' + url;
            }
        }

        normalizedURL = new URL(url).toString();
        console.log('normalized url ', normalizedURL)
          await handleURLPreview(normalizedURL)


        }
    }



    const handlePost = async () => {
        console.log('trying to post...')
        console.log('tagsss', tags)

        const validationResults = createDialogueSchema.safeParse( {content:input} )
        if (!validationResults.success) {
            const errorObj = validationResults.error.format();
            setErrors(errorObj.content._errors[0] )
            return 
            } else {
              setErrors(null)
            }

        setUploadingPost(true);
        const mentionsForPrisma = await Promise.all(
            dialogueItems.map(async (mention) => {
                // console.log('MENTIONWHILECREATING', mention)
                const type = mention.media_type;
                const mentionType = mention.media_type === 'movie' ? 'MOVIE' : mention.media_type === 'tv' ? 'TV' : 'CASTCREW'
                const tmdbId = mention.id;
                const movieData = {
                    tmdbId : mention.id,
                    title : mention.title || mention.name,
                    releaseDate : mention.release_date || mention.first_air_date,
                    posterPath : mention.poster_path,
                    backdropPath : mention.backdrop_path,
                };
                const castData = {
                    tmdbId : mention.id,
                    name : mention.name,
                    dob : mention.birthday,
                    posterPath : mention.profile_path
                }

                try {
                    const entity = await findOrCreateEntity(type, movieData, castData);
                    console.log("EACHENTITY", entity)
                    return {
                      userId,
                      tmdbId,
                      mentionType : mentionType,
                      movieId: mentionType === 'MOVIE' ? entity.id : null,
                      tvId: mentionType === 'TV' ? entity.id : null,
                      castId: mentionType === 'CASTCREW' ? entity.id : null,
                    };

                } catch(err){
                    console.log(err)
                    return null
                }
            })
          ).catch((err)=>{
          })
        // console.log('tag name', tags[0].name)
        const postData = {
            userId,
            content : input.trim(),
            mentions : mentionsForPrisma,
            tags,
            image,
            url : url.link || null
        }
        console.log('POSTDATA', postData)
        const newPost = await createDialogue(postData); 
        console.log("POSTRESPONSE", newPost)

        setMessage(newPost.message)
        setUploadingPost(false);
        setInput('')
        setImage(null)
        updateUrl({
            link : '',
            title : '',
            image : '',
            subtitle  :''
        })
        setTags({})
        setDialogueItems([])
        refetch();
    }

    const handleTagOptions = () => {
        router.push('/tagOptionsModal')
    }
    

    const handleLinkPress = async () => {
        console.log('trying to open link')
        const supported = await Linking.canOpenURL(url.link);
        if (supported) {
            await Linking.openURL(url.link); // Opens in default browser
        } 
    };

    const handleClearUrl = () => {
        updateUrl({
            link : '',
            image : '',
            title : '',
            subtitle : ''
        })
    }

    const removeItem = (item) => {
        setDialogueItems(prev => (
            prev.filter( i => i.id !== item.id)
        ))
    }

     if (!userDB) {
            
        return <ActivityIndicator></ActivityIndicator>  
    } 
 


  return (
    <>
    <ToastMessage message ={message} onComplete={()=> setMessage(null)} icon={<MessageSquare size={30} color={Colors.secondary}/>}   />
    <View onPress={()=>{setResultsOpen(false); setFlatlistVisible(false)}} className=' px-6 relative items-center justify-center' style={{ width:'100%', gap:15}} >

        { uploadingPost && (
            <View style={{ position:'absolute', inset:0, justifyContent:'center', alignItems:'center', zIndex:30 }} >
                <ActivityIndicator />
            </View>
        ) }
        <View className='w-full'>
    

<View className='thread-topic w-full relative justify-center items-center '>
    <TextInput
        placeholder='Dialogue mentions (max. 4)'
        placeholderTextColor={Colors.mainGray}
        multiline
        autoCorrect={false}
        onChangeText={(text)=> { setSearchQuery(text);  handleSearch(text)  }}
        className='w-full bg-white rounded-3xl  font-pregular '
        style={{ minHeight:50, paddingHorizontal:25, paddingTop:15, justifyContent:'center', alignItems:'center', textAlignVertical:'center', backgroundColor:Colors.mainGrayDark, color:'white' }}
        value={searchQuery}
        onFocus={()=>setResultsOpen(true)}
    />
    <TouchableOpacity onPress={()=> { setSearchQuery('') ; setResults([]); setResultsOpen(false)}}  style={{ position:'absolute', right:20, top:15 }}>
        <CloseIcon color={Colors.mainGray} size={24} className=' ' />
    </TouchableOpacity>
</View>
</View>
       
                { errors && (
                        <View className='w-full my-2 justify-center'>
                    <Text className='text-red-400'>*{errors}</Text>
                    </View>
                ) }
        <View className='w-full relative items-center justify-between ' style={{marginBottom:20, position:'relative', backgroundColor:Colors.mainGrayDark, borderRadius:15 , paddingHorizontal:0, gap:10, paddingBottom:60,width:'100%'}}>
            
           

            <View className='flex justify-start items-start w-full' style={{ position:'relative', top:10, left:0 , zIndex:40, width:'100%', gap:15 , paddingHorizontal:15}} >
            <View className='flex-row w-full justify-between items-center'>
                        <View className="flex-row items-center gap-2">
                            <Image
                                source={{ uri: userDB.profilePic || avatarFallbackCustom }}
                                contentFit='cover'
                                style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                            />
                            <Text className='text-mainGrayDark   ' >@{userDB.username}</Text>
                        </View>
                    <Text className='text-mainGrayDark '>{formatDate(new Date())}</Text>
                    
            </View>
           
                
                { Object.keys(tags).length > 0 && (
                    <View   className='flex-row  justify-between items-center' style={{ backgroundColor: tags.color , padding:5, borderRadius:15}}>
                        <Text className= 'font-pbold text-primary  text-xs'  >{tags.name}</Text>
                    <TouchableOpacity onPress={()=>setTags({})} style={{ backgroundColor:Colors.primary, borderRadius:'50%' }} ><CloseIcon size={16} color={Colors.mainGray} /></TouchableOpacity>
                    </View>
                ) }
                 
            </View>
            <View style={{position:"relative", alignItems:'center', justifyContent:'center', width:'100%', zIndex:10}}>
                <Text className='font-pcourier uppercase text-lg text-secondary ' >{userDB.firstName}</Text>
            </View>
       

            <TextInput
                value={input}
                multiline={true}
                onChangeText={setInput}
                placeholderTextColor={Colors.mainGray}
                autoCorrect={true}
                placeholder="What's on your mind?"
                autoCapitalize='sentences'
                className='font-pcourier'
                style={{ color:'white', width:'100%', paddingHorizontal:15 }}
            />
        {   loadingImage ? (
            <View className='bg-transparent justify-center items-center' style={{ width:'100%', backgroundColor:Colors.mainGrayDark,height : 200 }}>
                <ActivityIndicator></ActivityIndicator>
            </View>
        ) 
        : image && (
            <View className='bg-mainGrayDark w-full  justify-center items-center  ' style={{ paddingBottom:0, backgroundColor:Colors.mainGrayDark,  }}>
                    <View className="relative w-full" style={{paddingHorizontal:15}}>

                        <Image
                            source={{ uri: image }}
                            style={{ width:'100%', paddingHorizontal:15,height:200 , zIndex:30, borderRadius:15, overflow:'hidden'}}
                            contentFit='cover'
                        />
                        <TouchableOpacity onPress={()=> setImage(null)} className='rounded-full bg-primary ' style={{  position:'absolute', zIndex:30, padding:3, top:5, right:20 }}>
                            <CloseIcon color={Colors.mainGray} size={20} className='' style={{  }} />
                        </TouchableOpacity>
                    </View>
            </View>
            ) } 
                    { url?.image && (

                        image ? (
                            <>
                                <TouchableOpacity onPress={handleLinkPress} style={{ backgroundColor:Colors.primary, paddingHorizontal:25, paddingVertical:7, borderRadius:15, flexDirection:'row' , gap:5, width:'85%', justifyContent:'center', alignItems:'center'}}>
                                    <ExternalLink size={14} color={Colors.mainGray} />
                                    <Text className='text-sm text-mainGray font-pregular' numberOfLines={1}>{url.link}</Text>
                                    <TouchableOpacity onPress={handleClearUrl} style={{ backgroundColor:Colors.mainGray,borderRadius:50  }}>
                                        <CloseIcon size={18} color={Colors.primary}  />

                                    </TouchableOpacity>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity onPress={handleLinkPress} style={{ borderRadius:15, height:150, width:'90%', position:'relative'}}>
                               <TouchableOpacity onPress={handleClearUrl} style={{ backgroundColor:Colors.primary, padding:3, borderRadius:50, position:'absolute', top:5, right:5, zIndex:10 }}>
                                   <CloseIcon size={20} color={Colors.mainGray} />
                               </TouchableOpacity>
                            <Image
                                source ={{ uri :url.image }}
                                style={{ width:'100%', height:'100%', borderRadius:15 , position:'absolute'}}
                            />
                             <LinearGradient
                                colors={['transparent', Colors.mainGrayDark]}
                                style={{
                                height: '100%',
                                width: '100%',
                                position: 'absolute',
                                }}
                            />
                            <View className='flex-row justify-between items-end h-full gap-3 w-full' style={{ paddingHorizontal:15, paddingVertical:30  }}>
                                <Text className='text-mainGray  font-pbold ' numberOfLines={2} style={{width:'85%'}}>{url.title}</Text>
                            <TouchableOpacity disabled style={{  }}>
                                <ExternalLink size={22} color={Colors.mainGray}  />
                            </TouchableOpacity>
                            </View>
                            </TouchableOpacity>

                        )
                    ) }

        { dialogueItems.length > 0 && (

        <View className='flex-row gap-3 w-full item-center justify-start mt-3' style={{paddingHorizontal:15}} >
        { dialogueItems.map( mention => (
            <View  key={mention.id}   >
            <TouchableOpacity className=' items-center z-10'>
                <Image
                    source={{ uri: `${posterURL}${mention.poster_path || mention.profile_path}` }}
                    placeholder={moviePosterFallback}

                    contentFit='cover'
                    style={{ width:35, height:40, borderRadius:10, overflow:'hidden' }}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>removeItem(mention)} style={{position:'absolute', top:0, right:0, backgroundColor:Colors.primary, borderRadius:50, zIndex:20}}>
                <CloseIcon size={22} color={Colors.mainGray} />
            </TouchableOpacity>
            </View>
        ) ) 
        }
        </View>
        ) }
        </View>

        
     
            <View className='w-full justify-center items-center gap-3 ' style={{width:'100%', position:'absolute',bottom:0, backgroundColor:Colors.mainGrayDark, borderBottomRightRadius: 15, borderBottomLeftRadius:15 , paddingHorizontal:15, paddingBottom:20}}>
                    
                    <View className='border-t-[1px] w-full' style={{borderColor:Colors.mainGray, borderTopWidth:1}}
                    />
                    <View className='flex-row items-center  gap-3' style={{width:'100%', backgroundColor:Colors.mainGrayDark, justifyContent:'space-between'}}>
                        <View className="flex-row gap-5">
                            <TouchableOpacity>
                                
                                <FileImage onPress={()=>pickSingleImage(setImage, setLoadingImage)} color={Colors.mainGray} size={24} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>router.push('/addURLModal')}>
                                <Link size={20} color={Colors.mainGray} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleTagOptions} style={{ paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderRadius:15, borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                                    <Text className='text-xs font-pbold text-mainGray'>Tags 🏷️</Text>
                                </TouchableOpacity>
                        </View>
                        <View className="flex-row justify-center items-center gap-3">
                            <Text className='text-mainGray text-right '>{input.length}/800</Text>
                            <TouchableOpacity onPress={handlePost} >
                        <Text className='font-pbold bg-secondary  ' style={{paddingVertical:8, paddingHorizontal:20, borderRadius:30}} >Post</Text>
                    </TouchableOpacity>

                        </View>
                    </View>
                </View>
    </View>
    </>
  )
}

export default CreateDialogue

const styles = StyleSheet.create({})