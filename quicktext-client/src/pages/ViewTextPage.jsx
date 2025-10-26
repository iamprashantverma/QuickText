import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import axios from 'axios';

// Import environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ViewTextPage = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [textShare, setTextShare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTextShare();
  }, [shareId]);

  const fetchTextShare = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/textshare/${shareId}`);
      setTextShare(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Text share not found or expired');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className={`min-h-screen py-6 sm:py-8 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-xl shadow-lg p-6 sm:p-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-center">
              <p className={`text-lg ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>Loading text share...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen py-6 sm:py-8 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-xl shadow-lg p-6 sm:p-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-center">
              <h1 className={`text-2xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Text Share Not Found
              </h1>
              <p className={`text-lg mb-6 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {error}
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Go Home
              </button>
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className={`text-2xl sm:text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            {import.meta.env.VITE_APP_NAME || 'Quick'}<span className="text-indigo-600">Text</span>
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
              onClick={copyToClipboard}
              className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-xs sm:text-sm flex-1 sm:flex-none"
            >
              Copy Link
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-xs sm:text-sm flex-1 sm:flex-none"
            >
              Home
            </button>
          </div>
        </div>

        {/* Text Content */}
        <div className={`rounded-xl shadow-lg p-4 sm:p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="mb-4">
            <h2 className={`text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Shared Text Content
            </h2>
            <div className={`p-4 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}>
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {textShare.content}
              </pre>
            </div>
          </div>

          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <p>Share ID: {textShare.shareId}</p>
            <p>Views: {textShare.viewCount || 0}</p>
            <p>Created: {new Date(textShare.createdAt).toLocaleString()}</p>
            {textShare.expiresAt && (
              <p>Expires: {new Date(textShare.expiresAt).toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTextPage;