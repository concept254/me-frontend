import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const API = import.meta.env.VITE_API_URL

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', pwd: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!form.email || !form.pwd) return setError('All fields required')
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(API + '/api/me/auth/signin', form)
      if (!res.data.verified) {
        return setError('Please verify your email before signing in. Check your inbox.')
      }
      signIn(res.data)
      // Redirect admin to admin panel, others to home
      if (res.data.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight">
            Klaus<span className="text-indigo-400">.</span>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Sign in to access exclusive content</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">Sign In</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={form.pwd}
                onChange={e => setForm({ ...form, pwd: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <p className="text-gray-500 text-sm text-center mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 transition">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          <Link to="/" className="hover:text-gray-400 transition">← Back to portfolio</Link>
        </p>
      </div>
    </div>
  )
}