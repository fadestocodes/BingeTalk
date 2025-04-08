import React, { useState, createContext, useContext } from "react"

const CreateContext = createContext();

export const useCreateContext = () => {
    return useContext(CreateContext)
}

export const CreateProvider = ( {children} ) => {
    const [ url, updateUrl ] = useState({
        link : '',
        image : '',
        title : '',
        subtitle : ''
    })

    return (
        < CreateContext.Provider value = {{ url, updateUrl }} >
            { children }
        </CreateContext.Provider>
    )
}