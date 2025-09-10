import React, { useContext } from 'react'
import { DataContext } from '../contexts/APIProvider'
import './style.css'


const ContextConsume = () => {
  const { state, fetchData } = useContext(DataContext)
  return (
    <div className='container'>
      <button className='fetch-btn' onClick={fetchData}>Fetch Data </button>
      <div className="grid">
        {state.loading && <h2>Loading....</h2>}
        {state.data && state.data.map(user =>
          <div key={user.id} className='card'>
            <strong className='name'>{user.name.firstname + " " + user.name.lastname}</strong>
            <p className='address'>{user.address.city}</p>
            <h4 className='username'>{user.username}</h4>
            <p className='email'>{user.email}</p>
            <p className='password'>{user.password}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContextConsume
