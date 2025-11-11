// import React, { useState, createContext, useContext } from "react"

// const CreateContext = createContext();

// export const useCreateContext = () => {
//     return useContext(CreateContext)
// }

// export const CreateProvider = ( {children} ) => {
//     const [ url, updateUrl ] = useState({
//         link : '',
//         image : '',
//         title : '',
//         subtitle : ''
//     })

//     const [createUserData, updateCreateUserData] = useState({
//         firstName : '',
//         lastName : '',
//         email : '',
//         profilePic : '',
//         googleId : '',
//         appleId : '',

//     })

//     return (
//         < CreateContext.Provider value = {{ url, updateUrl ,createUserData, updateCreateUserData}} >
//             { children }
//         </CreateContext.Provider>
//     )
// }


import React, { createContext, useState, useContext } from 'react';

const CreateContext = createContext();

export const useCreateContext = () => useContext(CreateContext);

export const CreateProvider = ({ children }) => {
  const [createUserData, setCreateUserData] = useState({
            firstName : '',
            lastName : '',
            email : '',
            profilePic : '',
            googleId : '',
            appleId : '',
            
    
        })
  const updateCreateUserData = (data) => {
    setCreateUserData(data);
  };

  return (
    <CreateContext.Provider value={{ createUserData, updateCreateUserData }}>
      {children}
    </CreateContext.Provider>
  );
};
