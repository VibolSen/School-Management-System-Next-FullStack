"use client";
import React from "react";
import { createPortal } from "react-dom";
import CertificateForm from "./CertificateForm";

const CertificateModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingCertificate,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-full overflow-y-auto animate-fade-in-scale">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 id="add-certificate-modal-title" className="text-xl font-bold text-slate-800">
              {editingCertificate ? "Edit Certificate" : "Add New Certificate"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <CertificateForm
          initialData={editingCertificate || {}}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CertificateModal;
