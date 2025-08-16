import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      sales: 'Sales',
      expenses: 'Expenses',
      reports: 'Reports',
      products: 'Products',
      users: 'Users',
      logout: 'Logout',
      
      // Common
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      date: 'Date',
      amount: 'Amount',
      quantity: 'Quantity',
      total: 'Total',
      actions: 'Actions',
      
      // Sales
      newSale: 'New Sale',
      scanQR: 'Scan QR Code',
      scanBarcode: 'Scan Barcode',
      manualEntry: 'Manual Entry',
      productName: 'Product Name',
      price: 'Price',
      seller: 'Seller',
      transactionDate: 'Transaction Date',
      
      // Reports
      dailySales: 'Daily Sales',
      salesReport: 'Sales Report',
      expenseReport: 'Expense Report',
      totalSales: 'Total Sales',
      totalExpenses: 'Total Expenses',
      transactions: 'Transactions',
      productsSold: 'Products Sold',
      
      // Expenses
      newExpense: 'New Expense',
      expenseDescription: 'Description',
      expenseCategory: 'Category',
      expenseAmount: 'Amount',
      
      // Auth
      login: 'Login',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      
      // Roles
      admin: 'Admin',
      manager: 'Manager',
      chiefTeller: 'Chief Teller',
      teller: 'Teller',
      
      // Messages
      saleRecorded: 'Sale recorded successfully',
      expenseRecorded: 'Expense recorded successfully',
      errorOccurred: 'An error occurred',
      confirmDelete: 'Are you sure you want to delete this item?',
      
      // Currency
      htg: 'HTG',
      usd: 'USD'
    }
  },
  fr: {
    translation: {
      // Navigation
      dashboard: 'Tableau de bord',
      sales: 'Ventes',
      expenses: 'Dépenses',
      reports: 'Rapports',
      products: 'Produits',
      users: 'Utilisateurs',
      logout: 'Déconnexion',
      
      // Common
      save: 'Enregistrer',
      cancel: 'Annuler',
      edit: 'Modifier',
      delete: 'Supprimer',
      add: 'Ajouter',
      search: 'Rechercher',
      filter: 'Filtrer',
      date: 'Date',
      amount: 'Montant',
      quantity: 'Quantité',
      total: 'Total',
      actions: 'Actions',
      
      // Sales
      newSale: 'Nouvelle Vente',
      scanQR: 'Scanner QR Code',
      scanBarcode: 'Scanner Code-barres',
      manualEntry: 'Saisie manuelle',
      productName: 'Nom du produit',
      price: 'Prix',
      seller: 'Vendeur',
      transactionDate: 'Date de transaction',
      
      // Reports
      dailySales: 'Ventes quotidiennes',
      salesReport: 'Rapport de ventes',
      expenseReport: 'Rapport de dépenses',
      totalSales: 'Total des ventes',
      totalExpenses: 'Total des dépenses',
      transactions: 'Transactions',
      productsSold: 'Produits vendus',
      
      // Expenses
      newExpense: 'Nouvelle dépense',
      expenseDescription: 'Description',
      expenseCategory: 'Catégorie',
      expenseAmount: 'Montant',
      
      // Auth
      login: 'Connexion',
      email: 'Email',
      password: 'Mot de passe',
      forgotPassword: 'Mot de passe oublié?',
      
      // Roles
      admin: 'Administrateur',
      manager: 'Gestionnaire',
      chiefTeller: 'Chef caissier',
      teller: 'Caissier',
      
      // Messages
      saleRecorded: 'Vente enregistrée avec succès',
      expenseRecorded: 'Dépense enregistrée avec succès',
      errorOccurred: 'Une erreur s\'est produite',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet élément?',
      
      // Currency
      htg: 'HTG',
      usd: 'USD'
    }
  },
  ht: {
    translation: {
      // Navigation
      dashboard: 'Tablèbòd',
      sales: 'Vant',
      expenses: 'Depans',
      reports: 'Rapò',
      products: 'Pwodwi',
      users: 'Itilizatè',
      logout: 'Dekoneksyon',
      
      // Common
      save: 'Anrejistre',
      cancel: 'Anile',
      edit: 'Modifye',
      delete: 'Efase',
      add: 'Ajoute',
      search: 'Chèche',
      filter: 'Filtre',
      date: 'Dat',
      amount: 'Kantite lajan',
      quantity: 'Kantite',
      total: 'Total',
      actions: 'Aksyon',
      
      // Sales
      newSale: 'Nouvo Vant',
      scanQR: 'Eskane Kòd QR',
      scanBarcode: 'Eskane Kòd-ba',
      manualEntry: 'Antre manyèl',
      productName: 'Non pwodwi',
      price: 'Pri',
      seller: 'Vandè',
      transactionDate: 'Dat tranzaksyon',
      
      // Reports
      dailySales: 'Vant chak jou',
      salesReport: 'Rapò vant',
      expenseReport: 'Rapò depans',
      totalSales: 'Total vant',
      totalExpenses: 'Total depans',
      transactions: 'Tranzaksyon',
      productsSold: 'Pwodwi vann',
      
      // Expenses
      newExpense: 'Nouvo depans',
      expenseDescription: 'Deskripsyon',
      expenseCategory: 'Kategori',
      expenseAmount: 'Kantite lajan',
      
      // Auth
      login: 'Koneksyon',
      email: 'Imèl',
      password: 'Modpas',
      forgotPassword: 'Modpas oubliye?',
      
      // Roles
      admin: 'Administratè',
      manager: 'Jesyonè',
      chiefTeller: 'Chèf kèsye',
      teller: 'Kèsye',
      
      // Messages
      saleRecorded: 'Vant anrejistre avèk siksè',
      expenseRecorded: 'Depans anrejistre avèk siksè',
      errorOccurred: 'Yon erè rive',
      confirmDelete: 'Èske w sèten w vle efase atik sa a?',
      
      // Currency
      htg: 'HTG',
      usd: 'USD'
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
