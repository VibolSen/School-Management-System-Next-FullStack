// FILE: components/assignments/SubmissionModal.jsx

"use client";

import React, { useState, useEffect } from "react";

const SubmissionModal = ({ isOpen, onClose, onSubmit, currentSubmission }) => {
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    // Pre-fill the form with the current submission if it exists
    if (currentSubmission) {
      setContent(currentSubmission.content || "");
      setFileUrl(currentSubmission.fileUrl || "");
    }
  }, [currentSubmission, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ content, fileUrl });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            Submit Your Work
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-slate-800"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Text Submission
            </label>
            <textarea
              id="content"
              rows="8"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Type your response here..."
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="fileUrl"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              File URL (Optional)
            </label>
            <input
              id="fileUrl"
              type="text"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/path/to/your/file.pdf"
            />
            <p className="text-xs text-slate-500 mt-1">
              If your work is a file, please upload it to a service like Google
              Drive or Dropbox and paste the shareable link here.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg mr-2 hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionModal;
