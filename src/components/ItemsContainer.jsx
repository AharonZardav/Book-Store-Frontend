import Item from './Item'
import '../styles/ItemsContainer.css'
import { fetchFavoritesList } from '../services/ApiService'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext'
import ItemsContext from '../contexts/ItemsContext'
import SearchBarContext from '../contexts/SearchBarContext'

const ItemsContainer = ({page}) => {
  const {currentUser, isRequestToGetCurrentUserDone} = useContext(UserContext);
  const {items, getAllItemsForContext} = useContext(ItemsContext);
  const {isSearchBarActive, searchWord} = useContext(SearchBarContext);
  const [error, setError] = useState(null);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [favoriteItemsId, setFavoriteItemsId] = useState(new Set);
  const [isRequestToGetFavoritesDone, setIsRequestToGetFavoritesDone] = useState(false);
  
  const getAllItems = async() => {
    try {
      getAllItemsForContext()
    } catch (err) {
      if(err.status === 404){
        setError("אין פריטים כרגע לצערנו");
        setTimeout(() => {
          setError("");
        }, 3000)
        return;
      }
      if(err.status === 500){
        setError("הבאת הפריטים נכשלה: שגיאת שרת");
        setTimeout(() => {
          setError("");
        }, 3000)
        return;
      }
      if(err.code === 'ERR_NETWORK'){
        setError("הבאת הפריטים נכשלה: שגיאת רשת");
        setTimeout(() => {
          setError("");
        }, 3000)
        return;
      }
      return;
    };
  }

  const getFavoriteItems = async() => {
    try {
      const {data} = await fetchFavoritesList();
      if(page === "Home"){
        setFavoriteItemsId(new Set(data.map((item) => item.item_id)));
      }
      if(page === "FavoritesList"){
        setFavoriteItems(data);
      }
      if(favoriteItems.length === 0 && page === "FavoritesList"){
        setError("לצערנו אין עדיין פריטים ברשימה כרגע");
      } else {
        setError("");
      }
    } catch (err) {
      if(err.status === 404){
        setError("אין פריטים כרגע לצערנו");
        return;
      }
      if(err.status === 500){
        setError("הבאת הפריטים נכשלה: שגיאת שרת");
        return;
      }
      if(err.code === 'ERR_NETWORK'){
        setError("הבאת הפריטים נכשלה: שגיאת רשת");
        return;
      }
      return;
    };
    setIsRequestToGetFavoritesDone(true);
  }

  useEffect(() => {
    if(page==="Home" && isRequestToGetCurrentUserDone && currentUser){
      if(!isRequestToGetFavoritesDone){
        getFavoriteItems();
      }
      if(isRequestToGetFavoritesDone){
        getAllItems();
      } 
    }
  }, [currentUser, isRequestToGetFavoritesDone]);

  useEffect(() => {
    if(page==="Home" && isRequestToGetCurrentUserDone && !currentUser){
      getAllItems();
    }
  }, [currentUser, isRequestToGetFavoritesDone, page]);

  useEffect(() => {
    if(page==="FavoritesList" && isRequestToGetCurrentUserDone && currentUser){
      getFavoriteItems();
    }
  }, [currentUser]);

  useEffect(() => {
    setError("");
  }, [(favoriteItems != null), (favoriteItems.length > 0)]);

  return (
    <div className='items-container'>
      {items && favoriteItemsId && page==="Home" && !isSearchBarActive &&
          items.map((item) =>{
              return <Item className="item-card" imageUrl={item.image_path} amount={item.quantity} title={item.title} price={item.price}
                page={"Home"} isFavorite={favoriteItemsId.has(item.item_id)}/>
          })
      }
      {items && favoriteItemsId && page==="Home" && isSearchBarActive &&
          items.filter(item => item.title.includes(searchWord)).map((item) => (
            <Item key={item.item_id} className="item-card" imageUrl={item.image_path} amount={item.quantity} title={item.title} price={item.price} page={"Home"} isFavorite={favoriteItemsId.has(item.item_id)}/>
            )
          )
      }
      {favoriteItems && page==="FavoritesList" &&
          favoriteItems.map((favoriteItem) =>{
              return <Item className="item-card" imageUrl={favoriteItem.image_path} amount={favoriteItem.quantity} title={favoriteItem.title} price={favoriteItem.price}
                page={"FavoritesList"} isFavorite={true}/>
          })
      }
      {error && <p style={{margin: "0"}}>{error}</p>}
    </div>
  )
}

export default ItemsContainer