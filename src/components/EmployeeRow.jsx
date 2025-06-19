import React from 'react'

const EmployeeRow = ({employee, isSelected, onCheckboxChange}) => {
  return (
    <tr>
        <td><input className='check' type="checkbox" checked={isSelected} onChange={onCheckboxChange} /></td>
        <td>{employee.name}</td>
        <td>{employee.email}</td>
        <td>{employee.address}</td>
        <td>{employee.phone}</td>
        <td className='actions'>
            <button>✏️</button>
            <button>🗑️</button>
        </td>
    </tr>
  )
}

export default EmployeeRow