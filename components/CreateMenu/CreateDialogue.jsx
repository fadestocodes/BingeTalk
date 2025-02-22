import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Image, Keyboard, SectionList, Pressable } from 'react-native'
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
import { useFetchUser } from '../../api/user'
import { useUser } from '@clerk/clerk-expo'
import { router } from 'expo-router'
import { useTagsContext } from '../../lib/TagsContext'

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
    const { data : dialogues, refetch, isFetching } = useFetchDialogues();
    const { tags, setTags } = useTagsContext();


    // const { userDB, updateUserDB } = useUserDB();
    const { user } = useUser();
    const { data:userDB, refetch: refetchUser } = useFetchUser( user.emailAddresses[0].emailAddress )
    const userId = userDB.id
    const posterURL = 'https://image.tmdb.org/t/p/original';

    useEffect(()=>{
        console.log('tags', tags)
    }, [ tags ])
   


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

    const handleInput = (text) => {
        setInput(text);
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
                        resizeMethod='cover'
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
        console.log('text',text)
        return text;
    }

    const handlePost = async () => {
        const formattedString = parseMentions(input, mentions)
        console.log('content is ', formattedString);
        setUploadingPost(true);
        const mentionsForPrisma = await Promise.all(
            mentions.map(async (mention) => {
                console.log('mentino being mapped',mention)
                const type = mention.mediaType;
                const tmdbId = mention.tmdbId;
                const movieData = {
                    tmdbId : mention.tmdbId,
                    title : mention.title,
                    releaseDate : mention.releaseDate,
                    posterPath : mention.posterPath,
                    backdropPath : mention.backdropPath,
                };
                const personData = {
                    tmdbId : mention.tmdbId,
                    name : mention.name,
                    dob : mention.dob,
                    posterPath : mention.posterPath
                }
                try {
                    console.log('trying to get entity')
                    const entity = await findOrCreateEntity(type, movieData, personData);
                    console.log('entity is ', entity)
                    console.log('mention type', mention.mentionType)
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
            console.log('promise all failed', err)
          })
        console.log('mentino for prisma',mentionsForPrisma)
        // console.log('tag name', tags[0].name)
        console.log('tags data', tags)
        const postData = {
            userId,
            content : formattedString,
            mentions : mentionsForPrisma,
            tags
        }
        console.log('trying to create dialogue')
        try {
            const newPost = await createDialogue(postData); 
            console.log('new post', newPost)
            try {
                const activityData = {
                    userId,
                    description : `@${userDB.username} posted a new dialogue`,
                    dialogueId : newPost.id
                }
                const newActivity = await addActivity(activityData);
            } catch (err) {
                console.log(err)
            }
        } catch (error) {
            console.log('Error trying to create dialogue post', err)
        }
        setUploadingPost(false);
        setInput('')
        setTags([])
        refetch();
    }

    const handleTagOptions = () => {
        router.push('/create/tagOptionsModal')
    }
    


    
 


  return (
    <View onPress={()=>{setResultsOpen(false); setFlatlistVisible(false)}} className='w-full px-6 relative items-center justify-center' style={{  }} >
        { uploadingPost && (
            <View style={{ position:'absolute', inset:0, justifyContent:'center', alignItems:'center', zIndex:30 }} >
                <ActivityIndicator />
            </View>
        ) }

       

        <View className='w-full relative items-center justify-between ' style={{marginBottom:20, position:'relative'}}>

           

            <View className='flex-row justify-start items-center ' style={{ position:'absolute', top:10 , zIndex:40, width:'100%', gap:5 , paddingLeft:20}} >
                
                { Object.keys(tags).length > 0 && (
                    <View   className='flex-row gap-1 justify-between items-center' style={{ backgroundColor: tags.color , padding:5, borderRadius:10}}>
                        <Text className= 'font-pbold text-primary  uppercase text-xs'  >{tags.name}</Text>
                    <TouchableOpacity onPress={()=>setTags({})} style={{ backgroundColor:Colors.primary, borderRadius:'50%' }} ><CloseIcon size={18} color={Colors.mainGray} /></TouchableOpacity>
                    </View>
                ) }
                    {/* { tags.map( (tag, index) => (
                        <View  key={index} className='flex-row gap-1 justify-between items-center' style={{ backgroundColor: tag.color , padding:5, borderRadius:10}}>
                            <Text className= 'font-pbold text-primary  uppercase text-xs'  >{tag.name}</Text>
                        <TouchableOpacity onPress={()=>setTags([])} style={{ backgroundColor:Colors.primary, borderRadius:'50%' }} ><CloseIcon size={18} color={Colors.mainGray} /></TouchableOpacity>
                        </View>
                    ) ) } */}
            </View>
        
           <MentionInput
            value = {input}
            multiline={true}
            onChange={handleInput}
            style={{ fontFamily:'Courier', fontSize:15, lineHeight:24, color:'white' }}
            maxLength={800}
            placeholder="Use '/' to mention a movie, show, cast, or crew. "
            placeholderTextColor={Colors.mainGray}
            autoCorrect={false}
            partTypes={ [
                {
                    trigger : '/',
                    textStyle : { fontWeight: 'bold', color:Colors.secondary },
                    renderSuggestions,
                    isBottomMentionSuggestionsRender:true,
                    isInsertSpaceAfterMention:true
                }
            ] }
            containerStyle = { {backgroundColor:Colors.mainGrayDark, width:'100%', fontFamily : 'Courier', fontSize:18,minHeight:200,paddingTop: input ? 60 : 40, paddingHorizontal:20, paddingBottom:50, minHeight:200, borderTopLeftRadius:24, borderTopRightRadius:24} }
           
           />

       

        { input && (
            <View style={{position:"absolute", top:40, alignItems:'center', justifyContent:'center', width:'100%'}}>
                <Text className='font-pcourier uppercase text-lg text-white ' >Drew</Text>
            </View>

        ) }


        {   loadingImage ? (
            <View className='bg-mainGrayDark justify-center items-center' style={{ width:'100%', height : 200 }}>
                <ActivityIndicator></ActivityIndicator>
            </View>
        ) 
        
        : image && (
            <View className='bg-mainGrayDark justify-center items-center ' style={{  width:'100%', paddingBottom:50}}>
                    <View className="relative">

                        



                        <Image
                            source={{ uri: image }}
                            style={{ width:300, height:200 , zIndex:30, borderRadius:15, overflow:'hidden'}}
                            resizeMode='cover'
                        />
                        <TouchableOpacity onPress={()=> setImage(null)} className='rounded-full bg-primary border-[1px] border-mainGray' style={{  position:'absolute', zIndex:30, top:6, right:10 }}>
                            <CloseIcon color={Colors.mainGray} size={22} className='' style={{  }} />
                        </TouchableOpacity>
                    </View>
            </View>
            ) }
        </View>

        
     
            <View className='w-full justify-center items-center gap-3 ' style={{width:'100%', position:'absolute',bottom:0, backgroundColor:Colors.mainGrayDark, borderBottomRightRadius: 24, borderBottomLeftRadius:24 , paddingHorizontal:25, paddingBottom:20}}>
                    
                    <View className='border-t-[1px] w-full' style={{borderColor:Colors.mainGray, borderTopWidth:1}}
                    />
                    <View className='flex-row items-center  gap-3' style={{width:'100%',  justifyContent:'space-between'}}>
                        <View className="flex-row gap-3">
                            <TouchableOpacity>
                                <UploadPictureIcon onPress={()=>pickSingleImage(setImage, setLoadingImage)} color={Colors.mainGray} size={24} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleTagOptions} style={{ paddingHorizontal:5, paddingVertical:0, borderRadius:5, borderWidth:1.5 , borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                                <Text className='text-xs text-mainGray'>TAGS 🏷️</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row justify-center items-center gap-3">
                            <Text className='text-mainGray text-right '>{input.length}/800</Text>
                            <TouchableOpacity onPress={handlePost} disabled={!input} >
                        <Text className='font-pbold bg-secondary rounded-xl ' style={{paddingVertical:8, paddingHorizontal:20}} >Post</Text>
                    </TouchableOpacity>

                        </View>
                    </View>
                </View>
    </View>
  )
}

export default CreateDialogue

const styles = StyleSheet.create({})