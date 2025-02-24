import React, { useContext } from 'react'
import logo from '../styles/logo.png'
import '../styles/Navbar.css'
import CustomLink from './CustomLink'
import SearchBar from './SearchBar'
import UserContext from '../contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import { removeAuthHeader} from '../services/ApiService'
import TocIcon from '@mui/icons-material/Toc';

const Navbar = () => {
  const {currentUser, updateCurrentUserContext, isRequestToGetCurrentUserDone} = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    setTimeout(() => {
      removeAuthHeader("token");
      updateCurrentUserContext(null);
      navigate('/');
    }, 1000)
  };

  return (
    <nav className='navbar'>
        {isRequestToGetCurrentUserDone && !currentUser &&
          <div className='navbar-links'>
            <CustomLink to={'/login'} children={'התחברות'} className="btn-link"/>
          </div>
        }
        {currentUser && 
          <div className='navbar-links'>
            <button onClick={logout} className='btn'>התנתק</button>
            <CustomLink to={'/order-process'} children={"עגלת קניות"}/>
            <CustomLink to={'/orders'} children={"הזמנות"}/>
            <CustomLink to={'/favorites-list'} children={'מועדפים'}/>
            <CustomLink to={'/profile'} children={'פרופיל'}/>
          </div>
        }
        <div className='navbar-search'>
          <SearchBar className="search-bar"/>
        </div>
        <CustomLink to={'/'} children={<img src={logo} alt="logo" className='logo'/>}/>
    </nav>
  ) 
}

export default Navbar