import { StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native'
import { Colors } from '../../constants/Colors'
import React, {useState} from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Delete, Pencil, Shield, ShieldAlert } from 'lucide-react-native'
import { BackIcon } from '../../assets/icons/icons'
import { deleteDialogue } from '../../api/dialogue'
import { reportPost } from '../../api/report'
import ToastMessage from '../ui/ToastMessage'
import { useGetProfileFeed } from '../../api/feed'
import { usePostRemoveContext } from '../../lib/PostToRemoveContext'

import { deleteList } from '../../api/list'
import { deleteComment } from '../../api/comments'
import { deleteReview } from '../../api/review'

const PostOptions = () => {
    const { fromOwnPost, ownerId, postType, postId, postUserId} = useLocalSearchParams()
    const [ isStep1, setIsStep1 ] = useState(true)
    const [ pressedButton, setIsPressedButton ] = useState(null)
    const [ reportType, setReportType ] = useState(null)
    const [ toastMessage, setToastMessage ] = useState(null)
    const router = useRouter();
    const { data : profileDialogues, hasMore, refetch : refetchProfileFeed, loading , removeItem} = useGetProfileFeed(ownerId, 15)
    const { postToRemove, updatePostToRemove } = usePostRemoveContext()



    const handleButton = (type) => {
        if (type === 'edit'){
            router.replace(`/list/edit/${postId}`)
        }
        setIsPressedButton(type);
        setIsStep1(false);
    }

    const handleDelete = async () => {
        let data = {
            userId :  Number(ownerId),
        }
        let deleted

        if (postType === 'DIALOGUE' ){
           
            data.dialogueId = Number(postId)
            deleted = await deleteDialogue(data)
        }  else if (postType === 'LIST'){
            data.listId = Number(postId)
            deleted = await deleteList(data)
        } else if (postType === 'COMMENT' || postType === 'REPLY'){
            data.commentId = Number(postId)
            deleted = await deleteComment(data)
        } else if (postType === 'REVIEW'){
            data.reviewId = Number(postId)
            deleted = await deleteReview(data)
        }
        setToastMessage(deleted.message)

        updatePostToRemove( {
            id : Number(postId),
            postType 
        } )

        setIsStep1(true)
        setIsPressedButton(null)
        setReportType(null)
        setTimeout(() => {
            router.back()
        }, 1500)
    }

    const handleReportSubmit = async (reportType,postId) => {

        const data = {
            reporterId : Number(ownerId),
            userToReportId : Number(postUserId),
            postType,
            dialogueId : postType === 'DIALOGUE' ? Number(postId) : null,
            threadId : postType === 'THREAD' ? Number(postId) : null,
            listId : postType === 'LIST' ? Number(postId) : null,
            commentId : postType === 'COMMENT' ? Number(postId) : null,
            description : reportType
        } 
        const reportedPost = await reportPost(data)
        setToastMessage(reportedPost.message)
        setIsStep1(true)
        setIsPressedButton(null)
        setReportType(null)
        setTimeout(() => {
            router.back()
        }, 1500)
        
        

    }


  return (
    <ScrollView className='w-full h-full bg-primary' style={{borderRadius:30}}>
        <ToastMessage message={toastMessage} onComplete={()=>setToastMessage(null)}  icon={ pressedButton === 'DIALOGUE' ? <Delete size={30} color={Colors.secondary} /> : <ShieldAlert size={30} color={Colors.secondary} /> } />
        <View className='h-full w-full justify-center items-center relative gap-5'  style={{paddingTop:60, paddingBottom:120, paddingHorizontal:30, width:'100%', justifyContent:'center', alignItems:'center'}} >
        <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20 }} />
            
            { isStep1 ? (

            <View className='gap-5' >



                { fromOwnPost === 'true' && (
                    <>
                {postType === 'LIST' && (
                    <TouchableOpacity onPress={()=>{handleButton('edit')}} style={{ backgroundColor:'transparent', paddingHorizontal:50, paddingVertical:10, borderRadius:15, borderWidth:1, borderColor:Colors.secondary, flexDirection:'row', justifyContent:'center', alignItems:'center', gap:10 }} >
                    <Pencil size={24} color={Colors.secondary} />
                    <Text className='text-secondary text-center font-pbold'>Edit</Text>
                </TouchableOpacity>
                )}
                    <TouchableOpacity onPress={()=>{handleButton('delete')}} style={{ backgroundColor:'transparent', paddingHorizontal:50, paddingVertical:10, borderRadius:15, borderWidth:1, borderColor:Colors.secondary, flexDirection:'row', justifyContent:'center', alignItems:'center', gap:10 }} >
                    <Delete size={24} color={Colors.secondary} />
                    <Text className='text-secondary text-center font-pbold'>Delete post</Text>
                </TouchableOpacity>
                </>
                ) }

                <TouchableOpacity  onPress={()=>{handleButton('report')}} style={{ backgroundColor:'transparent', paddingHorizontal:50, paddingVertical:10, borderRadius:15, borderWidth:1, borderColor:Colors.secondary, flexDirection:'row', justifyContent:'center', alignItems:'center', gap:10 }}>
                    <ShieldAlert size={24} color={Colors.secondary}/>
                    <Text className='text-secondary  font-pbold'>Report</Text>
                </TouchableOpacity>
                
            </View>

            ) : (
                pressedButton === 'delete' ? (
                    <>
                    <TouchableOpacity onPress={()=>setIsStep1(true)} style={{ position:'absolute', top:30, left:30 }} >
                    <BackIcon size={20} color={Colors.mainGray} />
                    </TouchableOpacity>
                    <View className='gap-3 justify-center items-center '>

                        <Text  className='text-white font-pbold text-xl mb-3' >Are you sure you want to delete?</Text>
                        <TouchableOpacity onPress={handleDelete} style={{ backgroundColor:'transparent', paddingHorizontal:50, paddingVertical:10, borderRadius:15, borderWidth:1, borderColor:Colors.secondary, flexDirection:'row', justifyContent:'center', alignItems:'center', gap:10, width:250 }}>
                            <Text className='text-secondary text-center font-pbold'>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor:'transparent', paddingHorizontal:50, paddingVertical:10, borderRadius:15, borderWidth:1, borderColor:Colors.secondary, flexDirection:'row', justifyContent:'center', alignItems:'center', gap:10, width:250 }}>
                            <Text className='text-secondary text-center font-pbold'>No</Text>
                        </TouchableOpacity>
                    </View>
                    </>

                ) : pressedButton === 'report' && (
                    <>
                    <TouchableOpacity onPress={()=>setIsStep1(true)} style={{ position:'absolute', top:30, left:30 }} >
                    <BackIcon size={20} color={Colors.mainGray} />
                    </TouchableOpacity>
                    <View className='gap-3 justify-center items-center '>

                        <Text className='text-white font-pbold text-xl mb-3' >Reason for reporting?</Text>
                        <TouchableOpacity onPress={()=>{handleReportSubmit('hateful content', postId)}} style={{ backgroundColor:'transparent', paddingHorizontal:50, paddingVertical:10, borderRadius:15, borderWidth:1, borderColor:Colors.secondary, flexDirection:'row', justifyContent:'center', alignItems:'center', gap:10, width:250 }} >
                            <Text className='text-secondary text-center font-pbold'>Hateful content</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{handleReportSubmit('spam content', postId)}} style={{ backgroundColor:'transparent', paddingHorizontal:50, paddingVertical:10, width:250, borderRadius:15, borderWidth:1, borderColor:Colors.secondary, flexDirection:'row', justifyContent:'center', alignItems:'center', gap:10, width:250 }} >
                            <Text className='text-secondary text-center font-pbold'>Spam</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{handleReportSubmit('inappropriate content', postId)}} style={{ backgroundColor:'transparent', paddingHorizontal:50, paddingVertical:10, borderRadius:15, borderWidth:1, borderColor:Colors.secondary, flexDirection:'row', justifyContent:'center', alignItems:'center', gap:10, width:250 }} >
                            <Text className='text-secondary text-center font-pbold'>Inappropriate</Text>
                        </TouchableOpacity>
                    </View>
                    </>
                ) 

            ) }
            </View>
    </ScrollView>
  )
}

export default PostOptions

const styles = StyleSheet.create({})