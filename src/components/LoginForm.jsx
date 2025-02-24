import React, { useState, useContext } from 'react'
import "../styles/LoginForm.css"
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { fetchCurrentUser, login } from '../services/ApiService';
import UserContext from '../contexts/UserContext';

const LoginForm = () => {
    const {updateCurrentUserContext} = useContext(UserContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!username || !password){
            setError("אנא הכנס שם משתמש וסיסמא");
            setTimeout(() => {
                setError("");
            }, 3000)
            return;
        }
        try {
            await login({username, password});
        } catch (err) {
            if(err.status === 403){
                setError("שם משתמש או סיסמא שגויים");
            }
            if(err.code === "ERR_NETWORK"){
                setError("שגיאת רשת");
            }
            if(err.status === 500){
                setError("שגיאת שרת");
            }
            setTimeout(() => {
                setError("");
            }, 3000)
            return;
        }
        const {data} = await fetchCurrentUser();
        updateCurrentUserContext(data);
        navigate('/')
    }

  return (
    <div className='login-form'>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">שם משתמש</label>
            <input 
                type="text"
                id="name" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />

            <label htmlFor="password">סיסמה</label>
            <div style={{ position: "relative", marginBottom: "1rem"}}>
                <input 
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        paddingRight: "0",
                        paddingLeft: "0.5rem",
                        marginBottom: "0"
                    }}
                />
                <span
                    onClick={togglePasswordVisibility}
                    style={{
                        position: "absolute",
                        top: "50%",
                        right: "15px",
                        transform: "translateY(-40%)",
                        cursor: "pointer"
                    }}
                >
                    {showPassword ? <VisibilityIcon style={{fontSize: "medium"}}/> : <VisibilityOffIcon style={{fontSize: "medium"}}/>}
                </span>
            </div>
            {error && <p className='error-text'>{error}</p>}
            <div className='buttons'>
                <button type='button' className='register' onClick={() => navigate('/register')}>הרשמה</button>
                <button type='submit'>התחבר</button>
            </div>
        </form>
    </div>
  )
};

export default LoginForm