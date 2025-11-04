import {useState} from 'react'
import useTodosContext from '../hooks/use-todos-context'

const TodoCreate = () => {
  const {createTodo} = useTodosContext()
  const [title, setTitle] = useState('')

  const handleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    createTodo(title)
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={handleChange} />
      <button>Create Todo</button>
    </form>
  )
}

export default TodoCreate
