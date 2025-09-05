import React, { useState } from "react";
import "./AttendanceManager.css";

function AttendanceManager() {
  const [students, setStudents] = useState([
    { id: 1, name: "Alice", present: true },
    { id: 2, name: "Bob", present: false },
    { id: 3, name: "Charlie", present: true },
    { id: 4, name: "David", present: false },
    { id: 5, name: "Eve", present: true },
    {id: 6, name: "Gaurav", present: true},
    {id: 7, name: "Seet", present: true},
    {id: 8, name: "SKM", present: true},
    {id: 9, name: "Gullu", present: false}
  ]);

  const [filter, setFilter] = useState("All");

  const toggleAttendance = (id) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  const filteredStudents = students.filter(student => {
    if (filter === "All") return true;
    if (filter === "Present") return student.present;
    if (filter === "Absent") return !student.present;
  });

  const totalPresent = students.filter(s => s.present).length;

  return (
    <div className="attendance-manager">
      <h2>Attendance Manager</h2>
      <div className="filter">
        <label>Filter: </label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          <option>Present</option>
          <option>Absent</option>
        </select>
      </div>
      <ul className="student-list">
        {filteredStudents.map(student => (
          <li key={student.id} className={student.present ? "present" : "absent"}>
            <span>{student.name}</span>
            <span>{student.present ? "Present" : "Absent"}</span>
            <button onClick={() => toggleAttendance(student.id)}>Toggle</button>
          </li>
        ))}
      </ul>
      <div className="total">Total Present: {totalPresent}</div>
    </div>
  );
}

export default AttendanceManager;
