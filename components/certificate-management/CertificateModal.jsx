"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CertificateForm from "./CertificateForm";

const CertificateModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingCertificate,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingCertificate ? "Edit Certificate" : "Add New Certificate"}
          </DialogTitle>
        </DialogHeader>
        <CertificateForm
          initialData={editingCertificate || {}}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CertificateModal;
