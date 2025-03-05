import React, { useEffect, useState } from 'react'
import '../styles/RegistrationForm.css'
import { useNavigate } from 'react-router-dom';
import { register } from '../services/ApiService'


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    username: '',
    password: '',
  });
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({});
  const [errorFromServer, setErrorFromServer] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const nameRegex = /^[a-zA-Z]{2,30}$/;
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  const phoneRegex = /^05[0-9]-?\d{7}$/;
  const addressRegex = /^[a-zA-Z0-9\s,-]{3,}$/;
  const usernameRegex= /^[a-zA-Z0-9._-]{3,20}$/;
  const passwordRegex= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "password2"){
      setPassword2(value);
    } else {
      setFormData(formData => ({
        ...formData,
        [name]: value
      }));
    }    
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    if(!value.trim() && ['first_name', 'last_name', 'email', 'phone', 'address', 'username', 'password', 'password2'].includes(name)) {
      switch(name) {
        case 'first_name':
          error = 'שם פרטי הוא שדה חובה';
          break;
        case 'last_name':
          error = 'שם משפחה הוא שדה חובה';
          break;
        case 'email':
          error = 'אימייל הוא שדה חובה';
          break;
        case 'phone':
          error = 'מספר פלאפון הוא שדה חובה';
          break;
        case 'address':
          error = 'כתובת היא שדה חובה';
          break;
        case 'username':
          error = 'שם משתמש הוא שדה חובה';
          break;
        case 'password':
          error = 'סיסמא היא שדה חובה';
          break;
        case 'password2':
          error = 'נא להקליד סיסמא שוב';
          break;
        default:
          break;
      }
    }else if((name === "first_name" || name === 'last_name') && value.trim() && !nameRegex.test(value)){
      error = `שם ${name === 'first_name' ? 'פרטי' : 'משפחה'} צריך להכיל בין 2 ל30 תווים באנגלית בלבד`;
    }else if(name === "email" && !emailRegex.test(value)){
      error = "נא להכניס כתובת אימייל תקינה";
    } else if(name === "phone" && value.trim() && !phoneRegex.test(value)){
      error = "  מספר טלפון חייב להתחיל ב05 ויכול להכיל מספרים בלבד";
    }else if(name === "address" && value.trim() && !addressRegex.test(value)){
      error = "כתובת יכולה להכיל אותיות באנגלית בלבד, מספרים, רווחים, פסיקים ומקפים. חייבת להכיל לפחות 3 תווים";
    }else if(name === "username" && value.trim() && !usernameRegex.test(value)){
      error = "שם משתמש יכול להכיל רק אותיות באנגלית (גדולות וקטנות), מספרים (0-9), קו תחתון (_), נקודה (.) ומקף (-). חייב להיות באורך של 3 עד 20 תווים";
    }else if(name === "password" && value.trim() && !passwordRegex.test(value)){
      error = "(!@#$%^&*) הסיסמה חייבת להיות באנגלית בלבד ולהכיל לפחות 8 תווים, אות גדולה אחת, אות קטנה אחת ומספר אחד. ניתן לכלול תווים מיוחדים";
    }else if(name === "password2" && value.trim() && formData.password !== value){
      error = "הסיסמאות לא זהות";
    }
    setErrors(errors => ({
      ...errors,
      [name]: error
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!isFormValid && Object.keys(errors).length === 0) {
      setErrors(errors => ({
        ...errors,
        ["general_error"]: "כל השדות הן חובה"
      }));
      setTimeout(() => {
        setErrors(errors => ({...errors, general_error: ""}));
      }, 3000);
      return;
    }else if(!isFormValid && !password2){
      return;
    }else{
      try{
        const {data} = await register(formData);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch(err){
        if(err.status === 400){
          if(err.response.data === "User not created: This email already exists in the system."){
            setErrorFromServer("המייל כבר קיים במערכת");
          }
          if(err.response.data === "User not created: This username already exists in the system."){
            setErrorFromServer("המשתמש כבר קיים במערכת");
          }
        }
        if(err.status === 500){
          setErrorFromServer("שגיאת שרת");
        }
        if(err.code === "ERR_NETWORK"){
          setErrorFromServer("שגיאת רשת");
        }
        setTimeout(() => {
          setErrorFromServer("");
        }, 3000);        
        return;
      }
    }
  }

  useEffect(() => {
    if(formData){
      const { first_name, last_name, email, phone, address, username, password} = formData;
      setIsFormValid(
        Boolean(first_name && last_name && email && phone && address && username && password) && password2 &&
        Object.values(errors).every(err => !err) && password === password2
      );
    }
  }, [errors]);

  useEffect(() => {
    const cleanedErrors = Object.fromEntries(
      Object.entries(errors).filter(([key, value]) => value !== "")
    );
    if (JSON.stringify(cleanedErrors) !== JSON.stringify(errors)) {
      setErrors(cleanedErrors);
    }
  },[errors]);

  return (
    <div>
      <form className='registration-form' onSubmit={handleSubmit}>
        <input  
          type="text"
          name="first_name"
          placeholder='שם פרטי'
          value={formData.first_name} 
          onChange={handleChange} 
        />

        <input 
          type="text"
          name="last_name"
          placeholder='שם משפחה'
          value={formData.last_name} 
          onChange={handleChange}
        />

        <input 
          type="email"
          name="email"
          placeholder='אימייל'
          value={formData.email} 
          onChange={handleChange}        
        />
        
        <input 
          type="phone"
          name="phone"
          placeholder='פלאפון'
          value={formData.phone} 
          onChange={handleChange}        
        />
        
        <input 
          type="text"
          name="address"
          placeholder='כתובת'
          value={formData.address} 
          onChange={handleChange}        
        />

        <input 
          type="text"
          name="username"
          placeholder='שם משתמש'
          value={formData.username} 
          onChange={handleChange}        
        />

        <input 
          type="password"
          name="password"
          placeholder='סיסמא'
          value={formData.password} 
          onChange={handleChange}        
        />

        <input 
          type="password"
          name="password2"
          placeholder='אימות סיסמא'
          value={password2} 
          onChange={handleChange}
        />  
        {errorFromServer && <p className='error-text'>{errorFromServer}</p>}
        {!errorFromServer && errors && <p className='error-text'>{Object.values(errors)[0]}</p>}
        <div className='buttons'>
            <button 
              type='button' 
              className='register' 
              onClick={() => navigate('/login')}
            >
              התחבר
            </button>
            <button type='submit'>הירשם</button>
        </div>
      </form>
    </div>
  )
}

export default RegistrationForm