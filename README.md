# DEB Cargo Shipping LLC - Sales Management System

A comprehensive, responsive web application for managing sales, expenses, and reporting for DEB Cargo Shipping LLC. Built with vanilla JavaScript and Supabase backend.

## Features

✅ **Multilingual Support** - English, French, and Haitian Creole
✅ **Role-Based Access Control** - Admin, Manager, Chief Teller, Teller
✅ **Sales Management** - Manual entry and QR/barcode scanning
✅ **Expense Tracking** - Categorized expense management
✅ **Real-time Reporting** - Daily sales and expense reports
✅ **Mobile Responsive** - Optimized for mobile devices
✅ **Currency Support** - HTG and USD with conversion
✅ **Modern UI** - Minimalist design with brand colors

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Scanning**: HTML5 QR Code Scanner
- **Styling**: Custom CSS with CSS Variables
- **Authentication**: Supabase Auth with RLS

## Quick Start

### 1. Clone/Download Files
```bash
# Download all project files to your web server
- index.html
- styles.css
- app.js
- translations.js
- supabase-config.js
- database_setup.sql
- logo-placeholder.svg
```

### 2. Set Up Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor and run `database_setup.sql`
4. Get your Project URL and API Key from Settings > API
5. Update `supabase-config.js` with your credentials

### 3. Configure Application

1. Replace placeholder logo with your company logo
2. Update exchange rate in `supabase-config.js` if needed
3. Upload files to your web server (HTTPS required for scanner)

### 4. Create First User

1. Access the application URL
2. Register first admin user
3. Add products and other users as needed

## File Structure

```
project/
├── index.html              # Main application file
├── styles.css              # All styling and responsive design
├── app.js                  # Main application logic
├── translations.js         # Multi-language support
├── supabase-config.js      # Database configuration
├── database_setup.sql      # Database schema and setup
├── logo-placeholder.svg    # Default logo (replace with yours)
├── SETUP.md               # Detailed setup instructions
└── README.md              # This file
```

## User Roles & Permissions

| Feature | Admin | Manager | Chief Teller | Teller |
|---------|-------|---------|--------------|--------|
| Sales Entry | ✅ | ✅ | ✅ | ✅ |
| View Sales | ✅ | ✅ | ✅ | ✅ |
| Expense Entry | ✅ | ✅ | ✅ | ❌ |
| View Expenses | ✅ | ✅ | Own Only | ❌ |
| Reports | ✅ | ✅ | ✅ | Basic |
| Product Management | ✅ | ✅ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ | ❌ |

## Key Features Detail

### Sales Management
- Manual product selection and entry
- QR code and barcode scanning support
- Real-time total calculation
- Multi-currency support (HTG/USD)
- Transaction history

### Expense Management
- Categorized expenses (Fuel, Maintenance, Office, Utilities, Other)
- Date-based tracking
- Multi-currency support
- Role-based access control

### Reporting
- Daily sales summaries
- Expense breakdowns
- Date range filtering
- Currency-specific totals
- Product-wise sales reports

### Mobile Optimization
- Responsive design for all screen sizes
- Touch-friendly interface
- Optimized navigation for mobile
- Fast loading on slower connections

## Configuration

### Brand Colors
The application uses your brand colors (Red, Yellow, Blue):
- Primary Red: `#DC2626`
- Primary Yellow: `#FCD34D`
- Primary Blue: `#2563EB`

### Exchange Rate
Update the HTG to USD conversion rate in `supabase-config.js`:
```javascript
const HTG_TO_USD_RATE = 0.0075; // Update this value
```

### Language Settings
Default language is English. Users can switch languages from the menu. Available languages:
- English (en)
- French (fr)
- Haitian Creole (ht)

## Security Features

- Row Level Security (RLS) on all database tables
- Role-based access control
- Secure authentication via Supabase
- Input validation and sanitization
- HTTPS enforcement for production

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Requirements

- Modern web browser with JavaScript enabled
- HTTPS connection (for QR scanner)
- Internet connection
- Supabase account

## Support & Maintenance

### Regular Tasks
- Update exchange rates
- Review user roles
- Monitor database usage
- Check for errors in browser console

### Troubleshooting
- Check `SETUP.md` for detailed troubleshooting guide
- Verify Supabase project status
- Ensure HTTPS is enabled
- Check browser console for errors

## License

This project is proprietary software for DEB Cargo Shipping LLC.

## Contact

For technical support or questions about this application, contact your system administrator.

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Developed for**: DEB Cargo Shipping LLC

