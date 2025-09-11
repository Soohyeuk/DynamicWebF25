import { useState } from 'react'
//useState() is a React Hook that allows us to store a value in a variable and update it
//essentially it helps a re-render of a component when the value of the variable changes
//rather than re-rendering the whole component or the whole app 

const Counter = () => {
  const [counter, setCounter] = useState(0) //destructuring the useState hook, counter is the value, setCounter is the function to update the value

  const handleIncrement = () => {
    //we don't use state update directly, we use the setCounter function
    setCounter(counter + 1)
  }

  const handleDecrement = () => {
    if (counter > 0) {
        setCounter(counter - 1)
    }
  }

  return (
    <div>
      <h1>Counter: {counter}</h1>
      <button onClick={handleDecrement}>[-]</button>
      <button onClick={handleIncrement}>[+]</button>
    </div>
  )
}

export default Counter
