import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Notification from '../components/Notification'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [notification, setNotification] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!token) {
      setNotification({ message: 'Invalid reset link', type: 'error' })
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      setNotification({ message: 'Please fill all fields', type: 'error' })
      return
    }

    if (password.length < 8) {
      setNotification({ message: 'Password must be at least 8 characters', type: 'error' })
      return
    }

    if (password !== confirmPassword) {
      setNotification({ message: 'Passwords do not match', type: 'error' })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setNotification({ message: 'Password reset successful!', type: 'success' })
      } else {
        setNotification({ message: data.message || 'Failed to reset password', type: 'error' })
      }
    } catch (error) {
      setNotification({ message: 'Network error. Please try again.', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link to="/" className="mb-12 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-[#2F5B8C] rounded-lg flex items-center justify-center text-white font-bold">
          M
        </div>
        <span className="text-xl font-bold text-[#2F5B8C]">MediTrack</span>
      </Link>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Reset Password Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {!isSuccess ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Reset Password</h2>
              <p className="text-[#6B7280]">Enter your new password below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5B8C] focus:border-transparent"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151]"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.563-2.037m2.478-2.478A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.563 2.037m-2.478 2.478L12 12m0 0l-2.625 2.625" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-[#6B7280]">Must be at least 8 characters</p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5B8C] focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#2F5B8C] hover:bg-[#264a73] disabled:bg-gray-400 text-white font-medium rounded-xl transition-colors"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Password Reset!</h2>
            <p className="text-[#6B7280] mb-6">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <button
              onClick={handleGoToLogin}
              className="w-full py-3 px-4 bg-[#2F5B8C] hover:bg-[#264a73] text-white font-medium rounded-xl transition-colors"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
