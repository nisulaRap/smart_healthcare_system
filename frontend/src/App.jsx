import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientRegister from "./pages/PatientRegister";

export default function App() {
  return (
    
      <Routes>
        <Route path="/" element={<PatientRegister />} />
      </Routes>
   
  );
}
