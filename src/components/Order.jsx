import React, { useEffect, useState } from 'react'
import OrderItem from './OrderItem'
import '../styles/Order.css'

const Order = ({order}) => {
  const [itemsInOrder, setItemsInOrder] = useState([]);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const extractItemsFromOrder = (order) => {
    setItemsInOrder(order.items);
  }

  useEffect(() => {
    extractItemsFromOrder(order);
    if(order.order_status === 'OPEN'){
      setIsOrderOpen(true);
    }
  }, [])

  return (
    <div className={`order-card ${isOrderOpen ? 'open-order' : 'close-order'}`}>
        <div className='order-title'>
            {isOrderOpen ? <h2>הזמנה פתוחה</h2> : <h2>הזמנה סגורה</h2>}
        </div>
        {itemsInOrder &&
          itemsInOrder.map((item) => {
            return <OrderItem isOrderOpen={isOrderOpen} imageUrl={item.image_path} title={item.title} price={item.price} amount={item.quantity}/>
          })
        }
        <div className='order-buttons'>
            {isOrderOpen && <p>{`סה"כ לתשלום: ${"(למלא)"} ש"ח`}</p>}
            {isOrderOpen && <button>שלם עכשיו</button>}
            {!isOrderOpen && <p>{`${order.order_date} :תאריך הזמנה`}</p>}
        </div>
    </div>
  )
}

export default Order