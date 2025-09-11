import Card from './component/Card';
import RecipeInfo from './component/RecipeInfo';
import './component/RecipeCard.css';
import { RECIPE } from './component/recipe_data';

const App = () => {
  return (
    <div>
      <Card>
        <RecipeInfo title={RECIPE.title} description={RECIPE.description}/>
        <div className="card_lists"></div>
        
      </Card>
    </div>
  )
}

export default App
    