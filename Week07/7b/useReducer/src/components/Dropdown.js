import {useState, useEffect, useRef} from 'react'

import {GoChevronDown} from 'react-icons/go'
import Panel from './Panel'

const Dropdown = (props) => {
  const {options, onChange, value} = props
  const [isOpen, setIsOpen] = useState(false)

  const divEl = useRef()
  //ref to the dropdown's outer DOM node.
  //we use this to detect clicks that happen OUTSIDE the dropdown.
  //see JSX below where the outer <div> gets ref={divEl}.

  //about useEffect:
  // - With []: runs once on mount (ideal for adding listeners or fetching).
  // - With [deps]: runs when any dependency changes.
  // - With no deps: runs on every render (not what we want for listeners).
  //if the effect returns a function, React runs it on unmount to clean up.

  /*
  In this component we attach a document click listener that checks whether
  the click happened outside the dropdown. If so, close it.
  Include divEl in the dependency array so the effect always uses the current ref
  across unmounts/remounts.
  */
  useEffect(() => {
    //close the dropdown when clicking anywhere outside of the root element.
    const handler = (event) => {
      //ensure the ref exists and that the root DOES NOT contain the target.
      if (divEl.current && !divEl.current.contains(event.target)) {
        setIsOpen(false)
        console.log('clicked outside dropdown')
      }
    }

    //attach a document-level click listener to detect outside clicks.
    document.addEventListener('click', handler, true)

    //using an effect (with []) prevents re-attaching on every render.

    //cleanup: remove the listener when the component unmounts.
    //the function returned by the effect runs during cleanup.
    return () => {
      document.removeEventListener('click', handler)
    }
  }, [divEl])

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option) => {
    setIsOpen(false)
    //need some other function defined by the
    //parent component passed in as a prop to call here
    onChange(option)
  }

  const renderedOptions = options.map((opt, index) => {
    //render one clickable row per option; clicking selects and closes.
    return (
      <div
        onClick={() => handleOptionClick(opt)}
        key={index}
        className="hover:bg-sky-100 rounded cursor-pointer p-1"
      >
        {opt.label}
      </div>
    )
  })

  return (
    <div ref={divEl} className="w-48 relative">
      <Panel
        onClick={handleClick}
        className="flex justify-between items-center cursor-pointer"
      >
        {/*if a value is selected, show its label; otherwise show a placeholder. */}
        {value ? value.label : 'Select...'} <GoChevronDown />
      </Panel>
      {isOpen && <Panel className="absolute top-full">{renderedOptions}</Panel>}
    </div>
  )
}

/* Moved to its own file.
const Panel = (props) => {
  const {className, children, ...rest} = props
  const finalClassNames = cx(
    className,
    'border rounded p-3 shadow bg-white w-full'
  )
  return (
    <div {...rest} className={finalClassNames}>
      {children}
    </div>
  )
}

// named export
export {Panel}
*/

// Default export
export default Dropdown
