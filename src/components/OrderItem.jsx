import '../styles/OrderItem.css'

const OrderItem = ({isOrderOpen, imageUrl, amount, title, price}) => {
  
  return (
    <div className='order-item-card'>
      <div className='orderItem-content-container'>
        {isOrderOpen &&
          <div className='add-item-container'>
            <div className='orderItem-buttons-container'>
              <button style={{marginBottom: "2px"}}>-</button>
              <p>{`${amount}`}</p>
              <button style={{marginBottom: "2px"}}>+</button>
            </div>
            <p>{`נשארו ${amount} במלאי`}</p>
          </div>
        }
        {!isOrderOpen &&
          <div className='amount-in-order'>
            <p>{`${amount} :פריטים בהזמנה`}</p>
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