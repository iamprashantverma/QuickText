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
    } border-b sticky top-0 z-30`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link to="/" className={`font-bold text-2xl sm:text-3xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {(import.meta.env.VITE_APP_NAME || 'Quick')}
          <span className="text-indigo-600">Text</span>
        </Link>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={toggleTheme}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
            }`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm"
            >
              Dashboard
            </button>
          ) : (
            location.pathname !== '/login' && (
              <button
                onClick={() => navigate('/login')}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                Login
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar


