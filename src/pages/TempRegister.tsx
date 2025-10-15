import React from 'react'
import { RegisterForm } from '../dashboard/components/auth/RegisterForm'
import { useNavigate } from 'react-router-dom'

const TempRegister = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900">
              Create Initial Admin User
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              This is a temporary registration page. Please create your first admin user and then remove this page.
            </p>
          </div>

          <RegisterForm
            onSuccess={() => {
              navigate('/dashboard/login')
            }}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-red-600 font-medium">
              Important: After creating your admin user, remove this page and route from the application for security.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TempRegister
