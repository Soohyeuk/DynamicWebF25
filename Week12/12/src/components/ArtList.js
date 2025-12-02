import {useSelector} from 'react-redux'

const ArtList = () => {
  const artList = useSelector((state) => {
    return state.art.data
  })

  const renderedArt = artList.map((art) => {
    return (
      <div
        key={art.id}
        className="border rounded flex flex-row justify-between items-center"
      >
        <p>
          {art.name} - ${art.price}
        </p>
        <button className="rounded bg-red-500 p-2 text-white">Delete</button>
      </div>
    )
  })
  return <div>{renderedArt}</div>
}

export default ArtList
