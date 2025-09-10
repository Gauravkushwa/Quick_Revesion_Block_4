import React from 'react'
import Parent from './parent'

const GrandParent = ({name}) => {
  return (
    <div>
      <Parent name={name} />
    </div>
  )
}

export default GrandParent
