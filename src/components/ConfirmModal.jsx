import React from "react";

const ConfirmModal = ({ message, onCancel, onConfirm, mode }) => {
  console.log(message);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="msg">{message}</div>

        <div className="modal-btn">
          {mode === "confirm" && (
            <>
            <button onClick={onCancel}>Cancel</button>
            <button onClick={() => {
                if (typeof onConfirm === "function") {
                    onConfirm()
                }}}>
            
            Confirm</button>
            
            </>
          )}

          {mode === "alert" && <button onClick={onCancel}>Okay</button>}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
