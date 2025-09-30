import React from 'react'
import Card from './Card'
import RecipeInfo from './RecipeInfo'
import IngredientsList from './IngredientsList'
import InstructionsList from './InstructionsList'
import RecipeImg from './RecipeImg'
import './RecipeCard.css'
import UserRating from '../UserRating'
import {RECIPE} from './recipe-data'

const RecipeCard = () => {
  return (
    <div>
      <Card>
        <RecipeImg imgSrc={RECIPE.imgSrc} />
        <div className="card_text">
          <RecipeInfo title={RECIPE.title} description={RECIPE.description} />
          <UserRating />
          <div className="card_lists">
            <IngredientsList data={RECIPE.ingredients} />
            <InstructionsList data={RECIPE.instructions} />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default RecipeCard
