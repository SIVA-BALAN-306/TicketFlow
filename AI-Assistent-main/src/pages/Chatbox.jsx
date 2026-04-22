import React, { useState, useEffect, useRef } from 'react';

const Chatbox = () => {
    const [state, setState] = useState(false);
    const [messages, setMessages] = useState([]);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const messageInputRef = useRef(null);

    const toggleState = () => {
        setState(!state);
    };

    const onSendButton = () => {
        const text = messageInputRef.current.value.trim();

        if (text === "") return;

        const userMessage = { name: "User", message: text };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        fetch('http://127.0.0.1:5000/bot', {  // Adjust URL if needed
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })  // Sending JSON payload
        })
        .then(response => response.json())
        .then(data => {
            const botMessage = { name: "Mr.DOCTOR", message: data.message };  // Accessing the message
            setMessages(prevMessages => [...prevMessages, botMessage]);
            if (voiceEnabled) {
                speak(data.message);  // Using the message for speech
            }
            messageInputRef.current.value = '';  // Clear input field
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMessage = { name: "Mr.DOCTOR", message: "Sorry, something went wrong. Please try again." };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
            messageInputRef.current.value = '';  // Clear input field even on error
        });
    };

    const speak = (message) => {
        const speech = new SpeechSynthesisUtterance(message);
        speech.lang = 'en-US';
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 2;
        window.speechSynthesis.speak(speech);
    };

    const toggleVoice = () => {
        setVoiceEnabled(!voiceEnabled);
    };

    useEffect(() => {
        const messageInput = messageInputRef.current;
        const handleKeyUp = ({ key }) => {
            if (key === "Enter") {
                onSendButton();
            }
        };
        messageInput.addEventListener("keyup", handleKeyUp);

        return () => {
            messageInput.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        <div className="chatbox-container">
            <div className="chatbox">
                <div className={`chatbox__support ${state ? 'chatbox--active' : ''}`}>
                    <div className="chatbox__header">
                        <div className="chatbox__image--header">
                            <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" alt="image" />
                        </div>
                        <div className="chatbox__content--header">
                            <h4 className="chatbox__heading--header">Q-A BOT</h4>
                            <p className="chatbox__description--header">Hi. I am a tourist guide. How can I help you?</p>
                        </div>
                    </div>
                    <div className="chatbox__messages">
                        {messages.map((item, index) => (
                            <div key={index} className={`messages__item ${item.name === "Mr.DOCTOR" ? "messages__item--operator" : "messages__item--visitor"}`}>
                                {item.message}
                            </div>
                        ))}
                    </div>
                    <div className="chatbox__footer">
                        <input type="text" placeholder="Write a message..." ref={messageInputRef} />
                        <button className="chatbox__send--footer send__button" onClick={onSendButton}>Send</button>
                        {/* <button className="mute__button" onClick={toggleVoice} style={{ backgroundColor: voiceEnabled ? 'blue' : 'red' }}>Mute</button> */}
                    </div>
                </div>
                <div className="chatbox__button">
                    <button onClick={toggleState}>
                        <img src="https://static.vecteezy.com/system/resources/previews/009/415/138/original/question-chat-illustration-3d-png.png" width="50px" height="50px" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbox;
