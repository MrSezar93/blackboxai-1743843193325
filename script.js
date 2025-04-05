// Initialize app data
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// DOM Elements
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const balanceEl = document.getElementById('balance');
const monthlyChartEl = document.getElementById('monthlyChart');

// Initialize Chart
let monthlyChart;

// Main initialization function
function init() {
    updateSummary();
    renderChart();
    setupEventListeners();
}

// Calculate and update summary values
function updateSummary() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;

    totalIncomeEl.textContent = formatCurrency(income);
    totalExpenseEl.textContent = formatCurrency(expense);
    balanceEl.textContent = formatCurrency(balance);
}

// Format currency based on settings
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Render monthly chart
function renderChart() {
    if (monthlyChart) {
        monthlyChart.destroy();
    }

    const monthlyData = getMonthlyData();
    const ctx = monthlyChartEl.getContext('2d');

    monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Income',
                    data: monthlyData.income,
                    backgroundColor: '#48bb78',
                    borderColor: '#48bb78',
                    borderWidth: 1
                },
                {
                    label: 'Expenses',
                    data: monthlyData.expense,
                    backgroundColor: '#f56565',
                    borderColor: '#f56565',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Get monthly aggregated data
function getMonthlyData() {
    const result = {
        income: Array(12).fill(0),
        expense: Array(12).fill(0)
    };

    transactions.forEach(t => {
        const month = new Date(t.date).getMonth();
        if (t.type === 'income') {
            result.income[month] += t.amount;
        } else {
            result.expense[month] += t.amount;
        }
    });

    return result;
}

// Setup event listeners
function setupEventListeners() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
}

// Toggle dark mode
function toggleDarkMode(e) {
    document.body.classList.toggle('dark', e.target.checked);
    localStorage.setItem('darkMode', e.target.checked);
}

// Initialize dark mode from localStorage
function initDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark', darkMode);
    if (document.getElementById('dark-mode-toggle')) {
        document.getElementById('dark-mode-toggle').checked = darkMode;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    initDarkMode();
});

// Export functions needed in other files
window.app = {
    addTransaction: (transaction) => {
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateSummary();
        renderChart();
    },
    getTransactions: () => [...transactions],
    deleteTransaction: (id) => {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateSummary();
        renderChart();
    }
};