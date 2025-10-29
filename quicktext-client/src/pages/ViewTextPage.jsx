import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { getTextByLink } from '../services/api/textService';
import TextViewer from '../components/ui/TextViewer';
import SingleTaskSkeleton from '../components/ui/SingleTaskSkeleton';

const ViewTextPage = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [textShare, setTextShare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasFetched = useRef(false);

  useEffect(() => {

    if (hasFetched.current) return;
    hasFetched.current = true;
    
    const fetchTextShare = async () => {
      try {
        const response = await getTextByLink(shareId);
        const data = response.data?.data || response.data;
        setTextShare(data);
      } catch (err) {
        let message = err?.message || 'Failed to load your texts.';
        if (err.response) {
          message = err?.response?.data?.error?.message || message;
        } else if (err.message) {
          message = err.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTextShare();
  }, [shareId]);


  if (loading) {
    return <SingleTaskSkeleton theme={theme}/>
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
              <p className={`text-lg mb-6 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {error}
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-2 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
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
          onBack={() => navigate('/')}
        />
      </div>
    </div>
  );
};

export default ViewTextPage;