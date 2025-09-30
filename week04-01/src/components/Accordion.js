import {useState} from 'react'
import {GoChevronDown, GoChevronLeft} from 'react-icons/go'
/*
const Props = {
  label: string,
  content: string,
  onClick: function,
}

// const state = {
//   isExpanded: false,
// }
*/

const DUMMYDATA = {
  id: 'l1kj2i0g',
  label: 'When do chickens molt?',
  content:
    'Duis eget turpis vel ligula imperdiet suscipit eu ut felis. Ut eget neque at ligula aliquam ultricies eu vitae dolor. Proin eu dignissim velit. Morbi convallis volutpat nisl at vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam non dignissim sem. Aliquam cursus, tortor at iaculis fermentum, felis tortor interdum justo, eu ornare lorem dui eu lorem. Phasellus nibh sem, tempus at fermentum vel, pulvinar at tellus. Nunc eleifend velit at massa bibendum placerat. Sed tincidunt vestibulum ante ut pellentesque. Duis eget nisl varius, dapibus nunc sed, aliquam diam',
}

const Accordion = (props) => {
  // pull out our props with destructuring
  // const {items} = props
  // state
  const [isExpanded, setIsExpanded] = useState(true)

  // event handling function
  const handleClick = () => {
    setIsExpanded(!isExpanded)
    // NEVER EVER EVER IN A MILLION YEARS EVER
    // isExpanded = !isExpanded
  }

  // YAY your first ternary (shorthand if/else)
  /*
    1 ? 2 : 3

   1- condition we are checking (like a boolean)
   2- what to return if 1 is true
   3- what to return if 1 is false
  */
  const icon = (
    <span className="text-2xl">
      {isExpanded ? <GoChevronDown /> : <GoChevronLeft />}
    </span>
  )

  // JSX returned and rendered to the user
  return (
    <div key={DUMMYDATA.id}>
      <div
        onClick={handleClick}
        className="flex justify-between items-center p-3 bg-gray-100 border-b cursor-pointer"
      >
        {DUMMYDATA.label}
        {icon}
      </div>
      {
        /* conditional rendering
          The content div will only render when isExpanded is true
          if isExpanded is false, dont render anything
        */

        isExpanded && <div className="border-b p-5">{DUMMYDATA.content}</div>
      }
    </div>
  )
}

export default Accordion
