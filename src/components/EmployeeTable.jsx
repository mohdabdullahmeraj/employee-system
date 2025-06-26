import React, { useEffect, useState } from 'react'
import EmployeeRow from './EmployeeRow';
import Header from './Header';
import Pagination from './Pagination';
import EmployeeFormModal from './EmployeeFormModal';
import ConfirmModal from './ConfirmModal';
import EmailModal from './EmailModal';
import emailjs from '@emailjs/browser'
import SearchBar from './SearchBar';
import { API_BASE_URL } from '../constants';

const EmployeeTable = () => {
    
    const [employee, setEmployee] = useState([])
    const [isloading, setIsloading] = useState(true)

    useEffect(() =>{
        fetch(`${API_BASE_URL}/employees`)
            .then((res) => res.json())
            .then((data) => {
                setEmployee(data)
                setIsloading(false)
            })
            .catch((err) => {
                console.error("Failed to fetch employee data: ", err)
                setIsloading(false)
            })
    }, [])

    const [selectedEmployees, setSelectedEmployees] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [modalMessage, setModalMessage] = useState("Are you sure?")
    const [modalMode, setModalMode] = useState("confirm")
    const [onModalConfirm, setOnModalConfirm] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    
    const filteredEmployees = employee.filter(emp => {
        const query = searchQuery.toLowerCase()
        return (
            emp.name.toLowerCase().includes(query) ||
            emp.email.toLowerCase().includes(query) ||
            emp.phone.toLowerCase().includes(query)
        )
    })

    const [currentPage, setCurrentPage] = useState(1)
    const recordsPerPage = 5
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    const currentEmployees = filteredEmployees.slice(startIndex, endIndex)
    const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage)
    const pages = Array.from({length: totalPages}, (_, i) => i+1)
    const [showMailModal, setShowMailModal] = useState(false)
    const [emailRecipients, setEmailRecipients] = useState([])
    const [isSending, setIsSending] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])
    

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
            const deletePromises = selectedEmployees.map(id =>
                    fetch(`${API_BASE_URL}/employees/${id}`, {
                    method: 'DELETE'
                })
            )

            Promise.all(deletePromises)
                .then(responses => {
                    if(responses.some(res => !res.ok)){
                        throw new Error("One or more deletions failed")
                    }
                const updateList = employee.filter(emp => !selectedEmployees.includes(emp.id))
                setEmployee(updateList)
                setSelectedEmployees([])
                setShowConfirmModal(false)
                    
                })
                .catch(err => {
                    console.error('Error deleting employee:', err)
                    showAlert("❌ Failed to delete employee. Please try again.")
                })

        })
        

        setShowConfirmModal(true)

    }

    const handleConfirmAdd = (formData) => {
        if(editingEmployee){
            fetch(`${API_BASE_URL}/employees/${editingEmployee.id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(res => {
                if(!res.ok){
                    throw new Error('Failed to edit employee')
                }
                return res.json()
            })
            .then(updateEmployee => {
                setEmployee(prev => 
                    prev.map(emp => 
                        emp.id === updateEmployee.id ? updateEmployee : emp
                    )
                )
                setEditingEmployee(null)
                setShowModal(false)
            })  
            .catch(err => {
                console.error("Error updating employee:", err)
                showAlert("❌ Failed to update employee. Please try again.")
            })
            

        }else{
            fetch(`${API_BASE_URL}/employees/`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(res => {
                if(!res.ok){
                    throw new Error('Failed to add employee')
                }
                return res.json()
            })
            .then(newEmployee => {
                setEmployee(prev => [...prev, newEmployee])
                setShowModal(false)
            })
            .catch(err => {
                console.error("Error adding employee:", err)
                showAlert("❌ Failed to add employee. Please try again.")
            })

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
            fetch(`${API_BASE_URL}/employees/${id}`, {
                method: 'DELETE'
            })
            .then(res => {
                if(!res.ok){
                    throw new Error("Failed to delete employee")
                }
                setEmployee(employee.filter(emp => emp.id !== id))
                setShowConfirmModal(false)
            })
            .catch(err => {
                console.error('Error deleting employee:', err)
                showAlert("❌ Failed to delete employee. Please try again.")
            })

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

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    return (
    
    <div className='container'>
        {isloading ? (
      <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
    ) : (<>
        <Header 
            disabledDelete={selectedEmployees.length === 0} 
            onDelete={() => handleDelete()} 
            onAddEmployee={() => setShowModal(true)}
            openMailModal={() => handleBulkMail()}
            disabledMail={selectedEmployees.length === 0}
        />

        <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClear={() => handleClearSearch()}
        />

        <div className="table-wrapper">

            <table>
                <thead>
                    <tr>

                        <th><input type="checkbox" checked={currentEmployees.every(emp => selectedEmployees.includes(emp.id))} onChange={handleSelectAll} /></th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                        {currentEmployees.length === 0? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                    No matching records found.
                                </td>
                            </tr>
                        ) : (
                        currentEmployees.map((emp) => (
                            <EmployeeRow 
                            key={emp.id} 
                            employee={emp}
                            isSelected = {selectedEmployees.includes(emp.id)} 
                            onCheckboxChange = {() => handleCheckboxChange(emp.id)}
                            onDelete={() => handleDeleteOne(emp.id)}
                            onEdit={() => handleEditEmployee(emp.id)}
                            onMail={() => handleMailEmployee(emp.id)}
                            />
                        )))}
                        {}
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
</>)}
    </div>
  )
}

export default EmployeeTable