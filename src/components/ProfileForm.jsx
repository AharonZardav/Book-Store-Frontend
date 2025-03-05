import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext';
import '../styles/ProfileForm.css'
import { deleteCurrentUser, updateCurrentUser, removeAuthHeader } from '../services/ApiService'
import { useNavigate } from 'react-router-dom';


const ProfileForm = () => {
  const {currentUser, isRequestToGetCurrentUserDone, updateCurrentUserContext} = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errorFromServer, setErrorFromServer] = useState("");
  const [isFormValid, setIsFormValid] = useState(true);
  const [errors, setErrors] = useState({});
  const [isDeletedAccount, setIsDeletedAccount] = useState(false);

  const navigate = useNavigate();
  
  const nameRegex = /^[a-zA-Z]{2,30}$/;
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  const phoneRegex = /^05[0-9]-?\d{7}$/;
  const addressRegex = /^[a-zA-Z0-9\s,-]{3,}$/;

  useEffect(() => {
    if(isRequestToGetCurrentUserDone && currentUser){
      setFormData(currentUser);
    }
  }, [currentUser]);
  

  const validateField = (name, value) => {
    let error = '';
    if(!value.trim() && ['first_name', 'last_name', 'email', 'phone', 'address'].includes(name)) {
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
        default:
          break;
      }
    }else if((name === "first_name" || name === 'last_name') && value.trim() && !nameRegex.test(value)){
      error = "שם צריך להכיל בין 2 ל30 תווים באנגלית בלבד";
    }else if(name === "email" && !emailRegex.test(value)){
      error = "נא להכניס כתובת אימייל תקינה";
    } else if(name === "phone" && value.trim() && !phoneRegex.test(value)){
      error = "  מספר טלפון חייב להתחיל ב05 ויכול להכיל מספרים בלבד";
    }else if(name === "address" && value.trim() && !addressRegex.test(value)){
      error = "כתובת יכולה להכיל אותיות, מספרים, רווחים, פסיקים ומקפים. חייבת להכיל לפחות 3 תווים";
    }
    setErrors({...errors, [name]: error});    
  }

  const toggelEditMode = () => {
    setIsEditing(!isEditing);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value });
    validateField(name, value);
  }

  useEffect(() => {
    if(formData){
      const { first_name, last_name, email, phone, address} = formData;
      setIsFormValid(
        Boolean(first_name && last_name && email && phone && address) &&
        Object.values(errors).every(err => !err)
      );
    }
  }, [errors]);

  const handleSubmit = async(e) => {
    e.preventDefault();    
    if(!isFormValid) return;
    try{
      console.log("handle submit -> form data: ", formData);
      const {data} = await updateCurrentUser(formData);
      console.log('handle submit -> data: ' ,data);
      
      await updateCurrentUserContext(data);
      setIsEditing(false);
    } catch(err) {
      if(err.status === 400 || err.status === 500){
        setErrorFromServer(err.response.data);
      }
      if(err.code === "ERR_NETWORK"){
        setErrorFromServer("שגיאת רשת");
      }
      setTimeout(() => {
        setErrorFromServer("");
      }, 3000);
    }
  }

  const handleDeleteAccount = async() => {
    const confirmDelete = window.confirm(
      "אתה בטוח שאתה רוצה למחוק את המשתמש? לא תוכל לבטל את הפעולה"
    );
    if(confirmDelete){
      try{
        console.log('account deleted');
        
        const {data} = await deleteCurrentUser();
        removeAuthHeader("token");
        updateCurrentUserContext(null);
        setIsDeletedAccount(data);
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } catch(err){
        if(err.status === 400 || err.status === 500){
          setErrorFromServer(err.response.data);
        }
        if(err.code === "ERR_NETWORK"){
          setErrorFromServer(err.message);
        }
        setTimeout(() => {
          setErrorFromServer("");
        }, 3000);
      }
    }
  }

  return (
    <div>
      {currentUser && formData &&
        <form className='profile-form' onSubmit={handleSubmit}>
          <input 
            type="text"
            name='first_name'
            defaultValue={formData ? formData.first_name : ""}
            disabled={!isEditing}
            onChange={handleChange}
            className={`${errors.first_name ? 'input-error' : ''}`}
          />
          {errors.first_name && <p className='error-text'>{errors.first_name}</p>}
          <input 
            type="text"
            name='last_name'
            defaultValue={formData ? formData.last_name : ""}
            disabled={!isEditing}
            onChange={handleChange}
            className={`${errors.last_name ? 'input-error' : ''}`}
          />
          {errors.last_name && <p className='error-text'>{errors.last_name}</p>}
          <input 
            type="text"
            name='email'
            defaultValue={formData ? formData.email : ""}
            disabled={!isEditing}
            onChange={handleChange}
            className={`${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && <p className='error-text'>{errors.email}</p>}
          <input 
            type="text"
            name='phone'
            defaultValue={formData ? formData.phone : ""}
            disabled={!isEditing}
            onChange={handleChange}
            className={`${errors.phone? 'input-error' : ''}`}
          />
          {errors.phone && <p className='error-text'>{errors.phone}</p>}
          <input 
            type="text"
            name='address'
            defaultValue={formData ? formData.address : ""}
            disabled={!isEditing}
            onChange={handleChange}
            className={`${errors.address? 'input-error' : ''}`}
          />
          {errors.address && <p className='error-text'>{errors.address}</p>}
          {errorFromServer && <p className='error-text'>{errorFromServer}</p>}
          <div className='profile-buttons-container'>
            <button type='button' className='profile-button delete-button' onClick={handleDeleteAccount}>מחק משתמש</button>
            {!isEditing &&
              <button type='button' className='profile-button edit-button' onClick={toggelEditMode}>עריכה</button>
            }
            {isEditing &&
              <button type='submit' className='profile-button save-button' disabled={!isFormValid}>שמירה</button>
            }
          </div>
        </form>
      }
      {isRequestToGetCurrentUserDone && !currentUser &&
        <div>
          <h3>אתה לא מורשה לגשת לדף שחיפשת</h3>
        </div>
      }
    </div>
  )
}

export default ProfileForm