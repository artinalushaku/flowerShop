# Blooming Delights - Flower Shop

A modern e-commerce web application for a flower shop featuring product management, user authentication, and an admin dashboard.

## Features

- **User Authentication**: Secure login and registration system
- **Role-Based Access Control**: Separate user and admin privileges
- **Product Management**: Create, read, update, and delete products
- **User Management**: Admin can manage user accounts and roles
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling

### Backend
- Express.js
- MySQL database
- Sequelize ORM
- JWT for authentication

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MySQL (v5.7 or higher)

## Installation

### Clone the repository
```bash
git clone <repository-url>
cd flowershop
```

### Database Setup
1. Create a MySQL database named `flowershop`
2. Configure the database connection in `backend/.env`

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Update the `.env` file with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=flowershop
PORT=5000
JWT_SECRET=your_secret_key
```

4. Start the backend server:
```bash
npm run dev
```

The backend server should now be running on http://localhost:5000

### Frontend Setup
1. Open a new terminal and navigate to the project root directory
2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend application should now be running on http://localhost:3000

## Usage

### User Registration
1. Navigate to the signup page
2. Fill in your details
3. For testing admin access, check the "Register as admin" checkbox

### Login
1. Navigate to the login page
2. Enter your email and password
3. You will be redirected based on your role:
   - Regular users will go to the home page
   - Admins will also see an "Admin" link in the navigation bar

### Admin Dashboard
1. Log in as an admin
2. Click on the "Admin" link in the navigation bar
3. From here you can:
   - Manage products (add, edit, delete)
   - Manage users (edit, change roles, delete)

## Project Structure

```
flowershop/
├── backend/                  # Backend code
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Express middleware
│   ├── models/               # Sequelize models
│   ├── routes/               # Express routes
│   ├── .env                  # Environment variables
│   ├── db.js                 # Database configuration
│   ├── server.js             # Server entry point
│   └── package.json          # Backend dependencies
│
├── public/                   # Static assets
├── src/                      # Frontend code
│   ├── components/           # React components
│   ├── App.jsx               # Main component
│   └── main.jsx              # Entry point
│
├── package.json              # Frontend dependencies
└── README.md                 # Project documentation
```

## Test Accounts

For testing purposes, you can create accounts using the registration form:

1. Regular User:
   - Email: user@example.com
   - Password: password123

2. Admin User:
   - Email: admin@example.com
   - Password: admin123
   - Make sure to check "Register as admin" during signup

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Users (Admin Only)
- `GET /api/auth/users` - Get all users
- `GET /api/auth/users/:id` - Get user by ID
- `PUT /api/auth/users/:id` - Update user
- `DELETE /api/auth/users/:id` - Delete user
