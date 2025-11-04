import {useState} from 'react'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'

function App() {
  const [todos, setTodos] = useState([])

  const createTodo = (title) => {
    // Don't do todos.push({title: title})
    // always create a new array by copying the old values and adding the new value
    const updatedTodos = [
      ...todos,
      {id: Math.round(Math.random() * 1000000), title},
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

  return (
    <div>
      <TodoCreate onCreate={createTodo} />
      <TodoList todos={todos} onDelete={deleteTodoById} onEdit={editTodoById} />
    </div>
  )
}

export default App
