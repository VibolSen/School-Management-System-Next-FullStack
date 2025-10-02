import React from "react";
import AttendanceTable from "./attendance/AttendanceTable";

const AttendanceView = ({ attendance }) => {
  return <AttendanceTable attendance={attendance} />;
};

export default AttendanceView;