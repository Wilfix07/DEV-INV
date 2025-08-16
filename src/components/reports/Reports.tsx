import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Sale, Expense, SaleWithProduct } from '../../lib/supabase'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

const Reports = () => {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [sales, setSales] = useState<SaleWithProduct[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [reportType, setReportType] = useState<'sales' | 'expenses' | 'combined'>('combined')

  useEffect(() => {
    fetchReportData()
  }, [selectedDate, reportType])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const startDate = startOfDay(selectedDate)
      const endDate = endOfDay(selectedDate)

      if (reportType === 'sales' || reportType === 'combined') {
        const { data: salesData } = await supabase
          .from('sales')
          .select('*, product:products(*), seller:users(*)')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
          .order('created_at', { ascending: false })

        setSales(salesData || [])
      }

      if (reportType === 'expenses' || reportType === 'combined') {
        const { data: expensesData } = await supabase
          .from('expenses')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
          .order('created_at', { ascending: false })

        setExpenses(expensesData || [])
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
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

  const getTotalSales = (currency: 'HTG' | 'USD') => {
    return sales.reduce((sum, sale) => {
      return sum + (currency === 'HTG' ? sale.total_htg : sale.total_usd)
    }, 0)
  }

  const getTotalExpenses = (currency: 'HTG' | 'USD') => {
    return expenses.reduce((sum, expense) => {
      return sum + (currency === 'HTG' ? expense.amount_htg : expense.amount_usd)
    }, 0)
  }

  const getNetProfit = (currency: 'HTG' | 'USD') => {
    const totalSales = getTotalSales(currency)
    const totalExpenses = getTotalExpenses(currency)
    return totalSales - totalExpenses
  }

  const getProductSalesSummary = () => {
    const summary: { [key: string]: { quantity: number; total_htg: number; total_usd: number } } = {}
    
    sales.forEach(sale => {
      const productName = sale.product?.name || `Product ID: ${sale.product_id}`
      if (!summary[productName]) {
        summary[productName] = { quantity: 0, total_htg: 0, total_usd: 0 }
      }
      summary[productName].quantity += sale.quantity
      summary[productName].total_htg += sale.total_htg
      summary[productName].total_usd += sale.total_usd
    })

    return Object.entries(summary).map(([name, data]) => ({
      name,
      ...data
    }))
  }

  const exportReport = () => {
    const reportData = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      sales: sales,
      expenses: expenses,
      summary: {
        totalSalesHTG: getTotalSales('HTG'),
        totalSalesUSD: getTotalSales('USD'),
        totalExpensesHTG: getTotalExpenses('HTG'),
        totalExpensesUSD: getTotalExpenses('USD'),
        netProfitHTG: getNetProfit('HTG'),
        netProfitUSD: getNetProfit('USD'),
        totalTransactions: sales.length,
        productSummary: getProductSalesSummary()
      }
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deb-cargo-report-${format(selectedDate, 'yyyy-MM-dd')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
          <h1 className="text-2xl font-bold text-gray-900">{t('reports')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Daily sales and expense reports
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={exportReport}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="input-field"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Previous Day
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDate(subDays(selectedDate, -1))}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Next Day
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setReportType('sales')}
              className={`px-3 py-2 text-sm rounded-lg ${
                reportType === 'sales'
                  ? 'bg-deb-blue text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Sales Only
            </button>
            <button
              onClick={() => setReportType('expenses')}
              className={`px-3 py-2 text-sm rounded-lg ${
                reportType === 'expenses'
                  ? 'bg-deb-blue text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Expenses Only
            </button>
            <button
              onClick={() => setReportType('combined')}
              className={`px-3 py-2 text-sm rounded-lg ${
                reportType === 'combined'
                  ? 'bg-deb-blue text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Combined
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {(reportType === 'sales' || reportType === 'combined') && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Sales (HTG)</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(getTotalSales('HTG'), 'HTG')}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Sales (USD)</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(getTotalSales('USD'), 'USD')}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Transactions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sales.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Products Sold</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {getProductSalesSummary().length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Summary */}
      {(reportType === 'expenses' || reportType === 'combined') && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
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
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
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
      )}

      {/* Net Profit */}
      {reportType === 'combined' && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  getNetProfit('HTG') >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {getNetProfit('HTG') >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Net Profit (HTG)</p>
                <p className={`text-2xl font-semibold ${
                  getNetProfit('HTG') >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(getNetProfit('HTG'), 'HTG')}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  getNetProfit('USD') >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {getNetProfit('USD') >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Net Profit (USD)</p>
                <p className={`text-2xl font-semibold ${
                  getNetProfit('USD') >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(getNetProfit('USD'), 'USD')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Sales Summary */}
      {(reportType === 'sales' || reportType === 'combined') && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Sales Summary</h3>
          {getProductSalesSummary().length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity Sold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total (HTG)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total (USD)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getProductSalesSummary().map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.total_htg, 'HTG')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.total_usd, 'USD')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No sales recorded for this date</p>
          )}
        </div>
      )}

      {/* Detailed Sales */}
      {(reportType === 'sales' || reportType === 'combined') && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Sales</h3>
          {sales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total (HTG)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total (USD)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sale.product?.name || `Product ID: ${sale.product_id}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(sale.total_htg, 'HTG')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(sale.total_usd, 'USD')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(sale.created_at), 'HH:mm:ss')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No sales recorded for this date</p>
          )}
        </div>
      )}

      {/* Detailed Expenses */}
      {(reportType === 'expenses' || reportType === 'combined') && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Expenses</h3>
          {expenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount (HTG)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount (USD)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
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
                        {format(new Date(expense.created_at), 'HH:mm:ss')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No expenses recorded for this date</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Reports
