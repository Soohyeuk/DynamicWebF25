// Simple example
// import { createContext } from 'react'
// const CounterContext = createContext() // creates a Context for our counter state
// Wrap your app (or a common parent) with the provider so any descendant
// that needs the counter can read it directly from the Context's value.
// This avoids prop drilling and keeps related state in one place.

// export default CounterContext

import {createContext, useState} from 'react'
const CounterContext = createContext()

function Provider({children}) {
  const [count, setCount] = useState(0)

  const handleIncrement = () => {
    setCount(count + 1)
  }

  const handleDecrement = () => {
    setCount(count - 1)
  }

  const valuesToShare = {
    count,
    handleIncrement,
    handleDecrement,
  }

  return (
    <CounterContext.Provider value={valuesToShare}>
      {children}
    </CounterContext.Provider>
  )
}

export {Provider}
export default CounterContext
