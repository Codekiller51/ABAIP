import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { 
  X, 
  Save, 
  User, 
  Mail, 
  Shield,
  Eye,
  EyeOff,
  Crown,
  UserCheck
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { Database } from '../../../lib/supabase'
import toast from 'react-hot-toast'

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']

const schema = yup.object({
  first_name: yup.string().required('First name is required').max(50, 'First name must be less than 50 characters'),
  last_name: yup.string().required('Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  role: yup.string().oneOf(['super_admin', 'content_manager', 'editor']).required('Role is required'),
  avatar_url: yup.string().url('Must be a valid URL').nullable(),
  password: yup.string().when('$isNew', {
    is: true,
    then: (schema) => schema.required('Password is required').min(6, 'Password must be at least 6 characters'),
    otherwise: (schema) => schema.min(6, 'Password must be at least 6 characters')
  })
})

type FormData = yup.InferType<typeof schema>

interface UserEditorProps {
  user?: User | null
  isOpen: boolean
  onClose: () => void
  onSave: (user: User) => void
}

export const UserEditor: React.FC<UserEditorProps> = ({
  user,
  isOpen,
  onClose,
  onSave
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    context: { isNew: !user },
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role: 'editor',
      avatar_url: '',
      password: ''
    }
  })

  const watchedRole = watch('role')

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url || '',
        password: ''
      })
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        role: 'editor',
        avatar_url: '',
        password: ''
      })
    }
  }, [user, reset])

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)

      if (user) {
        // Update existing user
        const updateData: Partial<UserInsert> = {
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role as any,
          avatar_url: data.avatar_url || null,
          updated_at: new Date().toISOString()
        }

        const { data: updatedUser, error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', user.id)
          .select()
          .single()

        if (error) throw error

        // Update password if provided
        if (data.password) {
          const { error: passwordError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: data.password }
          )
          if (passwordError) throw passwordError
        }

        toast.success('User updated successfully')
        onSave(updatedUser)
      } else {
        // Create new user
        const { data: newUser, error: signUpError } = await supabase.auth.admin.createUser({
          email: data.email,
          password: data.password,
          email_confirm: true
        })

        if (signUpError) throw signUpError

        // Create user profile
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .insert({
            id: newUser.user.id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role as any,
            avatar_url: data.avatar_url || null
          })
          .select()
          .single()

        if (profileError) throw profileError

        toast.success('User created successfully')
        onSave(userProfile)
      }

      onClose()
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('A user with this email already exists')
      } else {
        toast.error('Failed to save user')
      }
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return Crown
      case 'content_manager': return UserCheck
      case 'editor': return User
      default: return User
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Full access to all features including user management'
      case 'content_manager': return 'Can manage content, team, and services but not users'
      case 'editor': return 'Can create and edit content with limited publishing rights'
      default: return ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                {user ? 'Edit User' : 'Add New User'}
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                {user ? 'Update user information and permissions' : 'Create a new user account'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary-600" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      First Name *
                    </label>
                    <input
                      {...register('first_name')}
                      type="text"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter first name..."
                    />
                    {errors.first_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      {...register('last_name')}
                      type="text"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter last name..."
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    disabled={!!user}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    placeholder="Enter email address..."
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                  {user && (
                    <p className="text-xs text-neutral-500 mt-1">Email cannot be changed after creation</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    {...register('avatar_url')}
                    type="url"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {errors.avatar_url && (
                    <p className="mt-1 text-sm text-red-600">{errors.avatar_url.message}</p>
                  )}
                </div>
              </div>

              {/* Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary-600" />
                  Security & Permissions
                </h3>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Role *
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'editor', label: 'Editor' },
                      { value: 'content_manager', label: 'Content Manager' },
                      { value: 'super_admin', label: 'Super Admin' }
                    ].map((role) => {
                      const RoleIcon = getRoleIcon(role.value)
                      return (
                        <label
                          key={role.value}
                          className={`relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            watchedRole === role.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <input
                            {...register('role')}
                            type="radio"
                            value={role.value}
                            className="sr-only"
                          />
                          <div className="flex items-start space-x-3">
                            <RoleIcon className={`h-5 w-5 mt-0.5 ${
                              watchedRole === role.value ? 'text-primary-600' : 'text-neutral-400'
                            }`} />
                            <div>
                              <div className={`font-medium ${
                                watchedRole === role.value ? 'text-primary-900' : 'text-neutral-900'
                              }`}>
                                {role.label}
                              </div>
                              <div className={`text-sm mt-1 ${
                                watchedRole === role.value ? 'text-primary-700' : 'text-neutral-600'
                              }`}>
                                {getRoleDescription(role.value)}
                              </div>
                            </div>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {user ? 'New Password (leave blank to keep current)' : 'Password *'}
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder={user ? 'Enter new password...' : 'Enter password...'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-neutral-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-neutral-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Save User'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}