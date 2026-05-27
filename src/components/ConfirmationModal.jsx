const ConfirmationModal = ({ show, config, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal fade show" 
         style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
         tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: 14 }}>
          <div className="modal-header border-0 pb-2">
            <h5 className="modal-title fw-semibold">{config.title}</h5>
            <hr />
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          
          <div className="modal-body pt-0 pb-4">
            <p className="mb-0 text-muted" style={{ fontSize: 15, lineHeight: 1.5 }}>
              {config.message}
            </p>
          </div>
          
          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              className="btn btn-light px-4"
              style={{ borderRadius: 8 }}
              onClick={onClose}
            >
              {config.cancelText}
            </button>
            <button
              type="button"
              className={`btn btn-${config.confirmVariant} px-4`}
              style={{ borderRadius: 8 }}
              onClick={() => {
                config.onConfirm();
                onClose();
              }}
            >
              {config.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;