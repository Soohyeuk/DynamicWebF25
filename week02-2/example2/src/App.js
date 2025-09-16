import RecipeCard from './components/RecipeCard'

const App = () => {
  return (
    <div className="app_wrapper">
      <header className="app_header">
        <h1 className="app_title">Recipe Explorer</h1>
      </header>
      <main className="app_main">
        <RecipeCard/>
      </main>
    </div>
  )
}

export default App
