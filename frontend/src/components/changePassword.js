import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './changePassword.css';
function ChangePasswordPage() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState('');
  const navigate=useNavigate();
  const handleChangePassword = () => {
    axios.post('http://127.0.0.1:5000/sepa_checker/change_password', {
        email: email,
        verification_code: verificationCode,
        new_password: newPassword,
      })
      .then(response => {
        alert(response.data.message);
        navigate('/');
      })
      .catch(error => {
        setPasswordChangeStatus('Error: ' + error.response.data.error);
      });
  };

  return (
    <div className='forget-container'>
      <input
        type="email"
        value={email}
        className='email'
        onChange={e => setEmail(e.target.value)}
        placeholder="Entrez votre adresse e-mail"
      />
      <input
        type="text"
        value={verificationCode}
        className='email'
        onChange={e => setVerificationCode(e.target.value)}
        placeholder="Entrez le code de vérification"
      />
      <input
        type="password"
        value={newPassword}
        className='email'
        onChange={e => setNewPassword(e.target.value)}
        placeholder="Entrez un nouveau mot de passe"
      />
      <button onClick={handleChangePassword} className='verification-button'>changer le mot de passe</button>
      <p>{passwordChangeStatus}</p>
    </div>
  );
}

export default ChangePasswordPage;