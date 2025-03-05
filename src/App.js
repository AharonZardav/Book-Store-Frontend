import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Profile from './pages/Profile';
import FavoritesList from './pages/FavoritesList';
import OrderProcess from './pages/OrderProcess';
import NotFound from './pages/NotFound';
import { useEffect, useState} from 'react';
import { fetchAllItems, fetchCurrentUser } from './services/ApiService';
import UserContext from './contexts/UserContext';
import ItemsContext from '../src/contexts/ItemsContext'
import SearchBarContext from '../src/contexts/SearchBarContext'
import OrdersPage from './pages/OrdersPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRequestToGetCurrentUserDone, setIsRequestToGetCurrentUserDone] = useState(false);
  const [items, setAllItems] = useState([]);
  const [isRequestToGetItemsDone, setIsRequestToGetItemsDone] = useState(false);
  const [isSearchBarActive, setIsSearchBarActive] = useState(false);
  const [searchWord, setSearchWord] = useState("");

  const updateCurrentUserContext = (user) => {
    setCurrentUser(user);
  }

  const updateItemsContext = (items) => {
    setAllItems(items);
  }

  const updateSearchWordContext = (searchWord) => {
    setSearchWord(searchWord);
  }

  const toggleIsSearchBarActive = () => {
    if(searchWord.length == 0){
      setIsSearchBarActive(false);
      return;
    }
    setIsSearchBarActive(true); 
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

  const getAllItemsForContext = async() => {
    try {
      const {data} = await fetchAllItems();
      updateItemsContext(data);
    }catch(err) {
      console.error('Failed to fetch items:', err);
    }
    setIsRequestToGetItemsDone(true);
    return;
  };

  useEffect(() => {
    getCurrentUserForContext();
    getAllItemsForContext();
  },[]);

  return (
    <UserContext.Provider value={{currentUser, updateCurrentUserContext, isRequestToGetCurrentUserDone}}>
    <ItemsContext.Provider value={{items, getAllItemsForContext, isRequestToGetItemsDone}}>
    <SearchBarContext.Provider value={{isSearchBarActive, updateSearchWordContext, searchWord, toggleIsSearchBarActive}}>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Registration/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/favorites-list' element={<FavoritesList/>}/>
          {/* <Route path='/order-process' element={<OrderProcess/>}/> */}
          <Route path='/orders' element={<OrdersPage/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </Router>
    </SearchBarContext.Provider>
    </ItemsContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
