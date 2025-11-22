import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Plus } from "lucide-react";
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
  const [isCopied, setIsCopied] = useState(false);
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
      
      // Dispatch event to update count
      window.dispatchEvent(new Event('textCreated'));
      
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
            {/* Label and Action Buttons Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <label
                className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Paste your text or write  here
              </label>
              
              {/* Action Buttons - Show when generated */}
              {isGenerated && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedUrl);
                      setIsCopied(true);
                      setShowPopup(true);
                      setTimeout(() => {
                        setIsCopied(false);
                        setShowPopup(false);
                      }, 2000);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isCopied
                        ? 'bg-green-600 text-white'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    <Plus size={14} />
                    <span>New</span>
                  </button>
                </div>
              )}
            </div>
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
            <div className="flex flex-col gap-3 sm:gap-4 mb-4">
              {/* First Row: One Time View, Expiration, and Generate Button */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                {/* One Time View */}
                <div className="w-full md:flex-1">
                  <div className="flex items-center gap-2 h-full md:pb-2">
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
                      } text-sm whitespace-nowrap`}
                    >
                      One-time view
                    </label>
                  </div>
                </div>

                {/* Expiration */}
                <div className="w-full md:flex-1">
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
                        max="259200"
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
                          if (n > 259200) n = 259200;
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
                          ? 'Disabled'
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
                          className={`
                            w-full 
                            text-left
                            px-2 sm:px-3 md:px-4 
                            py-1.5 sm:py-2 
                            text-xs sm:text-sm md:text-base 
                            rounded-md 
                            transition-colors 
                            hover:bg-indigo-100 
                            ${
                              theme === 'dark'
                                ? 'text-white hover:bg-gray-600'
                                : 'text-gray-900'
                            } 
                            ${
                              (opt === expiration && !isCustomExpiration) ||
                              (opt === 'custom' && isCustomExpiration)
                                ? 'bg-indigo-600 text-white'
                                : ''
                            }
                          `}
                        >
                          {opt === 'never'
                            ? 'Never expires'
                            : opt === '1440'
                            ? '24 hours'
                            : opt === 'custom'
                            ? 'Custom duration'
                            : `${opt} minutes`}
                        </button>

                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

                {/* Generate Button */}
                <div className="w-full md:flex-1">
                  <button
                    onClick={generateLink}
                    disabled={loading || !content.trim() || (isAvailable != null && !isAvailable)}
                    className="w-full px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 text-xs sm:text-sm whitespace-nowrap"
                  >
                    {loading ? 'Generating...' : 'Generate Link'}
                  </button>
                </div>
              </div>

              {/* Second Row: Custom Link */}
              <div className="w-full">
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
                    setCustomLink(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                  }
                  placeholder="quicktext/prashant-note"
                  maxLength={50}
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
            </div>
          </div>
        )}

        {/* Link Display - Show below content when generated */}
        {isGenerated && (
          <div
            className={`rounded-xl shadow-lg p-3 sm:p-4 mb-4 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <label
              className={`block text-xs sm:text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Your shareable link
            </label>
            <div className="relative">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedUrl);
                  setShowPopup(true);
                  setTimeout(() => setShowPopup(false), 1200);
                }}
                className={`absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
                title="Copy link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              <input
                type="text"
                readOnly
                value={generatedUrl}
                onClick={(e) => e.target.select()}
                className={`w-full pl-10 pr-3 py-2 sm:py-2.5 border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
              />
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
