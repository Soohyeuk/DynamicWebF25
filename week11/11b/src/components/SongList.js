import {useDispatch, useSelector} from 'react-redux'
import {addSong, removeSong} from '../store'
import Button from './Button'
import Card from './Card'
import {FaPlus} from 'react-icons/fa'
import {IoClose} from 'react-icons/io5'

import {createRandomSong} from '../data'

export default function SongList() {
  const dispatch = useDispatch()
  //retrieve the current list of songs from the redux store
  //in redux, a selector is a function that takes (at least) state as an argument
  //and returns a specific, "selected" slice of that state
  const songPlaylist = useSelector((state) => {
    return state.songs
  })

  const handleSongAdd = (song) => {
    //add a song to the playlist and update the store
    /* const action = addSong(song)
    dispatch(action) */
    dispatch(addSong(song))
  }
  const handleSongRemove = (song) => {
    //remove a song from the playlist by dispatching an action
    dispatch(removeSong(song))
  }

  const renderedSongs = songPlaylist.map((song) => {
    return (
      <div key={song} className="flex flex-row justify-between">
        {song}
        <Button danger rounded onClick={() => handleSongRemove(song)}>
          <IoClose />
        </Button>
      </div>
    )
  })

  return (
    <Card className="my-4">
      <div className="flex flex-row justify-between p-3 border-b">
        <h2 className="text-xl">Songs to Listen To</h2>
        <Button
          success
          rounded
          onClick={() => handleSongAdd(createRandomSong())}
        >
          <FaPlus className="mr-3" />
          Add Song
        </Button>
      </div>
      <div className="p-5">{renderedSongs}</div>
    </Card>
  )
}
