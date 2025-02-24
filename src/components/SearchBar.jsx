import React from 'react'
import "../styles/SearchBar.css"
import SearchIcon from '@mui/icons-material/Search';
import CustomLink from './CustomLink';

const SearchBar = () => {
  return (
    <div className="search-bar">
        <CustomLink to={'/'} children={<SearchIcon/>}/>
        <input type="text" placeholder="חפשו לפי שם הספר...?" />
    </div>
  )
}

export default SearchBar