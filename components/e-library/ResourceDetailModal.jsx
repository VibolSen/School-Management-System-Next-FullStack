// components/e-library/ResourceDetailModal.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ResourceDetailModal = ({ isOpen, onClose, resource }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !resource || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto animate-fade-in-scale">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">{resource.title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">✕</button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img src={resource.coverImage} alt={resource.title} className="w-full h-auto rounded-lg shadow-md" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-700">Author: {resource.author}</h3>
              <p className="text-sm text-slate-600">Department: {resource.department}</p>
              <p className="text-sm text-slate-600">Publication Year: {resource.publicationYear}</p>
              <p className="mt-4 text-slate-700">{resource.description}</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-slate-50 border-t rounded-b-xl flex justify-end items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ResourceDetailModal;