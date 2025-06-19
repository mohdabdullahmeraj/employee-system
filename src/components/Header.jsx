import React from 'react'

const Header = () => {
  return (
    <div className='header'>
        <h1>Manage Employees</h1>
        <div className='action-bar'>
          <button className='delete-btn'>Delete</button>
          <button className='add-btn'>Add New Employee</button>
        </div>
    </div>
  )
}

export default Header 