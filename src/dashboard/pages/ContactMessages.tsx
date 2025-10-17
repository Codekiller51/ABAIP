import React, { useState, useEffect } from 'react'
import { Mail, Trash2, Check, MessageSquare, Phone, Building, Calendar, Filter, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Database } from '../../lib/supabase'
import toast from 'react-hot-toast'

type ContactMessage = Database['public']['Tables']['contact_messages']['Row']

export const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching contact messages:', error)
      toast.error('Failed to load contact messages')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: isRead })
        .eq('id', id)

      if (error) throw error

      setMessages(messages.map(msg =>
        msg.id === id ? { ...msg, is_read: isRead } : msg
      ))

      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: isRead })
      }

      toast.success(isRead ? 'Marked as read' : 'Marked as unread')
    } catch (error) {
      console.error('Error updating message:', error)
      toast.error('Failed to update message')
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessages(messages.filter(msg => msg.id !== id))
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
      toast.success('Message deleted successfully')
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Failed to delete message')
    }
  }

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread' && msg.is_read) return false
    if (filter === 'read' && !msg.is_read) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        msg.name.toLowerCase().includes(query) ||
        msg.email.toLowerCase().includes(query) ||
        msg.subject.toLowerCase().includes(query) ||
        msg.message.toLowerCase().includes(query)
      )
    }

    return true
  })

  const unreadCount = messages.filter(msg => !msg.is_read).length

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-primary-600" />
            <span>Contact Messages</span>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-neutral-600 mt-2">Manage and respond to customer inquiries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-neutral-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
                  <p>No messages found</p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message)
                      if (!message.is_read) {
                        markAsRead(message.id, true)
                      }
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedMessage?.id === message.id
                        ? 'border-primary-500 bg-primary-50'
                        : message.is_read
                        ? 'border-neutral-200 bg-white hover:border-neutral-300'
                        : 'border-primary-200 bg-primary-50/50 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-neutral-900 truncate">{message.name}</h3>
                          {!message.is_read && (
                            <span className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 truncate">{message.email}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-neutral-700 mb-1">{message.subject}</p>
                    <p className="text-sm text-neutral-500 line-clamp-2">{message.message}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200">
                      <span className="text-xs text-neutral-500">{formatDate(message.created_at)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">{selectedMessage.subject}</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => markAsRead(selectedMessage.id, !selectedMessage.is_read)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                      title={selectedMessage.is_read ? 'Mark as unread' : 'Mark as read'}
                    >
                      <Check className="h-5 w-5 text-white" />
                    </button>
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                      title="Delete message"
                    >
                      <Trash2 className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                    <Mail className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-neutral-600">Name</p>
                      <p className="font-medium text-neutral-900">{selectedMessage.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                    <Mail className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-neutral-600">Email</p>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="font-medium text-primary-600 hover:text-primary-700"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  {selectedMessage.company && (
                    <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                      <Building className="h-5 w-5 text-primary-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-neutral-600">Company</p>
                        <p className="font-medium text-neutral-900">{selectedMessage.company}</p>
                      </div>
                    </div>
                  )}

                  {selectedMessage.phone && (
                    <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                      <Phone className="h-5 w-5 text-primary-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-neutral-600">Phone</p>
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          {selectedMessage.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-neutral-600">Received</p>
                      <p className="font-medium text-neutral-900">
                        {new Date(selectedMessage.created_at).toLocaleString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary-600" />
                    Message
                  </h3>
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-200">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Mail className="h-5 w-5" />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 h-full flex items-center justify-center py-16">
              <div className="text-center text-neutral-500">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
                <h3 className="text-xl font-semibold text-neutral-700 mb-2">No Message Selected</h3>
                <p>Select a message from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
