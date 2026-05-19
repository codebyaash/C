/* ============================================
   EXPENSE CALCULATOR - JAVASCRIPT
   Complete Application Logic
   ============================================ */

// ============================================
// STATE MANAGEMENT
// ============================================

class ExpenseApp {
    constructor() {
        // Application state
        this.expenses = [];
        this.currentEditingId = null;
        this.sheetWebAppUrl = ((window.EXPENSE_APP_CONFIG && window.EXPENSE_APP_CONFIG.SHEETS_WEB_APP_URL) || '').trim();
        this.pendingSyncIds = new Set(JSON.parse(localStorage.getItem('pendingSyncIds') || '[]'));
        this.chartInstances = {
            category: null,
            monthly: null,
            analyticsCat: null,
            analyticsMonth: null
        };
        
        // Initialize app
        this.init();
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    async init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.setDefaultDate();
        await this.loadExpenses();
        this.updateAllViews();
    }

    // Load expenses from Google Sheets when configured, otherwise localStorage.
    async loadExpenses() {
        const stored = localStorage.getItem('expenses');
        if (stored) {
            this.expenses = JSON.parse(stored);
        } else {
            // Load sample data on first visit
            this.expenses = window.sampleExpenses ? [...window.sampleExpenses] : [];
            await this.saveExpenses({ syncRemote: false });
        }

        if (!this.isSheetSyncEnabled()) {
            return;
        }

        try {
            const sheetExpenses = await this.fetchSheetExpenses();
            if (sheetExpenses.length > 0) {
                this.expenses = this.mergeExpenses(sheetExpenses, this.expenses);
                await this.saveExpenses({ syncRemote: false });
            }
        } catch (error) {
            console.error('Google Sheets sync failed:', error);
            this.showToast('Using local data. Sheet sync unavailable.', 'error');
        }
    }

    async saveExpenses({ syncRemote = false } = {}) {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));

        if (syncRemote) {
            await this.syncPendingExpenses();
        }
    }

    savePendingSyncIds() {
        localStorage.setItem('pendingSyncIds', JSON.stringify([...this.pendingSyncIds]));
    }

    markPendingSync(id) {
        this.pendingSyncIds.add(Number(id));
        this.savePendingSyncIds();
    }

    clearPendingSync(id) {
        this.pendingSyncIds.delete(Number(id));
        this.savePendingSyncIds();
    }

    isSheetSyncEnabled() {
        return this.sheetWebAppUrl.length > 0;
    }

    async fetchSheetExpenses() {
        const data = await this.sheetRequest('list');
        return Array.isArray(data.expenses) ? data.expenses : [];
    }

    sheetRequest(action, payload = {}) {
        return new Promise((resolve, reject) => {
            const callbackName = `expenseSheetCallback_${Date.now()}`;
            const script = document.createElement('script');
            const url = new URL(this.sheetWebAppUrl);

            url.searchParams.set('action', action);
            url.searchParams.set('callback', callbackName);
            url.searchParams.set('_', Date.now().toString());

            if (Object.keys(payload).length > 0) {
                url.searchParams.set('payload', JSON.stringify(payload));
            }

            const timeout = setTimeout(() => {
                cleanup();
                reject(new Error(`Sheet ${action} timed out`));
            }, 10000);

            const cleanup = () => {
                clearTimeout(timeout);
                delete window[callbackName];
                script.remove();
            };

            window[callbackName] = (data) => {
                cleanup();
                if (data && data.ok === false) {
                    reject(new Error(data.error || `Sheet ${action} failed`));
                } else {
                    resolve(data || {});
                }
            };

            script.onerror = () => {
                cleanup();
                reject(new Error(`Sheet ${action} failed`));
            };

            script.src = url.toString();
            document.body.appendChild(script);
        });
    }

    async syncExpenseToSheet(expense) {
        if (!this.isSheetSyncEnabled()) {
            return;
        }

        this.markPendingSync(expense.id);

        try {
            await this.sheetRequest('upsert', { expense });
            this.clearPendingSync(expense.id);
        } catch (error) {
            console.error('Google Sheets upsert failed:', error);
            this.showToast('Saved locally. Sheet sync failed.', 'error');
        }
    }

    async deleteExpenseFromSheet(id) {
        if (!this.isSheetSyncEnabled()) {
            return;
        }

        try {
            await this.sheetRequest('delete', { id });
            this.clearPendingSync(id);
        } catch (error) {
            console.error('Google Sheets delete failed:', error);
            this.showToast('Deleted locally. Sheet sync failed.', 'error');
        }
    }

    async syncPendingExpenses() {
        if (!this.isSheetSyncEnabled()) {
            return;
        }

        const pendingIds = [...this.pendingSyncIds];

        for (const id of pendingIds) {
            const expense = this.expenses.find(item => Number(item.id) === Number(id));
            if (expense) {
                await this.syncExpenseToSheet(expense);
            }
        }
    }

    mergeExpenses(sheetExpenses, localExpenses) {
        const merged = new Map();

        sheetExpenses.forEach(expense => merged.set(Number(expense.id), expense));
        localExpenses.forEach(expense => {
            if (this.pendingSyncIds.has(Number(expense.id)) || !merged.has(Number(expense.id))) {
                merged.set(Number(expense.id), expense);
            }
        });

        return [...merged.values()];
    }

    getUniqueUsers() {
        return [...new Set(
            this.expenses
                .map(expense => (expense.spentBy || '').trim())
                .filter(Boolean)
        )].sort((a, b) => a.localeCompare(b));
    }

    updateUserFilterOptions() {
        const userFilter = document.getElementById('userFilter');
        const selectedUser = userFilter.value;
        const users = this.getUniqueUsers();

        userFilter.innerHTML = [
            '<option value="">All Users</option>',
            ...users.map(user => `<option value="${this.escapeHtml(user)}">${this.escapeHtml(user)}</option>`)
        ].join('');

        if (users.includes(selectedUser)) {
            userFilter.value = selectedUser;
        }
    }

    getUserTotals(expenses = this.expenses) {
        const totals = {};

        expenses.forEach(expense => {
            const user = (expense.spentBy || 'Unknown').trim() || 'Unknown';
            totals[user] = (totals[user] || 0) + expense.amount;
        });

        return totals;
    }

    // Set up event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.closest('.nav-btn').dataset.view));
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Add expense form
        document.getElementById('expenseForm').addEventListener('submit', (e) => this.handleAddExpense(e));

        // Filters and search
        document.getElementById('searchInput').addEventListener('input', () => this.filterAndDisplayExpenses());
        document.getElementById('categoryFilter').addEventListener('change', () => this.filterAndDisplayExpenses());
        document.getElementById('userFilter').addEventListener('change', () => this.filterAndDisplayExpenses());
        document.getElementById('dateFilter').addEventListener('change', () => this.filterAndDisplayExpenses());

        // Modal
        document.getElementById('closeModal').addEventListener('click', () => this.closeEditModal());
        document.getElementById('editForm').addEventListener('submit', (e) => this.handleEditExpense(e));
        document.getElementById('deleteExpenseBtn').addEventListener('click', () => this.deleteExpense());
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') this.closeEditModal();
        });

        if (this.isSheetSyncEnabled()) {
            window.addEventListener('focus', () => this.refreshFromSheet());
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) this.refreshFromSheet();
            });
            setInterval(() => this.refreshFromSheet(), 60000);
        }
    }

    async refreshFromSheet() {
        if (!this.isSheetSyncEnabled()) {
            return;
        }

        try {
            const sheetExpenses = await this.fetchSheetExpenses();
            const mergedExpenses = this.mergeExpenses(sheetExpenses, this.expenses);

            const currentData = JSON.stringify(this.expenses);
            const sheetData = JSON.stringify(mergedExpenses);

            if (currentData !== sheetData) {
                this.expenses = mergedExpenses;
                await this.saveExpenses({ syncRemote: false });
                this.updateAllViews();
            }

            await this.syncPendingExpenses();
        } catch (error) {
            console.error('Google Sheets refresh failed:', error);
        }
    }

    // Initialize theme
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeToggleIcon(savedTheme);
    }

    // Set default date to today
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expenseDate').valueAsDate = new Date();
        document.getElementById('editDate').valueAsDate = new Date();
    }

    // ============================================
    // THEME MANAGEMENT
    // ============================================

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeToggleIcon(newTheme);
    }

    updateThemeToggleIcon(theme) {
        const icon = theme === 'light' ? '🌙' : '☀️';
        document.getElementById('themeToggle').textContent = icon;
    }

    // ============================================
    // VIEW MANAGEMENT
    // ============================================

    switchView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected view
        const viewElement = document.getElementById(`${viewName}-view`);
        if (viewElement) {
            viewElement.classList.add('active');
        }

        // Mark button as active
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Update view-specific content
        if (viewName === 'dashboard') {
            this.updateDashboard();
        } else if (viewName === 'expenses') {
            this.filterAndDisplayExpenses();
        } else if (viewName === 'analytics') {
            this.updateAnalytics();
        }
    }

    // ============================================
    // EXPENSE MANAGEMENT
    // ============================================

    async handleAddExpense(e) {
        e.preventDefault();

        const expense = {
            id: Date.now(),
            description: document.getElementById('expenseDescription').value.trim(),
            amount: parseFloat(document.getElementById('expenseAmount').value),
            category: document.getElementById('expenseCategory').value,
            date: document.getElementById('expenseDate').value,
            spentBy: document.getElementById('expenseSpentBy').value.trim(),
            notes: document.getElementById('expenseNotes').value.trim(),
            createdAt: new Date().toISOString()
        };

        // Validate
        if (!this.validateExpense(expense)) {
            return;
        }

        this.expenses.push(expense);
        await this.saveExpenses({ syncRemote: false });
        this.syncExpenseToSheet(expense);
        
        // Reset form and update views
        const form = e.target;
        form.reset();
        setTimeout(() => this.setDefaultDate(), 0);
        this.updateAllViews();
        
        // Switch to dashboard
        this.switchView('dashboard');
        this.showToast('Expense added successfully!', 'success');
    }

    validateExpense(expense) {
        if (!expense.description || expense.description.length === 0) {
            this.showToast('Please enter a description', 'error');
            return false;
        }
        if (!expense.amount || expense.amount <= 0) {
            this.showToast('Please enter a valid amount', 'error');
            return false;
        }
        if (!expense.category) {
            this.showToast('Please select a category', 'error');
            return false;
        }
        if (!expense.spentBy || expense.spentBy.length === 0) {
            this.showToast('Please enter who spent this amount', 'error');
            return false;
        }
        return true;
    }

    openEditModal(id) {
        this.currentEditingId = id;
        const expense = this.expenses.find(e => e.id === id);

        if (!expense) {
            this.showToast('Expense not found', 'error');
            return;
        }

        // Populate form
        document.getElementById('editExpenseId').value = expense.id;
        document.getElementById('editDescription').value = expense.description;
        document.getElementById('editAmount').value = expense.amount;
        document.getElementById('editCategory').value = expense.category;
        document.getElementById('editDate').value = expense.date;
        document.getElementById('editSpentBy').value = expense.spentBy || '';
        document.getElementById('editNotes').value = expense.notes;

        // Show modal
        document.getElementById('editModal').classList.add('active');
    }

    closeEditModal() {
        document.getElementById('editModal').classList.remove('active');
        this.currentEditingId = null;
    }

    async handleEditExpense(e) {
        e.preventDefault();

        const id = parseInt(document.getElementById('editExpenseId').value);
        const expenseIndex = this.expenses.findIndex(e => e.id === id);

        if (expenseIndex === -1) {
            this.showToast('Expense not found', 'error');
            return;
        }

        const updatedExpense = {
            ...this.expenses[expenseIndex],
            description: document.getElementById('editDescription').value.trim(),
            amount: parseFloat(document.getElementById('editAmount').value),
            category: document.getElementById('editCategory').value,
            date: document.getElementById('editDate').value,
            spentBy: document.getElementById('editSpentBy').value.trim(),
            notes: document.getElementById('editNotes').value.trim(),
            updatedAt: new Date().toISOString()
        };

        if (!this.validateExpense(updatedExpense)) {
            return;
        }

        this.expenses[expenseIndex] = updatedExpense;
        await this.saveExpenses({ syncRemote: false });
        this.syncExpenseToSheet(updatedExpense);
        this.showToast('Expense updated successfully!', 'success');
        this.closeEditModal();
        this.updateAllViews();
    }

    async deleteExpense() {
        if (!confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        const id = parseInt(document.getElementById('editExpenseId').value);
        this.expenses = this.expenses.filter(e => e.id !== id);
        await this.saveExpenses({ syncRemote: false });
        this.deleteExpenseFromSheet(id);
        this.showToast('Expense deleted successfully!', 'success');
        this.closeEditModal();
        this.updateAllViews();
    }

    // ============================================
    // FILTERING & SEARCHING
    // ============================================

    getFilteredExpenses() {
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        const selectedCategory = document.getElementById('categoryFilter').value;
        const selectedUser = document.getElementById('userFilter').value;
        const selectedDate = document.getElementById('dateFilter').value;

        return this.expenses.filter(expense => {
            // Search filter
            const matchesSearch = 
                expense.description.toLowerCase().includes(searchQuery) ||
                expense.notes.toLowerCase().includes(searchQuery);

            // Category filter
            const matchesCategory = !selectedCategory || expense.category === selectedCategory;

            // User filter
            const matchesUser = !selectedUser || expense.spentBy === selectedUser;

            // Date filter
            const matchesDate = !selectedDate || expense.date === selectedDate;

            return matchesSearch && matchesCategory && matchesUser && matchesDate;
        });
    }

    filterAndDisplayExpenses() {
        this.updateUserFilterOptions();
        const filtered = this.getFilteredExpenses();
        this.displayExpensesTable(filtered);
        this.updateFilteredSummary(filtered);
    }

    displayExpensesTable(expenses) {
        const tbody = document.getElementById('expensesTableBody');
        
        if (expenses.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="7" class="empty-state">No expenses found</td></tr>';
            return;
        }

        // Sort by date descending
        expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

        tbody.innerHTML = expenses.map(expense => `
            <tr>
                <td>${this.formatDate(expense.date)}</td>
                <td>${this.escapeHtml(expense.description)}</td>
                <td><span class="category-badge ${expense.category}">${expense.category}</span></td>
                <td class="amount-cell">₹${expense.amount.toFixed(2)}</td>
                <td>${this.escapeHtml(expense.spentBy || '-')}</td>
                <td>${this.escapeHtml(expense.notes)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="app.openEditModal(${expense.id})" title="Edit">✏️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateFilteredSummary(expenses) {
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);
        const userTotals = this.getUserTotals(expenses);
        const userSummary = Object.entries(userTotals)
            .sort((a, b) => b[1] - a[1])
            .map(([user, amount]) => `${this.escapeHtml(user)}: ₹${amount.toFixed(2)}`)
            .join(' | ');

        document.getElementById('filteredTotal').textContent = `₹${total.toFixed(2)}`;
        document.getElementById('filteredCount').textContent = expenses.length;
        document.getElementById('filteredUsers').textContent = userSummary || '-';
    }

    // ============================================
    // CALCULATIONS
    // ============================================

    getTotalExpenses() {
        return this.expenses.reduce((sum, e) => sum + e.amount, 0);
    }

    getCurrentMonthExpenses() {
        const now = new Date();
        const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
        
        return this.expenses
            .filter(e => e.date.startsWith(currentMonth))
            .reduce((sum, e) => sum + e.amount, 0);
    }

    getExpensesByCategory() {
        const byCategory = {};
        
        this.expenses.forEach(expense => {
            if (!byCategory[expense.category]) {
                byCategory[expense.category] = 0;
            }
            byCategory[expense.category] += expense.amount;
        });

        return byCategory;
    }

    getTopCategory() {
        const byCategory = this.getExpensesByCategory();
        let topCategory = null;
        let maxAmount = 0;

        Object.entries(byCategory).forEach(([category, amount]) => {
            if (amount > maxAmount) {
                maxAmount = amount;
                topCategory = category;
            }
        });

        return { category: topCategory, amount: maxAmount };
    }

    getExpensesByMonth() {
        const byMonth = {};

        this.expenses.forEach(expense => {
            const month = expense.date.substring(0, 7); // YYYY-MM
            if (!byMonth[month]) {
                byMonth[month] = 0;
            }
            byMonth[month] += expense.amount;
        });

        return byMonth;
    }

    // ============================================
    // DASHBOARD
    // ============================================

    updateDashboard() {
        this.updateSummaryCards();
        this.updateRecentTransactions();
        this.updateCharts();
    }

    updateSummaryCards() {
        const total = this.getTotalExpenses();
        const monthlyTotal = this.getCurrentMonthExpenses();
        const topCategory = this.getTopCategory();

        document.getElementById('totalExpenses').textContent = `₹${total.toFixed(2)}`;
        document.getElementById('totalTransactions').textContent = this.expenses.length;
        document.getElementById('monthlyExpenses').textContent = `₹${monthlyTotal.toFixed(2)}`;

        if (topCategory.category) {
            document.getElementById('topCategory').textContent = topCategory.category;
            document.getElementById('topCategoryAmount').textContent = `₹${topCategory.amount.toFixed(2)}`;
        } else {
            document.getElementById('topCategory').textContent = '-';
            document.getElementById('topCategoryAmount').textContent = '-';
        }
    }

    updateRecentTransactions() {
        const recent = [...this.expenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        const container = document.getElementById('recentTransactions');

        if (recent.length === 0) {
            container.innerHTML = '<p class="empty-state">No transactions yet</p>';
            return;
        }

        container.innerHTML = recent.map(expense => `
            <div class="transaction-item" style="border-left-color: var(--${this.getCategoryColor(expense.category)})">
                <div class="transaction-info">
                    <div class="transaction-description">${this.escapeHtml(expense.description)}</div>
                    <div class="transaction-meta">${expense.category} • ${this.formatDate(expense.date)}</div>
                </div>
                <div class="transaction-amount">₹${expense.amount.toFixed(2)}</div>
            </div>
        `).join('');
    }

    // ============================================
    // CHARTS
    // ============================================

    updateCharts() {
        this.updateCategoryChart();
        this.updateMonthlyChart();
    }

    updateCategoryChart() {
        const data = this.getExpensesByCategory();
        const labels = Object.keys(data);
        const values = Object.values(data);

        if (values.length === 0) {
            if (this.chartInstances.category) {
                this.chartInstances.category.destroy();
                this.chartInstances.category = null;
            }
            document.getElementById('categoryChart').style.display = 'none';
            return;
        }

        document.getElementById('categoryChart').style.display = 'block';

        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        if (this.chartInstances.category) {
            this.chartInstances.category.destroy();
        }

        this.chartInstances.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        '#e67e22', // Food
                        '#2980b9', // Travel
                        '#e91e63', // Shopping
                        '#9b59b6', // Bills
                        '#f39c12', // Entertainment
                        '#27ae60', // Health
                        '#3498db', // Education
                        '#95a5a6'  // Other
                    ],
                    borderColor: 'var(--bg-primary)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'var(--text-primary)',
                            padding: 15,
                            font: {
                                size: 14,
                                weight: '500'
                            }
                        }
                    }
                }
            }
        });
    }

    updateMonthlyChart() {
        const data = this.getExpensesByMonth();
        
        if (Object.keys(data).length === 0) {
            if (this.chartInstances.monthly) {
                this.chartInstances.monthly.destroy();
                this.chartInstances.monthly = null;
            }
            document.getElementById('monthlyChart').style.display = 'none';
            return;
        }

        document.getElementById('monthlyChart').style.display = 'block';

        // Sort by month
        const sortedMonths = Object.keys(data).sort();
        const values = sortedMonths.map(month => data[month]);

        const ctx = document.getElementById('monthlyChart').getContext('2d');
        
        if (this.chartInstances.monthly) {
            this.chartInstances.monthly.destroy();
        }

        this.chartInstances.monthly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedMonths.map(m => this.formatMonthLabel(m)),
                datasets: [{
                    label: 'Monthly Expenses',
                    data: values,
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 2,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: 'var(--text-primary)',
                            font: {
                                size: 14,
                                weight: '500'
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'var(--text-secondary)',
                            callback: function(value) {
                                return '₹' + value.toFixed(0);
                            }
                        },
                        grid: {
                            color: 'var(--border-color)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'var(--text-secondary)'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // ============================================
    // ANALYTICS
    // ============================================

    updateAnalytics() {
        this.updateMonthlySummary();
        this.updateCategorySummary();
        this.updateAnalyticsCharts();
    }

    updateMonthlySummary() {
        const data = this.getExpensesByMonth();
        const container = document.getElementById('monthlySummary');

        if (Object.keys(data).length === 0) {
            container.innerHTML = '<p class="empty-state">No data available</p>';
            return;
        }

        const sorted = Object.keys(data).sort().reverse();

        container.innerHTML = sorted.map(month => `
            <div class="summary-item">
                <div class="summary-item-label">${this.formatMonthLabel(month)}</div>
                <div class="summary-item-value">₹${data[month].toFixed(2)}</div>
            </div>
        `).join('');
    }

    updateCategorySummary() {
        const data = this.getExpensesByCategory();
        const container = document.getElementById('categorySummary');

        if (Object.keys(data).length === 0) {
            container.innerHTML = '<p class="empty-state">No data available</p>';
            return;
        }

        const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);

        container.innerHTML = sorted.map(([category, amount]) => `
            <div class="summary-item" style="border-left-color: var(--${this.getCategoryColor(category)})">
                <div class="summary-item-label">${category}</div>
                <div class="summary-item-value">₹${amount.toFixed(2)}</div>
            </div>
        `).join('');
    }

    updateAnalyticsCharts() {
        const catCtx = document.getElementById('analyticsCategory').getContext('2d');
        const monthlyCtx = document.getElementById('analyticsMonthly').getContext('2d');

        // Category pie chart
        const categoryData = this.getExpensesByCategory();
        const categoryLabels = Object.keys(categoryData);
        const categoryValues = Object.values(categoryData);

        if (this.chartInstances.analyticsCat) {
            this.chartInstances.analyticsCat.destroy();
        }

        this.chartInstances.analyticsCat = new Chart(catCtx, {
            type: 'pie',
            data: {
                labels: categoryLabels,
                datasets: [{
                    data: categoryValues,
                    backgroundColor: [
                        '#e67e22', '#2980b9', '#e91e63', '#9b59b6',
                        '#f39c12', '#27ae60', '#3498db', '#95a5a6'
                    ],
                    borderColor: 'var(--bg-primary)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'var(--text-primary)',
                            padding: 15
                        }
                    }
                }
            }
        });

        // Monthly line chart
        const monthlyData = this.getExpensesByMonth();
        const sortedMonths = Object.keys(monthlyData).sort();
        const monthlyValues = sortedMonths.map(m => monthlyData[m]);

        if (this.chartInstances.analyticsMonth) {
            this.chartInstances.analyticsMonth.destroy();
        }

        this.chartInstances.analyticsMonth = new Chart(monthlyCtx, {
            type: 'line',
            data: {
                labels: sortedMonths.map(m => this.formatMonthLabel(m)),
                datasets: [{
                    label: 'Total Expenses',
                    data: monthlyValues,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#3498db',
                    pointBorderColor: '#2980b9',
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: 'var(--text-primary)'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'var(--text-secondary)',
                            callback: function(value) {
                                return '₹' + value.toFixed(0);
                            }
                        },
                        grid: {
                            color: 'var(--border-color)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'var(--text-secondary)'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    updateAllViews() {
        this.updateUserFilterOptions();
        this.updateDashboard();
        this.filterAndDisplayExpenses();
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, options);
    }

    formatMonthLabel(monthString) {
        const [year, month] = monthString.split('-');
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    }

    getCategoryColor(category) {
        const colors = {
            'Food': 'food',
            'Travel': 'travel',
            'Shopping': 'shopping',
            'Bills': 'bills',
            'Entertainment': 'entertainment',
            'Health': 'health',
            'Education': 'education',
            'Other': 'other'
        };
        return colors[category] || 'primary';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }
}

// ============================================
// APPLICATION INITIALIZATION
// ============================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new ExpenseApp();
});
