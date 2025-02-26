import React, { useContext, useEffect, useState } from 'react'
import '../styles/Item.css'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import UserContext from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { addToFavoritesList, removeFromFavoritesList } from '../services/ApiService'

const Item = ({imageUrl, amount, title, isFavorite}) => {
  const {currentUser} = useContext(UserContext);
  const [isFavoriteItem, setIsFavoriteItem] = useState(null);
  // const [addToFavoritesActive, setAddToFavoritesActive] = useState(null);
  const navigate = useNavigate();

  const handleClick = async() => {
    if(currentUser){
      if(!isFavoriteItem){
        // Add item to user's favorites
        console.log("Add item to user's favorites");
        await addToFavoritesList(title);
      }
      if(isFavoriteItem){
        // Remove item from user's favorites
        console.log("Remove item from user's favorites");
        await removeFromFavoritesList(title);
      }
      setIsFavoriteItem(!isFavoriteItem);
    } else{
      navigate('/login');
    }
  }

  useEffect(() => {
    setIsFavoriteItem(isFavorite);
  },[]);
  
  return (
    <div className='item-card'>
        <div className='image-container'>
        <img src={`${imageUrl}`} className='image' alt='img'/>
        </div>
        <div className='text-container'>
            <h2>{`${title}`}</h2>
            <p>{`(נשארו ${amount} במלאי)`}</p>
        </div>
      <div className='buttons-container'>
        <span onClick={handleClick}>
          {!isFavoriteItem ? <FavoriteBorderIcon className='heart-icon'/> : <FavoriteIcon className='filled-heart-icon'/>}
        </span>
        <button className='button'>הוסף לעגלה</button>
      </div>
    </div>
  )
}

export default Item