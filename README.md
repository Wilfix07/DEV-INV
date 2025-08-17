# DEB Cargo Shipping LLC - Sales Management System

A comprehensive, responsive web application for managing sales, expenses, and reporting for DEB Cargo Shipping LLC. Built with React, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Features

### 🛍️ Sales Management
- **Manual Sales Entry**: Create sales records manually with product selection
- **QR Code Scanning**: Scan product QR codes to quickly register sales
- **Barcode Scanning**: Support for barcode scanning functionality
- **Real-time Tracking**: Monitor sales as they happen

### 👥 User Role Management
- **Admin**: Full access to all features and data
- **Manager**: Access to sales, expenses, reports, and products (cannot manage users)
- **Chief Teller**: Access to sales, reports, and dashboard (cannot manage expenses or users)
- **Teller**: Access to sales and dashboard only (cannot view reports or manage data)

### 📊 Daily Sales Reports
- **Dual Currency Support**: Haitian Gourdes (HTG) and US Dollars (USD)
- **Comprehensive Analytics**: Total sales, expenses, transactions, and product summaries
- **Date Filtering**: Filter reports by specific dates
- **Export Functionality**: Download reports in JSON format

### 💰 Expense Management
- **Expense Registration**: Record business expenses with categories
- **Categorized Tracking**: Organize expenses by type (Office Supplies, Transportation, etc.)
- **Dual Currency**: Track expenses in both HTG and USD

### 🌍 Multilingual Support
- **English**: Primary language
- **French**: Complete French translation
- **Haitian Creole**: Full Haitian Creole support
- **Dynamic Switching**: Change language on-the-fly

### 🎨 Branding & Design
- **DEB Cargo Brand Colors**: Red, Yellow, and Blue theme
- **Responsive Design**: Optimized for mobile and desktop
- **Modern UI**: Clean, minimalist interface with excellent UX

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Build Tool**: Vite
- **QR/Barcode Scanning**: HTML5 QR Code Scanner

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account and project

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd deb-cargo-shipping
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Copy `env.example` to `.env.local` and fill in your Supabase credentials

4. **Set up the database**
   - Go to your Supabase project's SQL Editor
   - Run the contents of `supabase/schema.sql` to create all tables and policies

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=knuhonoink
```

### Supabase Setup

1. **Enable Row Level Security (RLS)** - Already configured in schema
2. **Set up Authentication** - Email/password auth is enabled by default
3. **Configure Storage** - For future file upload features

## 📱 Usage

### First Time Setup

1. **Login with default admin account**:
   - Email: `admin@deb-cargo.com`
   - Password: Check your Supabase auth settings or create a new admin user

2. **Create Products**:
   - Navigate to Products section
   - Add your inventory items with prices in both currencies
   - Generate QR codes and barcodes for scanning

3. **Set up Users**:
   - Create user accounts for your team members
   - Assign appropriate roles based on their responsibilities

### Daily Operations

1. **Record Sales**:
   - Use QR code scanning for quick product identification
   - Or manually select products and enter quantities
   - Sales are automatically tracked with timestamps

2. **Track Expenses**:
   - Record business expenses with descriptions and categories
   - Monitor spending patterns

3. **Generate Reports**:
   - View daily sales summaries
   - Export data for accounting purposes
   - Analyze product performance

## 🗄️ Database Schema

### Tables

- **users**: User accounts and roles
- **products**: Product inventory with pricing
- **sales**: Sales transactions
- **expenses**: Business expenses

### Key Features

- **Row Level Security**: Data access controlled by user roles
- **Referential Integrity**: Foreign key constraints ensure data consistency
- **Audit Trail**: Created/updated timestamps on all records
- **Indexing**: Optimized queries for better performance

## 🔒 Security Features

- **Authentication**: Supabase Auth with email/password
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Row Level Security (RLS) policies
- **Input Validation**: Form validation and sanitization
- **HTTPS**: Secure communication (in production)

## 📱 Mobile Optimization

- **Responsive Design**: Works seamlessly on all device sizes
- **Touch-Friendly**: Optimized for mobile interactions
- **Offline Capable**: Basic functionality works without internet
- **PWA Ready**: Can be installed as a mobile app

## 🚀 Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Deploy Options

1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Supabase Edge Functions**
   - Deploy as a Supabase Edge Function
   - Perfect for serverless architecture

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components load on demand
- **Optimized Bundles**: Vite for fast builds and HMR
- **Database Indexing**: Optimized queries with proper indexes

## 🔄 Updates & Maintenance

### Regular Tasks

1. **Database Backups**: Supabase handles this automatically
2. **Security Updates**: Keep dependencies updated
3. **Performance Monitoring**: Monitor query performance
4. **User Training**: Regular training for new features

### Backup & Recovery

- **Automatic Backups**: Supabase provides daily backups
- **Point-in-Time Recovery**: Available in Supabase Pro plans
- **Export Data**: Use the export functionality for manual backups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software for DEB Cargo Shipping LLC.

## 🆘 Support

For technical support or questions:
- Check the documentation
- Review the code comments
- Contact the development team

## 🔮 Future Enhancements

- **Inventory Management**: Stock tracking and alerts
- **Customer Management**: Customer database and history
- **Advanced Analytics**: Charts and trend analysis
- **Mobile App**: Native mobile applications
- **API Integration**: Connect with accounting software
- **Multi-location Support**: Multiple store locations

---

**DEB Cargo Shipping LLC** - Streamlining your shipping operations with modern technology.

