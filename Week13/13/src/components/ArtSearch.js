import {useDispatch, useSelector} from 'react-redux'
import {changeSearchTerm} from '../store'

//component for searching through the art collection
const ArtSearch = () => {
  const dispatch = useDispatch()

  //reads the current search term from the redux store
  const searchTerm = useSelector((state) => {
    return state.art.searchTerm
  })

  //updates the search term in the store when the input changes
  const handleSearchTermChange = (event) => {
    dispatch(changeSearchTerm(event.target.value))
  }

  //renders the header and search input field
  return (
    <div>
      <div className="flex flex-row justify-between px-3">
        <h3 className="text-xl">My Art Collection</h3>
        <div>
          <label>Search: </label>
          <input
            type="text"
            className="border border-2 rounded border-slate-500"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        </div>
      </div>
    </div>
  )
}

export default ArtSearch
