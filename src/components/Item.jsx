import React, { useContext, useEffect, useState } from 'react'
import '../styles/Item.css'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import UserContext from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { addToFavoritesList, removeFromFavoritesList, addItemToOrder } from '../services/ApiService'

const Item = ({imageUrl, amount, title, isFavorite, price}) => {
  const {currentUser, isRequestToGetCurrentUserDone} = useContext(UserContext);
  const [isFavoriteItem, setIsFavoriteItem] = useState(null);
  const navigate = useNavigate();
  
  const handleFavoriteClick = async() => {
    if(currentUser){
      if(!isFavoriteItem){
        await addToFavoritesList(title);
      }
      if(isFavoriteItem){
        await removeFromFavoritesList(title);
      }
      setIsFavoriteItem(!isFavoriteItem);
    } else{
      navigate('/login');
    }
  }

  const handleAddItemClick = async() => {
    if(currentUser){
      try{
        await addItemToOrder({username:currentUser.username, title, quantity:1, shipping_address:currentUser.address});
      } catch(err){
        console.log(err);
        return;
      }
    } else{
      navigate('/login');
    }
  }

  useEffect(() => {
    if(isRequestToGetCurrentUserDone && currentUser){
      setIsFavoriteItem(isFavorite);
    }
  },[currentUser, isRequestToGetCurrentUserDone, isFavorite]);
  
  return (
    <div className='item-card'>
        <div className='image-container'>
        <img src={`${imageUrl}`} className='image' alt='img'/>
        </div>
        <div className='title-container'>
            <h2>{`${title}`}</h2>
        </div>
        <div className='text-container'>
          <h3>{`מחיר: ${price} ש"ח`}</h3>
          <p>{`(נשארו ${amount} במלאי)`}</p>
        </div>
      <div className='buttons-container'>
        <span onClick={handleFavoriteClick}>
          {!isFavoriteItem ? <FavoriteBorderIcon className='heart-icon'/> : <FavoriteIcon className='filled-heart-icon'/>}
        </span>
        {amount !== 0 && <button className='button' onClick={handleAddItemClick}>הוסף לעגלה</button>}
        {amount === 0 && <button className='button disabled'>אזל המלאי</button>}
      </div>
    </div>
  )
}

export default Item