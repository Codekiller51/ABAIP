import React, { useState, useEffect } from 'react'
import {
  FileText,
  Users,
  Briefcase,
  Image,
  TrendingUp,
  Eye,
  Calendar,
  Activity
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface Stats {
  insights: number
  teamMembers: number
  services: number
  mediaFiles: number
  publishedInsights: number
  draftInsights: number
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    insights: 0,
    teamMembers: 0,
    services: 0,
    mediaFiles: 0,
    publishedInsights: 0,
    draftInsights: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)

      const [insightsRes, teamRes, servicesRes, mediaRes, publishedRes, draftsRes] = await Promise.all([
        supabase.from('insights').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('media').select('id', { count: 'exact', head: true }),
        supabase.from('insights').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('insights').select('id', { count: 'exact', head: true }).eq('status', 'draft')
      ])

      setStats({
        insights: insightsRes.count || 0,
        teamMembers: teamRes.count || 0,
        services: servicesRes.count || 0,
        mediaFiles: mediaRes.count || 0,
        publishedInsights: publishedRes.count || 0,
        draftInsights: draftsRes.count || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsDisplay = [
    {
      name: 'Total Insights',
      value: loading ? '...' : stats.insights.toString(),
      change: `${stats.publishedInsights} published`,
      changeType: 'positive',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      name: 'Team Members',
      value: loading ? '...' : stats.teamMembers.toString(),
      change: 'Active profiles',
      changeType: 'positive',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      name: 'Services',
      value: loading ? '...' : stats.services.toString(),
      change: 'Service offerings',
      changeType: 'neutral',
      icon: Briefcase,
      color: 'bg-orange-500'
    },
    {
      name: 'Media Files',
      value: loading ? '...' : stats.mediaFiles.toString(),
      change: 'Files in library',
      changeType: 'positive',
      icon: Image,
      color: 'bg-purple-500'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'insight',
      title: 'Dashboard connected to live data',
      time: 'Just now',
      user: user ? `${user.first_name} ${user.last_name}` : 'System'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600 mt-2">
          Welcome back! Here's what's happening with your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">{stat.name}</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">{stat.value}</p>
                <p className={`text-sm mt-2 ${
                  stat.changeType === 'positive' ? 'text-green-600' :
                  stat.changeType === 'negative' ? 'text-red-600' :
                  'text-neutral-500'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Recent Activity</h2>
            <Activity className="h-5 w-5 text-neutral-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    {activity.type === 'insight' && <FileText className="h-4 w-4 text-primary-600" />}
                    {activity.type === 'team' && <Users className="h-4 w-4 text-primary-600" />}
                    {activity.type === 'media' && <Image className="h-4 w-4 text-primary-600" />}
                    {activity.type === 'service' && <Briefcase className="h-4 w-4 text-primary-600" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">{activity.title}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {activity.time} • {activity.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Quick Actions</h2>
            <TrendingUp className="h-5 w-5 text-neutral-400" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group">
              <FileText className="h-8 w-8 text-neutral-400 group-hover:text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-600 group-hover:text-primary-600">
                New Insight
              </p>
            </button>
            
            <button className="p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group">
              <Users className="h-8 w-8 text-neutral-400 group-hover:text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-600 group-hover:text-primary-600">
                Add Team Member
              </p>
            </button>
            
            <button className="p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group">
              <Image className="h-8 w-8 text-neutral-400 group-hover:text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-600 group-hover:text-primary-600">
                Upload Media
              </p>
            </button>
            
            <button className="p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group">
              <Briefcase className="h-8 w-8 text-neutral-400 group-hover:text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-600 group-hover:text-primary-600">
                Edit Services
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Content Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Content Overview</h2>
          <Eye className="h-5 w-5 text-neutral-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <Calendar className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-neutral-900">{loading ? '...' : stats.draftInsights}</p>
            <p className="text-sm text-neutral-600">Draft Insights</p>
          </div>

          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-neutral-900">{loading ? '...' : stats.publishedInsights}</p>
            <p className="text-sm text-neutral-600">Published Insights</p>
          </div>

          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-neutral-900">{loading ? '...' : stats.insights}</p>
            <p className="text-sm text-neutral-600">Total Content</p>
          </div>
        </div>
      </div>
    </div>
  )
}