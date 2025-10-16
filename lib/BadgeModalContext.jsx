import React, { createContext, useState, useContext, useEffect } from "react";
import BadgeLevelUpModal from "../components/BadgeLevelUpModal";
import * as nodeServer from '../lib/ipaddresses'


const BadgeContext = createContext();
export const useBadgeContext = () => useContext(BadgeContext);

const markBadgeNotificationSeen = async (userId, notifId) => {


    try {
        console.log(`userid: ${userId}, notifId: ${notifId}`)
        if (!userId || !notifId) throw new Error("Invalid parameters")
        const response = await fetch(`${nodeServer.currentIP}/user/${userId}/badge-notification/${notifId}`, {
            method : "PATCH",
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({userId, notifId})
        })
        if (!response.ok) throw new Error("Unexpected error")
        
    } catch(err){
        console.error(err)
    }
}

export const BadgeModalProvider = ({ children }) => {
    const [badgeModal, setBadgeModal] = useState({
        visible: false,
        badgeType: "",
        level: "",
        notifId : ""
    });
    const [badgeQueue, setBadgeQueue] = useState([]);
    const [userId, setUserId] = useState('')

    useEffect(() => {
        if (!badgeModal.visible && badgeQueue.length > 0) showNextBadge();
      }, [badgeQueue, badgeModal.visible]);

    const showNextBadge = () => {
        if (badgeQueue.length === 0) return;
        const nextBadge = badgeQueue[0];
        setBadgeQueue(badgeQueue.slice(1));
        setBadgeModal({ visible: true, badgeType: nextBadge.badgeType, level: nextBadge.level , notifId : nextBadge?.notifId || null});
    };

    const showBadgeModal = (badgeType, level, notifId=null, userId=null) => {
        if (userId){
            setUserId(userId)
        }
        setBadgeQueue(prev => [...prev, { badgeType, level, notifId }]);
        if (!badgeModal.visible) {
        // If no modal currently visible, show the first one immediately
        showNextBadge();
        }
    };

    const handleModalClose = async () => {
        setTimeout(async () => {
            if (badgeModal?.notifId){
                await markBadgeNotificationSeen(userId, badgeModal.notifId )
            }
            setBadgeModal(prev => ({ ...prev, visible: false }));
            showNextBadge();
        }, 300); // match animation duration
    };
  return (
    <BadgeContext.Provider value={{ showBadgeModal }}>
      {children}
      <BadgeLevelUpModal
        visible={badgeModal.visible}
        badgeType={badgeModal.badgeType}
        level={badgeModal.level}
        onClose={handleModalClose}
      />
    </BadgeContext.Provider>
  );
};
