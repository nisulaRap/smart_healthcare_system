import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppointmentBooking from './components/appointments/AppointmentBooking';
import AppointmentList from './components/appointments/AppointmentList';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<AppointmentBooking />} />
            <Route path="/appointments" element={<AppointmentList />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;