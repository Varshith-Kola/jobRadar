// src/components/Auth/Login.js

import React, { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { AuthContext } from '../../contexts/AuthContext';
import './Auth.css';

const clientId = '385500688980-32bckasv13n930nrnqp4llv4uentdesm.apps.googleusercontent.com';

const Login = () => {
    const { login } = useContext(AuthContext);

    const onSuccess = (response) => {
        console.log('Login Success: currentUser:', response.profileObj);
        login(response.profileObj);
    };

    const onFailure = (response) => {
        console.log('Login failed: res:', response);
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <GoogleLogin
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    );
};

export default Login;
