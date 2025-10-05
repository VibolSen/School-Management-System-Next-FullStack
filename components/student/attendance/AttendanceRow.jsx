import React from "react";

const AttendanceRow = ({ record }) => {
  return (
    <tr key={record.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        {new Date(record.date).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {record.group.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{record.group.name}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            record.status === "PRESENT"
              ? "bg-green-100 text-green-800"
              : record.status === "ABSENT"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {record.status}
        </span>
      </td>
    </tr>
  );
};

export default AttendanceRow;
