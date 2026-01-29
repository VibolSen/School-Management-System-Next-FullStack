"use client";

import React, { useState, useEffect, useMemo } from "react";
import ELibraryGrid from "./ELibraryGrid";
import AddResourceModal from "./AddResourceModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import ResourceDetailModal from "./ResourceDetailModal";


const ELibraryView = ({ loggedInUser }) => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedResource, setSelectedResource] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceToDelete, setResourceToDelete] = useState(null);



  const fetchResources = async () => {
    if (!loggedInUser?.departmentId) return;
    try {
      const res = await fetch(`/api/library?departmentId=${loggedInUser.departmentId}`, { cache: 'no-store' });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(res.statusText);
      }
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setResources(data);
    } catch (e) {
      console.error("Failed to fetch resources:", e);
      setResources([]);
      console.error("Failed to fetch resources");
    }
  };

  useEffect(() => {
    fetchResources();
  }, [loggedInUser]);

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

      setResources(resources.filter((r) => r.id !== resource.id));
      setResourceToDelete(null);
      console.log("Resource deleted successfully!");
    } catch (e) {
      console.error(e);
      console.error(e.message);
    }
  };

  const handleSaveResource = async (resourceData) => {
    if (!loggedInUser) {
      console.error("You must be logged in to save a resource.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", resourceData.title);
      formData.append("uploadedById", loggedInUser.id);
      formData.append("department", loggedInUser.departmentId);

      if (resourceData.author) formData.append("author", resourceData.author);
      if (resourceData.description) formData.append("description", resourceData.description);
      if (resourceData.coverImage) formData.append("coverImage", resourceData.coverImage);
      if (resourceData.publicationYear && !isNaN(resourceData.publicationYear)) {
        formData.append("publicationYear", String(resourceData.publicationYear));
      }

      const url = editingResource ? `/api/library?id=${editingResource.id}` : "/api/library";
      const method = editingResource ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Failed to save resource");
      }

      fetchResources();
      setIsEditModalOpen(false);
      setEditingResource(null);
      console.log(`Resource ${editingResource ? "updated" : "added"} successfully!`);
    } catch (err) {
      console.error("Failed to save resource", err);
      console.error(err.message);
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter(
      (r) =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [resources, searchTerm]);

  return (
    <div className="space-y-6">
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
        loggedInUser={loggedInUser}
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