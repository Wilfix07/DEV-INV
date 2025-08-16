import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { QrCode, Barcode, Plus, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Product, Sale } from '../../lib/supabase'
import toast from 'react-hot-toast'
import QRScanner from './QRScanner'

interface SaleForm {
  product_id: string
  quantity: number
  price_htg: number
  price_usd: number
}

const Sales = () => {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [showManualForm, setShowManualForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SaleForm>()

  useEffect(() => {
    fetchProducts()
    fetchSales()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name')

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
    }
  }

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*, product:products(*)')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setSales(data || [])
    } catch (error) {
      console.error('Error fetching sales:', error)
      toast.error('Failed to fetch sales')
    } finally {
      setLoading(false)
    }
  }

  const handleQRScan = (result: string) => {
    const product = products.find(p => p.qr_code === result)
    if (product) {
      setSelectedProduct(product)
      setShowManualForm(true)
      setShowQRScanner(false)
      toast.success(`Product found: ${product.name}`)
    } else {
      toast.error('Product not found')
    }
  }

  const handleBarcodeScan = (result: string) => {
    const product = products.find(p => p.barcode === result)
    if (product) {
      setSelectedProduct(product)
      setShowManualForm(true)
      setShowBarcodeScanner(false)
      toast.success(`Product found: ${product.name}`)
    } else {
      toast.error('Product not found')
    }
  }

  const onSubmit = async (data: SaleForm) => {
    try {
      const { error } = await supabase
        .from('sales')
        .insert({
          product_id: data.product_id,
          quantity: data.quantity,
          price_htg: data.price_htg,
          price_usd: data.price_usd,
          total_htg: data.price_htg * data.quantity,
          total_usd: data.price_usd * data.quantity,
          seller_id: (await supabase.auth.getUser()).data.user?.id
        })

      if (error) throw error

      toast.success(t('saleRecorded'))
      reset()
      setShowManualForm(false)
      setSelectedProduct(null)
      fetchSales()
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
          <h1 className="text-2xl font-bold text-gray-900">{t('sales')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Record new sales and view sales history
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowQRScanner(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <QrCode className="h-4 w-4" />
            {t('scanQR')}
          </button>
          
          <button
            onClick={() => setShowBarcodeScanner(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Barcode className="h-4 w-4" />
            {t('scanBarcode')}
          </button>
          
          <button
            onClick={() => setShowManualForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('manualEntry')}
          </button>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{t('scanQR')}</h3>
              <button
                onClick={() => setShowQRScanner(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <QRScanner onResult={handleQRScan} />
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{t('scanBarcode')}</h3>
              <button
                onClick={() => setShowBarcodeScanner(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <QRScanner onResult={handleBarcodeScan} />
          </div>
        </div>
      )}

      {/* Manual Entry Form Modal */}
      {showManualForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{t('newSale')}</h3>
              <button
                onClick={() => {
                  setShowManualForm(false)
                  setSelectedProduct(null)
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
                  {t('productName')}
                </label>
                <select
                  {...register('product_id', { required: 'Product is required' })}
                  className="input-field"
                  value={selectedProduct?.id || ''}
                  onChange={(e) => {
                    const product = products.find(p => p.id === e.target.value)
                    setSelectedProduct(product || null)
                    if (product) {
                      reset({
                        product_id: product.id,
                        quantity: 1,
                        price_htg: product.price_htg,
                        price_usd: product.price_usd
                      })
                    }
                  }}
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatCurrency(product.price_htg, 'HTG')}
                    </option>
                  ))}
                </select>
                {errors.product_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.product_id.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('quantity')}
                </label>
                <input
                  {...register('quantity', { 
                    required: 'Quantity is required',
                    min: { value: 1, message: 'Quantity must be at least 1' }
                  })}
                  type="number"
                  min="1"
                  className="input-field"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('price')} (HTG)
                  </label>
                  <input
                    {...register('price_htg', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="input-field"
                  />
                  {errors.price_htg && (
                    <p className="mt-1 text-sm text-red-600">{errors.price_htg.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('price')} (USD)
                  </label>
                  <input
                    {...register('price_usd', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="input-field"
                  />
                  {errors.price_usd && (
                    <p className="mt-1 text-sm text-red-600">{errors.price_usd.message}</p>
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
                    setShowManualForm(false)
                    setSelectedProduct(null)
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

      {/* Sales History */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sales History</h3>
        {sales.length > 0 ? (
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
                    {t('total')} (USD)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('date')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(sale as any).product?.name || `Product ID: ${sale.product_id}`}
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
                      {new Date(sale.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No sales recorded yet</p>
        )}
      </div>
    </div>
  )
}

export default Sales
