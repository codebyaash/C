# 💰 Expense Calculator - Track Your Finances

A modern, fully-featured expense tracking web application built with HTML, CSS, and JavaScript. Track your spending, analyze patterns, and manage your finances effortlessly.

## 🌟 Features

### Core Functionality
- ✅ **Add Expenses** - Create new expense records with description, amount, category, date, and who spent it
- ✅ **Edit & Delete** - Modify or remove expenses anytime
- ✅ **Track by Person** - Record who spent each amount (for shared expenses)
- ✅ **Filter by User** - Filter expenses using the Spent By field
- ✅ **Categorize** - Organize expenses into 8 categories (Food, Travel, Shopping, Bills, Entertainment, Health, Education, Other)
- ✅ **Search & Filter** - Find expenses by keywords, category, or date
- ✅ **Data Persistence** - Expenses save to browser local storage, with optional Google Sheets sync across devices

### Analytics & Insights
- ✅ **Dashboard** - Summary cards showing total expenses, top category, transaction count, and monthly total
- ✅ **Charts & Graphs** - Visual representation using Chart.js
  - Pie chart for category distribution
  - Bar chart for monthly expenses
  - Line chart for spending trends
- ✅ **Monthly Summary** - Track spending by month
- ✅ **Category Analysis** - Breakdown of expenses by category
- ✅ **Recent Transactions** - Quick view of latest 5 expenses

### User Experience
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Dark/Light Mode** - Toggle between themes for comfortable viewing
- ✅ **Smooth Animations** - Polished transitions and interactions
- ✅ **Form Validation** - Client-side validation for data integrity
- ✅ **Toast Notifications** - User feedback for actions
- ✅ **Modal Edit Dialog** - Inline editing for expenses

## 📁 Project Structure

```
/expense-calculator
├── index.html              # Main HTML file with all page structure
├── style.css               # Complete CSS with responsive design & dark mode
├── script.js               # JavaScript application logic
├── config.js               # Optional Google Sheets sync URL
├── google-apps-script.js   # Google Apps Script backend for Sheets sync
├── SHEET_SYNC.md           # iPhone/share-link sync setup guide
├── assets/                 # (Optional) For images, icons, fonts
├── components/             # (Optional) For component templates
├── data/
│   └── sampleData.js       # Sample expense data for testing
└── README.md               # This file
```

## 🚀 Getting Started

### Option 1: Live Server (Recommended for VS Code)

1. **Install Live Server Extension** (if not already installed)
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   - Search for "Live Server"
   - Install by Ritwick Dey

2. **Open the Project**
   ```bash
   cd /path/to/expense-calculator
   ```

3. **Start Live Server**
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Your default browser will open with the application

### Option 2: Local File

1. Open `index.html` directly in your web browser
2. The app will work offline with local storage

### Option 3: Simple HTTP Server

Using Python 3:
```bash
cd /path/to/expense-calculator
python3 -m http.server 8000
```
Then visit: `http://localhost:8000`

Using Node.js (with http-server):
```bash
npm install -g http-server
cd /path/to/expense-calculator
http-server
```

### Option 4: iPhone Link With Google Sheets Sync

1. Follow [SHEET_SYNC.md](SHEET_SYNC.md) to create the Google Sheet backend.
2. Paste your Apps Script Web App URL into `config.js`.
3. Redeploy Apps Script as a new version whenever `google-apps-script.js` changes.
4. Host the folder with GitHub Pages, Netlify, or another static host.
5. Open the hosted link in Safari on iPhone.

The GitHub Pages link will look like:

```text
https://YOUR_GITHUB_USERNAME.github.io/Calculator/
```

## 💻 Usage Guide

### Dashboard
- View summary cards with key metrics (in Indian Rupees)
- See pie chart of expense distribution by category
- Check monthly expense trends with bar chart
- Browse recent transactions

### Add Expense
1. Click "Add Expense" in the navigation
2. Fill in the form:
   - **Description**: What was the expense for?
   - **Amount**: How much did you spend?
   - **Category**: Select appropriate category
   - **Date**: When did you spend it?
   - **Spent By**: Who paid for this? (Enter name or "User 1", "User 2")
   - **Notes** (Optional): Additional details
3. Click "Add Expense" button
4. You'll be redirected to dashboard and see your expense in the list

### Expenses List
- View all expenses in a table format
- **Search**: Type keywords in search box
- **Filter by Category**: Select from dropdown
- **Filter by User**: Select a spender from the user dropdown
- **Filter by Date**: Pick a specific date
- Click the ✏️ icon to edit an expense
- View filtered total and transaction count

### Analytics
- **Monthly Summary**: See spending by month
- **Category Summary**: Breakdown by expense category
- **Visual Charts**: Interactive pie and line charts
- Export-friendly format (can be printed)

### Multi-User Tracking 👥
- **Spent By Field**: Track who spent each amount
- **User Filter**: Filter the Expenses tab by spender
- **Identify Spender**: See "User 1", "User 2", or enter custom names
- **Shared Expenses**: Both users can add expenses and see who paid
- **Collaboration**: Perfect for roommates, couples, or business partners
- **Fair Accounting**: Know who paid for what at a glance

### Theme Toggle
- Click the moon (🌙) or sun (☀️) icon in header
- Switches between light and dark modes
- Your preference is saved

## 💱 Currency

All expenses are tracked in **Indian Rupees (₹)**. Enter amounts without the currency symbol.

## 🎨 Design Features

### Color Scheme
- **Light Mode**: Clean white background with vibrant accents
- **Dark Mode**: Comfortable dark background with good contrast
- **Category Colors**: Each category has a unique color for quick identification

### Responsive Breakpoints
- **Desktop**: 1024px+ - Full layout with multi-column grids
- **Tablet**: 768px - 1023px - Adjusted grid layouts
- **Mobile**: Below 768px - Single column, optimized touch targets

### Animations
- Smooth page transitions (fade-in effect)
- Card hover effects
- Chart animations (Chart.js)
- Toast notification slides

## 📊 Sample Data

The app comes with sample expense data spanning March-May 2025 to help you explore features immediately. Data includes:
- 28 sample transactions
- Multiple categories
- **Varied amounts** (₹6.50 to ₹450) in Indian Rupees
- Realistic descriptions

To use custom data:
1. All expenses are stored in browser's local storage
2. Open DevTools (F12) → Application → Local Storage
3. Look for "expenses" key to view stored JSON

## 🔒 Data Storage

- **Local Mode**: Data is stored in browser localStorage
- **Sheet Sync Mode**: Data is loaded from and written to your configured Google Sheet
- **No Server Required Locally**: Works offline when `config.js` has no Sheet URL
- **Persistent**: Data survives browser refresh
- **Portable**: Export data from localStorage or directly from Google Sheets

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables, Grid, Flexbox
- **JavaScript (ES6+)**: Object-oriented programming
- **Chart.js**: Data visualization library

### Browser Support
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers (iOS Safari 13+, Chrome Mobile)

### Libraries
- **Chart.js 4.4.0** - CDN hosted, no installation needed

## 📝 Features Breakdown

### Form Validation
- Required fields enforcement
- Amount must be positive number
- Category selection required
- Date validation

### Filtering Logic
- Real-time search across description and notes
- Category filter (single select)
- Date filter (exact date match)
- Filters work together (AND operation)

### Calculations
- Total expenses sum
- Current month expenses (filters by YYYY-MM)
- Category-wise breakdown
- Monthly totals with sorting
- Top category identification

### Chart Updates
- Auto-update when expenses change
- Responsive to window resize
- Destroy and recreate on theme change
- Handle empty data states gracefully

## 🎯 Keyboard Shortcuts

While not implemented, you can enhance with:
- `Ctrl+N` or `Cmd+N` - Add new expense
- `Ctrl+F` or `Cmd+F` - Focus search
- `Esc` - Close modal
- `Enter` - Submit forms

## 🔧 Customization

### Add New Category

1. **In HTML** (`index.html`):
   ```html
   <option value="CategoryName">🔖 CategoryName</option>
   ```

2. **In CSS** (`style.css`):
   ```css
   --category-name: #hexcolor;
   .category-badge.CategoryName { background-color: var(--category-name); }
   ```

3. **Update script.js** color mapping in `getCategoryColor()` function

### Change Colors

Edit CSS variables in `style.css`:
```css
:root {
    --primary: #3498db;    /* Main color */
    --success: #27ae60;    /* Success color */
    --danger: #e74c3c;     /* Danger color */
    /* ... etc */
}
```

### Modify Summary Cards

Edit the HTML section in `index.html` within `<div class="summary-cards">`

## 📱 Mobile Optimizations

- Touch-friendly buttons (min 44px)
- Optimized table layout for small screens
- Stacked form inputs on mobile
- Responsive navigation menu
- Full-width modals on mobile

## 🚨 Known Limitations

1. No backend synchronization (data stored locally only)
2. No multi-device sync (use same browser/device)
3. No data backup/export UI (manual via localStorage)
4. No recurring expense automation
5. No budget alerts

## 🔐 Security Notes

- No sensitive data is sent to servers
- No authentication required
- All calculations happen client-side
- localStorage is same-origin only

## 🎓 Learning Resources

This project demonstrates:
- Object-Oriented JavaScript (Classes)
- DOM Manipulation
- Local Storage API
- CSS Variables & Grid
- Responsive Design
- Chart.js Integration
- Form Handling & Validation

## 📞 Support & Issues

If you encounter issues:

1. **Check browser console** (F12 → Console) for errors
2. **Clear localStorage** if data is corrupted:
   ```javascript
   localStorage.clear();
   location.reload();
   ```
3. **Ensure JavaScript is enabled**
4. **Update browser** to latest version
5. **Disable extensions** that might conflict

## 🚀 Future Enhancements

Potential features to add:
- Recurring expenses
- Budget alerts
- PDF export
- Multiple user accounts
- Cloud sync
- Mobile app version
- Receipt image upload
- Advanced analytics (trends, predictions)
- Multi-currency support
- Expense tags/labels
- Bulk import/export

## 📄 License

This project is open source and available for educational and personal use.

## 🙏 Credits

Built with:
- [Chart.js](https://www.chartjs.org/) - Amazing charting library
- [Google Fonts](https://fonts.google.com/) - System fonts
- Modern CSS3 and ES6+ JavaScript

---

**Made with 💙 for better financial tracking**

Happy expense tracking! 💰📊
