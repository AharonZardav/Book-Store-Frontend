import React from 'react'
import ProfileForm from '../components/ProfileForm'
import '../styles/Profile.css'

const Profile = () => {
  return (
    <div className='profile-page'>
      <h1>פרופיל</h1>
      <ProfileForm/>
    </div>
  )
}

export default Profile