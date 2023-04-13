import Modal from "react-modal";

export default function CustomModal({ children, isOpen, className }) {
  return (
    <Modal
      isOpen={isOpen}
      className={`p-3 border-2 border-light-h-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg shadow-lg ${className}`}
    >
      {children}
    </Modal>
  );
}
