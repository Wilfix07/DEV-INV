import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Plus, Edit, Trash2, QrCode, Barcode, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Product } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface ProductForm {
  name: string
  description: string
  price_htg: number
  price_usd: number
  qr_code: string
  barcode: string
}

const Products = () => {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>()

  useEffect(() => {
    fetchProducts()
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
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = () => {
    return `PROD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const generateBarcode = () => {
    return `BAR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const onSubmit = async (data: ProductForm) => {
    try {
      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            name: data.name,
            description: data.description,
            price_htg: data.price_htg,
            price_usd: data.price_usd,
            qr_code: data.qr_code,
            barcode: data.barcode,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id)

        if (error) throw error
        toast.success('Product updated successfully')
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert({
            name: data.name,
            description: data.description,
            price_htg: data.price_htg,
            price_usd: data.price_usd,
            qr_code: data.qr_code || generateQRCode(),
            barcode: data.barcode || generateBarcode()
          })

        if (error) throw error
        toast.success('Product created successfully')
      }

      reset()
      setShowForm(false)
      setEditingProduct(null)
      fetchProducts()
    } catch (error: any) {
      toast.error(error.message || t('errorOccurred'))
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    reset({
      name: product.name,
      description: product.description || '',
      price_htg: product.price_htg,
      price_usd: product.price_usd,
      qr_code: product.qr_code || '',
      barcode: product.barcode || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (productId: string) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId)

        if (error) throw error
        toast.success('Product deleted successfully')
        fetchProducts()
      } catch (error: any) {
        toast.error(error.message || t('errorOccurred'))
      }
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
          <h1 className="text-2xl font-bold text-gray-900">{t('products')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage product inventory and pricing
          </p>
        </div>
        
        <button
          onClick={() => {
            setShowForm(true)
            setEditingProduct(null)
            reset()
          }}
          className="btn-primary flex items-center gap-2 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingProduct(null)
                  reset()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    {...register('name', { required: 'Product name is required' })}
                    type="text"
                    className="input-field"
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    {...register('description')}
                    type="text"
                    className="input-field"
                    placeholder="Enter product description"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (HTG) *
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
                    placeholder="0.00"
                  />
                  {errors.price_htg && (
                    <p className="mt-1 text-sm text-red-600">{errors.price_htg.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (USD) *
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
                    placeholder="0.00"
                  />
                  {errors.price_usd && (
                    <p className="mt-1 text-sm text-red-600">{errors.price_usd.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    QR Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      {...register('qr_code')}
                      type="text"
                      className="input-field"
                      placeholder="Auto-generated if empty"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const qrCode = generateQRCode()
                        reset({ ...register().value, qr_code: qrCode })
                      }}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                      title="Generate QR Code"
                    >
                      <QrCode className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode
                  </label>
                  <div className="flex gap-2">
                    <input
                      {...register('barcode')}
                      type="text"
                      className="input-field"
                      placeholder="Auto-generated if empty"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const barcode = generateBarcode()
                        reset({ ...register().value, barcode: barcode })
                      }}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                      title="Generate Barcode"
                    >
                      <Barcode className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
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

      {/* Products List */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Inventory</h3>
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price (HTG)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price (USD)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QR Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barcode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        {product.description && (
                          <div className="text-sm text-gray-500">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.price_htg, 'HTG')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.price_usd, 'USD')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.qr_code ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <QrCode className="h-3 w-3 mr-1" />
                          {product.qr_code.substring(0, 8)}...
                        </span>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.barcode ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Barcode className="h-3 w-3 mr-1" />
                          {product.barcode.substring(0, 8)}...
                        </span>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-deb-blue hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
          <p className="text-gray-500 text-center py-8">No products found</p>
        )}
      </div>
    </div>
  )
}

export default Products
