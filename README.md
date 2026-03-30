#🔮 Mooncalf Market

A fantasy-themed e-commerce web application inspired by the wizarding world. Think Diagon Alley meets Amazon! Browse magical creatures, enchanted treats, and ancient tomes then checkout (securely 😉) using your galleons!

**Live Demo**: https://mooncalf-market.onrender.com/

---

##Screenshots: _Coming Soon_

---

## ✨ Features ✨

- **Secure Authentication** — JWT tokens stored in HTTP-only cookies for safe, stateless authentication.
- **Browse by Category** — Items organized into categories and subcategories with a clean sidebar navigation.
- **Item Detail Pages** — Image galleries, ratings, descriptions, and add-to-cart functionality.
- **Reviews** — Full CRUD for item reviews including star ratings.
- **Shopping Cart** — Add, update quantity, and remove items in real time.
- **Secure Checkout** — Real-time payment processing via the Stripe API.
- **Order Confirmation** — Post-purchase order summary with shipping details.
- **User Profiles** — Edit profile fields and manage your account.

---

## Tech Stack

### Frontend
- TypeScript
- React
- Redux (state management)
- React Router (client-side routing)
- Material UI for icons and buttons

### Backend
- Node.js
- Express
- Sequelize ORM
- SQLite (development)
- PostgreSQL (production)

### APIs & Services
- **Stripe API** - Secure payment processing
- **JWT** - Authentication via signed tokens

---

## Getting Started

## Prerequisites
- Node.js
- npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/mooncalf-market.git
cd mooncalf-market
```

2. Install dependencies for both frontend and backend:
```bash
# Backend
cd backend
npm install
 
# Frontend
cd ../frontend
npm install
```

3. Set up your environment variables. Create a `.env` file in the backend directory:
```env
PORT=8000
JWT_SECRET=<<your_secret_token>>
JWT_EXPIRES_IN=604800

# SQLite (development)
DB_FILE=dist/db/dev.db

 
> ⚠️ **Note:** Stripe checkout requires a secure HTTPS connection and will not function in local development. To test checkout, use the live demo link above.


> 4. Run the application:
```bash
# Backend
cd backend
npm start
 
# Frontend (in a separate terminal)
cd frontend
npm run dev
```


## Demo Credentials

### Demo Card Numbers (Stripe Test Mode)
 
| Scenario | Card Number | Exp | CVC | Zip |
|----------|-------------|-----|-----|-----|
| ✅ Success | 4242 4242 4242 4242 | 12/34 | 123 | 12345 |
| ❌ Declined | 4000 0000 0000 0002 | 12/34 | 123 | 12345 |
| 💸 Insufficient Funds | 4000 0000 0000 9995 | 12/34 | 123 | 12345 |
 
---

## 🔮 Future Features
 
- **Shops** — Full CRUD for individual shops and the items within them, allowing sellers to manage their own storefronts.
- **Item CRUD** — Full create, update, and delete functionality for items
- **Automated Testing** — End-to-end test coverage using Playwright to demonstrate QA practices
 
---

## Author
 
Built by [Stephanie Gage](https://sgage2013@guthub.io)