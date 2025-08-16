# DEB Cargo Shipping LLC - Setup Guide

This guide will walk you through setting up the complete DEB Cargo Shipping LLC application from scratch.

## 🚀 Quick Start (5 minutes)

1. **Install dependencies**: `npm install`
2. **Set up Supabase**: Create project and get credentials
3. **Configure environment**: Copy `.env.example` to `.env.local`
4. **Run database schema**: Execute `supabase/schema.sql` in Supabase
5. **Start development**: `npm run dev`

## 📋 Detailed Setup Instructions

### Step 1: Prerequisites

Ensure you have the following installed:
- **Node.js 16+** ([Download here](https://nodejs.org/))
- **Git** ([Download here](https://git-scm.com/))
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Step 2: Project Setup

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd deb-cargo-shipping
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or if you prefer yarn
   yarn install
   ```

### Step 3: Supabase Setup

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up with your email
   - Verify your email address

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project name: `deb-cargo-shipping`
   - Enter database password (save this!)
   - Choose region closest to your users
   - Click "Create new project"

3. **Wait for Project Setup**
   - This takes 2-3 minutes
   - You'll see a green checkmark when ready

4. **Get Project Credentials**
   - Go to **Settings** → **API**
   - Copy the **Project URL**
   - Copy the **anon public** key

### Step 4: Environment Configuration

1. **Create environment file**
   ```bash
   # Copy the example file
   cp env.example .env.local
   ```

2. **Edit `.env.local`**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Replace with your actual values**
   - `your-project-id` → Your actual project ID
   - `your-anon-key-here` → Your actual anon key

### Step 5: Database Setup

1. **Open Supabase SQL Editor**
   - In your Supabase project dashboard
   - Click **SQL Editor** in the left sidebar

2. **Execute the schema**
   - Copy the entire contents of `supabase/schema.sql`
   - Paste it into the SQL Editor
   - Click **Run** button

3. **Verify tables created**
   - Go to **Table Editor** in the left sidebar
   - You should see: `users`, `products`, `sales`, `expenses`

### Step 6: Authentication Setup

1. **Enable Email Auth**
   - Go to **Authentication** → **Settings**
   - Ensure **Enable email confirmations** is OFF (for development)
   - Set **Site URL** to `http://localhost:3000`

2. **Create Admin User**
   - Go to **Authentication** → **Users**
   - Click **Add User**
   - Email: `admin@deb-cargo.com`
   - Password: `admin123` (change this later!)
   - Click **Create User**

3. **Update User Role**
   - Go to **Table Editor** → **users**
   - Find your admin user
   - Set `role` to `admin`
   - Set `full_name` to your name

### Step 7: Test the Application

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Open browser**
   - Navigate to `http://localhost:3000`
   - You should see the login page

3. **Login**
   - Email: `admin@deb-cargo.com`
   - Password: `admin123`

4. **Verify functionality**
   - Dashboard should load
   - Navigation should work
   - All sections should be accessible

## 🔧 Configuration Options

### Brand Customization

1. **Update Colors** (in `tailwind.config.js`)
   ```javascript
   colors: {
     'deb-red': '#YOUR_RED_COLOR',
     'deb-yellow': '#YOUR_YELLOW_COLOR',
     'deb-blue': '#YOUR_BLUE_COLOR',
   }
   ```

2. **Update Logo**
   - Replace the placeholder logo in the header
   - Update `src/components/Layout.tsx`

### Language Settings

1. **Add new languages** (in `src/lib/i18n.ts`)
   - Copy existing language structure
   - Translate all text strings
   - Add to languages array

2. **Default language**
   - Change `fallbackLng` in i18n config

### Currency Settings

1. **Exchange rates**
   - Update conversion logic in components
   - Modify `formatCurrency` functions

## 🚨 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check `.env.local` file exists
   - Verify variable names are correct
   - Restart development server

2. **"Failed to fetch" errors**
   - Check Supabase project status
   - Verify API keys are correct
   - Check browser console for details

3. **Authentication errors**
   - Verify user exists in Supabase Auth
   - Check user role in users table
   - Ensure RLS policies are correct

4. **QR Scanner not working**
   - Ensure HTTPS connection (required for camera access)
   - Check browser permissions
   - Try different browser

### Database Issues

1. **Tables not created**
   - Check SQL Editor for errors
   - Verify you have admin access
   - Run schema in smaller chunks

2. **Permission denied errors**
   - Check RLS policies are enabled
   - Verify user roles are set correctly
   - Check foreign key constraints

### Performance Issues

1. **Slow loading**
   - Check database indexes
   - Monitor query performance
   - Consider pagination for large datasets

2. **Memory issues**
   - Check for memory leaks in components
   - Optimize image sizes
   - Use lazy loading

## 🔒 Security Considerations

### Production Deployment

1. **Environment Variables**
   - Never commit `.env.local` to git
   - Use secure environment management
   - Rotate API keys regularly

2. **HTTPS Required**
   - QR scanner requires secure connection
   - Use SSL certificates
   - Enable HSTS headers

3. **User Management**
   - Enforce strong passwords
   - Enable 2FA for admin accounts
   - Regular security audits

### Data Protection

1. **Backup Strategy**
   - Enable Supabase backups
   - Export data regularly
   - Test recovery procedures

2. **Access Control**
   - Review user permissions regularly
   - Remove unused accounts
   - Monitor access logs

## 📱 Mobile Optimization

### Testing Mobile Experience

1. **Device Testing**
   - Test on actual devices
   - Use browser dev tools
   - Check touch interactions

2. **Performance**
   - Optimize images
   - Minimize bundle size
   - Test on slow connections

### PWA Features

1. **Service Worker**
   - Enable offline functionality
   - Cache important resources
   - Handle updates gracefully

2. **App Installation**
   - Configure manifest.json
   - Test install prompts
   - Verify app icons

## 🚀 Deployment

### Development to Production

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Choose Platform**
   - **Vercel**: `vercel --prod`
   - **Netlify**: Drag `dist` folder
   - **Supabase**: Edge Functions

3. **Update Environment**
   - Set production Supabase URL
   - Update site URLs
   - Configure custom domains

### Monitoring

1. **Error Tracking**
   - Set up error monitoring
   - Track performance metrics
   - Monitor user experience

2. **Analytics**
   - Track user behavior
   - Monitor feature usage
   - Analyze performance data

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Support
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [React Community](https://reactjs.org/community/support.html)
- [Stack Overflow](https://stackoverflow.com/)

### Updates
- Keep dependencies updated
- Monitor security advisories
- Follow best practices

---

## ✅ Setup Checklist

- [ ] Node.js installed
- [ ] Dependencies installed
- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database schema executed
- [ ] Admin user created
- [ ] Application starts successfully
- [ ] Login works
- [ ] All features accessible
- [ ] Mobile responsive tested
- [ ] QR scanner working
- [ ] Ready for production

**Need help?** Check the troubleshooting section or contact support.
