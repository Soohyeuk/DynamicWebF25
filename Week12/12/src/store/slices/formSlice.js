import {createSlice} from '@reduxjs/toolkit'
import {addArt} from './artSlice'

const formSlice = createSlice({
  name: 'form',
  initialState: {
    name: '',
    price: 0,
  },
  //list of mini reducer and action creator functions
  //all get combined by toolkit as formSlice.reducer
  reducers: {
    changeName(state, action) {
      //we are assuming here:
      //the name we want to change is coming in our action.payload
      //because of immer being used we can directly mutate state
      state.name = action.payload
    },
    changePrice(state, action) {
      state.price = action.payload
    },
  },
  //use extrareducers to reset form fields when the 'art/addArt' action type runs
  extraReducers(builder) {
    builder.addCase(addArt, (state, action) => {
      //we do not need the action payload here
      state.name = ''
      state.price = 0
    })
  },
})

export const {changeName, changePrice} = formSlice.actions //action creators
export const formReducer = formSlice.reducer
