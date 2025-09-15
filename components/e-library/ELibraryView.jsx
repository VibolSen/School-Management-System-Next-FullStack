"use client";

import React, { useState, useEffect, useMemo } from "react";
import ELibraryGrid from "./ELibraryGrid";
import AddResourceModal from "./AddResourceModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import ResourceDetailModal from "./ResourceDetailModal";
import Notification from "@/components/Notification";

const ELibraryView = ({ loggedInUser }) => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [departments, setDepartments] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All"); // ✅ NEW state

  const [selectedResource, setSelectedResource] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [types, setTypes] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Safe fetch resources
  const fetchResources = async () => {
    try {
      const res = await fetch("/api/library");
      if (!res.ok) throw new Error(res.statusText);
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setResources(data);
    } catch (e) {
      console.error("Failed to fetch resources:", e);
      setResources([]);
      showMessage("Failed to fetch resources", "error");
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await fetch("/api/types"); // your types API
      if (!res.ok) throw new Error(res.statusText);
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setTypes(data); // store array of {id, name}
    } catch (e) {
      console.error("Failed to fetch types:", e);
      setTypes([]);
      showMessage("Failed to fetch types", "error");
    }
  };

  // Safe fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departments");
      if (!res.ok) throw new Error(res.statusText);
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setDepartments(data.map((dep) => dep.name));
    } catch (e) {
      console.error("Failed to fetch departments:", e);
      setDepartments([]);
      showMessage("Failed to fetch departments", "error");
    }
  };

  useEffect(() => {
    fetchResources();
    fetchDepartments();
    fetchTypes();
  }, []);

  const handleAddClick = () => {
    setEditingResource(null);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (resource) => {
    setEditingResource(resource);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (resource) => {
    try {
      const res = await fetch(`/api/library?id=${resource.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete resource");

      // Remove the resource from state
      setResources(resources.filter((r) => r.id !== resource.id));

      // Close the modal
      setResourceToDelete(null);
      showMessage("Resource deleted successfully!");
    } catch (e) {
      console.error(e);
      showMessage(e.message, "error");
    }
  };

  const handleCancelDelete = () => {
    setResourceToDelete(null);
  };

  const handleSaveResource = async (resourceData) => {
    if (!loggedInUser) {
      console.error("No logged-in user!");
      showMessage("You must be logged in to save a resource.", "error");
      return;
    }

    if (!resourceData.typeId) {
      console.error("Material type is required!");
      showMessage("Material type is required.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", resourceData.title);
      formData.append("uploadedById", loggedInUser.id);
      formData.append("typeId", resourceData.typeId);

      // ✅ FIX: include author
      if (resourceData.author) formData.append("author", resourceData.author);

      if (resourceData.department)
        formData.append("department", resourceData.department);
      if (resourceData.description)
        formData.append("description", resourceData.description);
      if (resourceData.coverImage)
        formData.append("coverImage", resourceData.coverImage);

      // Make sure publicationYear is a valid number
      if (
        resourceData.publicationYear &&
        !isNaN(resourceData.publicationYear)
      ) {
        formData.append(
          "publicationYear",
          String(resourceData.publicationYear)
        );
      }

      const url = editingResource
        ? `/api/library?id=${editingResource.id}`
        : "/api/library";
      const method = editingResource ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Failed to save resource");
      }

      fetchResources();
      setIsEditModalOpen(false);
      setEditingResource(null);
      showMessage(`Resource ${editingResource ? "updated" : "added"} successfully!`);
    } catch (err) {
      console.error("Failed to save resource", err);
      showMessage(err.message, "error");
    }
  };

  // ✅ Filter by department and type
  const filteredResources = useMemo(() => {
    return resources.filter(
      (r) =>
        (r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (departmentFilter === "All" || r.department === departmentFilter) &&
        (typeFilter === "All" || r.type?.id === typeFilter)
    );
  }, [resources, searchTerm, departmentFilter, typeFilter]);

  return (
    <div className="space-y-6">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">E-Library</h1>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        {/* ✅ Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Types</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Departments</option>
          {departments.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>
      </div>

      <ELibraryGrid
        resources={filteredResources}
        onEditClick={handleEditClick}
        onDeleteClick={setResourceToDelete}
        onResourceClick={setSelectedResource}
      />

      <AddResourceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSaveResource={handleSaveResource}
        resourceToEdit={editingResource}
        departments={departments}
        types={types}
      />

      <ConfirmationDialog
        isOpen={!!resourceToDelete}
        onClose={() => setResourceToDelete(null)}
        onConfirm={() => handleDelete(resourceToDelete)}
        onCancel={handleCancelDelete}
        title="Delete Resource"
        message={`Are you sure you want to delete "${resourceToDelete?.title}"?`}
      />

      <ResourceDetailModal
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        resource={selectedResource}
      />
    </div>
  );
};

export default ELibraryView;
