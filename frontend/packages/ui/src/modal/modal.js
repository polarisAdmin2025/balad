const ModalHeader = ({ closeModal, loading, children }) => {
  return (
    <div className="modal-title">
      <h2>{children}</h2>
      <button
        disabled={loading}
        onClick={closeModal}
        className="close-button exp-btn"
      >
        &times;
      </button>
    </div>
  )
}

const ModalContent = ({ children }) => {
  return <div className="modal-content">{children}</div>
}

const ModalFooter = ({ children }) => {
  return <div className="modal-footer btn-group">{children}</div>
}

const Modal = ({ children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">{children}</div>
    </div>
  )
}

Modal.Title = ModalHeader
Modal.Content = ModalContent
Modal.Footer = ModalFooter

export default Modal
