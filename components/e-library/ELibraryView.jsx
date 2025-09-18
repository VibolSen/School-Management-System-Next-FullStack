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

  const [selectedResource, setSelectedResource] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceToDelete, setResourceToDelete] = useState(null);

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
    console.log("Fetching resources...");
    try {
      const res = await fetch("/api/library", { cache: 'no-store' });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to fetch resources, response not OK:", res.status, errorText);
        throw new Error(res.statusText);
      }
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      console.log("Resources fetched successfully:", data);
      setResources(data);
    } catch (e) {
      console.error("Failed to fetch resources in catch block:", e);
      setResources([]);
      showMessage("Failed to fetch resources", "error");
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

    try {
      const formData = new FormData();
      formData.append("title", resourceData.title);
      formData.append("uploadedById", loggedInUser.id);

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
        (departmentFilter === "All" || r.department === departmentFilter)
    );
  }, [resources, searchTerm, departmentFilter]);

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
      />

      <ConfirmationDialog
        isOpen={!!resourceToDelete}
        onCancel={() => setResourceToDelete(null)}
        onConfirm={() => handleDelete(resourceToDelete)}
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
