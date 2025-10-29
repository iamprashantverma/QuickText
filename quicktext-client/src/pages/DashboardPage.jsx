import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

import { useNavigate } from 'react-router-dom';
import { deleteText } from '../services/api/textService';
import { getAllTexts } from '../services/api/textService';


const DashboardPage = () => {
  const { user} = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [textShares, setTextShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmForId, setConfirmForId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');


  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchTextShares();
  }, [user,navigate]);

  const fetchTextShares = async () => {
    setError('');
    setLoading(true);
    try {
      const resp = await getAllTexts();
      const items = resp?.data?.data || resp?.data || [];
      setTextShares(Array.isArray(items) ? items : (items.texts || []));
    } catch (err) {
      let message = 'Failed to load your texts.';
      if (err.response) {
        message = err.response.data?.message || message;
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shareId) => {
    if (!shareId) return;
    try {
      await deleteText(shareId);
      setTextShares((prev) => prev.filter((s) => (s.id ?? s.shareId) !== shareId));
      setConfirmForId(null);
      setToastMessage('Deleted successfully');
      setTimeout(() => setToastMessage(''), 1500);
    } catch (err) {
      let message = 'Failed to delete the item.';
      if (err.response) {
        message = err.response.data?.message || message;
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    }
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
        {toastMessage && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-green-600 text-white text-sm inline-block">
            {toastMessage}
          </div>
        )}
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-5">
          <div>
            <h1 className={`text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Your Dashboard
            </h1>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm mt-1`}>
              Manage your shares, track views, and tidy things up.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded text-sm">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Text Shares */}
        <div className={`rounded-xl shadow-lg p-3 sm:p-4 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-base sm:text-lg font-semibold mb-3 ${
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {textShares.map((share) => {
                const id = share.id ?? share.shareId;
                const linkId = share.shareId || share.link || share.customLink || id;
                const views = share.viewCount ?? share.views ?? 0;
                const isOneTime = !!(share.oneTimeView ?? share.one_time ?? share.oneTime);
                const createdAt = share.createdAt || share.created_at || share.createdOn || Date.now();
                const consumed = isOneTime && views >= 1;
                return (
                <div key={id} className={`p-3 sm:p-4 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-medium text-[13px] sm:text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      {share.customLink || linkId}
                    </h3>
                    {confirmForId === id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(id)}
                          className="px-2 py-1 rounded text-white bg-red-600 hover:bg-red-700 text-[11px]"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmForId(null)}
                          className={`px-2 py-1 rounded text-[11px] ${theme === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmForId(id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {isOneTime && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                        One-time view{consumed ? ' • consumed' : ''}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Views: {isOneTime ? Math.min(views, 1) : views}
                  </p>
                  <p className={`text-xs mb-3 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Created: {new Date(createdAt).toLocaleDateString()}
                  </p>
                  <a
                    href={`/${linkId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500 text-[11px] sm:text-xs"
                  >
                    View Share →
                  </a>
                </div>
              );})}
            </div>
          )}
        </div>
      </div>
      </div>

  );
};

export default DashboardPage;