import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className={`${
      theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
    } border-b sticky top-0 z-30 shadow-sm`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="pl-2 sm:pl-0">
            <Link to="/" className={`font-bold text-2xl sm:text-3xl md:text-4xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:opacity-80 transition-opacity`}>
              {(import.meta.env.VITE_APP_NAME || 'Quick')}
              <span className="text-indigo-600">Text</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 sm:px-3 sm:py-2 rounded-lg transition-all hover:scale-110 ${
                theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="text-base sm:text-lg">{theme === 'dark' ? '☀️' : '🌙'}</span>
            </button>

            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <>
                {location.pathname !== '/signup' && (
                  <button
                    onClick={() => navigate('/signup')}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Sign Up
                  </button>
                )}
                {location.pathname !== '/login' && (
                  <button
                    onClick={() => navigate('/login')}
                    className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Login
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar


