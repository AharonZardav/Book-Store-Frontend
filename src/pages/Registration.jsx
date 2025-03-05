import React from 'react'
import '../styles/Registration.css'
import RegistrationForm from '../components/RegistrationForm'

const Registration = () => {
  return (
    <div className='registration-page'>
      <h1>הרשמה</h1>
      <RegistrationForm/>
    </div>
  )
}

export default Registration