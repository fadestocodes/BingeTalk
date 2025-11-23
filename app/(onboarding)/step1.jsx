import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import { Colors } from '../../constants/Colors'
import { Wrench, Popcorn, ArrowRight, Clapperboard, PopcornIcon } from 'lucide-react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import FilmmakerIcon from '../../components/ui/UserFilmmaker'
import FilmloverIcon from '../../components/ui/UserFilmlover'
import ArrowNextButton from '../../components/ui/ArrowNextButton'
import { useSignUpContext } from '../../lib/SignUpContext'
import { updateAccountType } from '../../api/user'
import { useUserContext } from '../../lib/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

const step1 = () => {
    const [selected, setSelected] = useState(null)
    const {oauthProvider, noAccountType} = useLocalSearchParams()
    const { signUpData, updateSignUpData } = useSignUpContext()
    const { user, updateUser } = useUserContext();

    
    const handleSelect  = (selection) => {
        setSelected(selection)
        updateSignUpData(prev => ({
            ...prev,
            accountType : selection
        }))
    }
    const router = useRouter()

    const handleNext  = async () => {
        if (noAccountType){

            const updateData = {
                accountType : selected
            }
            const res = await updateAccountType(updateData)

            if (res.success){
                const jsonUser = JSON.stringify(res.user)
                updateUser(res.user)
                await AsyncStorage.setItem('user-data', jsonUser);
                router.replace('(home)/homeIndex')

            }

        } else {
            router.push({
                params: { oauthProvider},
                pathname :  selected === 'FILMMAKER' ? '(onboarding)/film-role' : '(onboarding)/profile-setup'
            })
        }
    }

  return (
    <SafeAreaView className='w-full h-full bg-primary'>
        <View className='px-10 pt-20 gap-3'>
            <Text className='text-3xl font-bold text-white'>{noAccountType ? "We've had a bit of an update!" :"Looks like you don't have an account yet, lets get you started!"}</Text>
            <Text className='text-xl font-bold text-white pt-10 pb-2'>Select your account type</Text>
            <TouchableOpacity onPress={()=>handleSelect('FILMMAKER')} style={{backgroundColor: selected === 'FILMMAKER'  ? Colors.primaryLight :'none' }} className=' px-6 gap-2 rounded-3xl border-2 border-primaryLight h-[150px] justify-center items-center'>
                <View className='flex flex-row gap-2 justify-center items-center'>
                    <Clapperboard size={25} color={Colors.mainGray}/>
                    <Text className='text-newLightGray font-bold text-lg'>Filmmaker</Text>
                </View>
                <Text className='text-newLightGray'>I work in the film industry and want to connect with other filmmakers, while using all the other features.</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>handleSelect('FILMLOVER')} style={{backgroundColor: selected === 'FILMLOVER' ?  Colors.primaryLight : 'none'}} className='px-6 gap-2 rounded-3xl h-[150px] border-2 border-primaryLight justify-center items-center'>
                <View className='flex flex-row gap-2 justify-center items-center'>
                    <PopcornIcon size={25} color={Colors.mainGray} />
                    <Text className='text-newLightGray font-bold text-lg'>Film lover</Text>
                </View>
                <Text className='text-newLightGray'>I enjoy watching films/shows and just want to use features like sending recommendations, tracking my watches, etc.</Text>
            </TouchableOpacity>

            <View className='pt-10 self-center'>
                <ArrowNextButton onPress={handleNext} disabled={!selected}  />
            </View>
        </View>

    </SafeAreaView>
  )
}

export default step1