import './RecipeCard.css'

const IngredientsList = (props) => {
  const {data} = props
  return (
    <div className="ingredients_list">
      <h3 className="list_title">Ingredients</h3>
      <ul>
        {data.map((item, index) => {
          return (
            <li key={index} className="list_item">
              {item}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default IngredientsList
