import {configureStore} from '@reduxjs/toolkit'
//imports actions and reducers from the slices for reuse and reexport
import {
  artReducer,
  addArt,
  removeArt,
  changeSearchTerm,
} from './slices/artSlice'
import {formReducer, changeName, changePrice} from './slices/formSlice'

//configures redux store
const store = configureStore({
  reducer: {
    art: artReducer,
    form: formReducer,
  },
})

//single access point for all imports from store
export {store, changeName, changePrice, addArt, removeArt, changeSearchTerm}
