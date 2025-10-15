import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Scale, Mail, Lock } from 'lucide-react'

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

type FormData = yup.InferType<typeof schema>

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { user, signIn, resetPassword, loading } = useAuth()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors, isSubmitting: isResetting },
  } = useForm<{ email: string }>({
    resolver: yupResolver(yup.object({ email: yup.string().email().required() })),
  })

  // Redirect if already logged in
  if (user) {
    const from = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  const onSubmit = async (data: FormData) => {
    try {
      await signIn(data.email, data.password)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const onResetSubmit = async (data: { email: string }) => {
    try {
      await resetPassword(data.email)
      setShowForgotPassword(false)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Scale className="h-10 w-10 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">ABA IP</h1>
                <p className="text-sm text-neutral-600">Dashboard</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-neutral-900">Reset Password</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmitReset(onResetSubmit)}>
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  {...registerReset('email')}
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
              {resetErrors.email && (
                <p className="mt-1 text-sm text-red-600">{resetErrors.email.message}</p>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 py-3 px-4 border border-neutral-300 rounded-xl text-neutral-700 font-medium hover:bg-neutral-50 transition-colors duration-200"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={isResetting}
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isResetting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Scale className="h-10 w-10 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">ABA IP</h1>
              <p className="text-sm text-neutral-600">Dashboard</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Access the content management system
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Forgot your password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting || loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-neutral-500">
            © 2025 ABA IP Law Firm. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}