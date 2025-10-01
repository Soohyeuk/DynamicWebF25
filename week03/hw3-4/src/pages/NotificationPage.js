import { useState } from 'react'
import Notification from '../components/Notification'
import Button from '../components/Button'

export default function Page() {
  const [showNotification, setShowNotification] = useState(false)
  const [notificationType, setNotificationType] = useState(null)

  const handleButtonClick = (type) => {
    setNotificationType(type)
    setShowNotification(true)
  }

  const dismissNotification = () => {
    setShowNotification(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Notification Demo
        </h1>
        
        <div className="grid grid-cols-2 gap-4">
          <Button success onClick={() => handleButtonClick('success')}>
            Success Notification
          </Button>
          
          <Button warning onClick={() => handleButtonClick('warning')}>
            Warning Notification
          </Button>
          
          <Button danger onClick={() => handleButtonClick('error')}>
            Error Notification
          </Button>
          
          <Button primary onClick={() => handleButtonClick('info')}>
            Info Notification
          </Button>
        </div>

        {/* Notification Popup */}
        {showNotification && (
          <Notification 
            success={notificationType === 'success'}
            warning={notificationType === 'warning'}
            error={notificationType === 'error'}
            info={notificationType === 'info'}
            rounded
            onDismiss={dismissNotification}
          >
            {notificationType === 'success' && 'Operation completed successfully!'}
            {notificationType === 'warning' && 'Warning: Check your inputs again.'}
            {notificationType === 'error' && 'Error: Something went wrong.'}
            {notificationType === 'info' && 'FYI: New updates are available.'}
          </Notification>
        )}
      </div>
    </div>
  )
}
