import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { createText, validateCustomURL } from '../services/api/textService';

const CreateTextPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [expiration, setExpiration] = useState('30');
  const [oneTimeView, setOneTimeView] = useState(false);
  const [isCustomExpiration, setIsCustomExpiration] = useState(false);
  const [customExpirationMinutes, setCustomExpirationMinutes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAvailable, setIsAvailable] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isExpirationDisabled = oneTimeView;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Debounced validation for custom link
  useEffect(() => {
    if (!customLink) {
      setIsAvailable(null);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        setError('');
        const resp = await validateCustomURL(customLink);
        setIsAvailable(resp.data.data.isAvailable);
      } catch (err) {
        let message = err?.message || 'Something went wrong. Please try again.';
        if (err.response) {
          message =
            err.response.data?.error?.message ||
            err.response.data?.message ||
            'Server returned an error.';
        } else if (err.request) {
          message = 'No response from server. Please check your internet connection.';
        } else {
          message = err.message;
        }
        console.error('Error:', message);
        setError(message);
      }
    }, 600); // <-- debounce delay (ms)

    return () => clearTimeout(handler);
  }, [customLink]);

  // Generate Link Function
  const generateLink = async () => {
    setError('');
    setLoading(true);

    try {
      const expirationMinutes = oneTimeView
        ? null
        : isCustomExpiration
        ? parseInt(customExpirationMinutes) || null
        : expiration === 'never'
        ? null
        : parseInt(expiration) || null;

      const payload = {
        content: content.trim(),
        expirationMinutes,
        oneTimeView,
        link: customLink.trim() || null,
      };

      const response = await createText(payload);
      const generatedl = response.data.data.link;
      const url = `${window.location.origin}/${generatedl}`;
      window.history.pushState({}, '', url);

      setGeneratedUrl(url);
      setIsGenerated(true);
      setIsAvailable(null);
      setCustomLink('');
      console.log('Response:', response.data);
    } catch (err) {
      let message = 'Something went wrong. Please try again.';
      if (err.response) {
        message =
          err.response.data?.error?.message ||
          err.response.data?.message ||
          'Server returned an error.';
      } else if (err.request) {
        message = 'No response from server. Please check your internet connection.';
      } else {
        message = err.message;
      }
      console.error('Error:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen py-6 sm:py-8 px-4 ${
        theme === 'dark'
          ? 'bg-linear-to-br from-gray-900 to-gray-800'
          : 'bg-linear-to-br from-blue-50 to-indigo-100'
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded text-xs sm:text-sm">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Text Editor */}
        <div
          className={`rounded-xl shadow-lg p-3 sm:p-4 mb-4 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="mb-3">
            <label
              className={`text-sm font-medium mb-2 block ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Paste your text or code here
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing or paste your text here..."
              className={`min-h-[200px] sm:min-h-[250px] w-full p-3 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y text-sm font-mono leading-relaxed ${
                theme === 'dark'
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
              readOnly={isGenerated}
            />
          </div>
        </div>

        {/* Bottom Row */}
        {!isGenerated && (
          <div
            className={`rounded-xl shadow-lg p-3 sm:p-4 mb-4 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex flex-col md:flex-row md:flex-nowrap items-start md:items-end gap-3 sm:gap-4 mb-4">
              {/* One Time View */}
              <div className="md:w-1/4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="oneTime"
                    checked={oneTimeView}
                    onChange={(e) => setOneTimeView(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <label
                    htmlFor="oneTime"
                    className={`${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    } text-sm`}
                  >
                    One-time view
                  </label>
                </div>
              </div>

              {/* Expiration */}
              <div className="md:w-1/4">
                <label
                  htmlFor="expiration"
                  className={`block text-xs font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Expiration
                </label>
                <div ref={dropdownRef} className="relative flex items-center gap-2 flex-nowrap">
                  {(!oneTimeView && isCustomExpiration) ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="number"
                        min="5"
                        step="1"
                        max="21600"
                        value={customExpirationMinutes}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || /^\d+$/.test(value)) {
                            setCustomExpirationMinutes(value);
                          }
                        }}
                        onBlur={() => {
                          if (customExpirationMinutes === '') return;
                          let n = parseInt(customExpirationMinutes);
                          if (isNaN(n)) return;
                          if (n < 5) n = 5;
                          if (n > 21600) n = 21600;
                          setCustomExpirationMinutes(String(n));
                        }}
                        placeholder="Min 5"
                        className={`w-20 sm:w-24 md:w-28 px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm outline-none ${
                          theme === 'dark'
                            ? 'border-gray-600 bg-gray-700 text-white'
                            : 'border-gray-300 bg-white text-gray-900'
                        }`}
                      />
                      <span
                        className={`${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        } text-xs sm:text-sm whitespace-nowrap`}
                      >
                        min
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomExpiration(false);
                          setIsDropdownOpen(false);
                        }}
                        className={`px-3 py-2 rounded text-sm ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        Options
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      id="expiration"
                      onClick={() => !isExpirationDisabled && setIsDropdownOpen(!isDropdownOpen)}
                      disabled={isExpirationDisabled}
                      className={`w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg flex items-center justify-between ${
                        theme === 'dark'
                          ? 'border-gray-600 bg-gray-700 text-white'
                          : 'border-gray-300 bg-white text-gray-900'
                      } ${isExpirationDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <span>
                        {oneTimeView
                          ? 'Disabled for one-time'
                          : isCustomExpiration
                          ? 'Custom duration'
                          : expiration === 'never'
                          ? 'Never expires'
                          : expiration === '1440'
                          ? '24 hours'
                          : expiration + ' minutes'}
                      </span>
                      <span>▼</span>
                    </button>
                  )}
                  {isDropdownOpen && !isExpirationDisabled && !isCustomExpiration && (
                    <div className="absolute top-full left-0 z-50 mt-1 w-full border rounded-lg shadow-lg overflow-hidden">
                      <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
                        {['never', '5', '30', '1440', 'custom'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              if (opt === 'custom') {
                                setIsCustomExpiration(true);
                              } else {
                                setIsCustomExpiration(false);
                                setExpiration(opt);
                              }
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-3 sm:px-4 py-2 text-sm text-left hover:bg-indigo-100 ${
                              theme === 'dark'
                                ? 'text-white hover:bg-gray-600'
                                : 'text-gray-900'
                            } ${
                              (opt === expiration && !isCustomExpiration) ||
                              (opt === 'custom' && isCustomExpiration)
                                ? 'bg-indigo-600 text-white'
                                : ''
                            }`}
                          >
                            {opt === 'never'
                              ? 'Never expires'
                              : opt === '1440'
                              ? '24 hours'
                              : opt === 'custom'
                              ? 'Custom duration'
                              : opt + ' minutes'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Link */}
              <div className="md:flex-1">
                <label
                  className={`block text-xs font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Custom link (optional)
                </label>
                <input
                  type="text"
                  value={customLink}
                  onChange={(e) =>
                    setCustomLink(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))
                  }
                  placeholder="quicktext/prashant-note"
                  className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 text-xs sm:text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 placeholder-gray-400'
                      : 'bg-white placeholder-gray-500'
                  } ${
                    isAvailable === null
                      ? `${
                          theme === 'dark'
                            ? 'text-white border-gray-600'
                            : 'text-gray-900 border-gray-300'
                        }`
                      : isAvailable
                      ? 'border-green-500 text-green-600'
                      : 'border-red-500 text-red-600'
                  }`}
                />
              </div>

              {/* Generate Button */}
              <div className="md:ml-4 md:self-end w-full md:w-auto">
                <button
                  onClick={generateLink}
                  disabled={loading || !content.trim() || (isAvailable != null && !isAvailable)}
                  className="w-full md:w-auto px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 text-xs sm:text-sm"
                >
                  {loading ? 'Generating...' : 'Generate Link'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* After Generation */}
        {isGenerated && (
          <div
            className={`rounded-xl shadow-lg p-4 mb-4 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="mb-2">
              <p
                className={`${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                } text-sm font-semibold`}
              >
                Share
              </p>
              <p
                className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                } text-xs`}
              >
                Your link is ready. Copy and share it.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={generatedUrl}
                className={`flex-1 px-3 py-2 border rounded-lg text-xs sm:text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedUrl);
                  setShowPopup(true);
                  setTimeout(() => setShowPopup(false), 1200);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm"
              >
                Copy
              </button>
              <button
                onClick={() => {
                  setContent('');
                  setIsGenerated(false);
                  setCustomLink('');
                  setIsCustomExpiration(false);
                  setOneTimeView(false);
                  setExpiration('30');
                  setCustomExpirationMinutes('');
                  navigate('/');
                }}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                Create another
              </button>
            </div>
          </div>
        )}

        {showPopup && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg text-sm">
            Link copied!
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTextPage;
