// import './style.css'
import {RECIPE_DATA} from './recipe_data'
//import CHICKEN_IMG from '../assets/chicken.jpg'

const RecipeCard = () => {
  return (
    <div className='recipe-card'>
      <img src={RECIPE_DATA.image} alt={RECIPE_DATA.name} />
      <div className='recipe-card-content'>
        <h2>Ingredients</h2>
        <ul>
            {RECIPE_DATA.ingredients.map((ingre, index) => (
                <li key={index}>{ingre}</li>
            ))}
        </ul>
      </div>
      <div>
        <h2>Instructions</h2>
        <ul>
            {RECIPE_DATA.instructions.map((ins, index) => (
                <li key={index}>{ins}</li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default RecipeCard
