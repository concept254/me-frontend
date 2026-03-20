import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/home'
import Blog from './pages/blog'
import BlogPost from './pages/blog/Post'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/index'
import Signup from './pages/signup'
import Login from './pages/login'
import Verify from './pages/verify'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
          </>
        } />
      </Routes>
    </div>
  )
}

export default App