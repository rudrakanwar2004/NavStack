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
├── client/                     ← React (Create React App)
│   │
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Browser.js              # Core browser simulator
│   │   │   ├── Navigation.js           # Back / Forward controls
│   │   │   ├── PageContent.js          # Page rendering
│   │   │   └── StackVisualization.js   # Stack UI
│   │   │
│   │   ├── hooks/
│   │   │   └── useAnimation.js         # Slide & bounce animations
│   │   │
│   │   ├── utils/
│   │   │   └── Stack.js                # Custom stack implementation
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json            # CRA config (proxy → backend)
│   └── node_modules/
│
├── server/                     ← Node.js / Express backend
│   │
│   ├── server.js               # POST /api/validate-url (DNS validation)
│   ├── package.json
│   └── node_modules/
│
└── README.md

```

---

Perfect 👍
Below is a **clean, final, viva-ready `README.md`** that reflects **everything we fixed and finalized in this chat** — CRA + Express (local), DNS-based validation, correct stack logic, canonical URL normalization, and real-browser behavior.

You can **copy-paste this directly** as `README.md`.

---

# 🚀 NavStack – Browser History Simulator

![NavStack Logo](https://drive.google.com/uc?export=view\&id=1A0_Gz5JQbTSwZ8_kw-RiZTHIoeHodNaZ)

NavStack is an interactive **browser history simulator** built using **React** and **Node.js**, designed to demonstrate how real web browsers manage navigation history using **stack data structures** (LIFO – Last In, First Out).

This project is **educational**, **visual**, and **browser-accurate**, including real-world URL validation and canonicalization.

---

## 🎯 Project Objectives

* Demonstrate **stack data structure usage** in browser navigation
* Simulate **Back / Forward** browser behavior
* Validate **external URLs** realistically using DNS lookup
* Prevent invalid or duplicate history entries
* Provide a smooth, animated, user-friendly interface

---

## 🏗️ Final Architecture (Local Setup)

```
NavStack/
│
├── client/                     ← React (Create React App)
│   │
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Browser.js              # Core browser simulator
│   │   │   ├── Navigation.js           # Back / Forward controls
│   │   │   ├── PageContent.js          # Page rendering
│   │   │   └── StackVisualization.js   # Stack UI
│   │   │
│   │   ├── hooks/
│   │   │   └── useAnimation.js         # Slide & bounce animations
│   │   │
│   │   ├── utils/
│   │   │   └── Stack.js                # Custom stack implementation
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json            # CRA config (proxy → backend)
│   └── node_modules/
│
├── server/                     ← Node.js / Express backend
│   │
│   ├── server.js               # POST /api/validate-url (DNS validation)
│   ├── package.json
│   └── node_modules/
│
└── README.md
```

---

## 🔄 Navigation Logic (How It Works)

### New Navigation

```
User enters URL
→ URL normalization (case-insensitive)
→ DNS validation (backend)
→ If valid:
   - current page → backStack
   - forwardStack cleared
   - new page set as current
→ If invalid:
   - navigation blocked
```

### Back Button

```
currentPage → forwardStack
backStack.pop() → currentPage
```

### Forward Button

```
currentPage → backStack
forwardStack.pop() → currentPage
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

---

### 🎨 **Ambarish Maji** — UI / UX Designer

* Logo design and branding
* Color scheme suggestions
* UI layout

---

### 🛠️ **Sohail Khan & Ragini Kanojia** — Backend & Validation Logic

* URL validation logic
* Error handling & sanitization

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

## 🚀 Running the Project

### 1️⃣ Start Backend

```bash
cd server
node server.js
```

Expected output:

```
✅ Backend running on http://localhost:5000
```

---

### 2️⃣ Start Frontend

```bash
cd client
npm start
```

Runs at:

```
http://localhost:3000
```

CRA automatically proxies API requests to the backend.



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