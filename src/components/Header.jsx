import React from 'react'

const Header = ({disabledDelete, disabledMail, onDelete, onAddEmployee, openMailModal}) => {
  return (
    <div className='header'>
        <h1>Manage Employees</h1>
        <div className='action-bar'>
          <button className='mail-btn' disabled={disabledMail} onClick={disabledMail? undefined: openMailModal}>Mail</button>
          <button className='delete-btn' disabled={disabledDelete} onClick={disabledDelete? undefined: onDelete}>Delete</button>
          <button className='add-btn' onClick={onAddEmployee}>Add New Employee</button>
        </div>
    </div>
  )
}

export default Header 