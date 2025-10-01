import {useState} from 'react'
import cx from 'classnames'
import Panel from './Panel'
import {GoChevronDown} from 'react-icons/go'

const Dropdown = (props) => {
  const {options, onChange, value} = props

  // local state
  const [isOpen, setIsOpen] = useState(false)

  const handleOptionClick = (option) => {
    setIsOpen(false)
    // need some other func defined by the parent passed in as a prop to call here
    onChange(option)
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const renderedOptions = options.map((opt, index) => {
    return (
      <div onClick={() => handleOptionClick(opt)} key={index} className="hover:bg-sky-100 rounded cursor-pointer p-1">
        {opt.label}
      </div>
    )
  })

  return (
    <div className="w-48 relative">
      <Panel
        onClick={handleClick}
        className="flex justify-between items-center cursor-pointer"
      >
        {/* an example case of a ternary */}
        {value ? value.label : 'Select...'} <GoChevronDown />
      </Panel>
      {isOpen && <Panel className="absolute top-full">{renderedOptions}</Panel>}
    </div>
  )
}

// const Panel = (props) => {
//   const {className, children, ...rest} = props
//   const finalClassNames = cx(
//     className,
//     'border rounded p-3 shadow bg-white w-full'
//   )
//   return (
//     <div {...rest} className={finalClassNames}>
//       {children}
//     </div>
//   )
// }

// // named export
// export {Panel}

// default export (usually the file name should give you a hint about what to be the default export)
export default Dropdown
