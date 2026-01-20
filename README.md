# EventGO - Modern Event Management System

EventGO is a premium, high-performance web application designed to streamline event management for colleges and organizations. Built with the **MERN Stack** (MongoDB, Express, React, Node.js), it features a stunning glassmorphism UI, role-based access control, and seamless event registration workflows.

## 🚀 Features

### for Students (Users)
*   **Dynamic Dashboard**: View personal profile, registered events, and registration status.
*   **Event Discovery**: Browse events with categories (Technical, Cultural, Sports) and search functionality.
*   **Team Registration**: Register for events solo or as a team, capturing member details (Name, USN).
*   **QR Code Tickets**: Automatically generated QR codes for every confirmed registration.
*   **Smooth Animations**: Enhanced user experience with `framer-motion` transitions.
*   **Startup Splash Screen**: A premium animated logo popup on startup with a glowing aura and loading bar.

### for Admins
*   **Admin Dashboard**: Dedicated panel to manage the ecosystem.
*   **Event Management**: Create, update, and delete events with details like venue, price, and category.
*   **Registration Tracking**: View all student registrations, team details, and payment references.
*   **Registration Management**: Ability to cancel/delete registrations if necessary.

## 🛠️ Technology Stack

### Frontend
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS (Custom Design System with Glassmorphism)
*   **Animations**: Framer Motion
*   **Routing**: React Router DOM
*   **Icons**: Lucide React
*   **Notifications**: React Toastify
*   **HTTP Client**: Axios
*   **Utilities**: QRCode.react

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (with Mongoose ODM)
*   **Authentication**: JWT (JSON Web Tokens) & Bcrypt
*   **Security**: CORS & Environment Variables

## 📂 Project Structure & Components

### Pages (`/src/pages`)
| Page | Description |
| :--- | :--- |
| **Home.jsx** | The landing page with hero section and feature highlights. |
| **Login.jsx** | Secure user login page. |
| **Signup.jsx** | New user registration page. |
| **Dashboard.jsx** | Personalized dashboard showing user stats and "My Registrations" (hidden for Admins). |
| **Events.jsx** | Gallery view of all available events with filtering. |
| **EventDetails.jsx** | Detailed view of a specific event including description, venue, and pricing. |
| **RegisterEvent.jsx** | Multi-step form for event registration (Team details, Payment info). |
| **AdminPanel.jsx** | Protected route for admins to add events and view/manage registrations. |

### Reusable Components (`/src/components`)
| Component | Description |
| :--- | :--- |
| **Navbar.jsx** | Responsive navigation bar with role-aware links (Admin vs Student). |
| **EventCard.jsx** | Card component displaying event summary and "Register" actions. |
| **SplashScreen.jsx** | An animated intro screen with a loading progression bar and branded visuals. |

### Backend Models (`/backend/models`)
| Model | Description |
| :--- | :--- |
| **User.js** | Stores user credentials, roles, and profile info. |
| **Event.js** | Stores event details (Title, Date, Venue, Price, Category, etc.). |
| **Registration.js** | Links Users to Events, storing team members and payment ref. |

## ⚡ Getting Started

1.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    # core dependencies: express, mongoose, cors, dotenv, jsonwebtoken, etc.
    npm run dev
    ```
    *Server runs on port 5000 (default).*

2.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    # core dependencies: react, vite, tailwindcss, framer-motion, etc.
    npm run dev
    ```
    *Client runs on port 5173 (default).*

3.  **Environment Variables**:
    Ensure `.env` files are configured in both `backend` (Database URI, JWT Secret) and `frontend` (API Base URL).

## 🎨 Design Philosophy
EventGO moves away from generic designs, utilizing a **Dark Mode** aesthetic with neon accents (Cyan/Purple gradients) and **Glassmorphism** effects for cards and overlays. Interaction is prioritized through hover effects and page transitions.
