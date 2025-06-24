import React from 'react'

const EmployeeRow = ({employee, isSelected, onCheckboxChange, onDelete, onEdit, onMail}) => {
  return (
    <tr>
        <td><input className='check' type="checkbox" checked={isSelected} onChange={onCheckboxChange} /></td>
        <td><img src={employee.image}alt={employee.name} style={{ width: "40px", height: "40px", borderRadius: "50%" }} /></td>
        <td>{employee.name}</td>
        <td>{employee.email}</td>
        <td>{employee.address}</td>
        <td>{employee.phone}</td>
        <td className='actions'>
            <button onClick={onEdit}>✏️</button>
            <button onClick={onDelete}>🗑️</button>
            <button onClick={onMail}>📧</button>
        </td>
    </tr>
  )
}

export default EmployeeRow