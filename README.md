# 🌐 NavStack – Browser History Simulator

![NavStack Logo](https://drive.google.com/uc?export=view\&id=1A0_Gz5JQbTSwZ8_kw-RiZTHIoeHodNaZ)

An interactive web application that **accurately simulates browser navigation history** using stack data structures, complete with real-time visualizations and smooth animations.

---

## 🎯 Project Overview

Modern browsers manage navigation history using **two stacks**:

* **Back Stack** – pages previously visited
* **Forward Stack** – pages available for forward navigation

**NavStack** visualizes this behavior in real time, allowing users to:

* Navigate between internal pages and external URLs
* Observe push/pop operations on both stacks
* Understand **real browser behavior**, including restricted and blocked websites

> 🔑 This project focuses on **browser-accurate semantics**, not naive URL reachability checks.

---

## 🏗️ Architecture (CRA + Vercel Serverless)

```
NavStack/
│
├── api/
│   └── validate-url.js        # Vercel Serverless Function
│
├── client/                   # Create React App (Frontend)
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Browser.js              # Core browser simulator
│   │   │   ├── Navigation.js           # Back / Forward controls
│   │   │   ├── PageContent.js          # Page rendering
│   │   │   └── StackVisualization.js   # Stack UI
│   │   │
│   │   ├── hooks/
│   │   │   └── useAnimation.js         # Slide / Bounce animations
│   │   │
│   │   ├── utils/
│   │   │   └── Stack.js                # Custom Stack implementation
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json           # CRA config (proxy for local dev)
│   └── node_modules/
│
└── README.md
```

---

## 🔁 Runtime Request Flow (Production)

```
Browser.js (React)
   ↓ fetch('/api/validate-url')
Vercel Serverless Function
   ↓
External Website
```

---

## 👥 Team Roles & Contributions

### 👨‍💻 **Rudra Kanwar** — Project Lead & Frontend Architect

**Key Contributions:**

* Designed the **overall system architecture**
* Implemented the **custom Stack data structure**
* Built the **Browser simulator core logic**:

  * `navigate`
  * `goBack`
  * `goForward`
* Defined **browser-accurate navigation rules**
* Implemented URL normalization, history checks, and UX states
* Integrated animations and validation feedback
* Migrated backend logic to **Vercel serverless API**

---

### 🎨 **Ambarish Maji** — UI / UX Designer

* Logo design and branding
* Color scheme suggestions
* UI layout

---

### 🛠️ **Sohail Khan & Ragini Kanojia** — Backend & Validation Logic

* Designed URL validation semantics
* Implemented `/api/validate-url`
* Handled real-world edge cases:

  * HTTP 403 / 404
  * Bot-blocked websites
  * DNS failures
  * Timeouts

---

## 🧩 Component Breakdown

### 1️⃣ `Stack.js` — Core Data Structure

Implements a clean **LIFO stack abstraction**.

```js
push(item)
pop()
peek()
isEmpty()
toArray()
```

✔ Encapsulated logic
✔ Used for both back and forward stacks

---

### 2️⃣ `Browser.js` — Core Simulator

The **heart of NavStack**.

Responsibilities:

* Maintains `backStack` and `forwardStack`
* Enforces navigation rules
* Decides **when navigation should be allowed**
* Coordinates animations and error feedback

---

### 3️⃣ `StackVisualization.js`

* Visualizes stack operations
* Highlights top elements
* Shows real-time depth changes

---

### 4️⃣ `Navigation.js`

* Back / Forward controls
* Disabled states when stacks are empty
* Mimics real browser navigation buttons

---

### 5️⃣ `PageContent.js`

* Displays current page
* Handles animated transitions
* Represents restricted or unreachable pages visually

---

### 6️⃣ `useAnimation.js`

Custom hooks providing:

* Slide animations for page transitions
* Bounce animations for invalid actions

---

## 🌐 URL Validation Logic (Browser-Accurate)

Validation is handled **server-side** via:

```http
POST /api/validate-url
```

### Interpretation Rules

| Condition      | Interpretation             |
| -------------- | -------------------------- |
| HTTP < 400     | Page exists                |
| HTTP 401 / 403 | Site exists but restricted |
| HTTP 404       | Page exists but not found  |
| Bot-blocked    | Site exists                |
| DNS failure    | Invalid                    |
| Timeout        | Invalid                    |

> ⚠️ Many modern sites (e.g. `x.com`, `chatgpt.com`) block server-side requests but load perfectly in browsers.

NavStack **correctly allows navigation** in such cases.

---

## 🎨 Design System

### Themes

* 🌞 **Light Theme** – clean and professional
* 🌙 **Dark Theme** – high contrast, modern look

### Animations

* Slide transitions during navigation
* Bounce feedback for invalid actions
* Smooth stack update animations

---

## 🚀 Getting Started (Local Development)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/navstack.git
cd navstack
```

### 2️⃣ Install Dependencies

```bash
cd client
npm install
```

### 3️⃣ Start Frontend

```bash
npm start
```

Frontend runs at:

```
http://localhost:3000
```

> During local development, CRA proxies `/api/validate-url`.

---

## 🌍 Deployment (Vercel)

* Frontend: **Create React App**
* Backend: **Vercel Serverless Function**
* No Express server required

```bash
vercel
```

✔ `/api/validate-url` automatically deployed
✔ `/client/build` served as frontend

---

## 🛠️ Technologies Used

* **React (CRA)** – Frontend
* **Vercel Serverless Functions** – Backend
* **Custom Stack DS** – Core logic
* **CSS Animations** – UI transitions
* **JavaScript (ES6+)**

---

## 🔒 Security & Safety

* URL sanitization
* Timeout-limited network requests
* No client-side external website fetches

---

## 📈 Future Enhancements

* [ ] Browser extension version
* [ ] History export/import
* [ ] Advanced stack operations
* [ ] Multi-language support
* [ ] Error-state visual classification

---

## 🧠 Key Takeaway

> **Navigation validity ≠ fetch success**

NavStack accurately models **how real browsers behave**, not how bots or scrapers behave.

This makes it a **strong educational, system-design, and data-structure project**.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## 🙏 Acknowledgments

* Inspired by real browser internals
* Built for learning and demonstration
* Thanks to the entire NavStack team

---