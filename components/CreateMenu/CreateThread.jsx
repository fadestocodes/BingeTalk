    import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator, Linking } from 'react-native'
    import { Image } from 'expo-image'
    import React, {useState, useEffect} from 'react'
    import { Colors } from '../../constants/Colors'
    import { SlateIcon, PeopleIcon, ThreadsIcon, CloseIcon, FilmIcon, PersonIcon, TVIcon , UploadPictureIcon} from '../../assets/icons/icons'
    import debounce from 'lodash.debounce';
    import { getYear } from '../../lib/formatDate'
    import { pickSingleImage } from '../../lib/pickImage'  
    import { useTagsContext } from '../../lib/TagsContext'
    import { useRouter } from 'expo-router';
    import { useFetchOwnerUser } from '../../api/user';
    import { useUser } from '@clerk/clerk-expo';
    import { createThread } from '../../api/thread';
    import { formatDate } from '../../lib/formatDate'
    import { createThreadSchema } from '../../lib/zodSchemas'
import ToastMessage from '../ui/ToastMessage'
import { MessagesSquare, ExternalLink , FileImage, Link} from 'lucide-react-native'
import { getLinkPreview } from '../../api/linkPreview'
import { useCreateContext } from '../../lib/CreateContext'
import { LinearGradient } from 'expo-linear-gradient'
  



    const CreateThread = ( {threadObject, handleChange, inputs, setInputs, handleSearch, results, setResults, resultsOpen, setResultsOpen, searchQuery, setSearchQuery} ) => {

        const [ image, setImage ] = useState(null); 
        const [ loadingImage, setLoadingImage ]  = useState(false);
        const posterURL = 'https://image.tmdb.org/t/p/original';
        const router = useRouter();
        const { tags, setTags } = useTagsContext();
        const { user : clerkUser } = useUser();
        const { data : ownerUser } = useFetchOwnerUser({email:clerkUser.emailAddresses[0].emailAddress}  );
        const [errors, setErrors] = useState(null)
        const [ message, setMessage ] = useState(null)
        const [topicError, setTopicError] = useState(false)
        const urlPattern = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(?:\/[^\s]*)?/;
        const { url, updateUrl } = useCreateContext()



        useEffect(()=>{
            setTags({})
        }, [])

       
    const handleTagOptions = () => {
        router.push('/tagOptionsModal')
    }


    const handleURLPreview = debounce( async (param) => {

        const linkPreview = await getLinkPreview(param);
        const previewImage = linkPreview.imageUrl
        console.log('linkpreview', linkPreview)

    } , 1200)

    const handleTitleInput = async (text) => {
        setInputs(prev => ({ ...prev, threadTitle : text }))

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
            if (searchQuery === '' || searchQuery === null || !threadObject) {
                setTopicError(true)
                return
            } else {
                setTopicError(false)
            }

            const validationResults = createThreadSchema.safeParse( { ...inputs,  threadTitle: inputs.threadTitle } )
            if (!validationResults.success) {
                const errorObj = validationResults.error.format();
                setErrors(errorObj.threadTitle._errors[0] )
                return 
                } else {
                  setErrors(null)
                }


            const threadData = {
                userId : Number(ownerUser.id),
                movieId : threadObject.media_type === 'movie' ? threadObject.id : null  ,
                tvId : threadObject.media_type === 'tv' ? threadObject.id : null ,
                castId :threadObject.media_type === 'person' ? threadObject.id : null ,
                title : inputs.threadTitle.trim(),
                caption : inputs.threadCaption.trim() ,
                tags : Object.keys(tags).length > 0 ? tags : null,
                threadObject,
                image : image || null,
                url : url.link || null
            }

            const newThread = await createThread( threadData )

            setMessage(newThread.message)


            // setInputs({
            //     title : '',
            //     caption : ''
            // })
            setSearchQuery('')
            setInputs(prev => ({
                ...prev,
                threadTitle : '',
                threadCaption : ''
            }))
            updateUrl({
                link:'',
                image:'',
                titel : '',
                subtitle:''
            })
            setImage('')
            setTags({})
        }


    const handleLinkPress = async () => {
        console.log('trying to open link', url.link)
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
        <ToastMessage message ={message} onComplete={()=> setMessage(null)} icon={<MessagesSquare size={30} color={Colors.secondary}/>}   />

        <View  className='w-full px-6  items-center justify-center gap-5' style={{paddingBottom:200}}>
<View className='w-full'>
    
                    { topicError && (
                        <Text className='text-red-400 text-left self-start my-2'>*Thread needs a topic</Text>
                     ) }
                <View className='thread-topic w-full relative justify-center items-center '>
                    <TextInput
                        placeholder='Thread topic (film, show, person)'
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

            

            <View className='thread-title w-full relative flex-1 ' style={{backgroundColor:Colors.mainGrayDark, borderRadius:15}}>

            
                { errors && (
                        <View className='w-full my-2 justify-center'>
                    <Text className='text-red-400'>*{errors}</Text>
                    </View>
                ) }
                <View className='w-full relative items-center justify-between ' style={{marginBottom:10,  paddingHorizontal:15, gap:10}}>
                <View className='flex-row w-full justify-between items-center' style={{ position:'relative', backgroundColor:Colors.mainGrayDark, top:0 , zIndex:20, top:10,}} >
                    
                        <View className="flex-row items-center gap-2">
                            <Image
                                source={{ uri: ownerUser.profilePic }}
                                contentFit='cover'
                                style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                            />
                            <Text className='text-mainGrayDark   ' >@{ownerUser.username}</Text>
                        </View>
                    <Text className='text-mainGrayDark '>{formatDate(new Date())}</Text>
                    
            </View>
                
                { Object.keys(tags).length > 0 && (
            <View className='flex-row justify-start items-center  mt-3' style={{ position:'relative', zIndex:40, width:'100%', gap:5 , paddingLeft:0}} >
                    <View   className='flex-row gap-1 justify-between items-center' style={{ backgroundColor: tags.color , padding:5, borderRadius:10}}>
                        <Text className= 'font-pbold text-primary  text-xs'  >{tags.name}</Text>
                    <TouchableOpacity onPress={()=>setTags({})} style={{ backgroundColor:Colors.primary, borderRadius:'50%' }} ><CloseIcon size={16} color={Colors.mainGray} /></TouchableOpacity>
                    </View>
                </View>
                ) }
                
                    <TextInput
                        autoCapitalize='sentences'
                        placeholder='Thread title'
                        placeholderTextColor={Colors.mainGray}
                        className='w-full text-lg font-pbold text-white'
                        onChangeText={handleTitleInput}
                        maxLength={150}
                        multiline
                        autoCorrect={true}
                        value={inputs.threadTitle}

                        // style={{ minHeight: Object.keys(tags).length > 0 ? 120 : 100, backgroundColor:Colors.mainGrayDark, paddingHorizontal:25, paddingTop: Object.keys(tags).length > 0 ? 90 : 50, paddingBottom:40 , borderTopLeftRadius: 15, borderTopRightRadius:15}}
                        style = { {backgroundColor:Colors.mainGrayDark, width:'100%', fontSize:18, paddingTop:10, paddingHorizontal:0, paddingBottom: 0 , borderTopLeftRadius:15, borderTopRightRadius:15} }

                    />
             

{   loadingImage ? (
            <View className='bg-transparent justify-center items-center' style={{ width:'100%', backgroundColor:Colors.mainGrayDark,height : 200 }}>
                <ActivityIndicator></ActivityIndicator>
            </View>
        ) 
        
        : image && (
            <View className='bg-mainGrayDark w-full  justify-center items-center  ' style={{ paddingBottom:0, backgroundColor:Colors.mainGrayDark  }}>
                    <View className="relative w-full">

                        



                        <Image
                            source={{ uri: image }}
                            style={{ width:'100%', height:200 , zIndex:30, borderRadius:15}}
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
                                <TouchableOpacity onPress={handleLinkPress}  style={{ backgroundColor:Colors.primary, paddingHorizontal:25, paddingVertical:7, borderRadius:15, flexDirection:'row' , gap:5, width:'85%', justifyContent:'center', alignItems:'center'}}>
                                    <ExternalLink size={14} color={Colors.mainGray} />
                                    <Text className='text-sm text-mainGray font-pregular' numberOfLines={1}>{url.link}</Text>
                                    <TouchableOpacity onPress={handleClearUrl} style={{ backgroundColor:Colors.mainGray,borderRadius:50  }}>
                                        <CloseIcon size={18} color={Colors.primary}  />

                                    </TouchableOpacity>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity onPress={handleLinkPress} style={{ borderRadius:15, height:150, width:'100%', position:'relative'}}>
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
                    
                <View className='w-full justify-center items-center gap-3 bg-white' style={{width:'100%',backgroundColor:Colors.mainGrayDark, position:'relative',bottom:0, borderBottomRightRadius: 15, borderBottomLeftRadius:15 , paddingHorizontal:15, paddingBottom:15}}>
                    
                    <View className='border-t-[1px] border-slate-300 w-full' style={{ borderTopWidth:1, borderColor:Colors.mainGray }}
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
                            <Text className='text-mainGray text-right '>{inputs.threadTitle.length}/150</Text>
                       

                        </View>
                    </View>
                </View>
            </View>

            <View className='thread-caption w-full relative'>
          
                <TextInput
                    onChangeText={(text)=> setInputs(prev => ({ ...prev, threadCaption : text }))}
                    value={inputs.threadCaption}
                    multiline
                    maxLength={800}
                    placeholder='Caption for your thread (optional)'
                    placeholderTextColor={Colors.mainGray}
                    style={{paddingTop:60, paddingHorizontal:25,backgroundColor:Colors.mainGrayDark, color:'white', paddingBottom:70, minHeight:100, textAlignVertical:'top'}}
                    className='w-full relative min-h-50 bg-white rounded-3xl  items-start justify-start font-pcourier '
                />
              
                    <View style={{position:"absolute", top:30, alignItems:'center', justifyContent:'center', width:'100%', zIndex:20}}>
                        <Text className='font-pcourier uppercase text-lg text-secondary' >{ownerUser.firstName}</Text>
                    </View>
                <View className='justify-center items-center z-10 gap-3 w-full bg-white  '  style={{ position:'absolute',backgroundColor:Colors.mainGrayDark, bottom:0, borderBottomRightRadius: 15, borderBottomLeftRadius:15 , height : 70 }}>
                    <View className='border-t-[1.5px] border-slate-200 w-full' 
                    />
                     <View className='w-full justify-center items-center gap-3 bg-white' style={{width:'100%', backgroundColor:Colors.mainGrayDark,position:'absolute',bottom:0, borderBottomRightRadius: 15, borderBottomLeftRadius:15 , paddingHorizontal:25, paddingBottom:10}}>
                    
                    <View className='border-t-[1px]  w-full' style={{borderColor:Colors.mainGray, borderTopWidth:1}}
                    />
                    <View className='flex-row justify-end items-center  gap-3' style={{width:'100%',  justifyContent:'flex-end'}}>
                       
                        <Text className='text-mainGray text-right '>{inputs.threadCaption.length}/800</Text>
                    </View>
                </View>
                </View>
            </View>
                <TouchableOpacity className=' bg-secondary rounded-xl justify-center items-center' onPress={handlePost} style={{paddingVertical:8, width:200, height:45, paddingHorizontal:20, borderRadius:30 }}>
                    <Text className='font-pbold text-center ' style={{}} >Post</Text>
                </TouchableOpacity>
        </View>
        </>

    )
    }

    export default CreateThread

    const styles = StyleSheet.create({})