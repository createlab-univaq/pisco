'use client';

import styles from './DeleteFlowModal.module.css';

export type DeleteFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
  flowId: string;
  deleteFunc: (flowId: string) => Promise<void>;
};

const DeleteFlowModal = ({
  isOpen,
  onClose,
  flowId,
  deleteFunc,
}: DeleteFlowModalProps) => {
  
  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        
        <div className={styles.modalHeader}>
          <h2>Delete Learning Path</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className={styles.modalBody}>
          <p>
            Are you sure? <br /> This action is irreversible!
          </p>
        </div>

        <div className={styles.modalFooter}>
          {/* I added a Cancel button for better User Experience */}
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          
          <button
            className={styles.deleteButton}
            onClick={async () => {
              onClose();
              await deleteFunc(flowId);
            }}
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteFlowModal;