import React, { useCallback, useContext } from 'react'
import { AuthContext } from '../contexts/AuthProvider'

const Main = () => {
    const {auth} = useContext(AuthContext)
  return (
    <div>
      <h2>{auth ? "✅ You are Successfully Login enjoy Exploring the App" : "❎ You are Not Login Please Login First To Explore the Content"}</h2>
    </div>
  )
}

export default Main
