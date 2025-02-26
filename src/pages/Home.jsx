import '../styles/Home.css'
import ItemsContainer from '../components/ItemsContainer'

const Home = () => {
    
  return (
    <div className='home-page'>
      <h1>דף הבית</h1>
      <ItemsContainer page={"Home"}/>
    </div>
  )
}

export default Home