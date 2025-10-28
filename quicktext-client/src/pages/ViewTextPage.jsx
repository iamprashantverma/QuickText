import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { getTextByLink } from '../services/api/textService';
import TextViewer from '../components/ui/TextViewer';

const ViewTextPage = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [textShare, setTextShare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent double fetch in Strict Mode
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    const fetchTextShare = async () => {
      try {
        const response = await getTextByLink(shareId);
        const data = response.data?.data || response.data;
        setTextShare(data);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.error?.message || err.response?.data?.message || 'Text share not found or expired');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTextShare();
  }, [shareId]);

  

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  if (loading) {
    return (
      <div className={`min-h-screen py-6 sm:py-8 px-4 ${
        theme === 'dark' 
          ? 'bg-linear-to-br from-gray-900 to-gray-800' 
          : 'bg-linear-to-br from-blue-50 to-indigo-100'
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
          ? 'bg-linear-to-br from-gray-900 to-gray-800' 
          : 'bg-linear-to-br from-blue-50 to-indigo-100'
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
        ? 'bg-linear-to-br from-gray-900 to-gray-800' 
        : 'bg-linear-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="max-w-4xl mx-auto">
        <TextViewer
          theme={theme}
          textShare={textShare}
          onCopy={copyToClipboard}
          onBack={() => navigate('/')}
        />
      </div>
    </div>
  );
};

export default ViewTextPage;