import { useContext } from 'react';
import UserContext from '../contexts/UserContext';
import '../styles/OrderProcessPage.css'
import Order from '../components/Order';

const OrderProcess = () => {
  const {currentUser, isRequestToGetCurrentUserDone} = useContext(UserContext);
  
  return (
    <div className='order-process-page'>
      <h1>Order Process</h1>
      {isRequestToGetCurrentUserDone && currentUser &&
        <div className='order-container'>
          <p>open order</p>
          {/* <Order isOrderOpen={true}  itemsInOrder={[]}/> */}
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

export default OrderProcess