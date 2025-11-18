import {configureStore, createSlice} from '@reduxjs/toolkit'
//a slice is similar to a dedicated reducer/useReducer pair for one part of the state tree
const songSlice = createSlice({
  name: 'song',
  initialState: [],
  reducers: {
    //action types are generated as "<sliceName>/<reducerFunctionName>"
    addSong(state, action) {
      //redux toolkit uses immer, so we can write "mutating" code here
      state.push(action.payload)
    },
    removeSong(state, action) {
      //action.payload is the name of the song we want to remove
      //find the index of the song passed via payload
      const index = state.indexOf(action.payload)
      //use array.splice() to remove the item at that index
      state.splice(index, 1)
    },
  },
})

//register your slices here by key to build the application-wide store
const store = configureStore({
  reducer: {
    songs: songSlice.reducer,
  },
})

//export the configured store so it can be used throughout the app
export {store}
//destructure and export the action creators generated from songSlice.actions
export const {addSong, removeSong} = songSlice.actions
