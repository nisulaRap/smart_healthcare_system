import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm py-3 px-6 flex justify-between items-center fixed w-full top-0 z-50">
      <h1
        className="text-xl font-bold text-sky-600 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        🏥 MediTrack
      </h1>

      <button
        onClick={() => {
          logout();
          navigate('/');
        }}
        className="flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-lg hover:bg-sky-200 transition"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" /> Logout
      </button>
    </nav>
  );
}
