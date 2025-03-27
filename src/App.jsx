import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import ProductManagement from './components/ProductManagement';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Signup from './components/Signup';

import ProtectedRoute from './components/ProtectedRoute';
import AboutUs from './components/AboutUs';
import Shop from './components/Shop';
import Contact from './components/Contact';


// AppContent component that can access useLocation
const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check auth status whenever location changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    setIsLoggedIn(!!token);
    setIsAdmin(user.role === 'admin');
  }, [location.pathname]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-rose-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-semibold text-rose-600">Blooming Delights</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              <Link to="/" className="text-gray-600 hover:text-rose-500 px-3 py-2 rounded-md">Home</Link>
              <Link to="/shop" className="text-gray-600 hover:text-rose-500 px-3 py-2 rounded-md">Shop</Link>
              <Link to="/about" className="text-gray-600 hover:text-rose-500 px-3 py-2 rounded-md">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-rose-500 px-3 py-2 rounded-md">Contact</Link>
              {isAdmin && (
                <Link to="/admin" className="text-gray-600 hover:text-rose-500 px-3 py-2 rounded-md">Admin</Link>
              )}
              {!isLoggedIn ? (
                <Link to="/login" className="text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-md">Login</Link>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-rose-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block text-gray-600 hover:text-rose-500 px-3 py-2 rounded-md">Home</Link>
              <Link to="/shop" className="block text-gray-600 hover:text-rose-500 px-3 py-2 rounded-md">Shop</Link>
              <Link to="/about" className="block text-gray-600 hover:text-rose-500 px-3 py-2 rounded-md">About</Link>
              <Link to="/contact" className="block text-gray-600 hover:text-rose-500 px-3 py-2 rounded-md">Contact</Link>
              {isAdmin && (
                <Link to="/admin" className="block text-gray-600 hover:text-rose-500 px-3 py-2 rounded-md">Admin</Link>
              )}
              {!isLoggedIn ? (
                <Link to="/login" className="block text-gray-600 hover:text-rose-500 px-3 py-2 rounded-md">Login</Link>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-600 hover:text-rose-500 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute requiredRole="admin">
            <ProductManagement />
          </ProtectedRoute>
        } />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
       
        <Route path="/" element={<HomePage />} />
        {/* Add other routes here */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Homepage Component
function HomePage() {
  return (
    <>
      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-rose-600">Blooming Delights</span>
    </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover the perfect flowers for every occasion. From romantic roses to cheerful sunflowers, we have everything to make your moments special.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/shop"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 md:py-4 md:text-lg md:px-10"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Categories */}
          <div className="mt-16">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">Our Collections</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Wedding Flowers */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-[url('/wedding-flowers.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-300"></div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">Wedding Flowers</h3>
                  <p className="mt-2 text-gray-600">Perfect arrangements for your special day</p>
                </div>
              </div>

              {/* Birthday Bouquets */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-[url('/birthday-flowers.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-300"></div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">Birthday Bouquets</h3>
                  <p className="mt-2 text-gray-600">Celebrate with our colorful flowers</p>
                </div>
              </div>

              {/* Seasonal Specials */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-[url('/seasonal-flowers.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-300"></div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">Seasonal Specials</h3>
                  <p className="mt-2 text-gray-600">Fresh picks for every season</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>© 2024 Blooming Delights. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;