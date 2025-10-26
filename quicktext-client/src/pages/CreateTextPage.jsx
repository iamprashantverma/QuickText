import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateTextPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [expiration, setExpiration] = useState('30');
  const [oneTimeView, setOneTimeView] = useState(false);
  const [isCustomExpiration, setIsCustomExpiration] = useState(false);
  const [customExpirationMinutes, setCustomExpirationMinutes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // If one-time is selected, disable expiration options
  const isExpirationDisabled = oneTimeView;

  const handleLogout = () => {
    // Remove JWT token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to home page
    window.location.href = '/';
  };

  const generateLink = async () => {
    setError('');
    setLoading(true);

    try {
      const link = customLink || null;
      // If one-time is selected, don't send expiration
      const expirationMinutes = oneTimeView ? null : (isCustomExpiration ? parseInt(customExpirationMinutes) : parseInt(expiration));
      
      const payload = {
        content,
        customLink: link,
        expirationMinutes,
        oneTimeView,
        userId: user?.id
      };

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/textshare/create`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate(`/text/${response.data.shareId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-6 sm:py-8 px-4 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className={`text-2xl sm:text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            {import.meta.env.VITE_APP_NAME || 'Quick'}<span className="text-indigo-600">Text</span>
          </h1>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Theme Toggle - Only in header */}
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
            
            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition text-xs sm:text-sm flex-1 sm:flex-none ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                  <button
                    onClick={() => navigate('/login')}
                    className={`px-3 sm:px-4 py-2 rounded-lg transition text-xs sm:text-sm w-full sm:w-auto ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Login
                  </button>
              </>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded text-xs sm:text-sm">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Text Editor */}
        <div className={`rounded-xl shadow-lg p-3 sm:p-4 mb-4 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="mb-3">
            <label className={`text-sm font-medium mb-2 block ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Paste your text or code here
            </label>
            
            {/* Simple Textarea */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing or paste your text here..."
              className={`min-h-[200px] sm:min-h-[250px] w-full p-3 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y text-sm font-mono leading-relaxed ${
                theme === 'dark'
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
              style={{
                direction: 'ltr',
                textAlign: 'left'
              }}
            />
          </div>
        </div>

        {/* Bottom Row: Settings + Generate Button */}
        <div className={`rounded-xl shadow-lg p-3 sm:p-4 mb-4 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="space-y-3 text-xs sm:text-sm mb-4">
            {/* One Time View First */}
            <div className={`flex items-center gap-2 pb-3 border-b ${
              theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <input
                type="checkbox"
                id="oneTime"
                checked={oneTimeView}
                onChange={(e) => setOneTimeView(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <label htmlFor="oneTime" className={`cursor-pointer ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                One-time view
              </label>
            </div>

            {/* Expiration Dropdown - Disabled if one-time is selected */}
            {!oneTimeView && (
              <div className="flex items-center gap-2">
                <label htmlFor="expiration" className={`cursor-pointer ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Expires in:</label>
                <select
                  id="expiration"
                  value={isCustomExpiration ? 'custom' : expiration}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setIsCustomExpiration(true);
                    } else {
                      setIsCustomExpiration(false);
                      setExpiration(e.target.value);
                    }
                  }}
                  disabled={isExpirationDisabled}
                  className={`px-2 py-1 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs sm:text-sm ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="never">Never</option>
                  <option value="5">5 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="custom">Custom</option>
                </select>
                {isCustomExpiration && (
                  <input
                    type="number"
                    value={customExpirationMinutes}
                    onChange={(e) => setCustomExpirationMinutes(e.target.value)}
                    placeholder="minutes"
                    min="1"
                    className={`w-20 sm:w-24 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs sm:text-sm ${
                      theme === 'dark'
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                  />
                )}
              </div>
            )}
          </div>

          {/* Generate Link + Custom Link in Same Row */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="text"
              value={customLink}
              onChange={(e) => setCustomLink(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
              placeholder="quicktext/prashnat-note"
              className={`flex-1 px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-xs sm:text-sm ${
                theme === 'dark'
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
            />
            <button
              onClick={generateLink}
              disabled={loading || !content.trim()}
              className="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-xs sm:text-sm"
            >
              {loading ? 'Generating...' : 'Generate Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTextPage;

