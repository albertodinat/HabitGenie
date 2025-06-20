# 🚀 Habit Tracker App - Screenshots and Features

Welcome to the Habit Tracker App! Below are some screenshots showcasing its key features and design.

---

## 📱 App Screenshots

### **1. Login Screen**
A sleek and intuitive Login screen.

<img src="https://github.com/user-attachments/assets/ea7e453d-f5f5-4277-a950-c80d1524e854" alt="Home Screen" width="300" />
<img src="https://github.com/user-attachments/assets/5e9c4d6a-74a2-4520-a1d6-b997d7ed2497" alt="Home Screen" width="300" />

---

### **2. Home Screen**
A sleek and intuitive home screen that helps users track their daily habits at a glance.

<img src="https://github.com/user-attachments/assets/cd1f421f-96ac-4e03-bea5-2001edc20adc" alt="Add Habit Screen" width="300" />

https://github.com/user-attachments/assets/6a3716bf-20da-4352-82a2-f6e48b1a5c52

---

### **3. Habit Calendar Screen**
Retrieve details of all habits tracked for a specific date.

<img src="https://github.com/user-attachments/assets/e4b55421-3634-44ab-9633-9e46ef8a843e" alt="Habit Details Screen" width="300" />

---

### **4. Settings Screen**
Customize your experience with a variety of settings.

<img src="https://github.com/user-attachments/assets/8affa2f2-792b-4fcc-8b3c-ab88d15b3192" alt="Settings Screen" width="300" />

---

### **5. Daily Habits Screen**
Track Daily Habits: *Monitor your progress and stay consistent*

<img src="https://github.com/user-attachments/assets/d1d0f09a-205b-4568-912d-f4424e0c9b8c" alt="Notifications Screen" width="300" />

---

## 🎯 Key Features
- **Track Daily Habits:** Monitor your progress and stay consistent.
- **Custom Reminders:** Never miss a habit with personalized notifications.
- **Intuitive Interface:** Designed for ease of use and efficiency.
- **Data Insights:** View detailed analytics to improve your habits over time.
- **Customizable Settings:** Tailor the app to your preferences.

---

## 🔗 Get Started
Clone the repository and start tracking your habits today!

```bash
git clone https://github.com/your-repository/habit-tracker-app.git
```

### Configuration
Create a `.env` file from the provided example and adjust the settings:

```bash
cp .env.example .env
```

The `.env` file contains the `ENABLE_NOTIFICATIONS` variable. Set it to `true` to allow Firebase Functions to send Expo push notifications or `false` to disable them.

## 🔔 Push Notifications

The project uses Expo push notifications triggered by Firebase Functions.

```bash
ENABLE_NOTIFICATIONS=true
```

When testing, create an appointment scheduled within the next 10 minutes. The function will immediately trigger the reminder scheduled for **-3h** so you can verify the notifications.

## 🧪 Tests

Jest is used for unit tests. Install the dependencies and run the test suite with:

```bash
npm install
npm test
```


