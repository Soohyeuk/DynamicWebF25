import {createContext, useState} from 'react'

const TodosContext = createContext()

const Provider = ({children}) => {
  const [todos, setTodos] = useState([])

  const createTodo = (title) => {
    const updatedTodos = [
      ...todos,
      {id: Math.round(Math.random() * 9999), title},
    ]
    setTodos(updatedTodos)
  }

  const deleteTodoById = (id) => {
    const updatedTodos = todos.filter((todo) => {
      return todo.id !== id
    })
    setTodos(updatedTodos)
  }

  const editTodoById = (id, newTitle) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          title: newTitle,
        }
      }
      return todo
    })

    setTodos(updatedTodos)
  }

  const valuesToShare = {
    todos,
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


