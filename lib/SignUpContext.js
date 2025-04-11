import React, { useState, createContext, useContext } from "react"

const SignUpContext = createContext();

export const useSignUpContext = () => {
    return useContext(SignUpContext)
}

export const SignUpProvider = ( {children} ) => {
    const [ signUpData, updateSignUpData ] = useState({
        firstName : '',
        lastName : '',
        username : '',
        email : '',
        password:'',
        confirmPassword : '',
        bio:'',
        bioLink:'',
        image:''
    })

    return (
        < SignUpContext.Provider value = {{ signUpData, updateSignUpData }} >
            { children }
        </SignUpContext.Provider>
    )
}