import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function AuthCheck() {

    const navigate = useNavigate();
    

    useEffect(() => {
        const checkToken = () =>{
            const token = localStorage.getItem('token')
            if(!token){
                navigate('/')
            } else {
                console.log(token)
            }
        }    
        const checkingToken = setInterval(checkToken,10000);
        return () =>clearInterval(checkingToken)
    }, [navigate])

    return (
        <></>
    )
}

export default AuthCheck