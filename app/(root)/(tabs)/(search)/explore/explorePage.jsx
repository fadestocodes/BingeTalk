import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import ExploreComponent from '../../../../../components/Explore'
import { getTrending } from '../../../../../lib/TMDB'
import { Explorev2 } from '../../../../../components/Explorev2'
import TinderSwipeCard from '../../../../../components/TinderSwipeCard/TinderSwipeCard'

const ExplorePage = () => {

    const [ movies, setMovies ] = useState([]);

    useEffect(() => {
        const fetchTrending = async () => {
            const res = await getTrending();
            if (res) {
                setMovies(res.results)
            }
        }
        fetchTrending();
    }, [])


  useEffect(()=>{
    setMovies(movies)
  }, [movies])



  return (
    // <ExploreComponent dataList={movies} />
    <View className='h-full w-full relative pt-[0px] bg-primary '>
        {/* <Explorev2  style={{  }} movies={movies} setMovies={setMovies} /> */}
        <TinderSwipeCard></TinderSwipeCard>

    </View>
)
}

export default ExplorePage
