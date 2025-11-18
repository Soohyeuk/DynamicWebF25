import {useReducer} from 'react'
import Panel from '../components/Panel'
import Button from '../components/Button'

//define action type constants so we don't depend on fragile string literals that can be mistyped
const INCREMENT_COUNT = 'increment'
const DECREMENT_COUNT = 'decrement'
const SET_VALUE_TO_ADD = 'set-value-to-add'
const ADD_VALUE_TO_COUNT = 'add-value-to-count'

const reducer = (state, action) => {
  switch (action.type) {
    case INCREMENT_COUNT:
      return {
        ...state,
        count: state.count + 1,
      }
    case DECREMENT_COUNT:
      return {
        ...state,
        count: state.count - 1,
      }
    case SET_VALUE_TO_ADD:
      return {
        ...state,
        valueToAdd: action.payload,
      }
    case ADD_VALUE_TO_COUNT:
      return {
        ...state,
        count: state.count + state.valueToAdd,
        valueToAdd: 0,
      }
    default:
      return state
  }
}

const CounterReducerPage = () => {
  const [state, dispatch] = useReducer(reducer, {
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
    //in the useState version, we'd add the user's input to the count:
    //setCount(count + valueToAdd)
    //and then clear the input by resetting valueToAdd:
    //setValueToAdd(0)
    //with this reducer design, the reducer already has both pieces of data in state,
    //so the action doesn't need an additional payload here

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
