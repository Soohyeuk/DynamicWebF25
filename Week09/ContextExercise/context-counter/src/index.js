import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
// import our context we just created to wrap the app
import {Provider} from './context/counter'

import './index.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
    {/* basically, this is like using Recoil or Redux library. By having something on top of our app, 
    it persists the data */}
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)
