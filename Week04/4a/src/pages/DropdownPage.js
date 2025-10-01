import React from 'react'
import Dropdown from '../components/Dropdown'
// import {Panel} from '../components/Dropdown'


const OPTIONS = [
  {label: 'Red', value: 'red'},
  {label: 'Green', value: 'green'},
  {label: 'Blue', value: 'blue'},
]

const DropdownPage = () => {
  return (
    <div>
      <Dropdown options={OPTIONS} />
    </div>
  )
}

export default DropdownPage