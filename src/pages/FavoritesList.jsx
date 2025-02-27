import ItemsContainer from '../components/ItemsContainer'
import '../styles/FavoritesList.css'
import UserContext from '../contexts/UserContext'
import { useContext } from 'react';

const FavoritesList = () => {
  const {currentUser, isRequestToGetCurrentUserDone} = useContext(UserContext);

  return (
    <div className='favorites-list-page'>
      {isRequestToGetCurrentUserDone && currentUser ? <h1>רשימת מועדפים</h1> : <h1>...אופס</h1>}
      {isRequestToGetCurrentUserDone && currentUser &&
        <ItemsContainer page={"FavoritesList"}/>
      }
       {isRequestToGetCurrentUserDone && !currentUser &&
        <div>
          <h3>אתה לא מורשה לגשת לדף שחיפשת</h3>
        </div>
      }
    </div>
  )
}

export default FavoritesList