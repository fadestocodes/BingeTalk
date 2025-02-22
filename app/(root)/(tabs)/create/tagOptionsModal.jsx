import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { tagOptions } from '../../../../lib/tagOptions'
import { CheckCircle, Circle } from 'lucide-react-native'; // Example icons
import { Colors } from '../../../../constants/Colors';
import { useTagsContext } from '../../../../lib/TagsContext';
import { useRouter } from 'expo-router';

const tagOptionsModal = () => {
    const { tags, setTags } = useTagsContext();
    const router = useRouter();

    const [ selected, setSelected ] = useState(tags);
   

    const handlePress = (item) => {
        if (selected?.name === item.name) {
            setSelected({});  // Deselect if already selected
            setTags({})
        } else {
            setSelected(item); // Select new tag
            setTags(item)
        }
    };

    const handleSave = () => {
        setTags(selected);
        router.back();
    }

  return (
    <View className='w-full px-8 py-8'>
        <FlatList
            data={tagOptions}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ gap:15, width:'100%', paddingBottom:100, paddingTop:30 }}
            ListHeaderComponent={(
                <View className='w-full justify-center items-center mb-5'>
                    <Text className='font-pbold text-2xl text-mainGray' >Choose a tag for your post.</Text>
                    <Text className=' text-mainGray' >(one tag per post)</Text>
                </View>
            )}
            ListFooterComponent={(
                <TouchableOpacity onPress={handleSave} style={{ marginTop:50, paddingHorizontal:15, paddingVertical:5, justifyContent:'center', alignItems:'center', backgroundColor:Colors.secondary, borderRadius:10 }}>
                    <Text className='text-primary font-pbold text-lg'>Save</Text>
                </TouchableOpacity>
            )}
            renderItem={({item}) => {
                // const isSelected = selected.includes( item );
                const isSelected = selected.name === item.name
                return (
                <TouchableOpacity onPress={ () => handlePress(item) } className='flex-row  justify-start items-center gap-3'>
                    <View>
                        {isSelected ? (
                            <CheckCircle color="green" size={24} />
                            ) : (
                            <Circle color="gray" size={24} />
                        )}
                    </View>
                    <Text className= 'font-pbold text-primary text-xs ' style={{ backgroundColor: item.color , padding:5, borderRadius:10}} >{item.name}</Text>
                </TouchableOpacity>
            )}
            
        }
        />

    </View>
  )
}

export default tagOptionsModal

const styles = StyleSheet.create({})