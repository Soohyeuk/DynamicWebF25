import cx from 'classnames'
import useNavigation from '../hooks/use-navigation'

// the link component is used to navigate to the path when clicked
const Link = (props) => {
  const {to, children, className, activeClassName} = props
  const {currentPath, navigate} = useNavigation()

  const handleClick = (event) => {
    event.preventDefault()
    navigate(to)
  }

  // add classes to the link
  const classes = cx(
    'text-blue-500',
    className,
    currentPath === to && activeClassName
  )

  return (
    <a href={to} onClick={handleClick} className={classes}>
      {children}
    </a>
  )
}

export default Link
