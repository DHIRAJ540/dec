import React, {Fragment} from "react"
import { useSelector } from "react-redux"
import {Route, Navigate} from 'react-router-dom'

const ProtectedRoute = ({children, isAdmin}) => {

    const {loading, isAuthenticated, user} = useSelector(state => state.user) 

    // if(isAuthenticated === false){
    //    return <Navigate to = "/login"/>
    // }
    // else{
    //     return children
    // }

    
    if(loading === false){
       
        // if(isAdmin === true && user.role !== "admin"){
            
        //    return <Navigate to = "/login"/>
        // } else {
        // return children

        // }
        // if(isAuthenticated === false){
        //    return <Navigate to = "/login"/>
        // }else {
        // return children

        // }
        

        
            if(isAdmin === true){
                if(user.role === "admin"){
                    console.log("hiiii")
                    return children
                } else {
                    return <Navigate to = "/login"/>
    
                }
            } else {
                if (isAuthenticated === false){
                    return <Navigate to = "/login"/>
                } else {
                    return children
                }
            }
        
        
    } else {
        return <Fragment></Fragment>
    }

    // return(
    //     <Fragment>
    //   {loading === false && (
        
         
    //         isAuthenticated === false ? <Navigate to = "/login" /> : children

            
    //         // if (isAdmin === true && user.role !== "admin") {
    //         //   return <Redirect to="/login" />;
    //         // }

    //         // return <Component {...props} />;
          
        
    //   )}
    // </Fragment>
    // )

    
}

export default ProtectedRoute