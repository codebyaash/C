# ⚡ Quick Start Guide

Get your Expense Calculator app running in seconds!

## 🎯 Fastest Start (Recommended)

### Using VS Code Live Server

1. **Open the folder in VS Code**
   ```bash
   code /Library/Repo/Calculator
   ```

2. **Install Live Server extension** (if you don't have it)
   - Click Extensions (Ctrl+Shift+X)
   - Search: "Live Server"
   - Install by Ritwick Dey

3. **Start the server**
   - Right-click `index.html`
   - Select "Open with Live Server"
   - ✨ App opens automatically!

4. **Explore the app**
   - Dashboard shows sample expenses
   - Add new expenses
   - View charts and analytics
   - Toggle dark mode (top right)

## 📱 Browser Direct Access

Simply double-click `index.html` to open in your browser (no server needed)

## 📲 iPhone Shared Link + Sheet Sync

For an iPhone link where every update syncs across devices:

1. Set up Google Sheets sync using [SHEET_SYNC.md](SHEET_SYNC.md).
2. Paste your Google Apps Script Web App URL into `config.js`.
3. Redeploy Apps Script as a new version whenever `google-apps-script.js` changes.
4. Host this folder as a static site.

Your iPhone link will be one of these:

- GitHub Pages: `https://YOUR_GITHUB_USERNAME.github.io/Calculator/`
- Netlify: the `https://...netlify.app` link Netlify gives you

Open that link in Safari on iPhone. Any Add/Edit/Delete will update the connected Google Sheet, and other devices using the same hosted link will load that shared data. The Expenses tab also has an **All Users** filter based on the `Spent By` field.

## 🖥️ Local Server

### Using Python
```bash
cd /Library/Repo/Calculator
python3 -m http.server 8000
# Visit: http://localhost:8000
```

### Using Node.js
```bash
npm install -g http-server
cd /Library/Repo/Calculator
http-server
# Visit: http://localhost:8080
```

## 📊 What You Get Out of the Box

✅ **28 sample expenses** (March-May 2025)
✅ **Dashboard** with summary cards
✅ **Interactive charts** (Pie & Bar)
✅ **Add/Edit/Delete expenses**
✅ **Search & filter** functionality
✅ **Dark/Light mode** toggle
✅ **Responsive design** (mobile-ready)
✅ **Local storage** (data persists)

## 🎮 Try These Features

1. **View Dashboard**
   - See total spending: ₹3,000+
   - Top category: Food
   - Recent transactions

2. **Add a New Expense**
   - Click "Add Expense"
   - Fill the form
   - Click "Add Expense"
   - See it on dashboard!

3. **Explore Filters**
   - Go to Expenses tab
   - Search: "grocery"
   - Filter by category: "Food"
   - Filter by date
   - View totals update

4. **View Analytics**
   - Click "Analytics"
   - See monthly breakdown
   - Category summary
   - Visual trend charts

5. **Switch Themes**
   - Click 🌙 icon in header
   - Switches to dark mode
   - Click ☀️ to switch back

## 📝 Default Sample Data

The app includes 28 realistic expenses across:
- **Categories**: Food, Travel, Shopping, Bills, Entertainment, Health, Education
- **Date Range**: March - May 2025
- **Total Spending**: ₹3,123.38

Want to clear and start fresh?
- Go to browser DevTools (F12)
- Application → Local Storage
- Find "expenses" key
- Delete it
- Refresh page

## 🔗 Important Files

- **index.html** - Main structure
- **style.css** - Styling + dark mode
- **script.js** - All app logic
- **data/sampleData.js** - Test data
- **README.md** - Full documentation

## ⚙️ System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- localStorage enabled
- Chart.js CDN access (for charts)

## 🆘 Troubleshooting

**Charts not showing?**
- Check internet (Chart.js is CDN)
- Refresh page
- Try different browser

**Data not saving?**
- Check if localStorage is enabled
- Try Incognito mode
- Clear browser cache

**Styling looks weird?**
- Force refresh (Ctrl+F5)
- Check browser is updated
- Disable browser extensions

## 📚 Next Steps

1. ✅ Run the app (you did this!)
2. 📖 Read [README.md](README.md) for full features
3. 🎨 Customize colors in style.css
4. ➕ Add more categories
5. 📊 Explore all views

## 🎓 Learning Path

This project teaches:
1. HTML structure & forms
2. CSS Grid & Flexbox
3. JavaScript OOP (Classes)
4. DOM manipulation
5. localStorage API
6. Chart.js library
7. Responsive design
8. Dark mode implementation

## 🚀 Features Highlights

| Feature | Status | Where |
|---------|--------|-------|
| Add Expense | ✅ | Add Expense tab |
| Edit Expense | ✅ | Click ✏️ in list |
| Delete Expense | ✅ | Edit modal |
| Search | ✅ | Expenses tab |
| Filter by Category | ✅ | Expenses tab |
| Filter by Date | ✅ | Expenses tab |
| Summary Cards | ✅ | Dashboard |
| Pie Chart | ✅ | Dashboard |
| Bar Chart | ✅ | Dashboard |
| Analytics | ✅ | Analytics tab |
| Dark Mode | ✅ | Header icon |
| Data Persistence | ✅ | localStorage |
| Sample Data | ✅ | Pre-loaded |
| Responsive | ✅ | All devices |

## 💡 Pro Tips

- Use sample data to understand the app's capabilities
- Try editing an expense to learn the modal
- Check different time periods in filters
- View charts in both light and dark modes
- Test on mobile by resizing browser window

---

**Enjoy tracking your expenses! 💰**

Need help? See [README.md](README.md) for complete documentation.
