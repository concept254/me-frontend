import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const API = import.meta.env.VITE_API_URL

export default function Verify() {
  const [searchParams] = useSearchParams()
  const { signIn } = useAuth()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) return setStatus('invalid')

    axios.get(API + '/api/me/auth/verify?token=' + token)
      .then(res => {
        signIn(res.data.user)
        setStatus('success')
      })
      .catch(() => setStatus('invalid'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        {status === 'verifying' && (
          <>
            <div className="flex gap-2 justify-center mb-6">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
            </div>
            <p className="text-gray-400">Verifying your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-black text-white mb-3">Email Verified!</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Your account is now active. You have full access to my portfolio including my PDF resume and references.
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
            >
              Go to Portfolio
            </Link>
          </>
        )}

        {status === 'invalid' && (
          <>
            <div className="text-6xl mb-6">❌</div>
            <h2 className="text-2xl font-black text-white mb-3">Invalid Link</h2>
            <p className="text-gray-400 mb-8">
              This verification link is invalid or has already been used. Please sign up again or contact me directly.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
            >
              Sign Up Again
            </Link>
          </>
        )}
      </div>
    </div>
  )
}