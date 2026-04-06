# 💰 Finance Dashboard

A modern, responsive finance dashboard built using React and Tailwind CSS to help users track, analyze, and understand their financial activity.

---

## 🚀 Overview

This project simulates a personal finance dashboard where users can:

- View financial summaries (balance, income, expenses)
- Explore transactions with filtering and search
- Analyze spending patterns using charts
- Gain insights from financial data
- Interact with role-based UI (Viewer/Admin)

The focus of this project is on **clean UI, proper state management, and meaningful data visualization**.

---

## ✨ Features

### 📊 Dashboard Overview
- Summary cards for:
  - Total Balance
  - Total Income
  - Total Expenses
- Trend indicators for quick insights

---

### 📈 Charts & Visualization
- Line chart showing **balance over time**
- Pie chart showing **expense breakdown by category**
- Fully dynamic and updates based on:
  - Date range
  - Transactions

---

### 📅 Time-Based Filtering
- Filter dashboard data using:
  - Last 7 Days
  - Last 30 Days
  - All Time
  - Custom Date Range

- All sections update dynamically:
  - Charts
  - Summary cards
  - Transactions
  - Insights

---

### 📋 Transactions Management
- View all transactions with:
  - Date
  - Category
  - Type (Income/Expense)
  - Amount (₹)

- Features:
  - 🔍 Search by category/description
  - 🎯 Filter by type (Income/Expense)
  - ↕️ Sorting
  - ✅ Multi-select transactions
  - 🗑️ Bulk delete with confirmation modal

---

### 👤 Role-Based UI
- **Viewer**
  - Can only view data
  - No edit/delete/add access

- **Admin**
  - Can add transactions
  - Can delete single or multiple transactions
  - Confirmation modal before deletion

---

### 💡 Insights Section
- Highlights key financial observations:
  - Highest spending category
  - Percentage contribution to total expenses
  - Monthly comparison insights
  - Savings rate

---

### 🌙 UI/UX Enhancements
- Clean and modern dark theme
- Responsive design (mobile + desktop)
- Smooth hover effects and transitions
- Empty state handling

---

## 🛠️ Tech Stack

- **React (Vite)**
- **Tailwind CSS**
- **Zustand** (state management)
- **Recharts** (data visualization)

---

## 🧠 Key Design Decisions

- Used **Zustand** for simple and scalable state management
- Centralized all logic around a single `transactions` dataset
- Derived:
  - Summary values
  - Chart data
  - Insights  
  from the same source to maintain consistency

- Focused on **user experience and clarity over complexity**

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone <your-repo-link>

# Navigate to project folder
cd finance-dashboard

# Install dependencies
npm install

# Run the development server
npm run dev
