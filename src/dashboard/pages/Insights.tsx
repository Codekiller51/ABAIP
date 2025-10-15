import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, CreditCard as Edit, Trash2, Eye, Calendar, User, Tag, FileText, MoreHorizontal, Star, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Database } from '../../lib/supabase'
import { InsightEditor } from '../components/insights/InsightEditor'
import toast from 'react-hot-toast'

type Insight = Database['public']['Tables']['insights']['Row']

export const Insights: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [showEditor, setShowEditor] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)

  useEffect(() => {
    fetchInsights()
  }, [statusFilter])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('insights')
        .select('*')
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setInsights(data || [])
    } catch (error: any) {
      toast.error('Failed to fetch insights')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (insight: Insight) => {
    setSelectedInsight(insight)
    setShowEditor(true)
  }

  const handleCreate = () => {
    setSelectedInsight(null)
    setShowEditor(true)
  }

  const handleEditorClose = () => {
    setShowEditor(false)
    setSelectedInsight(null)
  }

  const handleEditorSave = (savedInsight: Insight) => {
    if (selectedInsight) {
      setInsights(insights.map(i => i.id === savedInsight.id ? savedInsight : i))
    } else {
      setInsights([savedInsight, ...insights])
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this insight?')) return

    try {
      const { error } = await supabase
        .from('insights')
        .delete()
        .eq('id', id)

      if (error) throw error

      setInsights(insights.filter(insight => insight.id !== id))
      toast.success('Insight deleted successfully')
    } catch (error: any) {
      toast.error('Failed to delete insight')
      console.error('Error:', error)
    }
  }

  const handleStatusChange = async (id: string, status: 'draft' | 'published' | 'archived') => {
    try {
      const { error } = await supabase
        .from('insights')
        .update({ 
          status,
          published_at: status === 'published' ? new Date().toISOString() : null
        })
        .eq('id', id)

      if (error) throw error

      setInsights(insights.map(insight => 
        insight.id === id 
          ? { ...insight, status, published_at: status === 'published' ? new Date().toISOString() : null }
          : insight
      ))
      toast.success(`Insight ${status} successfully`)
    } catch (error: any) {
      toast.error('Failed to update insight status')
      console.error('Error:', error)
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('insights')
        .update({ featured: !featured })
        .eq('id', id)

      if (error) throw error

      setInsights(insights.map(insight => 
        insight.id === id ? { ...insight, featured: !featured } : insight
      ))
      toast.success(`Insight ${!featured ? 'featured' : 'unfeatured'} successfully`)
    } catch (error: any) {
      toast.error('Failed to update insight')
      console.error('Error:', error)
    }
  }

  const filteredInsights = insights.filter(insight =>
    insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insight.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insight.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

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
          <h1 className="text-3xl font-bold text-neutral-900">Insights</h1>
          <p className="text-neutral-600 mt-2">
            Manage your blog posts and articles
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Insight</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No insights found</h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first insight'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreate}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Create Insight
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredInsights.map((insight) => (
                  <tr key={insight.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-neutral-900">
                              {insight.title}
                            </h3>
                            {insight.featured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                            {insight.summary}
                          </p>
                          {insight.categories && insight.categories.length > 0 && (
                            <div className="flex items-center space-x-1 mt-2">
                              {insight.categories.slice(0, 2).map((category, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                                >
                                  {category}
                                </span>
                              ))}
                              {insight.categories.length > 2 && (
                                <span className="text-xs text-neutral-500">
                                  +{insight.categories.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-900">{insight.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(insight.status)}`}>
                        {insight.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-sm text-neutral-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {insight.published_at 
                            ? formatDate(insight.published_at)
                            : formatDate(insight.created_at)
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFeatured(insight.id, insight.featured)}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            insight.featured 
                              ? 'text-yellow-600 hover:bg-yellow-50' 
                              : 'text-neutral-400 hover:bg-neutral-100'
                          }`}
                          title={insight.featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          <Star className={`h-4 w-4 ${insight.featured ? 'fill-current' : ''}`} />
                        </button>
                        
                        <button
                          onClick={() => handleEdit(insight)}
                          className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors duration-200"
                          title="Edit insight"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <div className="relative group">
                          <button className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors duration-200">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            {insight.status !== 'published' && (
                              <button
                                onClick={() => handleStatusChange(insight.id, 'published')}
                                className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                              >
                                <Eye className="h-4 w-4 mr-3" />
                                Publish
                              </button>
                            )}
                            {insight.status !== 'draft' && (
                              <button
                                onClick={() => handleStatusChange(insight.id, 'draft')}
                                className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                              >
                                <Clock className="h-4 w-4 mr-3" />
                                Move to Draft
                              </button>
                            )}
                            {insight.status !== 'archived' && (
                              <button
                                onClick={() => handleStatusChange(insight.id, 'archived')}
                                className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                              >
                                <FileText className="h-4 w-4 mr-3" />
                                Archive
                              </button>
                            )}
                            <hr className="my-1 border-neutral-200" />
                            <button
                              onClick={() => handleDelete(insight.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Insights</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">{insights.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Published</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {insights.filter(i => i.status === 'published').length}
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
              <p className="text-sm font-medium text-neutral-600">Drafts</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {insights.filter(i => i.status === 'draft').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Featured</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {insights.filter(i => i.featured).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100">
              <Star className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Insight Editor */}
      <InsightEditor
        insight={selectedInsight}
        isOpen={showEditor}
        onClose={handleEditorClose}
        onSave={handleEditorSave}
      />
    </div>
  )
}