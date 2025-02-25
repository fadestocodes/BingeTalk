
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThreadsIdPage from '../../../../../components/Screens/ThreadsPage'
import { useLocalSearchParams } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { fetchSingleThread } from '../../../../../api/thread'

const threadsId = () => {
    const { threadsId, tvId, movieId, castId }= useLocalSearchParams();
    console.log(threadsId, tvId)
    const queryClient = useQueryClient();

    const [ thread, setThread ] = useState(null)


    const getThread = async () => {
        let cachedThreads, existingThread;
        
        if (tvId) {
            cachedThreads = queryClient.getQueryData(['threads', tvId]);
        } else if (movieId) {
            cachedThreads = queryClient.getQueryData(['threads', movieId]);
        } else if (castId) {
            cachedThreads = queryClient.getQueryData(['threads', castId]);
        }
    
        if (cachedThreads) {
            existingThread = cachedThreads.find(item => item.id === Number(threadsId));
        }
    
        if (existingThread) {
            console.log("Using cached thread:", existingThread);
            setThread({ ...existingThread });  // ⬅️ Force new object reference
        } else {
            console.log("Fetching thread from API...");
            const thread = await fetchSingleThread(threadsId);
            console.log("Thread fetched:", thread);
            setThread({ ...thread });  // ⬅️ Force new object reference
        }
    };
    

    useEffect(()=>{
       
        getThread();
    }, [])
    

    if (!thread) {
        return <ActivityIndicator />;
    }


  return (
   
    <ThreadsIdPage thread={thread} refetch={getThread}  ></ThreadsIdPage>
  )
}

export default threadsId

const styles = StyleSheet.create({})