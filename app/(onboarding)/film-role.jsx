import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList } from 'react-native'
import React, {useState} from 'react'
import { Colors } from '../../constants/Colors'
import { Wrench, Popcorn, ArrowRight, ArrowLeft } from 'lucide-react-native'
import { filmRoles } from '../../lib/FilmDeptRoles'
import {  useLocalSearchParams, useRouter } from 'expo-router'
import { parseDept } from '../../lib/parseFilmDept'




const FilmRole = () => {
    const departments = Object.entries(filmRoles.department).map(([name, info]) => ({
        name,
        roles: info.roles,
        emoji: info.emoji,
        numRoles : info.roles.length
      }));

    const [selected, setSelected] = useState('')
    const [selectedRole, setSelectedRole] = useState(null)
    const [selectedDept, setSelectedDept] = useState(null)
    const router = useRouter()
    const {accountType} = useLocalSearchParams()

    const handleDeptSelect = (dept) => {
    // const formatted = dept.toLowerCase().replace(/[^a-z0-9]/g, '');
    // setSelected(formatted)
        setSelected(dept)
        const parsed = parseDept(dept.name)
        setSelectedDept(parsed)
    }

    const handleNext = (role) => {
        
        const parsed = parseDept(role)
        setSelectedRole(parsed)
        router.push({
            params:{role: parsed, dept:selectedDept, accountType},
            pathname: '(onboarding)/profile-setup'
        })
    }
  return (
    <SafeAreaView className='w-full h-full bg-primary'>
    <View className='px-10 pt-20 gap-3 w-full'>
        <Text className='text-3xl font-bold text-white'>What's your role on set?</Text>
        <Text className='text-xl font-bold text-white pt-10 pb-2'>Select a department to find your role</Text>
        <View  style={{backgroundColor:Colors.primaryLight }} className='rounded-3xl border-2 border-primaryLight h-[450px]  w-full'>

            { !selected ? (
                <FlatList
                    data={departments}
                    keyExtractor={(item,index) => index}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{gap:20, paddingTop:30, paddingBottom:30,paddingLeft:20, paddingRight:20, width:'100%', justifyContent:'', alignItems:''}}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => handleDeptSelect(item)} style={{width:'100%'}} className='  '>
                            <Text className='font-bold text-newLightGray text-xl'>{item.emoji} {item.name} ({item.numRoles})</Text>
                        </TouchableOpacity>
    
                    )}
                />
            ) : (
                <FlatList
                    data={selected.roles}
                    keyExtractor={(item,index) => index}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{gap:15, paddingTop:30, paddingBottom:30,paddingLeft:20, paddingRight:20, width:'100%', justifyContent:'', alignItems:''}}
                    ListFooterComponent={(
                        <TouchableOpacity onPress={()=>setSelected(null)}  style={{ }} className='mt-10  self-center rounded-full bg-primary w-[45px] h-[45px] relative justify-center items-center'>
                            <View className=''>
                                <ArrowLeft color={Colors.newLightGray} />
                            </View>
                        </TouchableOpacity>

                    )}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity onPress={()=>{handleNext(item)}} style={{width:'100%'}} className='  '>
                                <Text className=' font-semibold text-newLightGray text-lg'>{item}</Text>
                            </TouchableOpacity>
                        )
                    }
                }
                />
            )}
        </View>
      

        <View className='flex flex-row gap-3 justify-center items-center'>
            <TouchableOpacity onPress={()=>router.back()} style={{ }} className='mt-10  self-center rounded-full bg-primaryLight w-[45px] h-[45px] relative justify-center items-center'>
                <View className=''>
                    <ArrowLeft color={Colors.newLightGray} />
                </View>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={handleNext} disabled={!selectedRole}  style={{ opacity : !selectedRole ? 0.3 : 1 }} className='mt-10  self-center rounded-full bg-primaryLight w-[45px] h-[45px] relative justify-center items-center'>
                <View className=''>
                    <ArrowRight color={Colors.newLightGray} />
                </View>
            </TouchableOpacity> */}
        </View>

    </View>

</SafeAreaView>
  )
}

export default FilmRole

const styles = StyleSheet.create({})