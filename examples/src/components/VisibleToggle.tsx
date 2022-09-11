import React, { useState } from 'react'

function VisibleToggle({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  return (
    <div>
      <button onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'Show'}</button>
      {visible ? children : null}
    </div>
  )
}

export default VisibleToggle
