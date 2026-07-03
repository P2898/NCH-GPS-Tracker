# 🗺️ NCH GPS Tracker App

A robust, serverless React Native mobile application built for field teams. This app tracks employee travel routes in the background, automatically calculates exact distances using GPS coordinates, and calculates financial reimbursements in real-time.

Instead of relying on expensive backend infrastructure like AWS or Firebase, this project uses **Google Apps Script** and **Google Sheets** as a 100% free, scalable backend database.

---

## ✨ Why this exists

Managing field staff travel logs is notoriously difficult. Paper logs are inaccurate, and commercial GPS tracking software is often expensive and overly complex.

This app was built to solve that problem with a focus on **simplicity and zero running costs**. It gives employees a dead-simple interface to "Start Trip" and "End Trip", while giving administrators a powerful live-tracking dashboard to monitor exactly who is on the road, where they are, and exactly how much they need to be reimbursed — all based on a dynamic, centrally-controlled per-kilometer rate.

---

## 📱 Key Features

### 👨‍💼 For Employees (Field Staff)
- **One-Tap Trip Tracking:** Start and stop trips with a single tap on the Dashboard.
- **Background GPS:** Uses `expo-location` and `expo-task-manager` to accurately track coordinates even when the phone is locked or the app is minimized.
- **Live Earnings Display:** Calculates distance in real-time using the Haversine formula and multiplies it by the company's current Per-KM rate to show exact earnings during the ride.
- **Trip History:** A dedicated History screen shows all past trips with distance, earnings, and duration.
- **Monthly Summary & Analytics:** A Summary screen shows month-by-month bar charts of total distance and total earnings.
- **Dark Mode Support:** Full light/dark theme toggle available in the Profile screen.
- **Offline Resilience:** If a trip ends without a network connection, the trip is queued locally and automatically synced to the cloud the next time the app opens.

### 🛡️ For Administrators
- **Hidden Admin Portal:** A separate, secure login screen accessible from the Employee login page.
- **Live Tracking Dashboard:** See exactly which employees are on a ride right now, their real-time coordinates, distance covered so far, and earnings — auto-refreshed every 30 seconds.
- **Company-Wide Trip Analytics:** View all historical trips across the entire organisation with filterable charts showing total company payout and distance.
- **Employee Directory:** Browse the full employee roster and tap into individual employee detail pages.
- **Dynamic Rate Control:** Update the global reimbursement rate (e.g., ₹4.00/km → ₹10.00/km) directly from the app. The change is immediately reflected for all employees globally the next time they open the app.
- **Session Management:** Admin sessions expire automatically after 8 hours for security.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React Native (Expo ~54) |
| **Language** | JavaScript (ES6+) |
| **Navigation** | React Navigation 6 (Native Stack + Bottom Tabs) |
| **State Management** | React Hooks & Context API |
| **Local Storage** | `@react-native-async-storage/async-storage` |
| **Background GPS** | `expo-location` + `expo-task-manager` |
| **Notifications** | `expo-notifications` |
| **Data Charts** | `react-native-chart-kit` + `react-native-svg` |
| **Haptics** | `expo-haptics` |
| **PDF Export** | `expo-print` + `expo-sharing` |
| **Backend API** | Google Apps Script (Serverless) |
| **Database** | Google Sheets |

### 🧠 The "Google Sheets as a Database" Architecture

By deploying a custom Google Apps Script as a Web App, the Google Sheet becomes a fully functional REST API that the mobile app communicates with via standard HTTP `fetch` calls.

**How it works:**
1. The app sends a JSON payload to the Apps Script endpoint with an `action` field.
2. The script routes the request based on the action:
   - `save_trip` → writes a completed trip row to the **Trips** sheet
   - `update_location` → upserts the employee's row in the **Active Locations** sheet (for live tracking)
   - `remove_location` → deletes the employee's row from **Active Locations** when the trip ends
   - `get_settings` → reads the global KM rate from the **Settings** sheet
   - `update_settings` → writes a new KM rate to the **Settings** sheet
3. All requests are authenticated with a shared secret key checked by the script.

This architecture means **HR and Accounting can open the Google Sheet directly** to view and export all travel data — no custom web dashboard needed!

---

## 📂 Project Structure

```
NCH-GPS-Tracker/
├── App.js                          # Root app, navigation, session handling
├── GoogleAppsScript.js             # Backend script (paste into Google Apps Script)
├── app.json                        # Expo app configuration
├── eas.json                        # EAS Build configuration (Android APK / iOS IPA)
│
├── constants/
│   ├── adminCredentials.js         # Admin login credentials (via env vars)
│   └── theme.js                    # Design system: colors, fonts, spacing
│
├── context/
│   └── ThemeContext.js             # Light/Dark mode global state
│
├── screens/
│   ├── DashboardScreen.js          # Employee home: start/end trip, live tracking
│   ├── HistoryScreen.js            # Employee trip history list
│   ├── SummaryScreen.js            # Monthly analytics with charts
│   ├── ProfileScreen.js            # Employee profile, rate info, logout
│   ├── LoginScreen.js              # Employee login screen
│   └── admin/
│       ├── AdminLoginScreen.js     # Admin login portal
│       ├── AdminOverviewScreen.js  # Live tracking + company analytics dashboard
│       ├── AdminTripsScreen.js     # All company trips view
│       ├── AdminEmployeesScreen.js # Employee directory
│       ├── AdminEmployeeDetailScreen.js  # Per-employee detail view
│       └── AdminSettingsScreen.js  # Rate control & admin settings
│
├── services/
│   └── googleSheetsService.js      # All API calls to Google Sheets backend
│
├── components/
│   ├── TripCard.js                 # Reusable trip card UI component
│   ├── SummaryCard.js              # Reusable stat card component
│   ├── ThemeToggle.js              # Light/dark mode toggle button
│   ├── LiveTripBanner.js           # Floating banner shown during active trip
│   └── MonthPicker.js              # Month selector for Summary screen
│
└── utils/
    ├── haversine.js                # GPS distance calculation formula
    ├── formatters.js               # Currency, distance, date formatters
    ├── storage.js                  # AsyncStorage helpers for trips & sessions
    ├── pdfExport.js                # Trip PDF export utility
    └── crossPlatform.js            # iOS/Android compatibility helpers
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or above)
- Expo CLI (`npm install -g expo-cli`)
- A Google Account

### 1. Clone the repository
```bash
git clone https://github.com/P2898/NCH-GPS-Tracker.git
cd NCH-GPS-Tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup the Google Sheet Backend

1. Create a new **Google Sheet**.
2. Create four tabs at the bottom named exactly: `All Trips`, `Active Locations`, `Employees`, `Settings`.
3. Go to **Extensions → Apps Script**.
4. Delete all existing code and paste the entire contents of `GoogleAppsScript.js` from this repo.
5. Choose a secure random string as your secret key and replace `your_secret_api_key_here` at the top of the script.
6. Click **Deploy → New Deployment**, set type to **Web App**, set "Who has access" to **Anyone**, and click **Deploy**.
7. Copy the generated **Web App URL**.

### 4. Configure Environment Variables

Create a `.env` file in the root project directory:
```env
EXPO_PUBLIC_ADMIN_USERNAME=your_admin_username
EXPO_PUBLIC_ADMIN_PASSWORD=your_secure_password
EXPO_PUBLIC_GOOGLE_SHEETS_URL=YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL
EXPO_PUBLIC_SECRET_KEY=YOUR_SECRET_KEY
```
> ⚠️ Never commit this `.env` file to GitHub. It is already listed in `.gitignore`.

### 5. Run the App
```bash
npx expo start --clear
```
Scan the QR code with the **Expo Go** app on your physical device.

> **Note:** Background GPS tracking requires a real physical device. It will not work correctly on emulators or simulators.

### 6. Build for Production (Optional)

To build a standalone APK (Android) or IPA (iOS):
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

---

## ⚙️ How the Google Sheet Tabs are Used

| Sheet Tab | Purpose |
|-----------|---------|
| `All Trips` | Permanent log of every completed trip |
| `Active Locations` | Live table of employees currently on a ride |
| `Employees` | Roster of all registered field staff |
| `Settings` | Stores the global rate per KM |
