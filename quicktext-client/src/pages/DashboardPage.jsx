import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DashboardPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [textShares, setTextShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchTextShares();
  }, [user, navigate]);

  const fetchTextShares = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/textshare/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTextShares(response.data);
    } catch (err) {
      setError('Failed to fetch your text shares');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shareId) => {
    if (!confirm('Are you sure you want to delete this text share?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/textshare/${shareId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTextShares(textShares.filter(share => share.id !== shareId));
    } catch (err) {
      setError('Failed to delete text share');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className={`min-h-screen py-6 sm:py-8 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className={`rounded-xl shadow-lg p-6 sm:p-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-center">
              <p className={`text-lg ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>Loading your text shares...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-6 sm:py-8 px-4 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className={`text-2xl sm:text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Dashboard
          </h1>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={toggleTheme}
              className={`px-3 sm:px-4 py-2 rounded-lg transition text-xs sm:text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => navigate('/create')}
              className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-xs sm:text-sm flex-1 sm:flex-none"
            >
              Create New
            </button>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs sm:text-sm flex-1 sm:flex-none"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded text-sm">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Text Shares */}
        <div className={`rounded-xl shadow-lg p-4 sm:p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Your Text Shares ({textShares.length})
          </h2>

          {textShares.length === 0 ? (
            <div className="text-center py-8">
              <p className={`text-lg ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No text shares yet. Create your first one!
              </p>
              <button
                onClick={() => navigate('/create')}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Create Text Share
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {textShares.map((share) => (
                <div key={share.id} className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-medium text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      {share.customLink || share.shareId}
                    </h3>
                    <button
                      onClick={() => handleDelete(share.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                  <p className={`text-xs mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Views: {share.viewCount || 0}
                  </p>
                  <p className={`text-xs mb-3 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Created: {new Date(share.createdAt).toLocaleDateString()}
                  </p>
                  <a
                    href={`/text/${share.shareId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500 text-xs"
                  >
                    View Share →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;