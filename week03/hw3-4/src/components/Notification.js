import cx from 'classnames'
import { twMerge } from 'tailwind-merge'
import PropTypes from 'prop-types'

const Notification = (props) => {
  const { 
    children,
    success,
    warning,
    error,
    info,
    rounded,
    outline,
    onDismiss,
  } = props

  // validation: only one type can be true
  const count =
    Number(!!success) +
    Number(!!warning) +
    Number(!!error) +
    Number(!!info)

  if (count > 1) {
    console.warn(
      'Pick only ONE notification type: success, warning, error, info.'
    )
  }

  const baseClass = 'w-[400px] h-[300px] border font-medium shadow-lg relative flex flex-col justify-center items-center text-center p-6'
  const classes = twMerge(
    cx(baseClass, {
      // color variants
      'bg-green-500 border-green-600 text-white': success,
      'bg-yellow-400 border-yellow-500 text-black': warning,
      'bg-red-500 border-red-600 text-white': error,
      'bg-blue-500 border-blue-600 text-white': info,

      // outline styles
      'bg-white': outline,
      'text-green-600': outline && success,
      'text-yellow-500': outline && warning,
      'text-red-600': outline && error,
      'text-blue-600': outline && info,

      // optional rounded
      'rounded-lg': rounded,
    })
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={classes}>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-current opacity-70 hover:opacity-100 transition-opacity text-2xl leading-none"
          >
            ×
          </button>
        )}
        <div className="text-lg">
          {children}
        </div>
      </div>
    </div>
  )
}

Notification.propTypes = {
  success: PropTypes.bool,
  warning: PropTypes.bool,
  error: PropTypes.bool,
  info: PropTypes.bool,
  rounded: PropTypes.bool,
  outline: PropTypes.bool,
  onDismiss: PropTypes.func,
}

export default Notification
