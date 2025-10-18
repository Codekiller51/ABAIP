import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit2 as Edit, Trash2, Briefcase, Star, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Database } from '../../lib/supabase'
import { ServiceEditor } from '../components/services/ServiceEditor'
import toast from 'react-hot-toast'

type Service = Database['public']['Tables']['services']['Row']

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showEditor, setShowEditor] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  useEffect(() => {
    fetchServices()
  }, [statusFilter])

  const fetchServices = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('services')
        .select('*')
        .order('order_index', { ascending: true })

      if (statusFilter !== 'all') {
        query = query.eq('active', statusFilter === 'active')
      }

      const { data, error } = await query

      if (error) throw error
      setServices(data || [])
    } catch (error: any) {
      toast.error('Failed to fetch services')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error

      setServices(services.filter(service => service.id !== id))
      toast.success('Service deleted successfully')
    } catch (error: any) {
      toast.error('Failed to delete service')
      console.error('Error:', error)
    }
  }

  const handleStatusToggle = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ active: !active })
        .eq('id', id)

      if (error) throw error

      setServices(services.map(service => 
        service.id === id ? { ...service, active: !active } : service
      ))
      toast.success(`Service ${!active ? 'activated' : 'deactivated'} successfully`)
    } catch (error: any) {
      toast.error('Failed to update service status')
      console.error('Error:', error)
    }
  }

  const handleOrderChange = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = services.findIndex(s => s.id === id)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= services.length) return

    try {
      const currentService = services[currentIndex]
      const swapService = services[newIndex]

      // Swap order indices
      await Promise.all([
        supabase
          .from('services')
          .update({ order_index: swapService.order_index })
          .eq('id', currentService.id),
        supabase
          .from('services')
          .update({ order_index: currentService.order_index })
          .eq('id', swapService.id)
      ])

      // Update local state
      const newServices = [...services]
      newServices[currentIndex] = { ...currentService, order_index: swapService.order_index }
      newServices[newIndex] = { ...swapService, order_index: currentService.order_index }
      newServices.sort((a, b) => a.order_index - b.order_index)
      setServices(newServices)

      toast.success('Service order updated')
    } catch (error: any) {
      toast.error('Failed to update service order')
      console.error('Error:', error)
    }
  }

  const handleEdit = (service: Service) => {
    setSelectedService(service)
    setShowEditor(true)
  }

  const handleCreate = () => {
    setSelectedService(null)
    setShowEditor(true)
  }

  const handleSave = (service: Service) => {
    if (selectedService) {
      setServices(services.map(s => s.id === service.id ? service : s))
    } else {
      setServices([...services, service])
    }
    setShowEditor(false)
    setSelectedService(null)
  }

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Services Management</h1>
          <p className="text-neutral-600 mt-2">
            Manage your service offerings and descriptions
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Services</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">{services.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Active</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {services.filter(s => s.active).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Inactive</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {services.filter(s => !s.active).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-100">
              <EyeOff className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Avg Features</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {services.length > 0
                  ? Math.round(services.reduce((acc, s) => acc + (s.features?.length || 0), 0) / services.length)
                  : 0
                }
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Services</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Briefcase className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No services found</h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first service'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreate}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Add Service
              </button>
            )}
          </div>
        ) : (
          filteredServices.map((service, index) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Service Header */}
              <div className={`h-32 bg-gradient-to-r ${service.color} relative`}>
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Briefcase className="h-12 w-12 text-white/80" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    service.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {service.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Order Controls */}
                <div className="absolute top-3 right-3 flex flex-col space-y-1">
                  <button
                    onClick={() => handleOrderChange(service.id, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleOrderChange(service.id, 'down')}
                    disabled={index === filteredServices.length - 1}
                    className="p-1 rounded bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>

                {/* Action Icons */}
                <div className="absolute bottom-3 right-3 flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
                    title="Edit Service"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleStatusToggle(service.id, service.active)}
                    className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
                    title={service.active ? 'Deactivate' : 'Activate'}
                  >
                    {service.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-red-500/80 transition-all duration-200"
                    title="Delete Service"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-neutral-600 text-sm line-clamp-3">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                      Features ({service.features.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {feature}
                        </span>
                      ))}
                      {service.features.length > 3 && (
                        <span className="text-xs text-neutral-500">
                          +{service.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Index */}
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <span>Order: {service.order_index}</span>
                  <span>Updated: {new Date(service.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Service Editor Modal */}
      {showEditor && (
        <ServiceEditor
          service={selectedService}
          isOpen={showEditor}
          onClose={() => {
            setShowEditor(false)
            setSelectedService(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}