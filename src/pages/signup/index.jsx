import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', pwd: '', confirm: '' })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.pwd) return setError('All fields are required')
    if (form.pwd !== form.confirm) return setError('Passwords do not match')
    if (form.pwd.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    setError(null)
    try {
      await axios.post(API + '/api/me/auth/signup', {
        name: form.name,
        email: form.email,
        pwd: form.pwd
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed, please try again')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="text-6xl mb-6">📧</div>
        <h2 className="text-2xl font-black text-white mb-3">Check your inbox!</h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          We sent a verification email to <span className="text-indigo-400">{form.email}</span>. Click the link in the email to activate your account and unlock full access.
        </p>
        <p className="text-gray-500 text-sm">
          Already verified?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight">
            Klaus<span className="text-indigo-400">.</span>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Create an account to unlock full access</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-2">Sign Up</h2>
          <p className="text-gray-500 text-sm mb-6">Get access to my PDF resume, references and more.</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
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
                placeholder="Min 6 characters"
                value={form.pwd}
                onChange={e => setForm({ ...form, pwd: e.target.value })}
                className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
                className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>

          <p className="text-gray-500 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition">
              Sign in
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