import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode.react';

const Registration = () => {
    const [formData, setFormData] = useState({
        address: '',
        phoneNumber: '',
        peopleCount: 0,
        peopleDetails: [],
    });
    const [error, setError] = useState('');
    const [showQrCode, setShowQrCode] = useState(false);
    const [qrCodeData, setQrCodeData] = useState([]);
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle people count change to dynamically add input fields
    const handlePeopleCountChange = (e) => {
        const count = parseInt(e.target.value, 10) || 0;
        setFormData({
            ...formData,
            peopleCount: count,
            peopleDetails: Array.from({ length: count }, () => ({ name: '', age: '' })),
        });
    };

    // Handle individual person details change
    const handlePersonDetailChange = (index, e) => {
        const { name, value } = e.target;
        const updatedPeopleDetails = formData.peopleDetails.map((person, i) =>
            i === index ? { ...person, [name]: value } : person
        );
        setFormData({ ...formData, peopleDetails: updatedPeopleDetails });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { address, phoneNumber, peopleCount, peopleDetails } = formData;

        // Form validation
        if (!address || !phoneNumber || peopleCount === 0 || peopleDetails.some(person => !person.name || !person.age)) {
            setError('Please fill in all the details.');
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/payment", formData);
    
            if (res.data === "exist") {
                alert("Registration record already exists");
            } else if (res.data === "notexist") {
                setQrCodeData(peopleDetails.map(person => 
                    `Name: ${person.name}, Age: ${person.age}`
                ));
                setShowQrCode(true);
                const totalAmount = peopleCount * 50;
                navigate('/payment', { state: { formData, totalAmount } });
            }
        } catch (e) {
            alert("Error occurred during payment");
            console.log(e);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Registration Form</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputBox}>
                    <label style={styles.label}>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputBox}>
                    <label style={styles.label}>Phone Number:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputBox}>
                    <label style={styles.label}>People Count:</label>
                    <input
                        type="number"
                        name="peopleCount"
                        value={formData.peopleCount}
                        onChange={handlePeopleCountChange}
                        style={styles.input}
                    />
                </div>

                {formData.peopleDetails.map((person, index) => (
                    <div key={index} style={styles.peopleContainer}>
                        <div style={styles.inputBox}>
                            <label style={styles.label}>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={person.name}
                                onChange={(e) => handlePersonDetailChange(index, e)}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.inputBox}>
                            <label style={styles.label}>Age:</label>
                            <input
                                type="number"
                                name="age"
                                value={person.age}
                                onChange={(e) => handlePersonDetailChange(index, e)}
                                style={styles.input}
                            />
                        </div>
                    </div>
                ))}

                {error && <p style={styles.error}>{error}</p>}

                <button
                    type="submit"
                    style={styles.submitButton}
                >
                    Proceed to Payment
                </button>

                {showQrCode && (
                    <div style={styles.qrContainer}>
                        {qrCodeData.map((data, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                                <QRCode value={data} />
                                <button
                                    onClick={() => downloadQRCode(index)}
                                    style={styles.qrButton}
                                >
                                    Download QR Code {index + 1}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
};

// Inline styles object
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '50px',
        fontFamily: 'Poppins, sans-serif',
        background: 'linear-gradient(90deg, #0a8379 60%, #0a8379 40.1%)',
        minHeight: '100vh',
        padding: '20px',
    },
    heading: {
        fontSize: '24px',
        color: '#fff',
        marginBottom: '30px',
    },
    form: {
        width: '300px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    },
    inputBox: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '10px',
        fontSize: '16px',
    },
    input: {
        width: '100%',
        padding: '8px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    peopleContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    error: {
        color: 'red',
        marginBottom: '15px',
    },
    submitButton: {
        width: '100%',
        padding: '12px',
        fontSize: '17px',
        backgroundColor: '#0a8379',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'background-color 0.3s',
    },
    qrContainer: {
        marginTop: '20px',
        textAlign: 'center'
    },
    qrButton: {
        padding: '10px 20px',
        background: '#0a8379',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px'
    }
};

export default Registration;
