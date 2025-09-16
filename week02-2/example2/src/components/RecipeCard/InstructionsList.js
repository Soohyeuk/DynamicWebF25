import './RecipeCard.css'

const InstructionsList = (props) => {
  const {data} = props
  return (
    <div className="intructions_list">
      <h3 className="list_title">Instructions</h3>
      <ol>
        {data.map((item, index) => {
          return (
            <li key={index} className="list_item">
              {item}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default InstructionsList
