import React, { useState, useEffect } from 'react';
import axios from 'axios';
import sha256 from 'sha256';
import uniqid from 'uniqid';
import { Base64 } from 'js-base64';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentComponent = () => {
    const [paymentUrl, setPaymentUrl] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const { formData, totalAmount } = location.state;

    useEffect(() => {
        initiatePayment();
    }, []);

    const MERCHANT_ID = "PGTESTPAYUAT86";
    const PHONE_PE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
    const SALT_KEY = "96434309-7796-489d-8924-ab56988a6076";
    const SALT_INDEX = 1;
    // const APP_BE_URL = "http://localhost:5173";

    const initiatePayment = async (retries = 3) => {
        try {
            const amountInPaise = totalAmount * 100;
            const merchantTransactionId = uniqid();

            const normalPayLoad = {
                merchantId: MERCHANT_ID,
                merchantTransactionId: merchantTransactionId,
                merchantUserId: "MUID123",
                amount: amountInPaise,
                // redirectUrl: `${APP_BE_URL}/success`,
                redirectMode: "REDIRECT",
                mobileNumber: "8870666787",
                paymentInstrument: { type: "PAY_PAGE" },
            };

            const base64EncodedPayload = Base64.encode(JSON.stringify(normalPayLoad));
            const stringToHash = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
            const sha256Hash = sha256(stringToHash);
            const xVerifyChecksum = `${sha256Hash}###${SALT_INDEX}`;

            const response = await axios.post(
                `${PHONE_PE_HOST_URL}/pg/v1/pay`,
                { request: base64EncodedPayload },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-VERIFY": xVerifyChecksum,
                        accept: "application/json",
                    },
                }
            );

            setPaymentUrl(response.data.data.instrumentResponse.redirectInfo.url);
        } catch (error) {
            if (error.response && error.response.status === 429 && retries > 0) {
                setTimeout(() => initiatePayment(retries - 1), 2000);
            } else {
                console.error('Error initiating payment:', error);
                setError(`Error initiating payment: ${error.response ? error.response.data.message : error.message}`);
            }
        }
    };

    const handleRedirect = () => {
        // Redirect to success page after payment
        navigate('/success', { state: { peopleDetails: formData.peopleDetails } });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center', fontSize: '30px' }}>
            <div>
                <h1>PAYMENT CONFIRMATION</h1>
                {paymentUrl && (
                    <div>
                        <p>Redirecting to payment page...</p>
                        <a href={paymentUrl} target="_blank" rel="noopener noreferrer" onClick={handleRedirect}>Proceed to Payment</a>
                    </div>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default PaymentComponent;
