import React from 'react'
import { useNavigate } from 'react-router-dom'
import CreateTextPage from './CreateTextPage'
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
          {/* App name removed; shown in Navbar */}
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto" />
        </div>

            <div className="text-center mb-6 sm:mb-8">
              <p className={`text-base sm:text-lg max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Paste your text or code and get a quick, shareable link—share snippets instantly with anyone, anywhere.
              </p>
            </div>

            {/* Create Text Page embedded here */}
            <div className="max-w-5xl mx-auto mb-6 sm:mb-8">
              <CreateTextPage />
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
