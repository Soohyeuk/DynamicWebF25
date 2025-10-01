// import ButtonPage from './pages/ButtonPage'
// import AccordionPage from './pages/AccordionPage'
import DropdownPage from './pages/DropdownPage'
import { Routes, Route } from 'react-router'

import ButtonPage from './pages/ButtonPage'
import AccordionPage from './pages/AccordionPage'
import Navbar from './components/Navbar'
import './index.css'

import cx from 'classnames'

const App = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <Routes>
          <Route path="/dropdown" element={<DropdownPage />} />
          <Route path="/" element={<ButtonPage />} />
          <Route path="/accordion" element={<AccordionPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
