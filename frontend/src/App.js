import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Forms from "./components/Forms";
import React from 'react';
import Validator from './components/validator.js'
import ForgotPassword from './components/ForgotPasword';
import ChangePasswordPage from './components/changePassword';
function App() {
    return(
   <BrowserRouter>
   <Routes>
    <Route path="/ChangePasswordPage" element={<ChangePasswordPage/>}/>
    <Route path="/" element={<Forms/>}/>
    <Route path="/validator" element={<Validator/>}/>
    <Route path="/forgotPassword" element={<ForgotPassword/>}/>
   </Routes>
   </BrowserRouter>
 )
}

export default App;

