import React, { createContext, useState, useContext } from 'react';

const PostRemoveContext = createContext();

export const usePostRemoveContext = () => useContext(PostRemoveContext);

export const PostRemoveProvider = ({ children }) => {
  const [postToRemove, setPostToRemove] = useState({
    id : '',
    postType : ''
  });

  const updatePostToRemove = (removeData) => {
    setPostToRemove(removeData);
  };

  return (
    <PostRemoveContext.Provider value={{ postToRemove, updatePostToRemove }}>
      {children}
    </PostRemoveContext.Provider>
  );
};
