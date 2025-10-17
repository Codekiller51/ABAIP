import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { 
  X, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Linkedin, 
  Image, 
  GraduationCap,
  Briefcase,
  Star,
  Plus
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { Database } from '../../../lib/supabase'
import toast from 'react-hot-toast'

type TeamMember = Database['public']['Tables']['team_members']['Row']
type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert']

const schema = yup.object({
  name: yup.string().required('Name is required').max(100, 'Name must be less than 100 characters'),
  title: yup.string().required('Title is required').max(100, 'Title must be less than 100 characters'),
  bio: yup.string().required('Bio is required').max(1000, 'Bio must be less than 1000 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().nullable(),
  linkedin: yup.string().url('Must be a valid URL').nullable(),
  image_url: yup.string().url('Must be a valid URL').nullable(),
  experience: yup.string().required('Experience is required').max(50, 'Experience must be less than 50 characters'),
  specialties: yup.array().of(yup.string()),
  education: yup.array().of(yup.string()),
  order_index: yup.number().min(0, 'Order must be 0 or greater'),
  active: yup.boolean()
})

type FormData = yup.InferType<typeof schema>

interface TeamMemberEditorProps {
  member?: TeamMember | null
  isOpen: boolean
  onClose: () => void
  onSave: (member: TeamMember) => void
}

export const TeamMemberEditor: React.FC<TeamMemberEditorProps> = ({
  member,
  isOpen,
  onClose,
  onSave
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [specialtyInput, setSpecialtyInput] = useState('')
  const [educationInput, setEducationInput] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      email: '',
      phone: '',
      linkedin: '',
      image_url: '',
      experience: '',
      specialties: [],
      education: [],
      order_index: 0,
      active: true
    }
  })

  const watchedSpecialties = watch('specialties') || []
  const watchedEducation = watch('education') || []

  useEffect(() => {
    if (member) {
      reset({
        name: member.name,
        title: member.title,
        bio: member.bio,
        email: member.email,
        phone: member.phone || '',
        linkedin: member.linkedin || '',
        image_url: member.image_url || '',
        experience: member.experience,
        specialties: member.specialties || [],
        education: member.education || [],
        order_index: member.order_index,
        active: member.active
      })
    } else {
      reset({
        name: '',
        title: '',
        bio: '',
        email: '',
        phone: '',
        linkedin: '',
        image_url: '',
        experience: '',
        specialties: [],
        education: [],
        order_index: 0,
        active: true
      })
    }
  }, [member, reset])

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)

      const memberData: TeamMemberInsert = {
        name: data.name,
        title: data.title,
        bio: data.bio,
        email: data.email,
        phone: data.phone || null,
        linkedin: data.linkedin || null,
        image_url: data.image_url || null,
        experience: data.experience,
        specialties: data.specialties || [],
        education: data.education || [],
        order_index: data.order_index || 0,
        active: data.active
      }

      let result
      if (member) {
        // Update existing member
        result = await supabase
          .from('team_members')
          .update(memberData)
          .eq('id', member.id)
          .select()
          .single()
      } else {
        // Create new member
        result = await supabase
          .from('team_members')
          .insert(memberData)
          .select()
          .single()
      }

      if (result.error) throw result.error

      toast.success(member ? 'Team member updated successfully' : 'Team member created successfully')
      onSave(result.data)
      onClose()
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('A team member with this email already exists')
      } else {
        toast.error('Failed to save team member')
      }
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addSpecialty = () => {
    if (specialtyInput.trim() && !watchedSpecialties.includes(specialtyInput.trim())) {
      setValue('specialties', [...watchedSpecialties, specialtyInput.trim()])
      setSpecialtyInput('')
    }
  }

  const removeSpecialty = (specialty: string) => {
    setValue('specialties', watchedSpecialties.filter(s => s !== specialty))
  }

  const addEducation = () => {
    if (educationInput.trim() && !watchedEducation.includes(educationInput.trim())) {
      setValue('education', [...watchedEducation, educationInput.trim()])
      setEducationInput('')
    }
  }

  const removeEducation = (education: string) => {
    setValue('education', watchedEducation.filter(e => e !== education))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-xl overflow-hidden">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                {member ? 'Edit Team Member' : 'Add New Team Member'}
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                {member ? 'Update team member information' : 'Add a new team member to your organization'}
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

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter full name..."
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Managing Partner, Senior Attorney..."
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Biography *
                  </label>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Write a brief biography..."
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Experience *
                  </label>
                  <input
                    {...register('experience')}
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 10+ years, 5 years..."
                  />
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-primary-600" />
                  Contact Information
                </h3>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    {...register('linkedin')}
                    type="url"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                  {errors.linkedin && (
                    <p className="mt-1 text-sm text-red-600">{errors.linkedin.message}</p>
                  )}
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                  <Image className="h-5 w-5 mr-2 text-primary-600" />
                  Profile Image
                </h3>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Image URL
                  </label>
                  <input
                    {...register('image_url')}
                    type="url"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/profile-image.jpg"
                  />
                  {errors.image_url && (
                    <p className="mt-1 text-sm text-red-600">{errors.image_url.message}</p>
                  )}
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-primary-600" />
                  Specialties
                </h3>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Areas of Expertise
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={specialtyInput}
                      onChange={(e) => setSpecialtyInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Add specialty and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addSpecialty}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {watchedSpecialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                      >
                        {specialty}
                        <button
                          type="button"
                          onClick={() => removeSpecialty(specialty)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary-600" />
                  Education
                </h3>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Educational Background
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={educationInput}
                      onChange={(e) => setEducationInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEducation())}
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Add education and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addEducation}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {watchedEducation.map((education, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent-100 text-accent-800"
                      >
                        {education}
                        <button
                          type="button"
                          onClick={() => removeEducation(education)}
                          className="ml-2 text-accent-600 hover:text-accent-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-primary-600" />
                  Settings
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Order Index */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Display Order
                    </label>
                    <input
                      {...register('order_index')}
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0"
                    />
                    {errors.order_index && (
                      <p className="mt-1 text-sm text-red-600">{errors.order_index.message}</p>
                    )}
                  </div>

                  {/* Active Status */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Status
                    </label>
                    <div className="flex items-center space-x-3 mt-3">
                      <input
                        {...register('active')}
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <span className="text-sm text-neutral-700">Active (visible on website)</span>
                    </div>
                  </div>
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
                  <span>{isSubmitting ? 'Saving...' : 'Save Member'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}