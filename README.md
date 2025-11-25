# StockMate – Offline Inventory & Sales Management PWA

StockMate is an offline-first inventory and sales management application built for retail shops. It helps shop owners track stock, record sales, monitor daily and monthly revenue, and manage their entire store operations without depending on the internet.

All data is stored locally on the device using IndexedDB, and the app installs as a PWA for a smooth, app-like experience.

## ✨ Key Features

- **Offline Support** – Works fully offline after the first load
- **Local Storage** – All data saved in IndexedDB; no cloud required
- **Inventory Management** – Add, edit, and organize products easily
- **Sales Recording** – Track daily transactions and update stock automatically
- **Daily & Monthly Reports** – Clear insights into revenue and product performance
- **Low Stock Alerts** – Stay aware of items that need restocking (configurable threshold)
- **Backup & Restore** – Export data and move to another device anytime
- **PWA Ready** – Install on desktop or mobile like a native application
- **Settings** – Customize low stock threshold and manage app preferences

## 🛠 Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB (native API)
- **Offline Layer**: Service Worker + PWA Manifest
- **Icons**: Lucide React
- **Deployment**: Netlify / GitHub Pages (static hosting)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd StockMate
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 🚀 Usage

### First Time Setup

1. Open the app in your browser
2. The app will automatically initialize the database
3. Start by adding products in the "Products" section
4. Record sales in the "Sales" section
5. View reports and analytics in the "Reports" section

### Generating PWA Icons

To generate the required PWA icons (192x192 and 512x512):

1. Open `public/icons/generate-icons.html` in your browser
2. Click "Generate 192x192 Icon" and "Generate 512x512 Icon"
3. The icons will be downloaded automatically
4. Place them in the `public/icons/` directory

Alternatively, you can use online tools like:
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

### Installing as PWA

1. Open the app in a supported browser (Chrome, Edge, Safari)
2. Look for the install prompt in the address bar
3. Click "Install" to add to home screen/desktop
4. The app will work offline after installation

## 📱 Features Overview

### Dashboard
- Overview of total products, low stock items, today's sales, and revenue
- Low stock alerts
- Recent sales list

### Products
- Add, edit, and delete products
- Search and filter products
- View stock levels with color-coded indicators
- Automatic low stock highlighting

### Sales
- Record sales transactions
- Automatic stock deduction
- Real-time validation
- Transaction history

### Reports
- **All Time**: Complete sales overview
- **Daily**: Filter by specific date
- **Monthly**: View monthly revenue with charts
- Top selling products
- Revenue statistics
- Transaction history

### Backup & Restore
- Export all data as JSON
- Import data from backup file
- Transfer data between devices
- Full data portability

### Settings
- Configure low stock threshold
- View app information
- Data management tips

## 🔧 Configuration

### Low Stock Threshold

1. Navigate to Settings
2. Set your preferred low stock threshold
3. Products below this threshold will be highlighted
4. Default threshold is 10 units

## 📊 Data Storage

All data is stored locally using IndexedDB:
- **Products**: Product inventory
- **Sales**: Sales transactions
- **Settings**: App configuration

No data is sent to any server. Everything remains on your device.

## 🔒 Privacy & Security

- All data stored locally on your device
- No cloud sync or external servers
- No tracking or analytics
- Complete privacy and control

## 🚢 Deployment

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Ensure the service worker and manifest are accessible

### GitHub Pages

1. Build the project: `npm run build`
2. Push the `dist` folder to the `gh-pages` branch
3. Enable GitHub Pages in repository settings

### Vercel

1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

## 🐛 Troubleshooting

### Service Worker Not Registering
- Ensure you're using HTTPS (or localhost for development)
- Check browser console for errors
- Clear browser cache and reload

### Data Not Persisting
- Check if IndexedDB is enabled in browser settings
- Ensure sufficient storage space
- Check browser console for errors

### Icons Not Showing
- Generate icons using the provided tool
- Ensure icons are in `public/icons/` directory
- Check manifest.json paths

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the repository.

---

**Made with ❤️ for small retail businesses**

