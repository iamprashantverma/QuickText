import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

const Home = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-linear-to-br from-gray-900 to-gray-800' 
        : 'bg-linear-to-br from-blue-50 to-indigo-100'
    }`}>
      {/* Header Section */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h1 className={`text-3xl sm:text-4xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            {import.meta.env.VITE_APP_NAME || 'Quick'}<span className="text-indigo-600">Text</span>
          </h1>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Theme Toggle */}
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
                  className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/create')}
                  className="px-3 sm:px-4 py-2 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  Create Share
                </button>
              </>
            ) : (
              <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-xs sm:text-sm w-full sm:w-auto"
                  >
                    Login
                  </button>
              </>
            )}
          </div>
        </div>

            <div className="text-center mb-6 sm:mb-8">
              <p className={`text-base sm:text-lg max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Paste your text or code and get a quick, shareable link—share snippets instantly with anyone, anywhere.
              </p>
            </div>

            {/* Direct Create Section */}
            <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
              <div className={`rounded-xl shadow-lg p-4 sm:p-6 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Create Your Share</h2>
                <p className={`text-xs sm:text-sm text-center mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Start typing or paste your content below</p>
            <button
              onClick={() => navigate('/create')}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm sm:text-base"
            >
              Start Sharing Now
            </button>
          </div>
        </div>

            {/* Features Section - Smaller Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12 max-w-5xl mx-auto">
              <div className={`rounded-lg shadow-md p-4 transform transition-all hover:scale-105 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
              <span className="text-xl sm:text-2xl">🎨</span>
            </div>
                <h3 className={`text-base sm:text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Rich Formatting</h3>
                <p className={`text-xs sm:text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Bold, italic, underline, and lists</p>
          </div>

          <div className={`rounded-lg shadow-md p-4 transform transition-all hover:scale-105 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3">
              <span className="text-xl sm:text-2xl">⏱️</span>
            </div>
                <h3 className={`text-base sm:text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Smart Expiration</h3>
                <p className={`text-xs sm:text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Flexible time controls</p>
          </div>

          <div className={`rounded-lg shadow-md p-4 transform transition-all hover:scale-105 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mb-3">
              <span className="text-xl sm:text-2xl">🔒</span>
            </div>
                <h3 className={`text-base sm:text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Secure Sharing</h3>
                <p className={`text-xs sm:text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>One-time view options</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home
