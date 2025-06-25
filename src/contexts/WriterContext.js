import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";

// Create WriterContext
const WriterContext = createContext();

// Custom hook to use WriterContext
export const useWriterContext = () => {
    return useContext(WriterContext);
};

// Provider Component
export const WriterProvider = ({ children }) => {
    const[allWriters,setAllWriters]=useState([])

    const getAllWriters=async()=>{

        try{
            const response=await axios.get(`${process.env.REACT_APP_GET_ALL_WRITERS}`,{withCredentials:true})
            console.log("All Writers",response.data.writers)
            if(response.data.success){
                setAllWriters(response.data.writers)
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
        getAllWriters()
    },[])


    return (
        <WriterContext.Provider value={{ allWriters,setAllWriters}}>
            {children}
        </WriterContext.Provider>
    );
};
