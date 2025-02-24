import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Profile from './pages/Profile';
import FavoritesList from './pages/FavoritesList';
import OrderProcess from './pages/OrderProcess';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import { useEffect, useState } from 'react';
import { fetchCurrentUser } from './services/ApiService';
import UserContext from './contexts/UserContext';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRequestToGetCurrentUserDone, setIsRequestToGetCurrentUserDone] = useState(false);

  const updateCurrentUserContext = (user) => {
    setCurrentUser(user);
  }

  const getCurrentUserForContext = async () => {
    try {
      if(localStorage.getItem('token')){
        const {data} = await fetchCurrentUser();
        updateCurrentUserContext(data);
      }
    } catch (err){
      console.error('Failed to fetch user:', err);
    }
    setIsRequestToGetCurrentUserDone(true);
  }

  useEffect(() => {
    getCurrentUserForContext();
  }, []);

  return (
    <UserContext.Provider value={{currentUser, updateCurrentUserContext, isRequestToGetCurrentUserDone}}>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Registration/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/favorites-list' element={<FavoritesList/>}/>
          <Route path='/order-process' element={<OrderProcess/>}/>
          <Route path='/orders' element={<Orders/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
