import React from 'react'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { http } from '../http';

const Login = (props) => {
    const clientId = "893078638476-914ds77nv7kh3amtip1eq1h0vueu92pm.apps.googleusercontent.com";

    const onSuccess = async (payload) => {
        const res = await http('/auth/login', {
            method: "POST",
            body: {
                token: payload.credential
            }
        })

        if (!res.ok) {
            alert("Something went wrong!");
            return;
        }

        const data = await res.json()

        localStorage.setItem('token', data.token)

        if (props.onLogin) {
            props.onLogin(data.user)
        }
    }

    const onError = () => {

    }

    return (
        <div className='flex h-screen items-center justify-center bg-gray-200'>
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onError}
                />
            </GoogleOAuthProvider>
        </div>
    )
}

export default Login