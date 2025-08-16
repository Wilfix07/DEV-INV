import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  DollarSign,
  Package,
  Users
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Sale, Expense } from '../lib/supabase'

const Dashboard = () => {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    totalSalesHTG: 0,
    totalSalesUSD: 0,
    totalExpensesHTG: 0,
    totalExpensesUSD: 0,
    totalTransactions: 0,
    totalProducts: 0
  })
  const [recentSales, setRecentSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Fetch today's sales
      const { data: salesData } = await supabase
        .from('sales')
        .select('*')
        .gte('created_at', today.toISOString())

      // Fetch today's expenses
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .gte('created_at', today.toISOString())

      // Fetch total products
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (salesData) {
        const totalSalesHTG = salesData.reduce((sum, sale) => sum + sale.total_htg, 0)
        const totalSalesUSD = salesData.reduce((sum, sale) => sum + sale.total_usd, 0)
        
        setStats(prev => ({
          ...prev,
          totalSalesHTG,
          totalSalesUSD,
          totalTransactions: salesData.length
        }))
        setRecentSales(salesData.slice(0, 5))
      }

      if (expensesData) {
        const totalExpensesHTG = expensesData.reduce((sum, expense) => sum + expense.amount_htg, 0)
        const totalExpensesUSD = expensesData.reduce((sum, expense) => sum + expense.amount_usd, 0)
        
        setStats(prev => ({
          ...prev,
          totalExpensesHTG,
          totalExpensesUSD
        }))
      }

      if (productsCount !== null) {
        setStats(prev => ({
          ...prev,
          totalProducts: productsCount
        }))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency: 'HTG' | 'USD') => {
    if (currency === 'HTG') {
      return `${amount.toLocaleString('en-US')} HTG`
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of today's activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Sales HTG */}
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('totalSales')} (HTG)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.totalSalesHTG, 'HTG')}
              </p>
            </div>
          </div>
        </div>

        {/* Total Sales USD */}
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('totalSales')} (USD)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.totalSalesUSD, 'USD')}
              </p>
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('transactions')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalTransactions}
              </p>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('products')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalProducts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Sales</h3>
        {recentSales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('productName')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('quantity')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('total')} (HTG)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('date')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Product ID: {sale.product_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(sale.total_htg, 'HTG')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sale.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No sales recorded today</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
