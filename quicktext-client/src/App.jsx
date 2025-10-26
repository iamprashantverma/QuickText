import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/context/AuthContext'
import { ThemeProvider } from './hooks/context/ThemeProvider'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CreateTextPage from './pages/CreateTextPage'
import DashboardPage from './pages/DashboardPage'
import ViewTextPage from './pages/ViewTextPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/create" element={<CreateTextPage />} />
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
