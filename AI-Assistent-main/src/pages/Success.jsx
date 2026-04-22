import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';

const Success = () => {
    const location = useLocation();
    const [qrCodes, setQrCodes] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        const { state } = location;

        if (state && state.peopleDetails) {
            // Generate QR code data for each person
            const qrCodeData = state.peopleDetails.map(person => 
                `Name: ${person.name}, Age: ${person.age}`
            );
            setQrCodes(qrCodeData);
        }
    }, [location]);

    const downloadQRCode = (index) => {
        const canvas = document.querySelectorAll('canvas')[index];
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `qrcode_person_${index + 1}.png`;
        downloadLink.click();
    };

    const handleCancelClick = (index) => {
        setSelectedIndex(index);
        setShowPopup(true);
    };

    const handleAccept = () => {
        // Handle refund logic and remove the QR code from the list
        const updatedQrCodes = qrCodes.filter((_, index) => index !== selectedIndex);
        setQrCodes(updatedQrCodes);
        setShowPopup(false);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
            <h1>Registration Successful</h1>
            {qrCodes.length > 0 && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    {qrCodes.map((data, index) => (
                        <div key={index} style={{ marginBottom: '50px' }}>
                            <QRCode value={data} />
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <button
                                    onClick={() => downloadQRCode(index)}
                                    style={{
                                        padding: '10px 20px',
                                        marginRight: '30px',
                                        background: '#0a8379',
                                        color: '#fff',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        marginTop: '10px',
                                    }}
                                >
                                    Download QR Code {index + 1}
                                </button>
                                <button
                                    onClick={() => handleCancelClick(index)}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#0a8379',
                                        color: '#fff',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        marginTop: '10px',
                                    }}
                                >
                                    Cancel {index + 1}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Popup message for the chatbot */}
            {showPopup && (
                <div style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        width: '300px'
                    }}>
                        <h2>MR.ADVISOR</h2>
                        <p>Are you sure you want to cancel the ticket?</p>
                        <button
                            onClick={handleAccept}
                            style={{
                                padding: '10px 20px',
                                marginRight: '20px',
                                background: '#0a8379',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '16px',
                            }}
                        >
                            Refund
                        </button>
                        <button
                            onClick={handleClosePopup}
                            style={{
                                padding: '10px 20px',
                                background: '#ccc',
                                color: '#000',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '16px',
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Success;
