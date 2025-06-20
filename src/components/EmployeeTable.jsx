import React, { useEffect, useState } from 'react'
import employeeData from '../data'
import EmployeeRow from './EmployeeRow';
import Header from './Header';
import Pagination from './Pagination';
import EmployeeFormModal from './EmployeeFormModal';

const EmployeeTable = () => {
    const [employee, setEmployee] = useState(() => {
        const stored = localStorage.getItem('employees')
        let initial = stored? JSON.parse(stored) : employeeData

        initial = initial.map((emp, idx) => ({
            ...emp, 
            id: emp.id ?? idx+1
        }))

        return initial
    })
    const [selectedEmployees, setSelectedEmployees] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState(null)

    useEffect(() => {
      localStorage.setItem('employees', JSON.stringify(employee))

    }, [employee])
    

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

    const handleConfirmAdd = (formData) => {
        if(editingEmployee){
            const updated = employee.map(emp => emp.id === editingEmployee.id ? {...formData, id: editingEmployee.id}: emp)
            setEmployee(updated)
            setEditingEmployee(null)

        }else{
            const id = Math.max(...employee.map(emp => emp.id)) + 1
            const updated = [...employee, { ...formData, id}]
            setEmployee(updated) 
            setShowModal(false)
        }

        setShowModal(false)
    }

    const handleCancelAdd = () => {
        setShowModal(false)
        setEditingEmployee(null)
    }

    const handleDeleteOne = (id) => {
        const confirmDelete = window.confirm("Do you want to delete the record")
        if(confirmDelete){

            setEmployee(employee.filter(emp => emp.id !== id))
        }
    }

    const handleEditEmployee = (id) => {
        setEditingEmployee(employee.find(emp => emp.id === id))
        setShowModal(true)
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
                            onDelete={() => handleDeleteOne(emp.id)}
                            onEdit={() => handleEditEmployee(emp.id)}
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
                    editingEmployee={editingEmployee}
                />
        )}

    </div>
  )
}

export default EmployeeTable