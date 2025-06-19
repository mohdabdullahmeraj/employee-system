import React, { useState } from 'react'
import employeeData from '../data'
import EmployeeRow from './EmployeeRow';
import Header from './Header';
import Pagination from './Pagination';
import EmployeeFormModal from './EmployeeFormModal';

const EmployeeTable = () => {
    const [employee, setEmployee] = useState(employeeData)
    const [selectedEmployees, setSelectedEmployees] = useState([])
    const [showModal, setShowModal] = useState(false)

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
        const confirmDelete = window.confirm("Do you want to delete the record")
        if(confirmDelete){

            const updateList = employee.filter(emp => !selectedEmployees.includes(emp.id))
            setEmployee(updateList)
            setSelectedEmployees([])
        }

    }

    const handleConfirmAdd = (newEmployee) => {
        const id = Math.max(...employee.map(emp => emp.id)) + 1
        const updated = [...employee, { ...newEmployee, id}]
        setEmployee(updated) 
        setShowModal(false)
    }

    const handleCancelAdd = () => {
        setShowModal(false)
    }

    return (
    
    <div className='container'>
        <Header 
            disabledDelete={selectedEmployees.length === 0} 
            onDelete={() => handleDelete()} 
            onAddEmployee={() => setShowModal(true)}
        />
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

        {showModal && (
                <EmployeeFormModal
                    onConfirm={handleConfirmAdd}
                    onClose={handleCancelAdd}
                />
        )}

    </div>
  )
}

export default EmployeeTable