import React from 'react'
import logo from '@/images/logo.svg'
import styles from '@/app.scss?modules'

const App: React.FC = () => {
  return (
    <div className={ styles.app }>
      <img src={logo} alt="logo" />
      <h1>React From LegoFlow</h1>
    </div>
  )
}

export default App
