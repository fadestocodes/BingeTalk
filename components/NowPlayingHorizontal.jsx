import { FlatList, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import React, {useState} from 'react';
import { useRouter } from 'expo-router';




const posterURL = 'https://image.tmdb.org/t/p/original';


const NowPlayingItem = ({ item}) => {
    const router = useRouter();

    const handlePress = () => {
        router.push(`/(root)/(tabs)/(home)/(movie)/${item.id.toString()}`)
    }
    

    return (
    <View className=''  >
        <TouchableOpacity 
            className='relative flex justify-center items-center rounded-md '
            activeOpacity={0.7}
            onPress={handlePress}
            >
            <ImageBackground
                source={{ uri: `${posterURL}${item.poster_path}` }}
                resizeMode="cover"
                className=' overflow-hidden rounded-md'                
                style={{ width: 80, height: 170, marginRight:12, borderRadius:10 , overflow : 'hidden'}} // Ensure image fills the container
            />
        </TouchableOpacity>
       
    </View>
    )
}


const NowPlayingHorizontal = ({movies}) => {
    const [activeItem, setActiveItem] = useState(movies[0])


    
    return (
            <FlatList
                data = {movies}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <NowPlayingItem  item={item}  className=''/>
                )}
                
                showsHorizontalScrollIndicator={false}
            />
        ) }
  

export default NowPlayingHorizontal
