import { useState, useEffect } from 'react';

function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerCategory, setProductsPerCategory] = useState({});
  
  // Limit for displayed categories and pagination
  const MAX_DISPLAYED_CATEGORIES = 4;
  const PRODUCTS_PER_PAGE = 50;
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  useEffect(() => {
    // Reset to first page when category changes
    setCurrentPage(1);
  }, [selectedCategory]);
  
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(product => product.category))];
      setCategories(uniqueCategories);
      
      // Count products per category
      const categoryCount = {};
      data.forEach(product => {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
      });
      setProductsPerCategory(categoryCount);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  // Filter products by selected category
  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products;
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  
  // Split categories for display
  const displayedCategories = categories.slice(0, MAX_DISPLAYED_CATEGORIES);
  const moreCategories = categories.slice(MAX_DISPLAYED_CATEGORIES);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Collection</h1>
      
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full ${!selectedCategory ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            All
          </button>
          
          {/* First 4 categories displayed directly */}
          {displayedCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full ${selectedCategory === category ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {category} ({productsPerCategory[category] || 0})
            </button>
          ))}
          
          {/* More dropdown for additional categories */}
          {moreCategories.length > 0 && (
            <div className="relative">
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Më shumë ({moreCategories.length})
              </button>
              
              {showMoreMenu && (
                <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="more-categories-button">
                    {moreCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowMoreMenu(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          selectedCategory === category ? 'bg-rose-100 text-rose-900' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        role="menuitem"
                      >
                        {category} ({productsPerCategory[category] || 0})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Empty Category Message */}
      {selectedCategory && filteredProducts.length === 0 && (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-xl font-medium text-gray-800 mb-2">Nuk ka produkte në këtë kategori</h2>
          <p className="text-gray-600">Ju lutemi zgjidhni një kategori tjetër ose shikoni të gjitha produktet.</p>
        </div>
      )}
      
      {/* Products Grid */}
      {displayedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Product Image */}
              <div className="h-64 overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                  <span className="bg-rose-100 text-rose-800 text-sm font-medium px-2.5 py-0.5 rounded">${product.price}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Category: <span className="font-medium">{product.category}</span>
                  </span>
                  <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                
                <button 
                  className="w-full mt-4 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-md transition-colors"
                  disabled={product.stock <= 0}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <nav className="inline-flex rounded-md shadow-sm isolate">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium 
              ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium 
                ${currentPage === index + 1 
                  ? 'bg-rose-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium 
              ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
      
      {/* Products Count Information */}
      <div className="mt-4 text-center text-gray-500 text-sm">
        {selectedCategory ? (
          <>
            Showing {Math.min(filteredProducts.length, PRODUCTS_PER_PAGE)} of {filteredProducts.length} products in "{selectedCategory}"
          </>
        ) : (
          <>
            Showing {Math.min(products.length, PRODUCTS_PER_PAGE)} of {products.length} products
          </>
        )}
      </div>
    </div>
  );
}

export default Shop;