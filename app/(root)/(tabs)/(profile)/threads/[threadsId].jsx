
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import ThreadsIdPage from '../../../../../components/Screens/ThreadsPage'
import { fetchSingleThread } from '../../../../../api/thread'

const threadsId = () => {
    const { threadsId, tvId }= useLocalSearchParams();
    console.log(threadsId, tvId)
    const queryClient = useQueryClient();

    const [ thread, setThread ] = useState(null)
    
    const cachedThreads = queryClient.getQueryData([ 'threads', tvId  ]);

    useEffect(()=>{
        const getThread = async () => {

        const cachedThreads = queryClient.getQueryData([ 'threads', tvId  ]);
    
        const existingThread = cachedThreads?.find( item => (item.id) === Number(threadsId) );
        console.log('is existing?',existingThread)
        setThread(existingThread);
    
        if (!existingThread) {
            const thread = await fetchSingleThread(threadsId);
            console.log('thread fetched', thread)
            setThread(thread);
        }
        }
        getThread();
    }, [queryClient])
    

    if (!thread) {
        return <ActivityIndicator />;
    }


  return (
   
    <ThreadsIdPage thread={thread}  ></ThreadsIdPage>
  )

}

export default threadsId

const styles = StyleSheet.create({})