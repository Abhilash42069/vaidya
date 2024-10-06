import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './login.css';

function App() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const sendOtpApiUrl = 'https://rnp-dev.fractal.ai/astra-auth/auth/send-otp/';
  const verifyOtpApiUrl = 'https://rnp-dev.fractal.ai/astra-auth/auth/verify-otp/';

  const sendOtp = () => {
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    fetch(sendOtpApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name: '', 
        email_id: email,
        otp: '', 
        app_id: 1
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'SUCCESS') {
        setOtpSent(true);
        setMessage('OTP sent to your email.');
      } else {
        setMessage('Failed to send OTP. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    });
  };

  const verifyOtp = () => {
    if (!otp) {
      setMessage('Please enter the OTP.');
      return;
    }

    fetch(verifyOtpApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name: 'Jane Doe',
        email_id: email,
        otp: otp,
        app_id: 1
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.access_token) {
        setMessage('OTP verified! Login successful.');
        // Redirect to the chat page
        navigate('/chat'); // Navigate to chat page after successful verification
      } else {
        setMessage('Invalid OTP. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    });
  };

  return (
    <div className="login-container">
      {!otpSent ? (
        <div>
          <h2>Login</h2>
          <label>Enter Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button onClick={sendOtp}>Send OTP</button>
        </div>
      ) : (
        <div>
          <h2>Verify OTP</h2>
          <label>Enter OTP:</label>
          <input 
            type="text" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </div>
      )}
      <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>
    </div>
  );
}

export default App;
