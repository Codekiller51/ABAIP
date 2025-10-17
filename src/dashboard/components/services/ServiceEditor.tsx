import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { 
  X, 
  Save, 
  Briefcase, 
  Image, 
  Star,
  Plus,
  Palette
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { Database } from '../../../lib/supabase'
import toast from 'react-hot-toast'

type Service = Database['public']['Tables']['services']['Row']
type ServiceInsert = Database['public']['Tables']['services']['Insert']

const schema = yup.object({
  title: yup.string().required('Title is required').max(100, 'Title must be less than 100 characters'),
  description: yup.string().required('Description is required').max(500, 'Description must be less than 500 characters'),
  icon: yup.string().required('Icon is required'),
  color: yup.string().required('Color is required'),
  image_url: yup.string().url('Must be a valid URL').nullable(),
  features: yup.array().of(yup.string()),
  order_index: yup.number().min(0, 'Order must be 0 or greater'),
  active: yup.boolean()
})

type FormData = yup.InferType<typeof schema>

interface ServiceEditorProps {
  service?: Service | null
  isOpen: boolean
  onClose: () => void
  onSave: (service: Service) => void
}

const iconOptions = [
  'Shield', 'Award', 'FileText', 'Lock', 'Scale', 'Briefcase', 'Star', 'Zap', 'Globe', 'Users'
]

const colorOptions = [
  { name: 'Primary Blue', value: 'from-primary-500 to-primary-600' },
  { name: 'Accent Red', value: 'from-accent-500 to-accent-600' },
  { name: 'Primary Dark', value: 'from-primary-600 to-primary-700' },
  { name: 'Accent Dark', value: 'from-accent-600 to-accent-700' },
  { name: 'Primary Darker', value: 'from-primary-700 to-primary-800' },
  { name: 'Accent Darker', value: 'from-accent-700 to-accent-800' },
  { name: 'Green', value: 'from-green-500 to-green-600' },
  { name: 'Purple', value: 'from-purple-500 to-purple-600' },
  { name: 'Orange', value: 'from-orange-500 to-orange-600' },
  { name: 'Teal', value: 'from-teal-500 to-teal-600' }
]

export const ServiceEditor: React.FC<ServiceEditorProps> = ({
  service,
  isOpen,
  onClose,
  onSave
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [featureInput, setFeatureInput] = useState('')

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
      title: '',
      description: '',
      icon: 'Briefcase',
      color: 'from-primary-500 to-primary-600',
      image_url: '',
      features: [],
      order_index: 0,
      active: true
    }
  })

  const watchedFeatures = watch('features') || []
  const watchedColor = watch('color')

  useEffect(() => {
    if (service) {
      reset({
        title: service.title,
        description: service.description,
        icon: service.icon,
        color: service.color,
        image_url: service.image_url || '',
        features: service.features || [],
        order_index: service.order_index,
        active: service.active
      })
    } else {
      reset({
        title: '',
        description: '',
        icon: 'Briefcase',
        color: 'from-primary-500 to-primary-600',
        image_url: '',
        features: [],
        order_index: 0,
        active: true
      })
    }
  }, [service, reset])

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)

      const serviceData: ServiceInsert = {
        title: data.title,
        description: data.description,
        icon: data.icon,
        color: data.color,
        image_url: data.image_url || null,
        features: data.features || [],
        order_index: data.order_index || 0,
        active: data.active
      }

      let result
      if (service) {
        // Update existing service
        result = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', service.id)
          .select()
          .single()
      } else {
        // Create new service
        result = await supabase
          .from('services')
          .insert(serviceData)
          .select()
          .single()
      }

      if (result.error) throw result.error

      toast.success(service ? 'Service updated successfully' : 'Service created successfully')
      onSave(result.data)
      onClose()
    } catch (error: any) {
      toast.error('Failed to save service')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addFeature = () => {
    if (featureInput.trim() && !watchedFeatures.includes(featureInput.trim())) {
      setValue('features', [...watchedFeatures, featureInput.trim()])
      setFeatureInput('')
    }
  }

  const removeFeature = (feature: string) => {
    setValue('features', watchedFeatures.filter(f => f !== feature))
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
                {service ? 'Edit Service' : 'Add New Service'}
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                {service ? 'Update service information' : 'Add a new service to your offerings'}
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
                  <Briefcase className="h-5 w-5 mr-2 text-primary-600" />
                  Basic Information
                </h3>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Service Title *
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl bg-white text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-300"
                    placeholder="Enter service title..."
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl bg-white text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-300 resize-none"
                    placeholder="Describe the service..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>

              {/* Visual Design */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-primary-600" />
                  Visual Design
                </h3>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Icon *
                  </label>
                  <select
                    {...register('icon')}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl bg-white text-neutral-900 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-300"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                  {errors.icon && (
                    <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>
                  )}
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Color Scheme *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {colorOptions.map((color) => (
                      <label
                        key={color.value}
                        className={`relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          watchedColor === color.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <input
                          {...register('color')}
                          type="radio"
                          value={color.value}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${color.value} mr-3`}></div>
                        <span className="text-sm font-medium text-neutral-700">{color.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.color && (
                    <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
                  )}
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Header Image URL
                  </label>
                  <input
                    {...register('image_url')}
                    type="url"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl bg-white text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-300"
                    placeholder="https://example.com/service-image.jpg"
                  />
                  {errors.image_url && (
                    <p className="mt-1 text-sm text-red-600">{errors.image_url.message}</p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-primary-600" />
                  Service Features
                </h3>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Features & Benefits
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Add feature and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {watchedFeatures.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
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
                  <span>{isSubmitting ? 'Saving...' : 'Save Service'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}