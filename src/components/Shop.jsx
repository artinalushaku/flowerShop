import { useState, useEffect } from 'react';

function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products;
    
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
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full ${selectedCategory === category ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
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
    </div>
  );
}

export default Shop;