import { Routes, Route, NavLink } from 'react-router-dom'
import { MessageSquare, Database, Smartphone } from 'lucide-react'
import Chat from './pages/Chat'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'
import Favorites from "./pages/Favorites"
import { useAuth } from './context/AuthContext'

function App() {
  const { isAdmin } = useAuth();
  return (
<div className="app-container">
<div className="sidebar">
<div className="sidebar-header">
<Smartphone size={28} />
<span>MobileAssist AI</span>
</div>
<div className="nav-links">
{/* Chat Assistant */}
<NavLink
to="/"
className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
>
<MessageSquare size={20} />
<span>Chat Assistant</span>
</NavLink>
{/* Favorite Phones */}
<NavLink
to="/favorites"
className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
>
 <span>Favorite Phones</span>
</NavLink>
{/* Admin Panel */}
<NavLink
to={isAdmin ? "/admin" : "/admin-login"}
className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
>
<Database size={20} />
<span>Database Admin</span>
</NavLink>
</div>
</div>
<div className="main-content">
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
</div>
)
}
export default App
