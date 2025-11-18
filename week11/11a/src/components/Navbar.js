import React from 'react'
import cx from 'classnames'
import {NavLink, Link} from 'react-router-dom'

import Panel from './Panel'

const Navbar = () => {
  //const activeClass = 'text-blue-500 font-bold decoration-solid'
  //const pendingClass = 'text-red-500'

  return (
    <Panel className="sticky top-0 overflow-y-scroll flex flex-col item-start">
      <Link to="/" className="text-blue-500">
        {' '}
        Buttons
      </Link>
      <Link to="/accordion" className="text-blue-500">
        Accordion
      </Link>
      <Link to="/dropdown" className="text-blue-500">
        Dropdown
      </Link>
      <Link to="/modal" className="text-blue-500">
        Modal
      </Link>
      <Link to="/counter" className="text-blue-500">
        Counter
      </Link>
      {/* Add link to your component page for HW */}
    </Panel>

    //bonus hw: figure out navlink and active class extra credit
    //<Panel className="sticky top-0 overflow-y-scroll flex flex-col item-start">
    //<NavLink
    //to="/"
    //className={cx(
    //({isActive, isPending}) =>
    //isPending ? pendingClass : isActive ? activeClass : '',
    //'text-blue-500'
    //)}
    //>
    //buttons
    //</NavLink>
    //<NavLink
    //to="/accordion"
    //className={cx(
    //({isActive, isPending}) =>
    //isPending ? pendingClass : isActive ? activeClass : '',
    //'text-blue-500'
    //)}
    //>
    //accordion
    //</NavLink>
    //<NavLink
    //to="/dropdown"
    //className={cx(
    //({isActive, isPending}) =>
    //isPending ? pendingClass : isActive ? activeClass : '',
    //'text-blue-500'
    //)}
    //>
    //dropdown
    //</NavLink>
    //{/* Add link here to the component page you made for HW */}
    //</Panel>
  )
}

export default Navbar
