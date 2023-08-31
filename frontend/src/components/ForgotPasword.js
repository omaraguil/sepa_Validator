import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css'

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate=useNavigate();
  
    const handleSendVerificationCode = () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length===0||(!emailPattern.test(email)) ){
      alert('email invalid !')
    }else{
      axios.post('http://127.0.0.1:5000/sepa_checker/send_verification_code', {
        email: email
      })
      .then(response => {
        console.log(response);
        navigate('/ChangePasswordPage')
      })
      .catch(error => {
        console.error(error);
        alert('User not found');
      });}
    }
  
    return (
      <div className='forget-container'>
        <input
          type="email"
          value={email}
          className='email'
          onChange={e => setEmail(e.target.value)}
          placeholder="entrez votre adresse e-mail"
        />
        <button className=" verification-button" onClick={handleSendVerificationCode}>Envoyer le code de vérification</button>
      </div>
    );
  }
  export default ForgotPassword;