'use client';

import React, { useState, useEffect } from 'react';

const AddResourceModal = ({ 
  isOpen, 
  onClose, 
  onSaveResource, 
  resourceToEdit, 
  departments = [], // from parent
  types = [] // MaterialTypeEnum types
}) => {
  const isEditMode = !!resourceToEdit;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverImage: null,
    publicationYear: new Date().getFullYear(),
    department: departments[0]?.name || departments[0] || '',
    typeId: types[0]?.id || '', // default type
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    if (resourceToEdit) {
      setFormData({
        title: resourceToEdit.title || '',
        author: resourceToEdit.author || '',
        coverImage: resourceToEdit.coverImage || null,
        publicationYear: resourceToEdit.publicationYear || new Date().getFullYear(),
        department: resourceToEdit.department || departments[0]?.name || departments[0] || '',
        typeId: resourceToEdit.type?.id || types[0]?.id || '',
        description: resourceToEdit.description || '',
      });
    } else {
      setFormData({
        title: '',
        author: '',
        coverImage: null,
        publicationYear: new Date().getFullYear(),
        department: departments[0]?.name || departments[0] || '',
        typeId: types[0]?.id || '',
        description: '',
      });
    }

    setErrors({});
  }, [isOpen, resourceToEdit, departments, types]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'coverImage' && files?.[0]) {
      setFormData(prev => ({ ...prev, coverImage: files[0] }));
    } else if (name === 'publicationYear') {
      const year = parseInt(value, 10);
      setFormData(prev => ({ ...prev, publicationYear: isNaN(year) ? prev.publicationYear : year }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.author.trim()) newErrors.author = 'Author is required.';
    if (!formData.coverImage && !isEditMode) newErrors.coverImage = 'Cover image is required.';
    if (!formData.publicationYear || isNaN(Number(formData.publicationYear))) {
      newErrors.publicationYear = 'Publication year must be a valid number.';
    }
    if (!formData.department.trim()) newErrors.department = 'Department is required.';
    if (!formData.typeId) newErrors.typeId = 'Type is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const resourceData = {
      ...formData,
      title: formData.title.trim(),
      author: formData.author.trim(),
      description: formData.description.trim(),
    };

    onSaveResource(resourceData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto animate-fade-in-scale">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {isEditMode ? 'Edit Library Resource' : 'Add New Library Resource'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${errors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                required
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${errors.author ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                required
              />
              {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author}</p>}
            </div>

            {/* Cover Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                name="coverImage"
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${errors.coverImage ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                {...(!isEditMode && { required: true })}
              />
              {errors.coverImage && <p className="text-xs text-red-500 mt-1">{errors.coverImage}</p>}
              {formData.coverImage && typeof formData.coverImage === 'object' && (
                <p className="text-xs mt-1">Selected file: {formData.coverImage.name}</p>
              )}
            </div>

            {/* Publication Year */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Publication Year</label>
              <input
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                className={`w-full px-3 py-2 border rounded-md text-sm ${errors.publicationYear ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                required
              />
              {errors.publicationYear && <p className="text-xs text-red-500 mt-1">{errors.publicationYear}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${errors.department ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dep => (
                  <option key={dep.id || dep} value={dep.name || dep}>
                    {dep.name || dep}
                  </option>
                ))}
              </select>
              {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
            </div>

           {/* Material Type */}
<div>
  <label className="block text-sm font-medium text-slate-700 mb-1">Material Type</label>
  <select
    name="typeId"
    value={formData.typeId || ""}
    onChange={handleChange}
    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.typeId ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
    required
  >
    <option value="">Select Type</option>
    {types.map(type => (
      <option key={type.id} value={type.id}>{type.name}</option>
    ))}
  </select>
  {errors.typeId && <p className="text-xs text-red-500 mt-1">{errors.typeId}</p>}
</div>


            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md text-sm ${errors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                required
              ></textarea>
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="p-6 bg-slate-50 border-t rounded-b-xl flex justify-end items-center gap-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700"
            >
              {isEditMode ? 'Save Changes' : 'Save Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;
