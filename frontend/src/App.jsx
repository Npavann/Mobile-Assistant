import { Routes, Route } from 'react-router-dom'
import Chat from './pages/Chat'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'
import Favorites from "./pages/Favorites"

function App() {
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/favorites" element={<Favorites />} />
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
  )
}

export default App