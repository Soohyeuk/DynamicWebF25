// introduction to useReducer()
// useReducer() is a hook that allows us to manage state in a more sophisticated way
// it's more powerful than useState() because it allows us to update state in multiple ways

import {useReducer} from 'react'
import Panel from '../components/Panel'
import Button from '../components/Button'

const INCREMENT_COUNT = 'increment'
const DECREMENT_COUNT = 'decrement'
const SET_VALUE_TO_ADD = 'set-value-to-add'
const ADD_VALUE_TO_COUNT = 'add-value-to-count'

const reducer = (state, action) => {
  // state is now and object with key value pairs as state variables
  switch (action.type) {
    case INCREMENT_COUNT:
      return {
        // always copy in entire state object
        ...state,
        // then override/update individual key/values
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
      //fallback action
      return state
  }
  /* if else can be used, but switch is often faster and neater to read
  if (action.type === INCREMENT_COUNT) {
    return {
      // always copy in entire state object
      ...state,
      // then override/update individual key/values
      count: state.count + 1,
    }
  }
  if (action.type === SET_VALUE_TO_ADD) {
    return {
      ...state,
      valueToAdd: action.payload,
    }
  }

  // always have a fallback option (at least as the current state)
  // if not, it will be cleared out 
  return state

  */
}

const CounterPage = ({initialCount}) => {
  //basically like this, but more clean: 
  // const [count, setCount] = useState(initialCount)
  // const [valueToAdd, setValueToAdd] = useState(0)
  const [state, dispatch] = useReducer(reducer, {
    count: initialCount,
    valueToAdd: 0,
  })

  //these handle functions are way more manageable than the useState() version
  const handleIncrement = () => {
    // dispatch is how we update our state object, it only ever takes one argument, an action object
    // an action oject always needs a type key
    dispatch({type: INCREMENT_COUNT})
  }

  const handleDecrement = () => {
    dispatch({type: DECREMENT_COUNT})
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch({type: ADD_VALUE_TO_COUNT})
  }

  const handleChange = (event) => {
    const value = parseInt(event.target.value) || 0
    // console.log(value, typeof value)
    // setValueToAdd(value)
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
          value={state.valueToAdd || 'Put a number here...'}
        />
        <Button primary rounded>
          Add Custom Amount!
        </Button>
      </form>
    </Panel>
  )
}

export default CounterPage
