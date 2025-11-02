import  { useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'
import { uploadProfileImage } from '../../services/api/user';
import {toast} from 'react-hot-toast';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const updateProfileImage = async (e) => {

      const file = e.target.files?.[0]

      if (!file) return
        try {
          setUploading(true)
          
          const {data} = await uploadProfileImage(file);
            updateUser(data.data);
           toast.success("Profile picture updated successfully ");
        } catch (err) {
          if (err?.response.data?.error?.message)
            toast.error(err?.response.data?.error?.message);

          console.error('Profile image upload failed', err)
        } finally {
          setUploading(false)
          if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

  return (
    <div className={`${
      theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
    } border-b sticky top-0 z-30 shadow-sm`}>
      <div className="max-w-4xl mx-auto px-3 sm:px-5 lg:px-4 xl:px-3 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="pl-1 sm:pl-0 lg:-ml-1 xl:-ml-2">
            <Link to="/" className={`font-bold text-xl sm:text-2xl md:text-3xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:opacity-80 transition-opacity`}>
              {(import.meta.env.VITE_APP_NAME || 'Quick')}
              <span className="text-indigo-600">Text</span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-5 xl:gap-6 flex-wrap lg:-mr-1 xl:-mr-2">
            <button
              onClick={toggleTheme}
              className={`p-1.5 sm:px-3 sm:py-2 rounded-lg transition-all hover:scale-110 ${
                theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="text-sm sm:text-base">{theme === 'dark' ? '☀️' : '🌙'}</span>
            </button>

            {user ? (
              <>
                <button
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  title={uploading ? 'Uploading...' : 'Change profile image'}
                  className="relative"
                >
                  {user?.profileImageUrl || user?.profileUrl || user?.picture ? (
                    <img
                      src={user.profileImageUrl || user.profileUrl || user.picture}
                      alt="Profile"
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white/30 ${uploading ? 'opacity-60' : ''}`}
                    />
                  ) : (
                    <span
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                      } ${uploading ? 'opacity-60' : ''}`}
                    >
                      {(user?.name || user?.username || user?.email || 'U')
                        .toString()
                        .trim()
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={updateProfileImage}
                />
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white rounded-lg text-[11px] sm:text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { logout();  toast.success("Logout successfully"); navigate('/',{replace:true}) }}
                  className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-medium transition-colors ${
                    theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {location.pathname !== '/signup' && (
                  <button
                    onClick={() => navigate("/signup", { replace: true })}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Sign Up
                  </button>
                )}
                {location.pathname !== '/login' && (
                  <button
                    onClick={ () => navigate("/login", { replace: true }) }
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


