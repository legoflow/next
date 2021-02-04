import React from 'react'
import logo from '@/images/logo.svg'
import '@/styles/main.scss'

const App: React.FC = () => {
  return (
    <div className="app">
      <img src={logo} alt="logo" />
      <h1>React From LegoFlow</h1>
    </div>
  )
}

export default App
