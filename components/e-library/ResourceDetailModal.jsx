import React from 'react';

const ResourceDetailModal = ({ isOpen, onClose, resource }) => {
  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" role="dialog" aria-modal="true" aria-labelledby="resource-modal-title">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        
        <div className="w-full md:w-1/3 flex-shrink-0">
            <img 
                src={resource.coverImage} 
                alt={`Cover for ${resource.title}`} 
                className="w-full h-64 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
            />
        </div>

        <div className="flex flex-col flex-grow p-6 md:p-8 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
             <h2 id="resource-modal-title" className="text-2xl font-bold text-slate-800 pr-4">
              {resource.title}
            </h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800 flex-shrink-0" aria-label="Close modal">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-md text-slate-600 mb-4">{resource.author}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 mb-4">
            <span><strong>Type:</strong> {resource.type}</span>
            <span><strong>Published:</strong> {resource.publicationYear}</span>
            <span><strong>Department:</strong> {resource.department}</span>
          </div>

          <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
            {resource.description}
          </p>
          
          <div className="mt-auto pt-4 border-t border-slate-200 flex justify-between items-center">
             <div>
              {resource.isAvailable ? (
                <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">Available for Borrowing</span>
              ) : (
                <span className="px-3 py-1 text-sm font-semibold text-red-800 bg-red-100 rounded-full">Currently Borrowed</span>
              )}
            </div>
            <button 
              disabled={!resource.isAvailable}
              className={`px-6 py-2 text-sm font-semibold rounded-md transition ${
                resource.isAvailable 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              Borrow
            </button>
          </div>
        </div>
      </div>
      <style>{`
          @keyframes fade-in-scale {
            from {
              transform: scale(.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-fade-in-scale {
            animation: fade-in-scale 0.2s ease-out forwards;
          }
      `}</style>
    </div>
  );
};

export default ResourceDetailModal;
