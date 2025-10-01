import {useState} from 'react'
import Dropdown from '../components/Dropdown'

const OPTIONS = [
  {label: 'Red', value: 'red'},
  {label: 'Green', value: 'green'},
  {label: 'Blue', value: 'blue'},
]

const COLOR_MAP = {
  red: 'bg-red-500',
  green: 'bg-green-400',
  blue: 'bg-blue-500',
}

// COLOR_MAP can be used like this: 
// 1. COLOR_MAP[value.value]
// 2.const color = 'red-' + value?.value + '-500'
// 3. const colorClass = `bg-${value?.value}-500`

const DATA_TO_FILTER = [
  {id: 1, name: 'katie', team: 'red'},
  {id: 2, name: 'tony', team: 'green'},
  {id: 3, name: 'amy', team: 'blue'},
  {id: 4, name: 'andy', team: 'red'},
  {id: 5, name: 'pete', team: 'green'},
]

const DropdownPage = () => {
  // this state stores the selected value from the dropdown.
  // it’s managed in the parent component so both the parent and its children can access, update, and re-render based on its value.

  let filteredData = DATA_TO_FILTER
  const [value, setValue] = useState(null)

  // if the user selected an option from our dropdown, find the value key, if they exist within the object
  if (value?.value) {
    // filter the array by value of selected option
    filteredData = DATA_TO_FILTER.filter(
      (student) => student.team === value.value
    )
  }

  const handleChange = (option) => {
    setValue(option)
  }

  return (
    <div>
      <h1 className={COLOR_MAP[value?.value] || null}>
        Dropdown page with user selectd value of: {value?.label}
      </h1>

      <Dropdown options={OPTIONS} onChange={handleChange} value={value} />

      <h2 className={COLOR_MAP[value?.value]}>Students from {value?.label}:</h2>

      {/* js expression written inside of jsx */}
      {filteredData.map((student) => {
        return <p key={student.id}>{student.name}</p>
      })}
    </div>
  )
}

export default DropdownPage
