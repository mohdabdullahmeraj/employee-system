import React, { useEffect, useState } from 'react'

const EmployeeFormModal = ({onClose, onConfirm, editingEmployee, showAlert}) => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: ''  
    })

    const [isSubmitting, setIsSubmitting] = useState(false);


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
                        setIsSubmitting(true);

                        if(!formData.name || !formData.email || !formData.address || !formData.phone){
                            // alert("Please fill in all fields")
                            showAlert("Please fill in all fields")
                            setIsSubmitting(false);
                            return
                        }

                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        if(!emailPattern.test(formData.email)){
                            showAlert("Please enter a valid email address")
                            setIsSubmitting(false);
                            return
                        }

                        const phonePattern = /^[0-9]{10}$/
                        if(!phonePattern.test(formData.phone)){
                            showAlert("Please enter a valid phone number")
                            setIsSubmitting(false);
                            return
                        }


                        onConfirm(formData)


                    }}>{isSubmitting ? "Saving..." : "Confirm"}</button>
                </div>
            </div>
        </div>
    )
}

export default EmployeeFormModal