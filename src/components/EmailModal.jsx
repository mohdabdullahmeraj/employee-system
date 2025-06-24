import React, { useState, useEffect } from 'react'


const EmailModal = ({recipients, onClose, onSend, showAlert, isSending, setIsSending, errorMessage, setErrorMessage }) => {

    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")

    useEffect(() => {
        setErrorMessage("") 
    }, [])
    
    const handleChange = (e) => {
        const {name, value} = e.target
        setErrorMessage("")

        if (name === 'subject'){
            setSubject(value)
        }else if (name === 'body'){
            setBody(value)
        }
    }
    
  return (

    <div>
        <div className="modal-overlay">
            <div className='modal-content'>
                <div className='modal-fields'>

                    <input type="text" name='to' value={recipients.join(', ')} onChange={handleChange} placeholder='To' disabled={isSending} readOnly/>
                    <input type="text" name='subject' value={subject} onChange={handleChange} placeholder='Subject' disabled={isSending}/>
                    <textarea name='body' value={body} onChange={handleChange} placeholder='Body' disabled={isSending}/>
                    
                
                </div>
                {errorMessage && (
                    <div className='error-text'>
                        {errorMessage}
                    </div>
                )}
                <div className='modal-btn'>
                    <button className='mail-btn-cancel' onClick={onClose} disabled={isSending}>Cancel</button>
                    <button onClick={() => {
                       setIsSending(true)

                        if (!subject || !body) {
                            showAlert("Please enter both subject and body.")
                            setIsSending(false)
                            return
                        }

                        if (recipients.length === 0) {
                            showAlert("No recipients found.")
                            setIsSending(false)
                            return
                        }
                       
                       
                       onSend({recipients, subject, body})
                    }
                    }>{isSending ? "⏳Sending..." : "Send"}</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EmailModal