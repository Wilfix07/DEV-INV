import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Plus, X, DollarSign } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Expense } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface ExpenseForm {
  description: string
  amount_htg: number
  amount_usd: number
  category: string
}

const Expenses = () => {
  const { t } = useTranslation()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseForm>()

  const expenseCategories = [
    'Office Supplies',
    'Transportation',
    'Utilities',
    'Maintenance',
    'Marketing',
    'Other'
  ]

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (error) {
      console.error('Error fetching expenses:', error)
      toast.error('Failed to fetch expenses')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ExpenseForm) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .insert({
          description: data.description,
          amount_htg: data.amount_htg,
          amount_usd: data.amount_usd,
          category: data.category,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })

      if (error) throw error

      toast.success(t('expenseRecorded'))
      reset()
      setShowForm(false)
      fetchExpenses()
    } catch (error: any) {
      toast.error(error.message || t('errorOccurred'))
    }
  }

  const formatCurrency = (amount: number, currency: 'HTG' | 'USD') => {
    if (currency === 'HTG') {
      return `${amount.toLocaleString('en-US')} HTG`
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  }

  const getTotalExpenses = (currency: 'HTG' | 'USD') => {
    return expenses.reduce((sum, expense) => {
      return sum + (currency === 'HTG' ? expense.amount_htg : expense.amount_usd)
    }, 0)
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
          <h1 className="text-2xl font-bold text-gray-900">{t('expenses')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track business expenses
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          {t('newExpense')}
        </button>
      </div>

      {/* Expense Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Expenses (HTG)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(getTotalExpenses('HTG'), 'HTG')}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Expenses (USD)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(getTotalExpenses('USD'), 'USD')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{t('newExpense')}</h3>
              <button
                onClick={() => {
                  setShowForm(false)
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
                  {t('expenseDescription')}
                </label>
                <input
                  {...register('description', { required: 'Description is required' })}
                  type="text"
                  className="input-field"
                  placeholder="Enter expense description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('expenseCategory')}
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="input-field"
                >
                  <option value="">Select a category</option>
                  {expenseCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('expenseAmount')} (HTG)
                  </label>
                  <input
                    {...register('amount_htg', { 
                      required: 'Amount is required',
                      min: { value: 0, message: 'Amount must be positive' }
                    })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="input-field"
                    placeholder="0.00"
                  />
                  {errors.amount_htg && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount_htg.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('expenseAmount')} (USD)
                  </label>
                  <input
                    {...register('amount_usd', { 
                      required: 'Amount is required',
                      min: { value: 0, message: 'Amount must be positive' }
                    })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="input-field"
                    placeholder="0.00"
                  />
                  {errors.amount_usd && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount_usd.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {t('save')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
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

      {/* Expenses List */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Expense History</h3>
        {expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('expenseDescription')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('expenseCategory')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('expenseAmount')} (HTG)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('expenseAmount')} (USD)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('date')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(expense.amount_htg, 'HTG')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(expense.amount_usd, 'USD')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No expenses recorded yet</p>
        )}
      </div>
    </div>
  )
}

export default Expenses
