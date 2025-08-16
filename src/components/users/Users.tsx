import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Plus, Edit, Trash2, User, X, Shield } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { User as UserType } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface UserForm {
  email: string
  full_name: string
  role: 'admin' | 'manager' | 'chief_teller' | 'teller'
  password?: string
}

const Users = () => {
  const { t } = useTranslation()
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserForm>()

  const roles = [
    { value: 'admin', label: t('admin'), color: 'bg-red-100 text-red-800' },
    { value: 'manager', label: t('manager'), color: 'bg-blue-100 text-blue-800' },
    { value: 'chief_teller', label: t('chiefTeller'), color: 'bg-yellow-100 text-yellow-800' },
    { value: 'teller', label: t('teller'), color: 'bg-green-100 text-green-800' },
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: UserForm) => {
    try {
      if (editingUser) {
        // Update existing user
        const updateData: any = {
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          updated_at: new Date().toISOString()
        }

        // Only update password if provided
        if (data.password) {
          const { error: authError } = await supabase.auth.admin.updateUserById(
            editingUser.id,
            { password: data.password }
          )
          if (authError) throw authError
        }

        const { error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', editingUser.id)

        if (error) throw error
        toast.success('User updated successfully')
      } else {
        // Create new user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: data.email,
          password: data.password || 'defaultpassword123',
          email_confirm: true
        })

        if (authError) throw authError

        const { error } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: data.email,
            full_name: data.full_name,
            role: data.role
          })

        if (error) throw error
        toast.success('User created successfully')
      }

      reset()
      setShowForm(false)
      setEditingUser(null)
      fetchUsers()
    } catch (error: any) {
      toast.error(error.message || t('errorOccurred'))
    }
  }

  const handleEdit = (user: UserType) => {
    setEditingUser(user)
    reset({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      password: ''
    })
    setShowForm(true)
  }

  const handleDelete = async (userId: string) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        // Delete from auth
        const { error: authError } = await supabase.auth.admin.deleteUser(userId)
        if (authError) throw authError

        // Delete from users table
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId)

        if (error) throw error
        toast.success('User deleted successfully')
        fetchUsers()
      } catch (error: any) {
        toast.error(error.message || t('errorOccurred'))
      }
    }
  }

  const getRoleLabel = (role: string) => {
    const roleObj = roles.find(r => r.value === role)
    return roleObj ? roleObj.label : role
  }

  const getRoleColor = (role: string) => {
    const roleObj = roles.find(r => r.value === role)
    return roleObj ? roleObj.color : 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deb-blue"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('users')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts and permissions
          </p>
        </div>
        
        <button
          onClick={() => {
            setShowForm(true)
            setEditingUser(null)
            reset()
          }}
          className="btn-primary flex items-center gap-2 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingUser(null)
                  reset()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="input-field"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  {...register('full_name', { required: 'Full name is required' })}
                  type="text"
                  className="input-field"
                  placeholder="Enter full name"
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  {...register('role', { required: 'Role is required' })}
                  className="input-field"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingUser ? '(leave blank to keep current)' : '*'}
                </label>
                <input
                  {...register('password', { 
                    required: !editingUser ? 'Password is required' : false,
                    minLength: editingUser ? undefined : { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  type="password"
                  className="input-field"
                  placeholder={editingUser ? 'Enter new password (optional)' : 'Enter password'}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingUser(null)
                    reset()
                  }}
                  className="btn-secondary flex-1"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Accounts</h3>
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-deb-blue flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-deb-blue hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-deb-red hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No users found</p>
        )}
      </div>

      {/* Role Permissions Info */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <div key={role.value} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.color}`}>
                  {role.label}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {role.value === 'admin' && 'Full access to all features and data'}
                {role.value === 'manager' && 'Access to sales, expenses, reports, and products. Cannot manage users.'}
                {role.value === 'chief_teller' && 'Access to sales, reports, and dashboard. Cannot manage expenses or users.'}
                {role.value === 'teller' && 'Access to sales and dashboard only. Cannot view reports or manage data.'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Users
