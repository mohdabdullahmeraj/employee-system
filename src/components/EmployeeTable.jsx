import React, { useEffect, useState } from 'react'
import employeeData from '../data'
import EmployeeRow from './EmployeeRow';
import Header from './Header';
import Pagination from './Pagination';
import EmployeeFormModal from './EmployeeFormModal';
import ConfirmModal from './ConfirmModal';
import EmailModal from './EmailModal';
import emailjs from '@emailjs/browser'

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
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [modalMessage, setModalMessage] = useState("Are you sure?")
    const [modalMode, setModalMode] = useState("confirm")
    const [onModalConfirm, setOnModalConfirm] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const recordsPerPage = 5
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    const currentEmployees = employee.slice(startIndex, endIndex)
    const totalPages = Math.ceil(employee.length / recordsPerPage)
    const pages = Array.from({length: totalPages}, (_, i) => i+1)
    const [showMailModal, setShowMailModal] = useState(false)
    const [emailRecipients, setEmailRecipients] = useState([])
    const [isSending, setIsSending] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

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
        if(currentEmployees.every(emp => selectedEmployees.includes(emp.id))){
            setSelectedEmployees(prev => prev.filter(id => !currentEmployees.some(emp => emp.id === id)))
        }
        else{
            setSelectedEmployees(prev => [...new Set([...prev, ...currentEmployees.map(emp => emp.id)])])
        }
    }

    const handleDelete = () => {
        if(selectedEmployees.length === 1){
            const emp = employee.find(emp => emp.id === selectedEmployees[0])
            setModalMessage(`Do you want to delete the record, ${emp.name}`)
        }else{
            setModalMessage("Do you want to delete the records")
        }
        
        setModalMode("confirm")
        setOnModalConfirm(() => () => {
            const updateList = employee.filter(emp => !selectedEmployees.includes(emp.id))
            setEmployee(updateList)
            setSelectedEmployees([])
            setShowConfirmModal(false)
        })
        

        setShowConfirmModal(true)

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
        const emp = employee.find(emp => emp.id === id)
        setModalMessage(`Do you want to delete the record, ${emp.name}`)
        setModalMode("confirm")
        setOnModalConfirm(() => () => {
            setEmployee(employee.filter(emp => emp.id !== id))
            setShowConfirmModal(false)
        })

        setShowConfirmModal(true)
    }

    const handleEditEmployee = (id) => {
        setEditingEmployee(employee.find(emp => emp.id === id))
        setShowModal(true)
    }

    const handleMailEmployee = (id) => {
        const emp = employee.find(emp => emp.id === id)
        if(emp){
            setEmailRecipients([emp.email])
            setShowMailModal(true)
        }
    }

    const handleBulkMail = () => {
        const selectedEmails = employee.filter(emp => selectedEmployees.includes(emp.id)).map(emp => emp.email)
        setEmailRecipients(selectedEmails)
        setShowMailModal(true)
    }

    const handleMailSend = ({recipients, subject, body}) => {
        // console.log("Sending email to:", recipients)
        // console.log("Subject:", subject)
        // console.log("Body:", body)

        // setShowMailModal(false)
        if(recipients.length === 0){
            showAlert("No recipients to send email to.")
            return 
        }
        // setShowMailModal(false)

        const emailPromises = recipients.map((to_email) => {
            const templateParameters ={
                to_email,
                subject,
                message: body
            }

            return emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                templateParameters,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            )   
        })

        Promise.all(emailPromises)
            .then(() => {
                showAlert('Email(s) sent successfully!')
                setShowMailModal(false)
            })
            .catch((err) => {
                console.error('EmailJS error: ', err)
                setErrorMessage("❌ Failed to send email. Please try again.")
                showAlert("Some emails failed to send.")
            })
            .finally(() => {
                setIsSending(false)
            })
    }

    const showAlert = (message) => {
        setModalMessage(message)
        setModalMode("alert")
        setOnModalConfirm(null)
        setShowConfirmModal(true)
    } 
    return (
    
    <div className='container'>
        
        <Header 
            disabledDelete={selectedEmployees.length === 0} 
            onDelete={() => handleDelete()} 
            onAddEmployee={() => setShowModal(true)}
            openMailModal={() => handleBulkMail()}
            disabledMail={selectedEmployees.length === 0}
        />
        <div className="table-wrapper">

            <table>
                <thead>
                    <tr>

                        <th><input type="checkbox" checked={currentEmployees.every(emp => selectedEmployees.includes(emp.id))} onChange={handleSelectAll} /></th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                        {currentEmployees.map((emp) =>(
                            <EmployeeRow 
                            key={emp.id} 
                            employee={emp}
                            isSelected = {selectedEmployees.includes(emp.id)} 
                            onCheckboxChange = {() => handleCheckboxChange(emp.id)}
                            onDelete={() => handleDeleteOne(emp.id)}
                            onEdit={() => handleEditEmployee(emp.id)}
                            onMail={() => handleMailEmployee(emp.id)}
                            />
                        ))}
                    </tbody>
            </table>
        </div>
        <Pagination
            totalPages = {totalPages}
            currentPage = {currentPage}
            setCurrentPage = {setCurrentPage} 
            totalL ={employee.length}
            currentL ={currentEmployees.length}   
        />

        {showModal && (
                <EmployeeFormModal
                    onConfirm={handleConfirmAdd}
                    onClose={handleCancelAdd}
                    editingEmployee={editingEmployee}
                    showAlert={showAlert}
                />
        )}

        {showConfirmModal && (
                <ConfirmModal 
                    message={modalMessage}
                    onConfirm={onModalConfirm}
                    onCancel={() => setShowConfirmModal(false)}
                    mode={modalMode}

                />
        )}

        {showMailModal && (
            <EmailModal 
                recipients={emailRecipients}
                onSend = {handleMailSend}
                onClose = {() => setShowMailModal(false)}
                showAlert={showAlert}
                isSending={isSending}
                setIsSending={setIsSending}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
            />
        )}

    </div>
  )
}

export default EmployeeTable