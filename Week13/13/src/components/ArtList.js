import {useSelector, useDispatch} from 'react-redux'
import {createSelector} from '@reduxjs/toolkit'
import {removeArt} from '../store'

//avoid storing data directly like this example
//{id: 345678, name: 'the scream', price: '1', bold: true}

const memoizedArt = createSelector(
  [(state) => state.art.data, (state) => state.art.searchTerm],
  (data, searchTerm) =>
    data.filter((art) =>
      art.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
)

const ArtList = () => {
  const dispatch = useDispatch()

  const artList = useSelector(memoizedArt)
  const name = useSelector((state) => state.form.name)

  //example of a less efficient selector kept here for reference

  const handleArtDelete = (art) => {
    dispatch(removeArt(art.id))
  }

  //this section controls how each art item is rendered
  const renderedArt = artList.map((art) => {
    //checks if the form name appears in the art name to decide bold style
    const bold = name && art.name.toLowerCase().includes(name.toLowerCase())

    return (
      <div
        key={art.id}
        className="border rounded flex flex-row justify-between items-center"
      >
        {/* &&  returns the last truthy value OR the first falsey value */}
        <p className={`${bold && 'font-bold'}`}>
          {art.name} - ${art.price}
        </p>
        <button
          onClick={() => handleArtDelete(art)}
          className="rounded bg-red-500 p-2 text-white"
        >
          Delete
        </button>
      </div>
    )
  })
  return <div>{renderedArt}</div>
}

export default ArtList
