import React from 'react'
import CreateTextPage from './CreateTextPage'
import { useTheme } from '../hooks/useTheme'
const Home = () => {

  const { theme, } = useTheme()
  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-linear-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-linear-to-br from-blue-50 via-indigo-50 to-blue-100'
    }`}>
      <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-4">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className={`text-2xl sm:text-2xl md:text-3xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Share Instantly, <span className="text-indigo-600">Simply</span>
          </h1>
          <p className={`text-lg sm:text-l max-w-xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Paste your text or code and get a quick, shareable link. Share snippets instantly with anyone, anywhere.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-12 sm:mb-16">
          <CreateTextPage />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 max-w-6xl mx-auto">
          <div className={`rounded-xl shadow-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
              theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'
            }`}>
          <span className="text-3xl text-blue-500">⚡</span>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Lightning Fast</h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Create and share links in seconds. No signup required.</p>
          </div>

          <div className={`rounded-xl shadow-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
              theme === 'dark' ? 'bg-green-900' : 'bg-green-100'
            }`}>
              <span className="text-3xl">⌛</span>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Smart Expiration</h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Set custom expiration times or make links permanent.</p>
          </div>

          <div className={`rounded-xl shadow-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
              theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'
            }`}>
              <span className="text-3xl">🛡️</span>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Secure & Private</h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>One-time view options for sensitive content.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
