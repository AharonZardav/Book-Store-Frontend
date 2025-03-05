import React, { useContext, useEffect, useState } from 'react'
import "../styles/SearchBar.css"
import SearchIcon from '@mui/icons-material/Search';
import CustomLink from './CustomLink';
import SearchBarContext from '../contexts/SearchBarContext';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const {updateSearchWordContext, toggleIsSearchBarActive} = useContext(SearchBarContext);
  const [searchWord, setSearchWord] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setSearchWord(e.target.value);
  }

  const handleSearch = () => {
    updateSearchWordContext(searchWord);
    toggleIsSearchBarActive();
  }

  const handleSearchClick = () => {
    if (location.pathname !== "/") {
      navigate('/');
    } else {
      handleSearch();
    }
  };

  useEffect(() => {
    handleSearch();
  }, [handleSearchClick]);

  return (
    <div className="search-bar">
        <CustomLink to={'/'} children={<SearchIcon/>} onClick={handleSearchClick}/>
        <input 
          type="text"
          placeholder="חפשו לפי שם הספר...?"
          onChange={handleChange}
        />
    </div>
  )
}

export default SearchBar