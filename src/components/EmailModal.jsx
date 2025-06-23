import React, { useState } from 'react'


const EmailModal = ({recipients, onClose, onSend, showAlert }) => {

    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")
    const [isSending, setIsSending] = useState(false)
    
    const handleChange = (e) => {
        const {name, value} = e.target

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

                    <input type="text" name='to' value={recipients.join(', ')} onChange={handleChange} placeholder='To' readOnly/>
                    <input type="text" name='subject' value={subject} onChange={handleChange} placeholder='Subject'/>
                    <textarea name='body' value={body} onChange={handleChange} placeholder='Body'/>
                    
                
                </div>
                <div className='modal-btn'>
                    <button onClick={onClose}>Cancel</button>
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
                    }>{isSending ? "Sending..." : "Send"}</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EmailModal