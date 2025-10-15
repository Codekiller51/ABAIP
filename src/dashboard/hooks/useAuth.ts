import { useState, useEffect, createContext, useContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export interface AuthUser extends User {
  role?: 'super_admin' | 'content_manager' | 'editor'
  first_name?: string
  last_name?: string
  avatar_url?: string
}

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<AuthUser>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useAuthProvider = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }

      if (event === 'SIGNED_IN') {
        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', session?.user?.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for ID:', userId)
      
      const { data: authUser, error: authError } = await supabase.auth.getUser()
      if (authError) {
        console.error('Error getting auth user:', authError)
        throw authError
      }
      console.log('Auth user fetched successfully:', authUser)

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching user from users table:', error)
        throw error
      }
      console.log('User data fetch result:', data)

      if (!data) {
        console.log('No user profile found, creating new profile')
        const newUserData = {
          id: userId,
          email: authUser?.user?.email || '',
          first_name: '',
          last_name: '',
          role: 'editor',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        console.log('Attempting to create new user with data:', newUserData)

        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert(newUserData)
          .select()
          .single()

        if (createError) {
          console.error('Error creating new user profile:', createError)
          throw createError
        }
        console.log('New user profile created successfully:', newUser)

        const userProfile = {
          ...authUser?.user,
          role: newUser.role,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          avatar_url: newUser.avatar_url,
        } as AuthUser
        
        setUser(userProfile)
        console.log('User profile set successfully:', userProfile)
        setLoading(false)
        return
      }

      const userProfile = {
        ...authUser?.user,
        role: data.role,
        first_name: data.first_name,
        last_name: data.last_name,
        avatar_url: data.avatar_url,
      } as AuthUser
      
      setUser(userProfile)
      console.log('Existing user profile set successfully:', userProfile)
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      if (error instanceof Error) {
        console.error('Error details:', error.message)
        toast.error(`Failed to load user profile: ${error.message}`)
      } else {
        toast.error('Failed to load user profile: Unknown error')
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      toast.success('Successfully signed in!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setSession(null)
      toast.success('Successfully signed out!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out')
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/dashboard/reset-password`,
      })

      if (error) throw error
      
      toast.success('Password reset email sent!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email')
      throw error
    }
  }

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      if (!user) throw new Error('No user logged in')

      const { error } = await supabase
        .from('users')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          avatar_url: data.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      setUser({ ...user, ...data })
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
      throw error
    }
  }

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  }
}

export { AuthContext }