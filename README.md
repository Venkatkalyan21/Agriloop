# 🌱 AgriLoop - Circular Economy Marketplace

A comprehensive digital platform connecting agricultural waste producers with industries that can transform waste into valuable resources, promoting sustainable circular economy practices.

## 📋 Overview

AgriLoop is a full-stack web application that facilitates the buying and selling of agricultural waste materials, enabling businesses to participate in the circular economy. The platform helps reduce waste, create new revenue streams, and promote environmental sustainability.

## ✨ Key Features

- **Material Marketplace**: Browse and list agricultural waste materials for sale
- **User Authentication**: Secure registration and login for companies and transporters
- **Real-time Listings**: Dynamic marketplace with live material availability
- **Company Profiles**: Detailed profiles for sellers and buyers
- **Transaction Management**: Track deals from listing to completion
- **Supply Chain Visualization**: Monitor material flow in circular supply chains
- **Sustainability Metrics**: Track environmental impact and savings

## 🛠️ Tech Stack

### Frontend
- **React** 18.3 with TypeScript
- **Vite** for fast development and building
- **TanStack Query** for data fetching and caching
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **JWT** authentication
- **Bcrypt** for password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Venkatkalyan21/Agriloop.git
cd Agriloop
```

2. **Install dependencies**

Backend:
```bash
cd server
npm install
```

Frontend:
```bash
cd client
npm install
```

3. **Database Setup**

Create a PostgreSQL database:
```sql
CREATE DATABASE circular_economy_marketplace;
```

Run the schema:
```bash
# In pgAdmin or psql, execute:
server/src/database/schema.sql
```

4. **Environment Configuration**

Create `server/.env`:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=circular_economy_marketplace
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
PORT=4000
NODE_ENV=development
```

5. **Seed Sample Data (Optional)**
```bash
cd server
node add_10_listings.js
```

6. **Run the Application**

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📦 Project Structure

```
Agriloop/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── config/       # Configuration files
│   │   ├── database/     # Database schema and migrations
│   │   └── utils/        # Helper functions
│   └── package.json
│
├── DEPLOYMENT.md         # Deployment guide
└── README.md            # This file
```

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to:
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: Railway PostgreSQL

## 📸 Screenshots

### Marketplace
Browse available agricultural waste materials with detailed information and pricing.

### User Dashboard
Manage your listings, track transactions, and view sustainability metrics.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Venkat Kalyan** - [GitHub](https://github.com/Venkatkalyan21)

## 🙏 Acknowledgments

- Built as part of sustainable agriculture initiative
- Inspired by circular economy principles
- Designed to reduce agricultural waste and promote resource efficiency

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**Made with 💚 for a sustainable future**
