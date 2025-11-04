import {createContext, useState, useCallback} from 'react'
import axios from 'axios'
// Shared todos context for the app's consumers.
// Exported as default for convenient imports.
const TodosContext = createContext()

const Provider = ({children}) => {
  const [todos, setTodos] = useState([])

  const fetchTodos = useCallback(async () => {
    const response = await axios.get('http://localhost:3001/todos')
    setTodos(response.data)
  }, [])
  // Alternative example of memoizing an existing function:
  // const stableFetchTodos = useCallback(fetchTodos, [])

  const createTodo = async (title) => {
    const response = await axios.post('http://localhost:3001/todos', {
      title,
    })

    const updatedTodos = [...todos, response.data]
    setTodos(updatedTodos)
  }

  const deleteTodoById = async (id) => {
    // Delete todo on the API
    await axios.delete(`http://localhost:3001/todos/${id}`)
    // Update local state by filtering out the removed todo
    const updatedTodos = todos.filter((todo) => {
      return todo.id !== id
    })
    setTodos(updatedTodos)
  }

  const editTodoById = async (id, newTitle) => {
    const response = await axios.put(`http://localhost:3001/todos/${id}`, {
      title: newTitle,
    })
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          ...response.data,
        }
      }
      return todo
    })

    setTodos(updatedTodos)
  }

  const valuesToShare = {
    todos,
    fetchTodos,
    createTodo,
    deleteTodoById,
    editTodoById,
  }

  return (
    <TodosContext.Provider value={valuesToShare}>
      {children}
    </TodosContext.Provider>
  )
}

export {Provider}
export default TodosContext
