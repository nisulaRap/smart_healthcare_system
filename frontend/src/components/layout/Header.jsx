import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              Smart Healthcare
            </span>
          </Link>
          <nav className="flex space-x-4">
            <Link
              to="/"
              className="px-4 py-2 text-gray-700 hover:text-blue-600"
            >
              Book Appointment
            </Link>
            <Link
              to="/appointments"
              className="px-4 py-2 text-gray-700 hover:text-blue-600"
            >
              My Appointments
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;