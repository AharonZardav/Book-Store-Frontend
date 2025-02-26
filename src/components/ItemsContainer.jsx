import Item from './Item'
import '../styles/ItemsContainer.css'
import { fetchFavoritesList, fetchAllItems } from '../services/ApiService'
import React, { useEffect, useState } from 'react'


const ItemsContainer = ({page}) => {    
  const [items, setAllItems] = useState([]);
  const [error, setError] = useState(null);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [favoriteItemsId, setFavoriteItemsId] = useState(new Set);


  const getAllItems = async() => {
    try {
      const {data} = await fetchAllItems();
      setAllItems(data);
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

  useEffect(() => {
    if(page==="Home"){
      getAllItems();
      getFavoriteItems();
    }
  }, [favoriteItemsId]);

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
  }

  useEffect(() => {
    if(page==="FavoritesList"){
      getFavoriteItems();
    }
  }, []);

  useEffect(() => {
    setError("");
  }, [(!favoriteItems == null), (favoriteItems.length > 0)]);

  return (
    <div className='items-container'>
        {items && page==="Home" &&
            items.map((item) =>{
                return <Item className="item-card" imageUrl={item.image_path} amount={item.quantity} title={item.title} page={"Home"} isFavorite={favoriteItemsId.has(item.item_id)}/>
            })
        }
        {favoriteItems && page==="FavoritesList" &&
            favoriteItems.map((favoriteItem) =>{
                return <Item className="item-card" imageUrl={favoriteItem.image_path} amount={favoriteItem.quantity} title={favoriteItem.title} page={"FavoritesList"} isFavorite={true}/>
            })
        }
        {error && <p>{error}</p>}
    </div>
  )
}

export default ItemsContainer