# NavStack - Browser History Simulator

![NavStack Logo](https://drive.google.com/uc?export=view&id=1A0_Gz5JQbTSwZ8_kw-RiZTHIoeHodNaZ)

An interactive web application that simulates browser navigation history using stack data structures with beautiful visualizations and smooth animations.

## 🎯 Project Overview

NavStack demonstrates how web browsers use stack data structures to manage navigation history. The application provides a visual representation of the LIFO (Last-In-First-Out) principle with interactive components that show how pages are pushed onto and popped from the back and forward stacks.

## 🏗️ Architecture Overview

```
NavStack/
│
├── api/
│   └── validate-url.js          # Serverless backend (Vercel function)
├── src/
│   ├── components/
│   │   ├── WelcomePage.js          # Welcome screen with team introduction
│   │   ├── Browser.js              # Main browser simulation component
│   │   ├── StackVisualization.js   # Visual stack representation
│   │   ├── Navigation.js           # Back/Forward navigation controls
│   │   ├── PageContent.js          # Dynamic page content display
│   │   └── WelcomePage.css         # Welcome page styles
│   ├── utils/
│   │   └── Stack.js                # Custom stack implementation
│   ├── hooks/
│   │   └── useAnimation.js         # Custom animation hooks
│   ├── styles/
│   │   ├── animations.css          # Animation keyframes and classes
│   │   └── themes.css              # Light/dark theme variables
│   ├── App.js                      # Main app component
│   └── index.js                    # Entry point
```

## 👥 Team Roles & Contributions

### **Rudra Kanwar** - Project Lead 

**Responsibilities & Contributions:**

* ✅ Led overall project architecture, repo structure, and feature planning.
* ✅ Designed and implemented the **core stack data structure** (`src/utils/Stack.js`) used for back/forward history.
* ✅ Implemented the **Browser** component (`src/components/Browser.js`) including navigation logic (navigate, goBack, goForward), input handling, history persistence, and UI state management.
* ✅ Coordinated component integration (Navigation, PageContent, StackVisualization) and managed inter-component state flows and props.
* ✅ Implemented frontend-side **URL normalization** and UI UX for validation states (loading/`Checking…`, error banners and dismissible alerts).
* ✅ Wrote production-ready deployment steps and prepared the project for Vercel serverless deployment (migrated backend validation to `/api/validate-url`).


### **Ambarish Maji** - UI/UX Designer

**Responsibilities:**

* ✅ Logo design and website identity
* ✅ Color scheme and visual design suggestions

### **Sohail Khan & Ragini Kanojia** - Backend & Validation Team

**Responsibilities:**

* ✅ Designed and implemented the **URL validation** backend logic.
* ✅ Implemented input sanitization and error handling for validation endpoints.
---

## 🧩 Component Details

### 1. **Stack.js** - Core Data Structure

**Purpose:** Implements the stack data structure used for history management
**Why it's needed:** Provides the fundamental LIFO operations for browser history
**How it helps:**

* Encapsulates stack operations (push, pop, peek)
* Maintains state of navigation history
* Enables clean separation of data logic from UI

```javascript
// Key Operations:
push(page)    // Add page to stack
pop()         // Remove and return top page
peek()        // View top page without removal
isEmpty()     // Check if stack is empty
toArray()     // Convert stack to array for visualization
```

### 2. **Browser.js** - Main Application Component

**Purpose:** Orchestrates the entire browser simulation
**Why it's needed:** Central controller managing all navigation logic and state
**How it helps:**

* Manages backStack and forwardStack states
* Handles user navigation requests
* Coordinates between all other components
* Implements theme switching

**Key Features:**

* Navigation with URL validation
* Stack operations visualization
* Theme persistence
* Error state management

### 3. **StackVisualization.js** - Visual Stack Display

**Purpose:** Provides visual representation of stack operations
**Why it's needed:** Helps users understand how stack operations work visually
**How it helps:**

* Animates push/pop operations
* Highlights current and top items
* Shows stack depth and contents
* Differentiates between back and forward stacks

**Visual Elements:**

* Stack items with depth indicators
* Top element highlighting
* Animation for stack changes
* Size and operation indicators

### 4. **Navigation.js** - Control Panel

**Purpose:** Provides back/forward navigation controls
**Why it's needed:** Mimics real browser navigation interface
**How it helps:**

* Disabled states based on stack emptiness
* Visual feedback on interactions
* Current page display
* Accessible navigation controls

### 5. **PageContent.js** - Dynamic Content Display

**Purpose:** Shows content for current page with animations
**Why it's needed:** Provides context for navigation changes
**How it helps:**

* Smooth page transition animations
* Breadcrumb navigation history
* Page-specific content and features
* Loading states and metadata

### 6. **WelcomePage.js** - Introduction Screen

**Purpose:** Team introduction and application launch point
**Why it's needed:** Sets context and provides team attribution
**How it helps:**

* Professional first impression
* Team member showcase
* Theme toggle access
* Smooth entry to main application

### 7. **useAnimation.js** - Custom React Hooks

**Purpose:** Provides reusable animation logic
**Why it's needed:** Centralized animation management
**How it helps:**

* Slide animations for page transitions
* Bounce effects for user feedback
* Pulse animations for attention
* Consistent timing across components

### 8. **themes.css & animations.css** - Styling System

**Purpose:** Centralized styling and animation definitions
**Why it's needed:** Consistent design system across application
**How it helps:**

* Light/dark theme variables
* Reusable animation keyframes
* Consistent spacing and colors
* Responsive design foundations

## 🔄 Workflow Process

### Navigation Flow:

```
1. User enters URL → URL validation kicks in
2. Valid URL → Current page pushed to backStack
3. ForwardStack cleared (new navigation)
4. New page set as current → Stack visualization updates
5. Animation triggers for smooth transition
```

### Back/Forward Flow:

```
Back Action:
1. Current page pushed to forwardStack
2. Top item popped from backStack
3. Popped item becomes current page
4. Both stacks update visualization

Forward Action:
1. Current page pushed to backStack
2. Top item popped from forwardStack
3. Popped item becomes current page
4. Both stacks update visualization
```

## 🎨 Design System

### Color Themes:

* **Light Theme:** Professional blue gradient with clean whites
* **Dark Theme:** Deep navy with vibrant accent colors

### Animations:

* **Page Transitions:** Slide effects for navigation
* **Stack Operations:** Smooth push/pop animations
* **Interactive Elements:** Hover and focus states
* **Loading States:** Shimmer and pulse effects

### Typography:

* **Primary Font:** Inter for modern readability
* **Hierarchy:** Clear heading sizes for information architecture
* **Accessibility:** High contrast ratios for readability

## 🔧 Technical Implementation

### Stack Management:

```javascript
// Two-stack approach for browser history
backStack: Stack    // History of visited pages
forwardStack: Stack // Pages available for forward navigation
```

### URL Validation:

1. **Internal Pages:** Quick name matching
2. **External URLs:** Network validation with serverless function
3. **Error Handling:** User-friendly error messages
4. **Security:** Input sanitization and safe navigation

### State Persistence:

* Theme preference saved to localStorage
* Browser history persistence
* Session restoration on reload

## 🚀 Getting Started

### Installation:

```bash
# Clone the repository
git clone https://github.com/yourusername/navstack.git

# Install dependencies
cd navstack
npm install

# Start development server
npm start
```

## 📱 Features

### Core Features:

* ✅ Visual stack data structure demonstration
* ✅ Real-time navigation simulation
* ✅ Light/dark theme switching
* ✅ Smooth animations and transitions
* ✅ URL validation and error handling
* ✅ History persistence across sessions

### Educational Value:

* Demonstrates LIFO (Last-In-First-Out) principle
* Interactive learning experience

## 🛠️ Technologies Used

* **React 18** - Frontend framework
* **CSS3** - Styling with custom properties
* **JavaScript ES6+** - Modern JavaScript features
* **CSS Animations** - Smooth transitions and effects
* **Git** - Version control

## 🔒 Security Features

* Input sanitization for URLs
* Secure localStorage usage

## 📈 Future Enhancements

* [ ] Advanced stack operations (merge, search)
* [ ] User accounts for history sync
* [ ] Export/import history functionality
* [ ] Safe network request handling
* [ ] Browser extension version
* [ ] Multi-language support
* [ ] XSS prevention measures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

* Inspired by browser navigation mechanics
* Built for educational purposes
* Special thanks to the entire development team
* Community feedback and contributions

---