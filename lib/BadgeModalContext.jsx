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

//   const showBadgeModal = (badgeType, level) => {
//     setBadgeModal({ visible: true, badgeType, level });
//   };
    const showBadgeModal = (badgeType, level) => {
        // first set visible false (optional, ensures a fresh mount)
        setBadgeModal({ visible: false, badgeType, level });
        
        // then next tick, set visible true
        setTimeout(() => {
        setBadgeModal({ visible: true, badgeType, level });
        }, 50); // 50ms delay ensures Modal mounts after layout
    };
    

  const hideBadgeModal = () => {
    setBadgeModal((prev) => ({ ...prev, visible: false }));
    setTimeout(() => {
      setBadgeModal({ visible: false, badgeType: "", level: "" });
    }, 300); // match your animation duration
  };

  return (
    <BadgeContext.Provider value={{ showBadgeModal, hideBadgeModal }}>
      {children}
      <BadgeLevelUpModal
        visible={badgeModal.visible}
        badgeType={badgeModal.badgeType}
        level={badgeModal.level}
        onClose={hideBadgeModal}
      />
    </BadgeContext.Provider>
  );
};
