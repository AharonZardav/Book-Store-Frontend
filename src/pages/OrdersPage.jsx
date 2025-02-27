import React, { useContext, useEffect, useState } from 'react'
import '../styles/OrdersPage.css'
import UserContext from '../contexts/UserContext';
import { fetchAllOrders } from '../services/ApiService'
import Order from '../components/Order';

const OrdersPage = () => {
  const {currentUser, isRequestToGetCurrentUserDone} = useContext(UserContext);
  const [openOrder, setOpenOrder] = useState(null);
  const [closedOrders, setClosedOrders] = useState([]);


  const getOrders = async() => {
    try{
      const {data} = await fetchAllOrders();
      setOpenOrder(data.openOrder);
      setClosedOrders(data.closedOrders);
    } catch (err){
      console.log(err);
      return;
    }
  }

  useEffect(() => {
    if(isRequestToGetCurrentUserDone && currentUser){
      getOrders();
    }
  }, [currentUser]);

  return (
    <div className='orders-page'>
      {/* <h1>Orders page</h1> */}
      {isRequestToGetCurrentUserDone && currentUser &&
        <div className='orders-container'>
            {openOrder && openOrder.items && <Order order={openOrder}/>}
            {closedOrders &&
              closedOrders.map((closedOrder) =>{
                return <Order order={closedOrder}/>
              })
            }
        </div>
      }
      {isRequestToGetCurrentUserDone && !currentUser &&
        <div>
          <h1>...אופס</h1>
          <h3>אתה לא מורשה לגשת לדף שחיפשת</h3>
        </div>
      }
    </div>
  )
}

export default OrdersPage