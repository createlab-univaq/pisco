'use client';

import React from 'react';
import styles from './ConfirmModal.module.css';

export type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isProcessing?: boolean;
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  processingText?: string;
  cancelText?: string;
};

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing = false,
  title = 'Confirm Action',
  message = 'Are you sure? This action cannot be undone.',
  confirmText = 'Confirm',
  processingText = 'Processing...',
  cancelText = 'Cancel',
}: ConfirmModalProps) => {

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>

        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
            disabled={isProcessing}
          >
            &times;
          </button>
        </div>

        <div className={styles.modalBody}>
          <p>{message}</p>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isProcessing}
          >
            {cancelText}
          </button>

          <button
            className={styles.confirmButton}
            disabled={isProcessing}
            onClick={onConfirm}
          >
            {isProcessing ? processingText : confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmModal;