import { View, Text, SafeAreaView, TextInput, TouchableWithoutFeedback, Keyboard , KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import { Colors } from '../../constants/Colors'
import Animated, {useAnimatedKeyboard,useAnimatedStyle} from 'react-native-reanimated';
import { BackIcon } from '../../assets/icons/icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { submitFeedback } from '../../api/submitFeedback';
import ToastMessage from '../ui/ToastMessage';
import { NotepadText } from 'lucide-react-native';

const SubmitFeedbackPage = () => {
  const [ input, setInput ] = useState('')
  const keyboard = useAnimatedKeyboard();
  const router = useRouter()
  const { userId } = useLocalSearchParams()
  const [ message, setMessage ] = useState('')
  const [ toastIcon, setToastIcon ] = useState(null)

  // console.log("USERIDHERE", userId)

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value / 4 }],
  }));

  const handlePost = async () => {
    const data = {
      userId : Number(userId),
      content : input.trim()
    }

    const res = await submitFeedback(data)

    setToastIcon(<NotepadText size={30} color={Colors.secondary} />)
    setMessage(res.message)

    setInput('')
  }


  
  return (
<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
    <SafeAreaView className='h-full w-full ' style={{backgroundColor:Colors.primary}}>
       {/* <Animated.View style={[]}> */}
       <ScrollView keyboardShouldPersistTaps="handled" style={{}}>
       <ToastMessage message={message} onComplete={()=>{setMessage(null); setToastIcon(null)}} icon={toastIcon} />
       <TouchableOpacity onPress={()=>router.back()} style={{paddingLeft:30}}>
            <BackIcon size={26} color={Colors.mainGray} />
        </TouchableOpacity>

          <View className='px-10 py-10 gap-5 pb-[180px]' >
            <Text className='text-2xl text-white font-pbold'>Help us make Bingeable better!</Text>
            <TextInput
              multiline
              value={input}
              // scrollEnabled
              onChangeText={(text)=>setInput(text)}
              maxLength={1000}
              style={{ minHeight:150, backgroundColor:Colors.mainGrayDark, borderRadius:15, paddingHorizontal:25, paddingVertical:20, color:'white' }}
              placeholder='Describe what you would change or improve!'
              placeholderTextColor={Colors.mainGray}
            />

            <TouchableOpacity disabled={ !input } onPress={handlePost} style={{borderRadius:30, backgroundColor:Colors.secondary, height:50, width:200, alignSelf:'center', justifyContent:'center', alignItems:'center'}} >
              <Text className='font-pbold text-primary text-lg'>Submit</Text>
            </TouchableOpacity>

            
          </View>
      {/* </Animated.View> */}
      </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default SubmitFeedbackPage