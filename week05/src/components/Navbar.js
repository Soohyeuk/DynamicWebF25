import Panel from './Panel'
import { Link, NavLink } from 'react-router'
import cx from 'classnames'
import { useState } from 'react'

const Navbar = () => {
//   const activeClass = 'text-blue-500 font-bold decoration-solid'
//   const pendingClass = 'text-red-500'

  return (
    <Panel className="sticky top-0 overflow-y-scroll flex flex-col item-start">
        <Link className="text-blue-500" to="/">Buttons</Link>
        <Link className="text-blue-500" to="/dropdown">Dropdown</Link>
        <Link className="text-blue-500" to="/accordion">Accordion</Link>
    </Panel>
    // <Panel className="sticky top-0 overflow-y-scroll flex flex-col item-start">
    //   <NavLink className={cx(({isActive, isPending}) => 
    //         isPending ? pendingClass : isActive ? activeClass : 'text-blue-500')} to="/">Buttons</NavLink>

    //   <NavLink className={cx(({isActive, isPending}) => 
    //         isPending ? pendingClass : isActive ? activeClass : 'text-blue-500')} to="/dropdown">Dropdown</NavLink>

    //   <NavLink className={cx(({isActive, isPending}) => 
    //         isPending ? pendingClass : isActive ? activeClass : 'text-blue-500')} to="/accordion">Accordion</NavLink>
    // </Panel>
  )
}

export default Navbar
