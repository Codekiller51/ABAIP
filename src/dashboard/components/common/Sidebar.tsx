import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Scale,
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Image,
  Settings,
  X,
  MessageSquare,
  Home
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation()
  const { user } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'content_manager', 'editor'] },
    { name: 'Insights', href: '/dashboard/insights', icon: FileText, roles: ['super_admin', 'content_manager', 'editor'] },
    { name: 'Team', href: '/dashboard/team', icon: Users, roles: ['super_admin', 'content_manager'] },
    { name: 'Services', href: '/dashboard/services', icon: Briefcase, roles: ['super_admin', 'content_manager'] },
    { name: 'Media', href: '/dashboard/media', icon: Image, roles: ['super_admin', 'content_manager', 'editor'] },
    { name: 'Contact Messages', href: '/dashboard/contact-messages', icon: MessageSquare, roles: ['super_admin', 'content_manager'] },
    { name: 'Users', href: '/dashboard/users', icon: Users, roles: ['super_admin'] },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['super_admin'] },
  ]

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || 'editor')
  )

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-50 lg:hidden bg-neutral-900/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:fixed lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-neutral-200">
            <Link to="/dashboard" className="flex items-center space-x-3">
              {/* <Scale className="h-8 w-8 text-primary-600" /> */}
              <img src="logot.png" alt="ABA IP Consultants Logo" className="h-12" />
              <div>
                <h1 className="text-lg font-bold text-neutral-900">ABA IP</h1>
                <p className="text-xs text-neutral-600">Dashboard</p>
              </div>
            </Link>
            
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
            >
              <X className="h-5 w-5 text-neutral-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-6">
            <Link
              to="/"
              target="_blank"
              className="mb-4 group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 border-2 border-dashed border-neutral-300 hover:border-neutral-400"
            >
              <Home className="mr-3 h-5 w-5 flex-shrink-0 text-neutral-400 group-hover:text-neutral-500 transition-colors duration-200" />
              Back to Website
            </Link>

            <ul className="space-y-2">
              {filteredNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                      }
                    `}
                  >
                    <item.icon className={`
                      mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200
                      ${isActive(item.href) ? 'text-primary-600' : 'text-neutral-400 group-hover:text-neutral-500'}
                    `} />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User info */}
          <div className="border-t border-neutral-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-neutral-500 capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}