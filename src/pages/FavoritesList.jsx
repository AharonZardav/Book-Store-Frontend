import ItemsContainer from '../components/ItemsContainer'
import '../styles/FavoritesList.css'

const FavoritesList = () => {
    
  return (
    <div className='favorites-list-page'>
      <h1>רשימת מועדפים</h1>
      <ItemsContainer page={"FavoritesList"}/>
    </div>
  )
}

export default FavoritesList