const ConfirmationModal = ({ show, config, onClose }) => {
  if (!show) return null;

  const variantIcons = {
    danger:  "bi bi-exclamation-triangle-fill",
    warning: "bi bi-exclamation-circle-fill",
    success: "bi bi-check-circle-fill",
    info:    "bi bi-info-circle-fill",
  };

  const variantColors = {
    danger:  "#dc3545",
    warning: "#f59e0b",
    success: "#198754",
    info:    "#0d6efd",
  };

  const activeVariant = config.confirmVariant || "danger";
  const iconClass = variantIcons[activeVariant] || variantIcons.danger;
  const iconColor = variantColors[activeVariant] || variantColors.danger;

  return (
    <div 
      className="modal fade show" 
      style={{ 
        display: "block", 
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(4px)",
      }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" style={{ transform: "scale(1)", transition: "transform 0.2s ease-out" }}>
        <div 
          className="modal-content border-0 shadow-lg" 
          style={{ 
            borderRadius: 16, 
            overflow: "hidden",
            animation: "modalPop 0.25s ease-out",
          }}
        >
          {/* Top colored accent bar */}
          <div style={{ height: 4, background: iconColor, width: "100%" }} />

          <div className="modal-header border-0 flex-column align-items-center pt-4 pb-0">
            {/* Icon */}
            <div 
              className="d-flex align-items-center justify-content-center mb-3"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `${iconColor}15`,
                color: iconColor,
                fontSize: "1.75rem",
              }}
            >
              <i className={iconClass} />
            </div>

            {/* Title */}
            <h5 
              className="modal-title fw-bold text-center" 
              style={{ fontSize: "1.15rem", color: "#1e293b", padding: "0 1rem" }}
            >
              {config.title}
            </h5>

            {/* Close button - absolute positioned */}
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
              style={{ 
                position: "absolute", 
                top: "1rem", 
                right: "1rem",
                width: 32,
                height: 32,
                borderRadius: "50%",
                padding: 0,
                opacity: 0.5,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => e.target.style.opacity = "0.8"}
              onMouseLeave={(e) => e.target.style.opacity = "0.5"}
            />
          </div>
          
          <div className="modal-body pt-2 pb-2 px-4">
            <p 
              className="mb-0 text-center" 
              style={{ 
                fontSize: 14, 
                lineHeight: 1.6, 
                color: "#64748b",
                maxWidth: 360,
                margin: "0 auto",
              }}
            >
              {config.message}
            </p>
          </div>
          
          <div 
            className="modal-footer border-0 pt-3 pb-4 px-4" 
            style={{ gap: "0.75rem", justifyContent: "center" }}
          >
            <button
              type="button"
              className="btn btn-light"
              style={{ 
                borderRadius: 10, 
                padding: "0.6rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                border: "1px solid #e2e8f0",
                color: "#475569",
                minWidth: 110,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f1f5f9";
                e.target.style.borderColor = "#cbd5e1";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "";
                e.target.style.borderColor = "#e2e8f0";
              }}
              onClick={onClose}
            >
              {config.cancelText || "Cancel"}
            </button>
            <button
              type="button"
              className={`btn btn-${activeVariant}`}
              style={{ 
                borderRadius: 10, 
                padding: "0.6rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                minWidth: 110,
                boxShadow: `0 4px 14px ${iconColor}30`,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
              onClick={() => {
                config.onConfirm();
                onClose();
              }}
            >
              {config.confirmText || "Confirm"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalPop {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;