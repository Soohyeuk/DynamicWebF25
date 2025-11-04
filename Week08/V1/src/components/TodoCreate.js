import {useState} from 'react'

const TodoCreate = ({onCreate}) => {
  const [title, setTitle] = useState('')

  const handleChange = (e) => {
    setTitle(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate(title)
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
