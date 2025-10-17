import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AdminLayout from "./pages/admin/AdminLayout";
import PatientRecods from "./pages/admin/PatientRecods";
import CardIssuance from "./pages/admin/CardIssuance";
import Appoinments from "./pages/admin/Appoinments";
import HealthCard from "./pages/HealthCard";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* Patient side */}
      <Route path="/" element={<App />} />
      <Route path="/health-card" element={<HealthCard />} />

      {/* Admin side */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="patientrecords" element={<PatientRecods />} />
        <Route path="appoinments" element={<Appoinments />} />
        <Route path="cardissuance" element={<CardIssuance />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
