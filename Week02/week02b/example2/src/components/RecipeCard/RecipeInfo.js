// import './RecipeCard.css'
// to use css modules you mus rename your css sheet {title}.module.css
import styles from './RecipeCard.module.css'

// const props = {
//   title: 'Buttermilk',
//   decription: 'blah blah',
// }

const RecipeInfo = (props) => {
  const {title, description} = props

  return (
    <div className={styles.recipe_info}>
      <h2 classNames={styles.recipe_title}>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export default RecipeInfo
