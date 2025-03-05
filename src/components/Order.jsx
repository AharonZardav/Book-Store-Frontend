import React, { useContext, useEffect, useState } from 'react'
import OrderItem from './OrderItem'
import '../styles/Order.css'
import ItemsContext from '../contexts/ItemsContext'
import { placeOrder } from '../services/ApiService'
import { useNavigate } from 'react-router-dom'
import { Margin } from '@mui/icons-material'

const Order = ({order}) => {
  const [itemsInOrder, setItemsInOrder] = useState([]);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const {items, isRequestToGetItemsDone, getAllItemsForContext} = useContext(ItemsContext);
  const [sum, setSum] = useState(0);
  
  const calculateTotalSum = () => {
    let total = 0;
    itemsInOrder.forEach((item) => {
      total += item.price * item.quantity;
    });
    setSum(total.toFixed(2));
  };
  
  const findItemQuantityInStock = (title) => {
    if(isRequestToGetItemsDone && items){
      const foundedItem = items.find((item) => item.title === title)
      return foundedItem.quantity;
    }
  }

  const handlePlaceOrder = async() => {
    try {
      const {data} = await placeOrder();
      
      setIsOrderOpen(false);
    }catch(err) {
      console.error('Failed to fetch items:', err);
    }
    return;
  }

  useEffect(() => {
    setItemsInOrder(order.items);
    if(order.order_status === 'OPEN'){
      setIsOrderOpen(true);
    }
  }, [])

  useEffect(() => {
    if(!items ||items.length === 0){
      getAllItemsForContext();
    }
  }, [items]);

  useEffect(() => {
    calculateTotalSum();
  }, [itemsInOrder]);

  return (
    <div className={`order-card ${isOrderOpen ? 'open-order' : 'close-order'}`}>
        <div className='order-title'>
            {isOrderOpen ? <h2>הזמנה פתוחה</h2> : <h2>הזמנה סגורה</h2>}
        </div>
        {itemsInOrder && items &&
          itemsInOrder.map((item) => {
            return <OrderItem isOrderOpen={isOrderOpen} imageUrl={item.image_path} title={item.title} price={item.price} 
            amount={item.quantity} quantityInStock={findItemQuantityInStock(item.title)}/>
          })
        }
        <div className='order-buttons'>
            {isOrderOpen ? <p>{`סה"כ לתשלום: ${sum} ש"ח`}</p> : <p style={{margin: 0}}>{`סה"כ שולם: ${sum} ש"ח`}</p>}
            {isOrderOpen && <button onClick={handlePlaceOrder}>שלם עכשיו</button>}
            {!isOrderOpen && <p>{`${order.order_date} :תאריך הזמנה`}</p>}
        </div>
    </div>
  )
}

export default Order