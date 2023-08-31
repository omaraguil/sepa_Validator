import './Validator.css';
import React,{useState} from 'react';
import axios from 'axios';
import iconImage from './Icons/warning.png';
import { Navigate,useNavigate } from 'react-router-dom';

function Validator(){
    const [xmlFile, setXmlFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [montant,setMontant]= useState('');
    const [date,SetDate]=useState([])
    const [openPop,setOpenPop]=useState(false)
    const [warningDate,setWarningDate]=useState(false)
    const [warningPaiment,setWarningPaiment]=useState(false)
    const [reapetedPaiment,setRepeatedPaiment]=useState({})
    const [xx,setxx]=useState(false)
    const [montantplusque,setMontantplusque]=useState([])
    const [Popmontant,setPopmontant]=useState(false)
    
    const navigate=useNavigate()
    
     
    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile.type === 'text/xml') {
            setXmlFile(droppedFile);
            setIsValid(false);
            setMessage('XML file dropped and validated.');
            
        } else {
            setIsValid(false);
            setMessage('Invalid file format. Only XML files are allowed.');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleValidation = async () => {
        if (xmlFile && montant!=='') {
            try {
                const formData = new FormData();
                formData.append('xmlFile', xmlFile);
                formData.append('montant',montant);

                const response = await axios.post('http://localhost:5000/sepa_checker/validate',
                 formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                setMessage(response.data.message);
                SetDate(response.data.date);
                setRepeatedPaiment(response.data.warning);
                setxx(true);
                setMontantplusque(response.data.payment_amounts)
                
                
                if (response.data.version) {
                    setOpenPop(false);
                }else{
                    setOpenPop(true);
                }
                
            } catch (error) {
                console.error('Error validating file:', error);
            }
        } else {
            setMessage('Please upload a valid XML file and provide a montant.');
        }
        
    };

    const handleFileInputChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile.type === 'text/xml') {
            setXmlFile(selectedFile);
            setIsValid(true);
            setMessage('XML file selected and validated.');
        } else {
            setXmlFile(null);
            setIsValid(false);
            setMessage('Invalid file format. Only XML files are allowed.');
        }
    };

    const closePop=()=>{
        setOpenPop((prevShowError)=>!prevShowError)
    }

    const handleDATE =()=>{
        setWarningDate(true)
    }
    const handleRepeatedPaiment=()=>{
        setWarningPaiment(true)
    }
    const handleMontant=()=>{
        setPopmontant(true)
    }
    

if(localStorage.getItem("sessionID")){
    return (
        
        <div className='content'>
            <h1> validateur Sepa</h1>
            <button className="felssa" onClick={()=>{
                localStorage.clear();
                navigate('/');
                                                        }} >Déconnexion</button>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className='dropzone'
               
            >

            
                
            
                
                <div className="IconUpload"></div>


                {xmlFile ? (
                    <p>Valid XML file: {xmlFile.name}</p>
                ) : (
                    <p>Glisser et déposer un fichier XML ici.</p>
                )}

                <input
                    type="file"
                    accept=".xml"
                    onChange={handleFileInputChange}
                />


            </div>


            <label className='montant'>
                Montant plus que : 
                <input
                    type="number"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                />
            </label>


            <button disabled={!isValid} onClick={handleValidation} className='btn-validate'>
                Valider
            </button>
            <p>{message}</p>

           {/* popUp */}{/* popUp */}{/* popUp */}{/* popUp */}

            {openPop&&
                          <div className='popUp'>
                            <div className='PopUp-container'>
                            <p>Warning</p>
                            <span> fichier xml n'est pas valide</span><br/><br/>
                            <img src={iconImage} alt=''/>
                            <button onClick={closePop}>Close</button>
                            </div>
                        </div>
                        } 
                        
           {warningDate&&

            <div className='popUp'>
            <div className='PopUp-container'>
                <h2>expired date</h2>
                <hr/>
                {date.map((item,index)=>(
                
               
                    <div key={index} >
                     <p className='popUpDATE'>IBAN : {item.IBAN}</p>
                    <p className='popUpDATE'>date : {item.date}</p> 
                    <hr/>
                    </div>
                
            ))}
            <button onClick={()=>{setWarningDate(false)}}>fermer</button>
            </div>
                </div>
           }


            {/* warning paiment */}
           {warningPaiment&&
            <div className='popUp'>
            <div className='PopUp-container'>
            <h2>paiement répété</h2>
                <hr/>
                {Object.entries(reapetedPaiment).map(function([iban,count]){
                    return(
                <div key={count}>
                    <p>{iban}</p>
                    <p>{count}</p>
                </div>
                    );
                })}
            <button onClick={()=>{setWarningPaiment(false)}}>fermer</button>
            </div>
                </div>
           }

           {/*PopMontant*/}
           {Popmontant&&
            <div className='popUp'>
            <div className='PopUp-container'>
            <h2>Montant plus que</h2>
                <hr/>
                {montantplusque.map((item,index)=>(
                
               
                <div key={index} >
                 <p className='popUpDATE'>IBAN : {item.IBAN}</p>
                <p className='popUpDATE'>montant : {item.amount}</p> 
                <hr/>
                </div>
            
        ))}
            <button onClick={()=>{setPopmontant(false)}}>fermer</button>
            </div>
                </div>
           }
           



            <div className="scrollable-div">
                        {date.length>0&&
            <div className="alert1" onClick={handleDATE}>
        <div className="alert fade alert-simple alert-danger alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light brk-library-rendered rendered show" role="alert" data-brk-library="component__alert">
          <i className="start-icon far fa-times-circle faa-pulse animated"></i>
          <strong className="font__weight-semibold">WARNING</strong> expired date.
        </div>
      </div>
      }
      {xx &&
       <div className="alert1" onClick={handleRepeatedPaiment}>
       <div className="alert fade alert-simple alert-danger alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light brk-library-rendered rendered show" role="alert" data-brk-library="component__alert">
         <i className="start-icon far fa-times-circle faa-pulse animated"></i>
         <strong className="font__weight-semibold">WARNING</strong> paiement répété.
       </div>
        </div>

      }

      {montantplusque.length>0&&
         <div className="alert1" onClick={handleMontant}>
         <div className="alert1 fade alert-simple1 alert-danger1 alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light brk-library-rendered rendered show" role="alert" data-brk-library="component__alert">
           <i className="start-icon far fa-times-circle faa-pulse animated"></i>
           <strong> Montant plus Que.</strong>
         </div>
          </div>

      }




      
            
            
            </div>


            

        </div>
    );
}else{
        return <Navigate to="/" replace/>
    }
}

export default Validator;