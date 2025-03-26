import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch(activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'users':
        return <UserManagement />;
      case 'dashboard':
        return <DashboardOverview />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-rose-700 text-white min-h-screen p-4">
          <div className="text-2xl font-bold mb-8 text-center">Admin Panel</div>
          <nav>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-rose-800' : 'hover:bg-rose-600'}`}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('products')}
                  className={`w-full text-left px-4 py-2 rounded ${activeTab === 'products' ? 'bg-rose-800' : 'hover:bg-rose-600'}`}
                >
                  Manage Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-4 py-2 rounded ${activeTab === 'users' ? 'bg-rose-800' : 'hover:bg-rose-600'}`}
                >
                  Manage Users
                </button>
              </li>
              <li>
                <Link to="/" className="block px-4 py-2 rounded hover:bg-rose-600">
                  Back to Website
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function DashboardOverview() {
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products count
        const productsResponse = await fetch('http://localhost:5000/api/products');
        const productsData = await productsResponse.json();
        setProductCount(productsData.length);
        
        // Fetch users count
        const token = localStorage.getItem('token');
        const usersResponse = await fetch('http://localhost:5000/api/auth/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUserCount(usersData.length);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Products</h3>
          <div className="text-3xl font-bold text-rose-600 mt-2">
            {isLoading ? '...' : productCount}
          </div>
          <p className="text-gray-500 mt-2">Total products in store</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Users</h3>
          <div className="text-3xl font-bold text-rose-600 mt-2">
            {isLoading ? '...' : userCount}
          </div>
          <p className="text-gray-500 mt-2">Registered users</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
          <div className="text-3xl font-bold text-rose-600 mt-2">$1,245</div>
          <p className="text-gray-500 mt-2">Last 7 days</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Stats</h3>
        <p className="text-gray-600">Welcome to your admin dashboard. Here you can manage your products, users, and check your store's performance.</p>
        <p className="text-gray-600 mt-2">Click on "Manage Products" in the sidebar to add, edit, or delete products.</p>
        <p className="text-gray-600 mt-2">Click on "Manage Users" to view and update user information and roles.</p>
      </div>
    </div>
  );
}

export default AdminDashboard; 