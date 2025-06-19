import React, { useState } from 'react'
import employeeData from '../data'
import EmployeeRow from './EmployeeRow';
import Header from './Header';
import Pagination from './Pagination';

const EmployeeTable = () => {
    const [employee, setEmployee] = useState(employeeData)

    return (
    
    <div className='container'>
        <Header />
        
        <table>
            <thead>
                <tr>

                    <th><input type="checkbox" /></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                    {employee.map(emp =>(
                        <EmployeeRow key={emp.id} employee={emp} />
                    ))}
                </tbody>
        </table>
        <Pagination/>
    </div>
  )
}

export default EmployeeTable