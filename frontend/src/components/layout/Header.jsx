import { Link } from 'react-router-dom';
import { Calendar, List } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Smart Healthcare
            </span>
          </Link>

          <div className="flex space-x-4">
            <Link
              to="/"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Book Appointment
            </Link>
            <Link
              to="/appointments"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center"
            >
              <List className="w-4 h-4 mr-2" />
              My Appointments
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;