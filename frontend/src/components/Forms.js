import React, { useState } from 'react';
import './Forms.css';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

function Forms() {
  const [isLoginSelected, setIsLoginSelected] = useState(true);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const navigate=useNavigate();

  const [signEmail,setSignEmail]=useState('');
  const [signPassword,setSignPassword]=useState('');
  const [signPasswordC,setSignPasswordC]=useState('');
  const [EmailValid,setEmailValid]=useState(true);
  const [showPassword, setShowPassword] = useState(false);



  const LoginUser=()=>{
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length===0||(!emailPattern.test(email)) ){
      setEmailValid(false);
    }else if(password.length===0){
      alert('Password has left Blank !');
    }else{
      axios.post(`http://127.0.0.1:5000/sepa_checker/login`,{
        email:email,
        password:password
      })
      .then(function(response){
        console.log(response);
        localStorage.setItem("sessionID",email);
        navigate("/validator")
        
      }).catch(function(error){
        console.log(error,'error');
        if (error.response.status===401) {
          alert('invalid credentials');
        }
      });
    }
  }


  const registreUser =()=>{
   
    if (signPassword===signPasswordC && signPassword!=="" &&signEmail!=="") {
      axios.post(`http://127.0.0.1:5000/sepa_checker/signup`,{
      email:signEmail,
      password:signPassword
    }).then(function(response){
      console.log(response);
      setIsLoginSelected(true);
      alert('success')

    }).catch(function(error){
      console.log(error,"error")
      if (error.response.status===401) {
        alert('invalid credentials');
      }
    })
    }else{
      alert('form invalide')
    }
  }
  const handleLoginClick = () => {
    setIsLoginSelected(true);
  };

  const handleSignupClick = () => {
    setIsLoginSelected(false);
  };

  const handleTogglePassword = () => {

    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className="container">
        <div className={`slider ${isLoginSelected ? 'moveslider' : ''}`}></div>
        <div className="btn">
          <button className={`login ${isLoginSelected ? 'selected' : ''}`} onClick={handleLoginClick}>
            connexion
          </button>
          <button className={`signup ${!isLoginSelected ? 'selected' : ''}`} onClick={handleSignupClick}>
            Inscription
          </button>
        </div>

        <div className={`form-section ${isLoginSelected ? '' : 'form-section-move'}`}>
          <div className="login-box">
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="email ele" placeholder="youremail@email.com" />
           <div className='container-password'>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} className="password ele" placeholder="Mot de passe" />
            <button onClick={handleTogglePassword} className="toggle-button">
                {showPassword ? "Masque" : "Afficher"}
            </button>
            <p className='forget-text' onClick={()=>navigate('/forgotPassword')}>Mot de passe oublié !</p>
            </div>

            {!EmailValid&&
            <p className="email-invalide">
              Invalid email address
            </p>
            }

            <button className="clkbtn" onClick={LoginUser}>connexion</button>
          </div>

          <div className="signup-box">

            <input type="email" value={signEmail} onChange={(e)=>setSignEmail(e.target.value)} className="email ele" placeholder="youremail@email.com" />
            <input type="password" value={signPassword} onChange={(e)=>setSignPassword(e.target.value)} className="password ele" placeholder="Mot de passe" />
            <input type="password" value={signPasswordC} onChange={(e)=>setSignPasswordC(e.target.value)} className="password ele" placeholder="Confirmer Mot de passe" />
            {signPassword!==signPasswordC&&
            <p className='pwni'>
              Mot de passe non identique
            </p>
            }
             {signPassword===signPasswordC&&signPassword!=="" &&
            <p className='identique'>
              Mot de passe identique
            </p>
            }
          
            <button className="clkbtn" onClick={registreUser}>Inscription</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forms;
