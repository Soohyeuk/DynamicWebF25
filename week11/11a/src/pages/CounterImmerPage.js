import {useReducer} from 'react'
import {produce} from 'immer'
import Panel from '../components/Panel'
import Button from '../components/Button'

//use action type constants so we don't rely on hard-coded strings that are easy to mistype
const INCREMENT_COUNT = 'increment'
const DECREMENT_COUNT = 'decrement'
const SET_VALUE_TO_ADD = 'set-value-to-add'
const ADD_VALUE_TO_COUNT = 'add-value-to-count'

const reducer = (state, action) => {
  switch (action.type) {
    case INCREMENT_COUNT:
      //because our reducer is wrapped with immer's produce helper,
      //we can mutate state directly and immer will create the next immutable state for us
      state.count = state.count + 1
      return
    case DECREMENT_COUNT:
      state.count = state.count - 1
      return
    case SET_VALUE_TO_ADD:
      state.valueToAdd = action.payload
      return
    case ADD_VALUE_TO_COUNT:
      state.count = state.count + state.valueToAdd
      state.valueToAdd = 0
      return
    default:
      return
  }
}

const CounterReducerPage = () => {
  const [state, dispatch] = useReducer(produce(reducer), {
    count: 0,
    valueToAdd: 0,
  })

  const handleIncrement = () => {
    dispatch({type: INCREMENT_COUNT})
  }

  const handleDecrement = () => {
    dispatch({type: DECREMENT_COUNT})
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    //in the useState version, we'd add the user-entered value to the count...
    //setCount(count + valueToAdd)
    //...then reset the input value back to 0:
    //setValueToAdd(0)
    //with this reducer setup, we don't need extra payload data here
    //because both values already live in state and are handled inside the reducer

    dispatch({type: ADD_VALUE_TO_COUNT})
  }

  const handleChange = (event) => {
    const value = parseInt(event.target.value) || 0

    dispatch({type: SET_VALUE_TO_ADD, payload: value})
  }
  return (
    <Panel>
      <h1>Count is currently {state.count}</h1>
      <div className="flex flex-row">
        <Button success rounded onClick={handleIncrement} className="mr-4">
          Increment
        </Button>
        <Button danger rounded onClick={handleDecrement}>
          Decrement
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className="p-1 m-4 bg-slate-50 border border-slate-300"
          type="number"
          onChange={handleChange}
          value={state.valueToAdd || ''}
        />
        <Button primary rounded>
          Add Custom Amount!
        </Button>
      </form>
    </Panel>
  )
}

export default CounterReducerPage
