import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, CreditCard as Edit, Trash2, User, Mail, Phone, Linkedin, Star, MapPin, GraduationCap, Briefcase, MoreHorizontal } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Database } from '../../lib/supabase'
import { TeamMemberEditor } from '../components/team/TeamMemberEditor'
import toast from 'react-hot-toast'

type TeamMember = Database['public']['Tables']['team_members']['Row']

export const Team: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showEditor, setShowEditor] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  useEffect(() => {
    fetchTeamMembers()
  }, [statusFilter])

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true })

      if (statusFilter !== 'all') {
        query = query.eq('active', statusFilter === 'active')
      }

      const { data, error } = await query

      if (error) throw error
      setTeamMembers(data || [])
    } catch (error: any) {
      toast.error('Failed to fetch team members')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTeamMembers(teamMembers.filter(member => member.id !== id))
      toast.success('Team member deleted successfully')
    } catch (error: any) {
      toast.error('Failed to delete team member')
      console.error('Error:', error)
    }
  }

  const handleStatusToggle = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ active: !active })
        .eq('id', id)

      if (error) throw error

      setTeamMembers(teamMembers.map(member => 
        member.id === id ? { ...member, active: !active } : member
      ))
      toast.success(`Team member ${!active ? 'activated' : 'deactivated'} successfully`)
    } catch (error: any) {
      toast.error('Failed to update team member status')
      console.error('Error:', error)
    }
  }

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member)
    setShowEditor(true)
  }

  const handleCreate = () => {
    setSelectedMember(null)
    setShowEditor(true)
  }

  const handleSave = (member: TeamMember) => {
    if (selectedMember) {
      // Update existing member
      setTeamMembers(teamMembers.map(m => m.id === member.id ? member : m))
    } else {
      // Add new member
      setTeamMembers([...teamMembers, member])
    }
    setShowEditor(false)
    setSelectedMember(null)
  }

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold text-neutral-900">Team Management</h1>
          <p className="text-neutral-600 mt-2">
            Manage team member profiles and information
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Team Member</span>
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
              placeholder="Search team members..."
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
              <option value="all">All Members</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <User className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No team members found</h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first team member'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreate}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Add Team Member
              </button>
            )}
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Member Photo */}
              <div className="relative h-48 bg-gradient-to-br from-primary-100 to-accent-100">
                {member.image_url ? (
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-16 w-16 text-primary-400" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Actions Menu */}
                <div className="absolute top-3 right-3">
                  <div className="relative group">
                    <button className="p-2 rounded-lg bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white hover:text-neutral-900 transition-all duration-200">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <button
                        onClick={() => handleEdit(member)}
                        className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        <Edit className="h-4 w-4 mr-3" />
                        Edit Profile
                      </button>
                      <button
                        onClick={() => handleStatusToggle(member.id, member.active)}
                        className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        <User className="h-4 w-4 mr-3" />
                        {member.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <hr className="my-1 border-neutral-200" />
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium text-sm">
                    {member.title}
                  </p>
                </div>

                {/* Bio */}
                <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                  {member.bio}
                </p>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-neutral-600">
                    <Mail className="h-4 w-4 text-neutral-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <Phone className="h-4 w-4 text-neutral-400" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.linkedin && (
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <Linkedin className="h-4 w-4 text-neutral-400" />
                      <span className="truncate">LinkedIn Profile</span>
                    </div>
                  )}
                </div>

                {/* Specialties */}
                {member.specialties && member.specialties.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.slice(0, 3).map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {specialty}
                        </span>
                      ))}
                      {member.specialties.length > 3 && (
                        <span className="text-xs text-neutral-500">
                          +{member.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Experience */}
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <Briefcase className="h-4 w-4 text-neutral-400" />
                  <span>{member.experience}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Members</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">{teamMembers.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Active</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {teamMembers.filter(m => m.active).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Star className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Attorneys</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {teamMembers.filter(m => m.title.toLowerCase().includes('attorney') || m.title.toLowerCase().includes('partner')).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Support Staff</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {teamMembers.filter(m => !m.title.toLowerCase().includes('attorney') && !m.title.toLowerCase().includes('partner')).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100">
              <Briefcase className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Team Member Editor Modal */}
      {showEditor && (
        <TeamMemberEditor
          member={selectedMember}
          isOpen={showEditor}
          onClose={() => {
            setShowEditor(false)
            setSelectedMember(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}