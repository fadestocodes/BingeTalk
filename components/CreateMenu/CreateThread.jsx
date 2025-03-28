    import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator } from 'react-native'
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
import { MessagesSquare } from 'lucide-react-native'
  



    const CreateThread = ( {threadObject, handleChange, inputs, setInputs, handleSearch, results, setResults, resultsOpen, setResultsOpen, searchQuery, setSearchQuery} ) => {

        // const [ inputs, setInputs ] = useState({
        //     title : '',
        //     caption : ''
        // })
        const [ image, setImage ] = useState(null); 
        const [ loadingImage, setLoadingImage ]  = useState(false);
        const posterURL = 'https://image.tmdb.org/t/p/original';
        const router = useRouter();
        const { tags, setTags } = useTagsContext();
        const { user : clerkUser } = useUser();
        const { data : ownerUser } = useFetchOwnerUser({email:clerkUser.emailAddresses[0].emailAddress}  );
        const [errors, setErrors] = useState(null)
        const [ message, setMessage ] = useState(null)

        useEffect(()=>{
            setTags({})
        }, [])

       
    const handleTagOptions = () => {
        router.push('/tagOptionsModal')
    }

      

        // const toPascalCase = (str) => {
        //     return str
        //         .replace(/[^a-zA-Z0-9 ]/g, '') // Remove non-alphanumeric characters except spaces
        //         .split(' ') // Split words
        //         .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
        //         .join(''); // Join words without spaces
        // };
        
        // const handlePress = (item) => {
        //     setInputs(prev => ({
        //         ...prev,
        //         query: `/${toPascalCase(item.name || item.title)}` // Convert to PascalCase
        //     }));
        //     setResultsOpen(false);
        // };

        const handlePost = async () => {
            console.log('input', inputs.threadTitle, inputs.threadCaption)

            const validationResults = createThreadSchema.safeParse( { ...inputs,  threadTitle: inputs.threadTitle } )
            console.log('validationreults', validationResults)
            if (!validationResults.success) {
                const errorObj = validationResults.error.format();
                console.log('errorobj from validation', errorObj)
                setErrors(errorObj.threadTitle._errors[0] )
                console.log(errorObj.threadTitle._errors[0] )
                return 
                } else {
                  setErrors(null)
                }

                console.log('made it here')
            const threadData = {
                userId : Number(ownerUser.id),
                movieId : threadObject.media_type === 'movie' ? threadObject.id : null  ,
                tvId : threadObject.media_type === 'tv' ? threadObject.id : null ,
                castId :threadObject.media_type === 'person' ? threadObject.id : null ,
                title : inputs.threadTitle,
                caption : inputs.threadCaption ,
                tags : Object.keys(tags).length > 0 ? tags : null,
                threadObject
            }

            const newThread = await createThread( threadData )

            setMessage(newThread.message)


            // setInputs({
            //     title : '',
            //     caption : ''
            // })
            setInputs(prev => ({
                ...prev,
                threadTitle : '',
                threadCaption : ''
            }))
            setTags({})
        }
        

    return (
        <>
        <ToastMessage message ={message} onComplete={()=> setMessage(null)} icon={<MessagesSquare size={30} color={Colors.secondary}/>}   />

        <View  className='w-full px-6  items-center justify-center gap-5' style={{paddingBottom:200}}>

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

            

            <View className='thread-title w-full relative flex-1 '>

            <View className='flex-row justify-start items-center ' style={{ position:'absolute', top:50 , zIndex:40, width:'100%', gap:5 , paddingLeft:20}} >
                
                { Object.keys(tags).length > 0 && (
                    <View   className='flex-row gap-1 justify-between items-center' style={{ backgroundColor: tags.color , padding:5, borderRadius:10}}>
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

                { errors && (
                        <View className='w-full my-2 justify-center'>
                    <Text className='text-red-400'>*{errors}</Text>
                    </View>
                ) }
                <View className='w-full relative items-center justify-between ' style={{marginBottom:20}}>
                <View className='flex-row w-full justify-between items-center' style={{ position:'absolute', top:0 , zIndex:20, top:10, paddingHorizontal:10}} >
                    
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
                
                    <TextInput
                        autoCapitalize='sentences'
                        placeholder='Thread title'
                        placeholderTextColor={Colors.mainGray}
                        className='w-full bg-white  text-lg font-pbold text-white'
                        onChangeText={(text)=> setInputs(prev => ({ ...prev, threadTitle : text }))}
                        maxLength={150}
                        multiline
                        autoCorrect={true}
                        value={inputs.threadTitle}
                        style={{ minHeight: Object.keys(tags).length > 0 ? 120 : 100, backgroundColor:Colors.mainGrayDark, paddingHorizontal:25, paddingTop: Object.keys(tags).length > 0 ? 90 : 50, paddingBottom:40 , borderTopLeftRadius: 15, borderTopRightRadius:15}}
                    />
                   
                {   loadingImage ? (
                    <View className=' w-full justify-center items-center' style={{ width:'100%', height:100 , backgroundColor:Colors.mainGrayDark}}> 
                        <ActivityIndicator></ActivityIndicator>
                    </View>
                ) 
                
                : image && (
                    <View className=' justify-center items-center w-full' style={{  width:'100%', paddingBottom:50, backgroundColor:Colors.mainGrayDark}}>
                            <View className="relative" style={{backgroundColor:Colors.mainGrayDark}}>
                                <Image
                                    source={{ uri: image }}
                                    style={{ width:300, height:200 , zIndex:30, borderRadius:15, overflow:'hidden'}}
                                    contentFit='cover'
                                />
                                <TouchableOpacity onPress={()=> setImage(null)} className='rounded-full bg-primary border-[1px] border-mainGray' style={{  position:'absolute', zIndex:30, top:6, right:10 }}>
                                    <CloseIcon color={Colors.mainGray} size={22} className='' style={{  }} />
                                </TouchableOpacity>
                            </View>
                    </View> 
                    ) }
                    </View>
                    
                <View className='w-full justify-center items-center gap-3 bg-white' style={{width:'100%',backgroundColor:Colors.mainGrayDark, position:'absolute',bottom:0, borderBottomRightRadius: 15, borderBottomLeftRadius:15 , paddingHorizontal:25, paddingBottom:15}}>
                    
                    <View className='border-t-[1px] border-slate-300 w-full' style={{ borderTopWidth:1, borderColor:Colors.mainGray }}
                    />
                    <View className='flex-row justify-end items-center  gap-3' style={{width:'100%',  justifyContent:'space-between'}}>
                        <View className='flex-row justify-center items-center gap-3'>
                            <TouchableOpacity>
                                <UploadPictureIcon onPress={()=>pickSingleImage(setImage, setLoadingImage)} color={Colors.mainGray} size={15} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleTagOptions} style={{ paddingHorizontal:5, paddingVertical:3, borderRadius:5, borderWidth:1.5 , borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                                    <Text className='text-xs text-mainGray'>TAGS 🏷️</Text>
                                </TouchableOpacity>
                        </View>
                        <Text className='text-mainGray text-right '>{inputs.threadTitle.length}/150</Text>
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
                    className='w-full relative min-h-50 bg-white rounded-3xl  items-start justify-start font-pcourier text-custom'
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
                <TouchableOpacity className=' bg-secondary rounded-xl justify-center items-center' onPress={handlePost} style={{paddingVertical:8, width:200, height:45, paddingHorizontal:20 }}>
                    <Text className='font-pbold text-center ' style={{}} >Post</Text>
                </TouchableOpacity>
        </View>
        </>

    )
    }

    export default CreateThread

    const styles = StyleSheet.create({})