import cx from 'classnames'
import PropTypes from 'prop-types'
// might need to install and import twMerge so that your white text does not overwrite my outline button text styles
// to install: npm i tailwind-merge
// then import it like this:
import { twMerge } from 'tailwind-merge'

// only need to import PropTypes here if we are using their PropType validation
// for example PropTypes.bool,
// import PropTypes from 'prop-types' // ES6

const Button = (props) => {
  const {
    children,
    primary,
    secondary,
    success,
    warning,
    danger,
    rounded,
    outline,
  } = props

  // we can put that same validation logic here and spit our a console.warning message when we accidentaly use 2 variant booleans
  const count =
    Number(!!primary) +
    Number(!!secondary) +
    Number(!!success) +
    Number(!!warning) +
    Number(!!danger)

  if (count > 1) {
    console.warn(
      'Only of one of those can be true...!'
    )
    //don't return anything, because that would exit the component function before we render anything, which is NOT GOOD 
  }

  const baseClass = 'flex items-center px-8 py-3 border'
  
  return (
    <button
      className={twMerge(
        cx(baseClass, {
          // color variants
          'bg-blue-500 border-blue-500 text-white': primary,
          'bg-gray-900 border-gray-900 text-white': secondary,
          'bg-green-500 border-green-500 text-white': success,
          'bg-orange-400 border-orange-500 text-white': warning,
          'bg-red-600 border-red-600 text-white': danger,
          // outline and rounded additional style props
          'rounded-full': rounded,
          'bg-white': outline,
          'text-blue-500': outline && primary,
          'text-gray-900': outline && secondary,
          'text-green-500': outline && success,
          'text-orange-400': outline && warning,
          'text-red-600': outline && danger,
        })
      )}
    >
      {children}
    </button>
  )
}

// validating props by type, this is the most common reason for using this library
// typscript is also used for this more recently and a lot more (I lowkey don't like TS, but it's good for these ig...)
Button.propTypes = {
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  success: PropTypes.bool,
  warning: PropTypes.bool,
  danger: PropTypes.bool,
  rounded: PropTypes.bool,
  outline: PropTypes.bool,
}

export default Button
