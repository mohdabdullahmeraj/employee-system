import React, { useEffect, useState } from 'react'

const EmployeeFormModal = ({onClose, onConfirm, editingEmployee}) => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: ''  
    })

    useEffect(() => {
        if(editingEmployee){
            setFormData(editingEmployee)
        }
    }, [editingEmployee])

    const handleChange = (e) => {
        const {name, value} = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }



    return (
        <div className="modal-overlay">
            <div className='modal-content'>
                <div className='modal-fields'>

                    <input type="text" name='name' value={formData.name} onChange={handleChange} placeholder='Name'/>
                    <input type="text" name='email' value={formData.email} onChange={handleChange} placeholder='Email'/>
                    <input type="text" name='address' value={formData.address} onChange={handleChange} placeholder='Address'/>
                    <input type="text" name='phone' value={formData.phone} onChange={handleChange} placeholder='Phone'/>
                
                </div>
                <div className='modal-btn'>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={() => {
                        if(!formData.name || !formData.email || !formData.address || !formData.phone){
                            alert("Please fill in all fields")
                            return
                        }

                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        if(!emailPattern.test(formData.email)){
                            alert("Please enter a valid email address")
                            return
                        }

                        const phonePattern = /^[0-9]{10}$/
                        if(!phonePattern.test(formData.phone)){
                            alert("Please enter a valid phone number")
                            return
                        }


                        onConfirm(formData)


                    }}>Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default EmployeeFormModal