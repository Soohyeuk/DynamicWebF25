import React from 'react'
import './RecipeCard.css';

// const prop = {
// title: "buttermilk",
// description: "desc", 
// }

const RecipeInfo = (props) => {
    const {title, description} = props;
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export default RecipeInfo
