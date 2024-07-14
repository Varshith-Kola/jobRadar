// src/pages/Home.js

import React, { useContext } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { AuthContext } from '../contexts/AuthContext';
import './Home.css';
import logo from '../assets/logo.png'; // Update with your actual logo path
import backgroundVideo from '../assets/Black Green Elegant Professional Job Vacancy We Are Hiring Video.mp4'; // Update with your actual video path
import mobileBackgroundVideo from '../assets/mobile.mp4'; // Update with your actual mobile background video path

const clientId = '385500688980-32bckasv13n930nrnqp4llv4uentdesm.apps.googleusercontent.com';

const Home = () => {
    const { user, login, logout } = useContext(AuthContext);

    const onSuccess = (response) => {
        console.log('Login Success: currentUser:', response.profileObj);
        login(response.profileObj);
    };

    const onFailure = (response) => {
        console.log('Login failed: res:', response);
    };

    const onLogoutSuccess = () => {
        console.log('Logout made successfully');
        logout();
    };

    return (
        <div className="home-container">
            <video className="video-background desktop" autoPlay loop muted playsInline loading="lazy">
                <source src={backgroundVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <video className="video-background-mobile mobile" autoPlay loop muted playsInline loading="lazy">
                <source src={mobileBackgroundVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <nav className="navbar">
                <img src={logo} alt="JobRadar Logo" className="logo" />
                <div className="auth-button-container">
                    {user ? (
                        <GoogleLogout
                            clientId={clientId}
                            buttonText="Logout"
                            onLogoutSuccess={onLogoutSuccess}
                            className="auth-button"
                            aria-label="Logout"
                        />
                    ) : (
                        <GoogleLogin
                            clientId={clientId}
                            buttonText="Login"
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                            cookiePolicy={'single_host_origin'}
                            isSignedIn={true}
                            className="auth-button"
                            aria-label="Login with Google"
                        />
                    )}
                </div>
            </nav>
            <main>
                {!user ? (
                    <>
                        {/* Removed Welcome to JobRadar and gateway text */}
                    </>
                ) : (
                    <>
                        <h2>Welcome, {user.name}</h2>
                        <p>Ready to find your next job?</p>
                    </>
                )}
            </main>
            <footer>
                <p>&copy; 2024 JobRadar. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
