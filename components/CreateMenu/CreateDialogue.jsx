import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Keyboard, SectionList, Pressable, Linking } from 'react-native'
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
import { useUser } from '@clerk/clerk-expo'
import { router, useLocalSearchParams } from 'expo-router'
import { useTagsContext } from '../../lib/TagsContext'
import { formatDate } from '../../lib/formatDate'
import { createDialogueSchema } from '../../lib/zodSchemas'
import ToastMessage from '../ui/ToastMessage'
import { MessageSquare, FileImage, Link , ExternalLink} from 'lucide-react-native'
import { getLinkPreview } from '../../api/linkPreview'
import { useCreateContext } from '../../lib/CreateContext'
import { LinearGradient } from 'expo-linear-gradient'


const toPascalCase = (str) => {
        return str
            .replace(/[^a-zA-Z0-9 ]/g, '') // Remove non-alphanumeric characters except spaces
            .split(' ') // Split words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
            .join(''); // Join words without spaces
    };

const CreateDialogue = ( {flatlistVisible, setFlatlistVisible} ) => {

    const [ input, setInput ] = useState('')
    const [image, setImage] = useState(null);
    const [ loadingImage, setLoadingImage ] = useState(false);
    const [ results, setResults ] = useState([]);
    const [ resultsOpen, setResultsOpen ] = useState(false);
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
    const { user } = useUser();
    const { data:userDB, refetch: refetchUser, isFetching:isFetchingUser } = useFetchOwnerUser({email: user.emailAddresses[0].emailAddress} )
    const { data : dialogues, refetch, isFetching } = useFetchDialogues(userDB.id);
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(?:\/[^\s]*)?/;


    const userId = userDB.id
    const posterURL = 'https://image.tmdb.org/t/p/w500';

    // if (!userDB || isFetchingUser) {
            
    //     return <ActivityIndicator></ActivityIndicator>  
    // } 

    useEffect(() => {
      
        mentions.forEach( mention => {
            if (!input.includes(mention.pascalName)){
                console.log(' the mentino to remove is ', mention.pascalName)
            }
        }  )
        setMentions(prev => prev.filter( item => input.includes(item.pascalName) ) )
        // console.log('Mentions after filtering', filteredMentions);
    }, [input]);  // Watching both input and mentions
   

    const handleSearch = debounce( async (query) => {
        if (query.length > 2) {
            try {
                setResultsOpen(true)
                setSuggestionOpen(true)
                const response = await searchAll(query);
                setResults(response.results);
                // setResults( [{ title : 'Results', data : response.results }] )
                // console.log('results are ', results)
            } catch (err) {
                console.log(err)
            }
        } 
    }, 300)

    const handleURLPreview = debounce( async (param) => {

        const linkPreview = await getLinkPreview(param);
        const previewImage = linkPreview.imageUrl
        console.log('linkpreview', linkPreview)

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

    // useEffect(( ) => {
    //     console.log('mentions array ', mentions)
    // }, [mentions])


//-----------------
    const renderSuggestions = ( { keyword, onSuggestionPress } ) => {

        
        if (keyword === null || mentions.some( mention => mention.pascalName === keyword ) || keyword === undefined ) {
            return null
        }
        handleSearch(keyword)
        return (
            <View style={{  }} >
              
                { results.length > 0 && results.map( item => (
                     <TouchableOpacity  
                        key={item.id}
                        disabled={mentions.some((mention) => mention.pascalName === toPascalCase(item.name || item.title))}

                        onPress={() => {
                            setResults([]);
                            setSuggestionOpen(false)
                            const mentionText = `${toPascalCase(item.name || item.title)}`;
                            setMentions((prev) => {
                                const exists = prev.some((mention) => mention.pascalName === mentionText);
                              
                                if (!exists) {
                                  return [...prev, { mentionObj: item.name || item.title, pascalName: mentionText, mediaType : item.media_type, title : item.title || item.original_name || null, name : item.name || null,
                                    releaseDate : item.release_date || item.first_air_date, posterPath : item.poster_path || item.profile_path, backdropPath : item.backdrop_path || null, dob : item.birthday || null,
                                    tmdbId : item.id, movieId : item.mediaType==='movie' ? item.id : null, userId, mentionType : item.media_type === 'movie' ? 'MOVIE' : item.media_type === 'tv' ? 'TV' : 'CASTCREW',
                                    tvId : item.media_type === 'tv' ? item.id : null, castId : item.media_type === 'person' ? item.id : null,

                                
                                }];
                                }
                              
                                return prev; // If it exists, return the same array without adding a duplicate
                              });
                            onSuggestionPress({
                                id: item.id,
                                name: mentionText, // This inserts the mention into input
                            });
                           
                        }} 
                        style={{ width:'100%', padding:10, paddingHorizontal:10, borderBottomWidth:.5, borderColor:Colors.mainGray, flexDirection:'row',gap:10, justifyContent:'flex-start', alignItems:'center' }}
                    >
                    <Image
                        source = {{ uri: `${posterURL}${item.poster_path || item.profile_path}` }}
                        contentFit='cover'
                        style= {{ width:30, height: 50, borderRadius:10, overflow:'hidden' }}
                    />
                    <View className='gap-1' >
                        <View className='flex-row gap-1 justify-start items-center'>
                            {  item.media_type === 'movie' ? <FilmIcon size={14} color={Colors.secondary}  /> : item.media_type === 'tv' ? <TVIcon size={14} color={Colors.secondary} /> : <PersonIcon size={14} color={Colors.secondary} /> }
                            <Text style={{ opacity : mentions.some((mention) => mention.pascalName === toPascalCase(item.name || item.title)) ? .2 : 1 }}  className='text-mainGray text-sm font-pbold'>{item.name || item.title}</Text>
                        </View>
                        <Text className='text-mainGray text-xs' >{ item.media_type === 'movie' ? `Released: ${item.release_date}` : item.media_type === 'tv' ? `First episode: ${item.first_air_date}` : item.birthday }</Text>

                    </View>
                 </TouchableOpacity>
                ) ) }
            </View>
        )
    }
//------------------

    const parseMentions = (text, mentions) => {
        // Create the mention string to search for, like /[MovieTitle](ID)
        mentions.forEach(mention => {
            // Create the mention string to search for, like /[MovieTitle](ID)
            const mentionString = `/\\[${mention.pascalName}\\]\\(${mention.tmdbId}\\)`; // escape square brackets and parentheses
            
            // Replace the mention in the text with the desired format (/MovieTitle)
            const regex = new RegExp(mentionString, 'g'); // 'g' for global search
            text = text.replace(regex, `/${mention.pascalName}`);
        });
        return text;
    }

    const handlePost = async () => {
        const formattedString = parseMentions(input, mentions)

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
            mentions.map(async (mention) => {
                const type = mention.mediaType;
                const tmdbId = mention.tmdbId;
                const movieData = {
                    tmdbId : mention.tmdbId,
                    title : mention.title,
                    releaseDate : mention.releaseDate,
                    posterPath : mention.posterPath,
                    backdropPath : mention.backdropPath,
                };
                const castData = {
                    tmdbId : mention.tmdbId,
                    name : mention.name,
                    dob : mention.dob,
                    posterPath : mention.posterPath
                }
                try {
                    const entity = await findOrCreateEntity(type, movieData, castData);
                    return {
                      userId,
                      tmdbId,
                      mentionType : mention.mentionType,
                      movieId: mention.mentionType === 'MOVIE' ? entity.id : null,
                      tvId: mention.mentionType === 'TV' ? entity.id : null,
                      castId: mention.mentionType === 'CASTCREW' ? entity.id : null,
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
            content : formattedString.trim(),
            mentions : mentionsForPrisma,
            tags,
            image,
            url : url.link || null
        }
        const newPost = await createDialogue(postData); 

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
        setTags([])
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

    
 


  return (
    <>
    <ToastMessage message ={message} onComplete={()=> setMessage(null)} icon={<MessageSquare size={30} color={Colors.secondary}/>}   />
    <View onPress={()=>{setResultsOpen(false); setFlatlistVisible(false)}} className=' px-6 relative items-center justify-center' style={{ width:'100%'}} >
        { uploadingPost && (
            <View style={{ position:'absolute', inset:0, justifyContent:'center', alignItems:'center', zIndex:30 }} >
                <ActivityIndicator />
            </View>
        ) }

       
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
                                source={{ uri: userDB.profilePic }}
                                contentFit='cover'
                                style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                            />
                            <Text className='text-mainGrayDark   ' >@{userDB.username}</Text>
                        </View>
                    <Text className='text-mainGrayDark '>{formatDate(new Date())}</Text>
                    
            </View>
           
                
                { Object.keys(tags).length > 0 && (
                    <View   className='flex-row  justify-between items-center' style={{ backgroundColor: tags.color , padding:5, borderRadius:10}}>
                        <Text className= 'font-pbold text-primary  text-xs'  >{tags.name}</Text>
                    <TouchableOpacity onPress={()=>setTags({})} style={{ backgroundColor:Colors.primary, borderRadius:'50%' }} ><CloseIcon size={16} color={Colors.mainGray} /></TouchableOpacity>
                    </View>
                ) }
                    {/* { tags.map( (tag, index) => (
                        <View  key={index} className='flex-row gap-1 justify-between items-center' style={{ backgroundColor: tag.color , padding:5, borderRadius:10}}>
                            <Text className= 'font-pbold text-primary  uppercase text-xs'  >{tag.name}</Text>
                        <TouchableOpacity onPress={()=>setTags([])} style={{ backgroundColor:Colors.primary, borderRadius:'50%' }} ><CloseIcon size={18} color={Colors.mainGray} /></TouchableOpacity>
                        </View>
                    ) ) } */}
            </View>
            <View style={{position:"relative", alignItems:'center', justifyContent:'center', width:'100%', zIndex:10}}>
                <Text className='font-pcourier uppercase text-lg text-secondary ' >{userDB.firstName}</Text>
            </View>
        
           <MentionInput
            value = {input}
            multiline={true}
            onChange={handleInput}
            style={{ fontFamily:'Courier', fontSize:15, lineHeight:18, color:'white' }}
            maxLength={800}
            placeholder="Use '/' to mention a movie, show, cast, or crew. "
            placeholderTextColor={Colors.mainGray}
            autoCorrect={true}
            partTypes={ [
                {
                    trigger : '/',
                    textStyle : { fontWeight: 'bold', color:Colors.secondary },
                    renderSuggestions,
                    isBottomMentionSuggestionsRender:true,
                    isInsertSpaceAfterMention:true
                }
            ] }
            // containerStyle = { {backgroundColor:Colors.mainGrayDark, width:'100%', fontFamily : 'Courier', fontSize:18,minHeight:250, paddingTop: Object.keys(tags).length > 0 ? 110 :  Object.keys(tags) <1 && 60, paddingHorizontal:20, paddingBottom:image || url.image ? 20 : 70, minHeight: Object.keys(tags).length > 0 && !image && !url.image ? 250  : Object.keys(tags).length > 0 && image  ? 180 :  image || url.image ? 130  : 180 , borderTopLeftRadius:15, borderTopRightRadius:15} }
            containerStyle = { {backgroundColor:Colors.mainGrayDark, width:'100%', fontFamily : 'Courier', fontSize:18, paddingTop:0, paddingHorizontal:20, paddingBottom: 0 , borderTopLeftRadius:15, borderTopRightRadius:15} }
           
           />

       

         



        {   loadingImage ? (
            <View className='bg-transparent justify-center items-center' style={{ width:'100%', backgroundColor:Colors.mainGrayDark,height : 200 }}>
                <ActivityIndicator></ActivityIndicator>
            </View>
        ) 
        
        : image && (
            <View className='bg-mainGrayDark w-full  justify-center items-center  ' style={{ paddingBottom:0, backgroundColor:Colors.mainGrayDark,  }}>
                    <View className="relative">

                        



                        <Image
                            source={{ uri: image }}
                            style={{ width:300, height:200 , zIndex:30, borderRadius:15, overflow:'hidden'}}
                            contentFit='cover'
                        />
                        <TouchableOpacity onPress={()=> setImage(null)} className='rounded-full bg-primary ' style={{  position:'absolute', zIndex:30, padding:3, top:6, right:10 }}>
                            <CloseIcon color={Colors.mainGray} size={20} className='' style={{  }} />
                        </TouchableOpacity>
                    </View>
            </View>
            ) } 
                    { url.image && (

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

        </View>

        
     
            <View className='w-full justify-center items-center gap-3 ' style={{width:'100%', position:'absolute',bottom:0, backgroundColor:Colors.mainGrayDark, borderBottomRightRadius: 15, borderBottomLeftRadius:15 , paddingHorizontal:25, paddingBottom:20}}>
                    
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