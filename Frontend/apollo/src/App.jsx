// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage/HomePage';
import Appointment from './Components/Appointment/Appointment.jsx';
import Queries from './Components/Queries/Queries.jsx';
import DocAppointment from './Components/DocAppointment/DocAppointment.jsx';
import Department from './Department.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

// Define an array of department names and paths
const departments = [
  { name: "Anesthesiologist", path: "anaesthesia" },
  { name: "Cardiologist", path: "cardiology" },
  { name: "Dentist", path: "dental" },
  { name: "Dermatologist", path: "dermatology" },
  { name: "ENT Specialist", path: "ent" },
  { name: "Gastroenterologist", path: "gastroenterology" },
  { name: "Gynecologist", path: "gynecologist" },
  { name: "Nephrologist", path: "nephrology" },
  { name: "Neurologist", path: "neurology" },
  { name: "Ophthalmologist", path: "ophthalmology" },
  { name: "Oncologist", path: "oncology" },
  { name: "Orthopedic Surgeon", path: "orthopedic" },
  { name: "Pediatrician", path: "pediatrics" },
  { name: "Pulmonologist", path: "pulmonology" },
  { name: "Radiologist", path: "radiology" },
  { name: "Urologist", path: "urology" },
];

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/appointment' element={<Appointment />} />
        <Route path='/queries' element={<Queries />} />
        {departments.map((department) => (
          <Route
            key={department.path}
            path={`/departments/${department.path}`}
            element={<Department departmentName={department.name} />}
          />
        ))}
        <Route path="/book-appointment/:departmentName/:doctorId" element={<DocAppointment />} />
      </Routes>
    </>
  );
}

export default App;
