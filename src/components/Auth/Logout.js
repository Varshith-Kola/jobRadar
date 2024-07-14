// src/components/Auth/Logout.js

import React, { useContext } from 'react';
import { GoogleLogout } from 'react-google-login';
import { AuthContext } from '../../contexts/AuthContext';
import './Auth.css';

const clientId = '385500688980-32bckasv13n930nrnqp4llv4uentdesm.apps.googleusercontent.com';

const Logout = () => {
    const { logout } = useContext(AuthContext);

    const onLogoutSuccess = () => {
        console.log('Logout made successfully');
        logout();
    };

    return (
        <div className="logout-container">
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onLogoutSuccess}
            />
        </div>
    );
};

export default Logout;
