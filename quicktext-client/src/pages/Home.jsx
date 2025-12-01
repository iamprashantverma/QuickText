import { useEffect, useState } from 'react'
import CreateTextPage from './CreateTextPage'
import { useTheme } from '../hooks/useTheme'
import { getTextShareCount } from '../services/api/textService'

const Home = () => {
  const { theme } = useTheme()
  const [shareCount, setShareCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [flippedCard, setFlippedCard] = useState(null)

  const fetchShareCount = async () => {
    try {
      const {data} = await getTextShareCount();
      setShareCount(data.data.value || 0)
    } catch (error) {
      console.error('Error fetching share count:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShareCount()
    
    // Listen for text creation event to refresh count
    const handleTextCreated = () => {
      fetchShareCount()
    }
    
    window.addEventListener('textCreated', handleTextCreated)
    
    return () => {
      window.removeEventListener('textCreated', handleTextCreated)
    }
  }, [])

  const formatCount = (count) => {
    if (count >= 1000000000) {
      return (count / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
    }
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    }
    return count.toString()
  }
  
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 max-w-6xl mx-auto">
          {/* Card 1: Lightning Fast */}
          <div 
            className="perspective-1000 group"
            onClick={(e) => {
              e.stopPropagation()
              setFlippedCard(flippedCard === 1 ? null : 1)
            }}
          >
            <div 
              className={`relative w-full h-[260px] sm:h-[280px] transition-all duration-[800ms] cursor-pointer hover:scale-105 ${
                flippedCard === 1 ? '[transform:rotateY(180deg)]' : ''
              }`}
              style={{ 
                transformStyle: 'preserve-3d',
                transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              {/* Front */}
              <div 
                className={`absolute inset-0 rounded-2xl shadow-xl p-6 sm:p-7 flex flex-col transition-all ${
                  theme === 'dark' 
                    ? 'bg-linear-to-br from-gray-800 to-gray-900 border border-gray-700' 
                    : 'bg-linear-to-br from-white to-gray-50'
                }`}
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg transition-transform group-hover:scale-110 ${
                  theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'
                }`}>
                  <span className="text-4xl">⚡</span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Lightning Fast</h3>
                <p className={`text-sm sm:text-base flex-1 leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>No login or signup needed. Start sharing instantly.</p>
                <div className={`flex items-center gap-2 mt-4 text-xs sm:text-sm font-semibold ${
                  theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                }`}>
                  <span>Learn more</span>
                  <span className="animate-pulse">→</span>
                </div>
              </div>
              {/* Back */}
              <div 
                className={`absolute inset-0 rounded-2xl shadow-2xl p-3 sm:p-4 flex flex-col overflow-hidden ${
                  theme === 'dark' 
                    ? 'bg-linear-to-br from-indigo-900 via-indigo-800 to-blue-900 border-2 border-indigo-600' 
                    : 'bg-linear-to-br from-indigo-100 via-indigo-50 to-blue-100 border-2 border-indigo-400'
                }`}
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    theme === 'dark' ? 'bg-indigo-700' : 'bg-indigo-200'
                  }`}>
                    <span className="text-lg">⚡</span>
                  </div>
                  <h3 className={`text-sm sm:text-base font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-indigo-900'
                  }`}>No Barriers</h3>
                </div>
                <div className="flex-1 space-y-1.5 overflow-hidden">
                  {['No account', 'No email', 'Just paste', 'Instant link'].map((item, i) => (
                    <div key={i} className={`flex items-center gap-1.5 p-1.5 rounded ${
                      theme === 'dark' ? 'bg-indigo-800/50' : 'bg-white/70'
                    }`}>
                      <span className="text-green-500 text-[10px] shrink-0">✓</span>
                      <span className={`text-[10px] ${
                        theme === 'dark' ? 'text-indigo-100' : 'text-indigo-900'
                      }`}>{item}</span>
                    </div>
                  ))}
                </div>
                <div className={`flex items-center gap-1 mt-2 text-[10px] sm:text-xs font-semibold ${
                  theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
                }`}>
                  <span>←</span>
                  <span>Back</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Smart Expiration */}
          <div 
            className="perspective-1000 group"
            onClick={(e) => {
              e.stopPropagation()
              setFlippedCard(flippedCard === 2 ? null : 2)
            }}
          >
            <div 
              className={`relative w-full h-[260px] sm:h-[280px] transition-all duration-[800ms] cursor-pointer hover:scale-105 ${
                flippedCard === 2 ? '[transform:rotateY(180deg)]' : ''
              }`}
              style={{ 
                transformStyle: 'preserve-3d',
                transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              {/* Front */}
              <div 
                className={`absolute inset-0 rounded-2xl shadow-xl p-6 sm:p-7 flex flex-col transition-all ${
                  theme === 'dark' 
                    ? 'bg-linear-to-br from-gray-800 to-gray-900 border border-gray-700' 
                    : 'bg-linear-to-br from-white to-gray-50'
                }`}
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg transition-transform group-hover:scale-110 ${
                  theme === 'dark' ? 'bg-green-900' : 'bg-green-100'
                }`}>
                  <span className="text-4xl">⌛</span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Smart Expiration</h3>
                <p className={`text-sm sm:text-base flex-1 leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>Custom expiration control from minutes to forever.</p>
                <div className={`flex items-center gap-2 mt-4 text-xs sm:text-sm font-semibold ${
                  theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                }`}>
                  <span>Learn more</span>
                  <span className="animate-pulse">→</span>
                </div>
              </div>
              {/* Back */}
              <div 
                className={`absolute inset-0 rounded-2xl shadow-2xl p-3 sm:p-4 flex flex-col overflow-hidden ${
                  theme === 'dark' 
                    ? 'bg-linear-to-br from-green-900 via-green-800 to-emerald-900 border-2 border-green-600' 
                    : 'bg-linear-to-br from-green-100 via-green-50 to-emerald-100 border-2 border-green-400'
                }`}
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    theme === 'dark' ? 'bg-green-700' : 'bg-green-200'
                  }`}>
                    <span className="text-lg">⌛</span>
                  </div>
                  <h3 className={`text-sm sm:text-base font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-green-900'
                  }`}>Full Control</h3>
                </div>
                <div className="flex-1 space-y-1.5 overflow-hidden">
                  {['5 min to 6 months', 'Custom time', 'One-time view', 'You decide'].map((item, i) => (
                    <div key={i} className={`flex items-center gap-1.5 p-1.5 rounded ${
                      theme === 'dark' ? 'bg-green-800/50' : 'bg-white/70'
                    }`}>
                      <span className="text-green-500 text-[10px] flex-shrink-0">✓</span>
                      <span className={`text-[10px] ${
                        theme === 'dark' ? 'text-green-100' : 'text-green-900'
                      }`}>{item}</span>
                    </div>
                  ))}
                </div>
                <div className={`flex items-center gap-1 mt-2 text-[10px] sm:text-xs font-semibold ${
                  theme === 'dark' ? 'text-green-300' : 'text-green-700'
                }`}>
                  <span>←</span>
                  <span>Back</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Secure & Private */}
          <div 
            className="perspective-1000 group"
            onClick={(e) => {
              e.stopPropagation()
              setFlippedCard(flippedCard === 3 ? null : 3)
            }}
          >
            <div 
              className={`relative w-full h-[260px] sm:h-[280px] transition-all duration-[800ms] cursor-pointer hover:scale-105 ${
                flippedCard === 3 ? '[transform:rotateY(180deg)]' : ''
              }`}
              style={{ 
                transformStyle: 'preserve-3d',
                transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              {/* Front */}
              <div 
                className={`absolute inset-0 rounded-2xl shadow-xl p-6 sm:p-7 flex flex-col transition-all ${
                  theme === 'dark' 
                    ? 'bg-linear-to-br from-gray-800 to-gray-900 border border-gray-700' 
                    : 'bg-linear-to-br from-white to-gray-50'
                }`}
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg transition-transform group-hover:scale-110 ${
                  theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'
                }`}>
                  <span className="text-4xl">🛡️</span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Secure & Private</h3>
                <p className={`text-sm sm:text-base flex-1 leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>Your data is protected with zero tracking.</p>
                <div className={`flex items-center gap-2 mt-4 text-xs sm:text-sm font-semibold ${
                  theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                }`}>
                  <span>Learn more</span>
                  <span className="animate-pulse">→</span>
                </div>
              </div>
              {/* Back */}
              <div 
                className={`absolute inset-0 rounded-2xl shadow-2xl p-3 sm:p-4 flex flex-col overflow-hidden ${
                  theme === 'dark' 
                    ? 'bg-linear-to-br from-purple-900 via-purple-800 to-violet-900 border-2 border-purple-600' 
                    : 'bg-linear-to-br from-purple-100 via-purple-50 to-violet-100 border-2 border-purple-400'
                }`}
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    theme === 'dark' ? 'bg-purple-700' : 'bg-purple-200'
                  }`}>
                    <span className="text-lg">🛡️</span>
                  </div>
                  <h3 className={`text-sm sm:text-base font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-purple-900'
                  }`}>Data Security</h3>
                </div>
                <div className="flex-1 space-y-1.5 overflow-hidden">
                  {['One-time delete', 'Server deleted', 'Zero tracking', 'Full privacy'].map((item, i) => (
                    <div key={i} className={`flex items-center gap-1.5 p-1.5 rounded ${
                      theme === 'dark' ? 'bg-purple-800/50' : 'bg-white/70'
                    }`}>
                      <span className="text-green-500 text-[10px] shrink-0">✓</span>
                      <span className={`text-[10px] ${
                        theme === 'dark' ? 'text-purple-100' : 'text-purple-900'
                      }`}>{item}</span>
                    </div>
                  ))}
                </div>
                <div className={`flex items-center gap-1 mt-2 text-[10px] sm:text-xs font-semibold ${
                  theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  <span>←</span>
                  <span>Back</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Count Section */}
        <div className="text-center mt-12 mb-8 px-4">
          <p className={`text-base sm:text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {loading ? (
              <span className="inline-block animate-pulse">Loading...</span>
            ) : (
              <>
                Over <span className={`font-bold text-xl sm:text-2xl ${
                  theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                }`}>{formatCount(shareCount)}+</span> texts have been shared securely
              </>
            )}
          </p>
          <p className={`text-sm sm:text-base mt-1 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Join thousands of users sharing content instantly
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
