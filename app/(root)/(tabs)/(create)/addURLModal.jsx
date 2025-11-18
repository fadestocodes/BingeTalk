import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, TouchableOpacity, ActivityIndicator, Linking} from 'react-native'
import React, {useState} from 'react'
import { Image } from 'expo-image'
import { Colors } from '../../../../constants/Colors'
import { CloseIcon } from '../../../../assets/icons/icons'
import debounce from 'lodash.debounce'
import { getLinkPreview } from '../../../../api/linkPreview'
import { ExternalLink } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useCreateContext } from '../../../../lib/CreateContext'



const addURLModal = () => {
    const { url, updateUrl } = useCreateContext()
    // const [ url, setUrl ] = useState('')
    // const [ urlImage, setUrlImage ] = useState('')
    const [ loadingImage, setLoadingImage ] = useState(false)
    // const [ urlMetadata, setUrlMetadata ] = useState({
    //     title : '',
    //     subtitle : ''
    // })

    const urlPattern = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(?:\/[^\s]*)?/;
    const handleURLPreview = debounce( async (param) => {

        const linkPreview = await getLinkPreview(param);
        const previewImage = linkPreview.imageUrl
        setLoadingImage(false)
        // setUrlImage(previewImage)

        // setUrlMetadata({
        //     title : linkPreview.title,
        //     subtitle : linkPreview.h1
        // })
        updateUrl(prev => ({
            ...prev,
            image : previewImage,
            title : linkPreview.title,
            subtitle : linkPreview.h1
        }))


    } , 1200)

    const handleInput = async (text) => {
        // setUrl(text)
        updateUrl(prev => ({
            ...prev,
            link : text
        }))

        const urlMatch = text.match(urlPattern);
        if (urlMatch) {
            setLoadingImage(true)

            let normalizedURL = ''
            let urlToNormalize = urlMatch[0];  // Get the matched URL
          if (!/^https?:\/\//i.test(urlToNormalize)) {
            // Step 2: Check if the URL has 'www.' prefix
            if (/^www\./i.test(urlToNormalize)) {
                // If 'www.' is present, prepend 'https://'
                urlToNormalize = 'https://' + urlToNormalize;
            } else {
                // Otherwise, prepend 'https://'
                urlToNormalize = 'https://www.' + urlToNormalize;
            }
        }

        normalizedURL = new URL(urlToNormalize).toString();
        await handleURLPreview(normalizedURL)

         }
    }   

    const handleLinkPress = async () => {
        const supported = await Linking.canOpenURL(url.link);
        if (supported) {
            await Linking.openURL(url.link); // Opens in default browser
        } 
    };

    const handleClear = () => {
        updateUrl({
            link : '',
            image : '',
            title : '',
            subtitle : ''
        })
    }

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View className='px-10 gap-5'>
        <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:30 , alignSelf:'center'}} />


      <Text className='text-3xl font-pbold text-mainGray pt-20 self-center '>Add a link</Text>
      <View>
      <TextInput 
        value={url.link}
        onChangeText={handleInput}
        placeholder='Enter a URL'
        placeholderTextColor={Colors.mainGray}
        autoCapitalize='none'
        keyboardType='url'
        style={{  borderRadius:30, backgroundColor:Colors.mainGrayDark,  paddingVertical:15, paddingLeft:20, paddingRight:50, color:'white', fontSize:15  }}

      />
        <TouchableOpacity onPress={handleClear} style={{ backgroundColor:Colors.primary, borderRadius:50, position:'absolute', right:10, top:10, padding:5 }}>
            <CloseIcon size={20} color={Colors.mainGray} />
        </TouchableOpacity>

      </View>
      { loadingImage && (
        <ActivityIndicator />
      ) }
      { url.image && (
        <TouchableOpacity onPress={handleLinkPress} style={{ borderRadius:15, height:150, width:'100%', position:'relative'}}>
        <Image
            source ={{ uri :url.image }}
            style={{ width:'100%', height:'100%', borderRadius:15 , position:'absolute'}}
        />
         <LinearGradient
            colors={['transparent', 'black']}
            style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            }}
        />
        <View className='flex-row justify-between items-end h-full gap-3 w-full' style={{ paddingHorizontal:15, paddingVertical:15  }}>
            <Text className='text-mainGray  font-pbold ' numberOfLines={2} style={{width:'85%'}}>{url.title}</Text>
        <TouchableOpacity disabled style={{  }}>
            <ExternalLink size={22} color={Colors.mainGray}  />
        </TouchableOpacity>
        </View>
        </TouchableOpacity>
      ) }

    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default addURLModal

const styles = StyleSheet.create({})