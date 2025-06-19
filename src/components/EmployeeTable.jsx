import React, { useState } from 'react'
import employeeData from '../data'
import EmployeeRow from './EmployeeRow';
import Header from './Header';
import Pagination from './Pagination';

const EmployeeTable = () => {
    const [employee, setEmployee] = useState(employeeData)
    const [selectedEmployees, setSelectedEmployees] = useState([])

    const handleCheckboxChange = (id) => {
        if(selectedEmployees.includes(id)){
            setSelectedEmployees(selectedEmployees.filter(empId => empId !== id))
        }else{
            setSelectedEmployees([...selectedEmployees, id])
        }
    }

    const handleSelectAll = () => {
        if(selectedEmployees.length === employee.length){
            setSelectedEmployees([])
        }
        else{
            setSelectedEmployees(employee.map(emp => emp.id))
        }
    }

    const handleDelete = () => {
        const updateList = employee.filter(emp => !selectedEmployees.includes(emp.id))
        setEmployee(updateList)
        setSelectedEmployees([])

    }

    return (
    
    <div className='container'>
        <Header disabledDelete={selectedEmployees.length === 0} onDelete={() => handleDelete()} />
        <div className="table-wrapper">

            <table>
                <thead>
                    <tr>

                        <th><input type="checkbox" checked={selectedEmployees.length === employee.length} onChange={handleSelectAll} /></th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                        {employee.map(emp =>(
                            <EmployeeRow 
                            key={emp.id} 
                            employee={emp}
                            isSelected = {selectedEmployees.includes(emp.id)} 
                            onCheckboxChange = {() => handleCheckboxChange(emp.id)}
                            />
                        ))}
                    </tbody>
            </table>
        </div>
        <Pagination/>
    </div>
  )
}

export default EmployeeTable