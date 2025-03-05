import UserContext from '../contexts/UserContext';
import '../styles/OrderItem.css'
import React, { useContext, useEffect, useState } from 'react'
import { addItemToOrder, removeItemFromOrder } from '../services/ApiService'
import { useNavigate } from 'react-router-dom';
import ItemsContext from '../contexts/ItemsContext';

const OrderItem = ({isOrderOpen, imageUrl, amount, title, price, quantityInStock}) => {

  const navigate = useNavigate();
  const {currentUser} = useContext(UserContext);
  const [quantityInOrder, setQuantityInOrder] = useState(amount);

  const handleAddItemClick = async() => {
    if(currentUser){
      try{
        if(quantityInStock > quantityInOrder){
          await addItemToOrder({username:currentUser.username, title, quantity:1, shipping_address:currentUser.address});
          setQuantityInOrder(quantityInOrder + 1);
          window.location.reload()
        } else {
          return;
        }
      } catch(err){
        console.log(err);
        return;
      }
    } else{
      navigate('/login');
    }
  }

  const handleRemoveItemClick = async() => {
    if(currentUser){
      try{
        if(quantityInOrder > 0){
          await removeItemFromOrder({username:currentUser.username, title, quantity:1, shipping_address:currentUser.address});
          setQuantityInOrder(quantityInOrder - 1);
          window.location.reload();
        } else {
          return;
        }
      } catch(err){
        console.log(err);
        return;
      }
    } else{
      navigate('/login');
    }
  }

  return (
    <div className='order-item-card'>
      <div className='orderItem-content-container'>
        {isOrderOpen &&
          <div className='add-item-container'>
            <div className='orderItem-buttons-container'>
              <button onClick={handleRemoveItemClick} style={{marginBottom: "2px"}}>-</button>
              <p>{`${quantityInOrder}`}</p>
              <button onClick={handleAddItemClick} style={{marginBottom: "2px"}}>+</button>
            </div>
            <p>{`נשארו ${quantityInStock-quantityInOrder} במלאי`}</p>
          </div>
        }
        {!isOrderOpen &&
          <div className='amount-in-order'>
            <p>{`${quantityInOrder} :פריטים בהזמנה`}</p>
          </div>
        }
        <div className='orderItem-text-container'>
          <h2>{`${title}`}</h2>
          <h3>{`מחיר: ${price} ש"ח`}</h3>
        </div>
      </div>
      <div className='orderItem-image-container'>
        <img src={`${imageUrl}`} className='orderItem-image' alt='img'/>
      </div>
    </div>
  )
}

export default OrderItem