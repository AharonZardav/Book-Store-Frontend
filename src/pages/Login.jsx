import React from 'react'
import LoginForm from '../components/LoginForm'
import '../styles/Login.css'

const Login = () => {
  return (
    <div className='login-page'>
      <h1>התחברות</h1>
      <LoginForm />
    </div>
  )
}

export default Login