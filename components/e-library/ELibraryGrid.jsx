import React from 'react';

// Single Resource Card
const ResourceCard = ({ resource, onResourceClick, onEditClick, onDeleteClick }) => {
  const { title, author, coverImage } = resource;

  const handleCardClick = () => onResourceClick(resource);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    onEditClick(resource);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    onDeleteClick(resource);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
      aria-label={`View details for ${title}`}
    >
      <div className="relative h-56">
        <img
          className="w-full h-full object-cover"
          src={coverImage || '/default-cover.jpg'}
          alt={`Cover for ${title}`}
          loading="lazy"
        />
        {/* Action buttons overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={handleEditClick}
            className="text-white bg-blue-600 hover:bg-blue-700 rounded-full p-3 transition-transform duration-300 hover:scale-110"
            aria-label={`Edit ${title}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            className="text-white bg-red-600 hover:bg-red-700 rounded-full p-3 transition-transform duration-300 hover:scale-110"
            aria-label={`Delete ${title}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-bold text-slate-800 truncate" title={title}>{title}</h3>
        <p className="text-sm text-slate-500 mb-3">{author || 'Unknown Author'}</p>
      </div>
    </div>
  );
};

// Grid to display multiple resources
const ELibraryGrid = ({ resources, onResourceClick, onEditClick, onDeleteClick }) => {
  if (!resources || resources.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl shadow-md">
        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.22-8.242l10.44 4.99m-10.44-4.99l10.44 4.99M3 10.519l9-4.266 9 4.266" />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-slate-900">No Resources Found</h3>
        <p className="mt-1 text-sm text-slate-500">
          Your search did not match any resources. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {resources.map(resource => (
        <ResourceCard 
          key={resource.id} 
          resource={resource} 
          onResourceClick={onResourceClick} 
          onEditClick={onEditClick} 
          onDeleteClick={onDeleteClick} 
        />
      ))}
    </div>
  );
};

export default ELibraryGrid;
