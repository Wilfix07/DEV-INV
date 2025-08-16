import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  Home, 
  ShoppingCart, 
  DollarSign, 
  BarChart3, 
  Package, 
  Users, 
  Menu, 
  X,
  Globe,
  LogOut
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { User } from '../lib/supabase'

interface LayoutProps {
  user: User
  children: React.ReactNode
}

const Layout = ({ user, children }: LayoutProps) => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: t('dashboard'), href: '/dashboard', icon: Home },
    { name: t('sales'), href: '/sales', icon: ShoppingCart },
    { name: t('expenses'), href: '/expenses', icon: DollarSign },
    { name: t('reports'), href: '/reports', icon: BarChart3 },
    { name: t('products'), href: '/products', icon: Package },
    { name: t('users'), href: '/users', icon: Users },
  ]

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ht', name: 'Kreyòl', flag: '🇭🇹' },
  ]

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const canAccess = (route: string) => {
    if (user.role === 'admin') return true
    if (user.role === 'manager' && route !== '/users') return true
    if (user.role === 'chief_teller' && ['/dashboard', '/sales', '/reports'].includes(route)) return true
    if (user.role === 'teller' && ['/dashboard', '/sales'].includes(route)) return true
    return false
  }

  const filteredNavigation = navigation.filter(nav => canAccess(nav.href))

  return (
    <div className="min-h-screen bg-deb-light">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-deb-red via-deb-yellow to-deb-blue rounded-lg"></div>
              <span className="ml-2 text-lg font-semibold text-deb-dark">DEB Cargo</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-deb-blue text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4">
            <div className="h-8 w-8 bg-gradient-to-r from-deb-red via-deb-yellow to-deb-blue rounded-lg"></div>
            <span className="ml-2 text-lg font-semibold text-deb-dark">DEB Cargo</span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-deb-blue text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            
            {/* Language switcher */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="relative">
                <select
                  value={i18n.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-deb-blue focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                <Globe className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* User menu */}
              <div className="flex items-center gap-x-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user.full_name}</p>
                  <p className="text-gray-500 capitalize">{t(user.role)}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-x-2 text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:block">{t('logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
