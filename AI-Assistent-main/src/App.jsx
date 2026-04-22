import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Map from './pages/Map';
import Success from './pages/Success';
import PaymentComponent from './pages/Payment'; 
import About from './pages/About';
import Login from './components/Login';
import PreLoader from './components/Preloader';
import TranslateWidget from './components/TranslateWidget';
import './App.css';

const App = () => {
    const [showPopup, setShowPopup] = useState(true); // State to control the popup visibility
    const [showLogin, setShowLogin] = useState(false); // State to control the login form visibility

    // Handle acceptance of the popup
    const handleAccept = () => {
        setShowPopup(false);
    };

    // Handle login button click to show the login form
    const handleLoginClick = () => {
        setShowLogin(true);
    };

    // Handle close action of the login form
    const handleCloseLogin = () => {
        setShowLogin(false);
    };

    return (
        <>
            {/* Preloader component */}
            <PreLoader />

            {/* Main router setup */}
            <Router>
                <div>
                    {/* Navigation bar */}
                    <Nav onLoginClick={handleLoginClick} />
                    <main>
                        {/* Route configuration */}
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/doctors" element={<Registration />} />
                            <Route path="/map" element={<Map />} />
                            <Route path="/success" element={<Success />} />
                            <Route path="/payment" element={<PaymentComponent />} />
                            <Route path="/about" element={<About />} />
                        </Routes>
                    </main>
                </div>
            </Router>

            {/* Popup message for the chatbot */}
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>MR.ADVISOR</h2>
                        <TranslateWidget />
                        <p>In this chatbot, only access to a few questions is free. If you want to move further, please complete the login process.</p>
                        <button onClick={handleAccept}>Accept</button>
                    </div>
                </div>
            )}

            {/* Login component, shown conditionally */}
            {showLogin && <Login onClose={handleCloseLogin} />}
        </>
    );
};

export default App;
