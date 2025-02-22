import React, { useState, createContext, useContext } from "react"

const TagsContext = createContext();

export const useTagsContext = () => {
    return useContext(TagsContext)
}

export const TagsProvider = ( {children} ) => {
    const [ tags, setTags ] = useState({})

    return (
        < TagsContext.Provider value = {{ tags, setTags }} >
            { children }
        </TagsContext.Provider>
    )
}