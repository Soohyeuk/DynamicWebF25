import {createContext, useState, useEffect} from 'react'

const NavigationContext = createContext()

const NavigationProvider = ({children}) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  // track back button usage by updating currentPath
  useEffect(() => {
    // register an event listener to store the current path in state
    const handler = () => {
      setCurrentPath(window.location.pathName)
    }
    // listen for user interactions with our routes
    // popState runs when the user presses the browser's back button
    window.addEventListener('popState', handler)

    // when we use useEffect to add an event listener, we always return a cleanup function
    return () => {
      window.removeEventListener('popState', handler)
    }
  }, [])

  // we also need a function to help us navigate around normally
  const navigate = (to) => {
    // this takes care of the browser navbar
    window.history.pushState({}, '', to)
    // we also need to update our currentPath in state so that our app rerenders and shows the new page
    setCurrentPath(to)
  }

  return (
    <NavigationContext.Provider value={{currentPath, navigate}}>
      {currentPath}
      {children}
    </NavigationContext.Provider>
  )
}

export {NavigationProvider}
export default NavigationContext
