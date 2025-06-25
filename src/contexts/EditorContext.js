import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";

// Create OrderContext
const EditorContext = createContext();

// Custom hook to use OrderContext
export const useEditorContext = () => {
    return useContext(EditorContext);
};

// Provider Component
export const EditorProvider = ({ children }) => {
    const[allEditors,setAllEditors]=useState([])

    const getAllEditors=async()=>{

        try{
            const response=await axios.get(`${process.env.REACT_APP_GET_ALL_EDITORS}`,{withCredentials:true})
            console.log("All editors",response.data.editors)
            if(response.data.success){
                setAllEditors(response.data.editors)
            }
            else{
                toast.error(response.data.message)
            }

        }
        catch(e){
            toast.error(e.response?e.response.data.message:e.message)

        }
    }
    useEffect(()=>{
        getAllEditors()
    },[])


    return (
        <EditorContext.Provider value={{ allEditors,setAllEditors}}>
            {children}
        </EditorContext.Provider>
    );
};
