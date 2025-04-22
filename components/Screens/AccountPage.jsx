import { ScrollView, StyleSheet, Text, View , TouchableOpacity, SafeAreaView} from 'react-native'
import React from 'react'
import { BackIcon, ForwardIcon } from '../../assets/icons/icons'
import { Colors } from '../../constants/Colors'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ShieldX, ChevronRight, LogOut, UserMinus, FileUser, Info, LifeBuoy } from 'lucide-react-native'
import { useClerk, useUser } from '@clerk/clerk-expo'



const AccountPage = () => {
    const router = useRouter()
    const { signOut } = useClerk();
    const {userId} = useLocalSearchParams()


    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/')
        } catch (err) {
            console.log(err)
        } 
    }

    const handlePrivacy = () => {
        router.push('/user/account/privacy')
    }
    const handleAbout = () => {
        router.push('/user/account/about')
    }

    const handleDelete = () => {
        router.push({
            pathname:'/user/account/deleteAccount',
            params:{userId}
        })
    }

    const handleHelp = () => {
        router.push('/user/account/help')
    }

    const handleBlockedUsers = () => {
        router.push('/user/account/blockedUsers')
    }

  return (
    <SafeAreaView className='w-full h-full bg-primary'>
    <ScrollView   style={{paddingHorizontal:15}}>
    <View className='w-full   px-4 gap-5' style={{paddingBottom:200}}>

          <TouchableOpacity onPress={()=>router.back()}>
            <BackIcon size={22} color={Colors.mainGray} />
        </TouchableOpacity>
        <View className="gap-5">
            <View className='flex-row gap-2 justify-start items-center'>

              <Text className='text-white font-pbold text-3xl'>Account</Text>
            </View>
        </View>
        <View className="gap-8 pt-8 w-full">
            <View className='w-full justify-between flex-row'>
                <View className='flex-row gap-2 justify-start items-center'>
                    <ShieldX size={26} color={Colors.mainGray} />
                     <Text className='text-white font-pregular text-lg'>Blocked users</Text>

                </View>
                <TouchableOpacity onPress={handleBlockedUsers}>
                    <ChevronRight size={28} color={Colors.mainGray} />
                </TouchableOpacity>
            </View>
           
            <View className='w-full justify-between flex-row'>

                <View className='flex-row gap-2 justify-start items-center'>
                    <LifeBuoy size={26} color={Colors.mainGray} />
                    <Text className='text-white font-pregular text-lg'>Help</Text>
                </View>
                <TouchableOpacity onPress={handleHelp}>
                    <ChevronRight size={28} color={Colors.mainGray} />
                </TouchableOpacity>
            </View>
            <View className='w-full justify-between flex-row'>

                <View className='flex-row gap-2 justify-start items-center'>
                    <Info size={26} color={Colors.mainGray} />
                    <Text className='text-white font-pregular text-lg'>About</Text>
                </View>
                <TouchableOpacity onPress={handleAbout}>
                    <ChevronRight size={28} color={Colors.mainGray} />
                </TouchableOpacity>
            </View>
            <View className='w-full justify-between flex-row'>

                <View className='flex-row gap-2 justify-start items-center'>
                    <FileUser size={26} color={Colors.mainGray} />
                    <Text className='text-white font-pregular text-lg'>Privacy Policy</Text>
                </View>
                <TouchableOpacity onPress={handlePrivacy}>
                    <ChevronRight size={28} color={Colors.mainGray} />
                </TouchableOpacity>
            </View>
            <View className='w-full justify-between flex-row'>

            <View className='flex-row gap-2 justify-start items-center'>
                <UserMinus size={26} color={Colors.mainGray} />
                <Text className='text-white font-pregular text-lg'>Delete Account</Text>
            </View>
            <TouchableOpacity onPress={handleDelete}>
                <ChevronRight size={28} color={Colors.mainGray} />
            </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleSignOut} className='flex-row justify-center items-center gap-3 self-center' style={{ backgroundColor:Colors.secondary, width:250 , borderRadius:30, paddingHorizontal:20, paddingVertical:10}}>
                <LogOut size={24} color={Colors.primary} />
                <Text className='font-pbold text-primary'>Sign out</Text>
            </TouchableOpacity>
        </View>


      </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default AccountPage

const styles = StyleSheet.create({})