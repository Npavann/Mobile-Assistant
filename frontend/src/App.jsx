import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Chat from './pages/Chat'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'
import Favorites from "./pages/Favorites"
import UserLogin from './pages/UserLogin'
import UserUpload from './pages/UserUpload'
import UserProtectedRoute from './components/UserProtectedRoute'
import { UserAuthProvider } from './context/UserAuthContext'
import AppLock from './pages/AppLock'

function App() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <AppLock onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <UserAuthProvider>
      <div style={{ height: "100vh", overflow: "hidden" }}>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route
            path="/user-upload"
            element={
              <UserProtectedRoute>
                <UserUpload />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </UserAuthProvider>
  )
}

export default App



