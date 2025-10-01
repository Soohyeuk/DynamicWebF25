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
  id: 'kkkkkkk',
  label: 'When do chickens molt?',
  content:
    'Duis eget turpis vel ligula imperdiet suscipit eu ut felis. Ut eget neque at ligula aliquam ultricies eu vitae dolor. Proin eu dignissim velit. Morbi convallis volutpat nisl at vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam non dignissim sem. Aliquam cursus, tortor at iaculis fermentum, felis tortor interdum justo, eu ornare lorem dui eu lorem. Phasellus nibh sem, tempus at fermentum vel, pulvinar at tellus. Nunc eleifend velit at massa bibendum placerat. Sed tincidunt vestibulum ante ut pellentesque. Duis eget nisl varius, dapibus nunc sed, aliquam diam',
}

const Accordion = (props) => {
  // pull out our props with destructuring
  const [isExpanded, setIsExpanded] = useState(true)

  // event handling function
  const handleClick = () => {
    setIsExpanded(!isExpanded)
    //NEVER CHANGE THE isExpanded directly when it is a varialbe from useState
  }

  /*
  Ternary expression (used in JS; nasty to read imo)
    1 ? 2 : 3

   1- first if statement 
   2- if 1 is true
   3- if 1 is false
  */
  const icon = (
    <span className="text-2xl">
      {isExpanded ? <GoChevronDown /> : <GoChevronLeft />}
    </span>
  )

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
        /* conditional rendering; it will render if isExpanded is True 
        */

        isExpanded && <div className="border-b p-5">{DUMMYDATA.content}</div>
      }
    </div>
  )
}

export default Accordion