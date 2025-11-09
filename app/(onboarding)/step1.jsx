import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import { Colors } from '../../constants/Colors'
import { Wrench, Popcorn, ArrowRight } from 'lucide-react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

const step1 = () => {
    const [selected, setSelected] = useState(null)
    const {oauthProvider} = useLocalSearchParams()
    const router = useRouter()

    const handleNext  = () => {
        router.push({
            params: {accountType:selected, oauthProvider},
            pathname : selected === 'FILMMAKER' ? '(onboarding)/film-role' : '(onboarding)/step-2'
        })
    }

  return (
    <SafeAreaView className='w-full h-full bg-primary'>
        <View className='px-10 pt-20 gap-3'>
            <Text className='text-3xl font-bold text-white'>Looks like you don't have an account yet, lets get you started!</Text>
            <Text className='text-xl font-bold text-white pt-10 pb-2'>Select your account type</Text>
            <TouchableOpacity onPress={()=>setSelected('FILMMAKER')} style={{backgroundColor: selected === 'FILMMAKER'  ? Colors.primaryLight :'none' }} className='rounded-3xl border-2 border-primaryLight h-[150px] justify-center items-center'>
                <View className='flex flex-row gap-2'>
                    <Wrench color={Colors.mainGray}/>
                    <Text className='text-newLightGray font-bold text-lg'>Filmmaker</Text>
                </View>
                <Text className='text-newLightGray'>I work in the film industry</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setSelected('FILMLOVER')} style={{backgroundColor: selected === 'FILMLOVER' ?  Colors.primaryLight : 'none'}} className='rounded-3xl h-[150px] border-2 border-primaryLight justify-center items-center'>
                <View className='flex flex-row gap-2'>
                    <Popcorn color={Colors.mainGray} />
                    <Text className='text-newLightGray font-bold text-lg'>Film lover</Text>
                </View>
                <Text className='text-newLightGray'>I enjoy watching films and shows</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext} disabled={!selected} style={{opacity : !selected ? .2 : 1}} className='mt-10  self-center rounded-full bg-primaryLight w-[45px] h-[45px] relative justify-center items-center'>
                <View className=''>
                    <ArrowRight color={Colors.newLightGray} />
                </View>
            </TouchableOpacity>

        </View>

    </SafeAreaView>
  )
}

export default step1