import React, { createContext, useState, useContext } from "react";
import BadgeLevelUpModal from "../components/BadgeLevelUpModal";

const BadgeContext = createContext();
export const useBadgeContext = () => useContext(BadgeContext);

export const BadgeModalProvider = ({ children }) => {
  const [badgeModal, setBadgeModal] = useState({
    visible: false,
    badgeType: "",
    level: "",
  });
  const [badgeQueue, setBadgeQueue] = useState([]);

  const showNextBadge = () => {
    if (badgeQueue.length === 0) return;
    const nextBadge = badgeQueue[0];
    setBadgeQueue(badgeQueue.slice(1));
    setBadgeModal({ visible: true, badgeType: nextBadge.badgeType, level: nextBadge.level });
  };

  const showBadgeModal = (badgeType, level) => {
    setBadgeQueue(prev => [...prev, { badgeType, level }]);
    if (!badgeModal.visible) {
      // If no modal currently visible, show the first one immediately
      showNextBadge();
    }
  };

  const handleModalClose = () => {
    setBadgeModal(prev => ({ ...prev, visible: false }));
    setTimeout(() => {
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
