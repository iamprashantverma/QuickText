import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/context/AuthContext'
import { ThemeProvider } from './hooks/context/ThemeProvider'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CreateTextPage from './pages/CreateTextPage'
import DashboardPage from './pages/DashboardPage'
import ViewTextPage from './pages/ViewTextPage'
import Home from './pages/Home'
import Navbar from './components/ui/Navbar'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* removed /create route */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/text/:shareId" element={<ViewTextPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
