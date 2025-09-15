"use client";

import React, { useEffect, useState, useRef } from "react";

const GroupSelector = ({
  allGroups,
  selectedGroupIds,
  setSelectedGroupIds,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const safeSelectedGroupIds = Array.isArray(selectedGroupIds)
    ? selectedGroupIds
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelection = (groupId) => {
    const newIds = safeSelectedGroupIds.includes(groupId)
      ? safeSelectedGroupIds.filter((id) => id !== groupId)
      : [...safeSelectedGroupIds, groupId];
    setSelectedGroupIds(newIds);
  };

  const filteredGroups = allGroups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedGroups = allGroups.filter((g) =>
    safeSelectedGroupIds.includes(g.id)
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        role="button"
        tabIndex="0"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer"
      >
        <div className="flex flex-wrap gap-1 min-h-[20px]">
          {selectedGroups.length === 0 ? (
            <span className="text-slate-500">Select groups...</span>
          ) : (
            selectedGroups.map((group) => (
              <span
                key={group.id}
                className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full"
              >
                {group.name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelection(group.id);
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  &times;
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto">
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border-b text-sm"
          />
          <ul className="list-none p-0 m-0">
            {filteredGroups.map((group) => (
              <li
                key={group.id}
                onClick={() => handleSelection(group.id)}
                className="flex items-center py-2 px-3 hover:bg-slate-100 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={safeSelectedGroupIds.includes(group.id)}
                  className="h-4 w-4 rounded"
                />
                <span className="ml-3">{group.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GroupSelector;
