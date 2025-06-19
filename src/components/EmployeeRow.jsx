import React from 'react'

const EmployeeRow = ({employee}) => {
  return (
    <tr>
        <td><input type="checkbox" /></td>
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