import { useState, useEffect } from 'react';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([
        'Wedding Flowers',
        'Birthday Bouquets',
        'Seasonal Specials',
        'Custom Arrangements'
    ]);
    const [newCategory, setNewCategory] = useState('');
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        stock: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);
    const [categoryProductCounts, setCategoryProductCounts] = useState({});

    // Fetch all products
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setProducts(data);
            
            // Extract unique categories from products
            const uniqueCategories = [...new Set(data.map(product => product.category))];
            setCategories(prevCategories => {
                const mergedCategories = [...new Set([...prevCategories, ...uniqueCategories])];
                return mergedCategories;
            });
            
            // Count products per category
            const counts = {};
            data.forEach(product => {
                counts[product.category] = (counts[product.category] || 0) + 1;
            });
            setCategoryProductCounts(counts);
            
            setError(null);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products');
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    // Handle adding a new category
    const handleAddCategory = () => {
        const trimmedCategory = newCategory.trim();
        
        if (trimmedCategory === '') {
            return;
        }
        
        // Validate category name length
        if (trimmedCategory.length < 3) {
            setError('Category name must be at least 3 characters long');
            return;
        }
        
        if (trimmedCategory.length > 30) {
            setError('Category name cannot exceed 30 characters');
            return;
        }
        
        if (categories.includes(trimmedCategory)) {
            setError('This category already exists');
            return;
        }
        
        setCategories([...categories, trimmedCategory]);
        setFormData({
            ...formData,
            category: trimmedCategory
        });
        setNewCategory('');
        setShowAddCategory(false);
        setError(null); // Clear error message on success
    };
    
    // Handle deleting a category
    const handleDeleteCategory = (categoryToDelete) => {
        // Check if any products are using this category
        const productsWithCategory = products.filter(product => product.category === categoryToDelete);
        
        if (productsWithCategory.length > 0) {
            setError(`Cannot delete category "${categoryToDelete}" because it is being used by ${productsWithCategory.length} product(s).`);
            return;
        }
        
        if (window.confirm(`Are you sure you want to delete the category "${categoryToDelete}"?`)) {
            setCategories(categories.filter(category => category !== categoryToDelete));
            setError(null);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        console.log("Form data before validation:", formData);
        
        // Make sure price is properly formatted as a number
        let price;
        try {
            // Handle both comma and period as decimal separators
            const normalizedPrice = formData.price.toString().replace(',', '.');
            price = parseFloat(normalizedPrice);
            
            if (isNaN(price)) {
                setError('Price must be a valid number');
                console.log("Validation error: Price is not a valid number");
                return;
            }
        } catch (error) {
            setError('Price format is invalid');
            console.log("Validation error: Price format error", error);
            return;
        }
        
        const stock = parseInt(formData.stock);
        
        // Create a processed form data object with correctly formatted values
        const processedFormData = {
            ...formData,
            price: price.toFixed(2), // Ensure price has 2 decimal places
            stock: stock
        };
        
        console.log("Processed form data:", processedFormData);
        
        // Validate price and stock
        if (price < 0) {
            setError('Price cannot be negative');
            console.log("Validation error: Price is negative");
            return;
        }
        
        // Validate price is at least 1.00€
        if (price < 1.00) {
            setError('Price must be at least 1.00€');
            console.log("Validation error: Price below minimum", price);
            return;
        }
        
        // Validate price is at most 999.99€
        if (price > 999.99) {
            setError('Price cannot exceed 999.99€');
            console.log("Validation error: Price above maximum", price);
            return;
        }
        
        // Validate stock is not negative
        if (stock < 0) {
            setError('Stock cannot be negative');
            console.log("Validation error: Stock is negative");
            return;
        }
        
        // Validate stock does not exceed maximum capacity
        if (stock > 100) {
            setError('Stock cannot exceed 100 items (maximum warehouse capacity)');
            console.log("Validation error: Stock above maximum", stock);
            return;
        }
        
        // Validate description length
        if (formData.description.length < 20) {
            setError('Description must be at least 20 characters');
            console.log("Validation error: Description too short", formData.description.length);
            return;
        }
        
        if (formData.description.length > 500) {
            setError('Description cannot exceed 500 characters');
            console.log("Validation error: Description too long", formData.description.length);
            return;
        }
        
        console.log("All validation passed");
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in as an admin to perform this action');
                console.log("Validation error: No token found");
                return;
            }

            const url = editingId 
                ? `http://localhost:5000/api/products/${editingId}`
                : 'http://localhost:5000/api/products';
            
            const method = editingId ? 'PUT' : 'POST';
            
            console.log("Sending request to:", url, "with method:", method);
            console.log("Request body:", JSON.stringify(processedFormData));

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(processedFormData),
            });

            if (response.ok) {
                console.log("Request successful");
                fetchProducts();
                resetForm();
                setEditingId(null);
            } else {
                const data = await response.json();
                console.error("Server error response:", data);
                
                // Display more detailed error message
                if (data.validationErrors && data.validationErrors.length > 0) {
                    // If we have specific validation errors from Sequelize
                    const validationMessages = data.validationErrors.map(err => err.message).join(', ');
                    setError(`Validation error: ${validationMessages}`);
                } else if (data.error) {
                    // If we have a specific error message
                    setError(`${data.message}: ${data.error}`);
                } else {
                    // Default error message
                    setError(data.message || 'Failed to save product');
                }
            }
        } catch (error) {
            console.error('Error saving product:', error);
            setError('An error occurred while saving the product');
        }
    };

    // Handle edit button click
    const handleEdit = (product) => {
        setFormData(product);
        setEditingId(product.id);
        setError(null);
    };

    // Handle delete button click
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You must be logged in as an admin to perform this action');
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    fetchProducts();
                } else {
                    const data = await response.json();
                    setError(data.message || 'Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                setError('An error occurred while deleting the product');
            }
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            imageUrl: '',
            stock: ''
        });
        setError(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold mb-6">Product Management</h2>
            
            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            
            {/* Category Management Section */}
            <div className="mb-8">
                <button
                    onClick={() => setShowCategoryManager(!showCategoryManager)}
                    className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded mb-4"
                >
                    {showCategoryManager ? 'Hide Category Manager' : 'Manage Categories'}
                </button>
                
                {showCategoryManager && (
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h3 className="text-xl font-bold mb-4">Category Management</h3>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Add New Category
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="New category name"
                                    minLength={3}
                                    maxLength={30}
                                />
                                <button 
                                    type="button"
                                    onClick={handleAddCategory}
                                    className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    disabled={!newCategory.trim()}
                                >
                                    Add Category
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Category name must be between 3 and 30 characters.</p>
                            <p className="text-sm text-amber-600 mt-1">Note: Each category can contain a maximum of 50 products.</p>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Current Categories</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {categories.map(category => {
                                    const count = categoryProductCounts[category] || 0;
                                    const isFull = count >= 50;
                                    const isNearCapacity = count >= 40;
                                    const bgColor = isFull ? 'bg-red-100' : isNearCapacity ? 'bg-amber-100' : 'bg-gray-100';
                                    
                                    return (
                                        <div key={category} className={`flex items-center justify-between ${bgColor} p-2 rounded`}>
                                            <span>
                                                {category} 
                                                <span className="ml-1 text-xs text-gray-600">
                                                    ({count}/50)
                                                </span>
                                                {isFull && <span className="ml-1 text-xs text-red-600">(Full)</span>}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteCategory(category)}
                                                className="ml-2 bg-red-500 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Product Form */}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            min="1"
                            max="999.99"
                            step="0.01"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">Price must be between 1.00€ and 999.99€.</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Category
                        </label>
                        {showAddCategory ? (
                            <div className="flex flex-col">
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="New category name"
                                        minLength={3}
                                        maxLength={30}
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleAddCategory}
                                        className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded"
                                    >
                                        Add
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setShowAddCategory(false)}
                                        className="ml-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Category name must be between 3 and 30 characters.</p>
                            </div>
                        ) : (
                            <div className="flex">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option 
                                            key={category} 
                                            value={category}
                                            disabled={categoryProductCounts[category] >= 50}
                                        >
                                            {category} ({categoryProductCounts[category] || 0}/50)
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    type="button"
                                    onClick={() => setShowAddCategory(true)}
                                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded"
                                >
                                    New
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Stock
                        </label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            min="0"
                            max="100"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">Stock must be between 0 and 100 items.</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Image URL
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            minLength={10}
                            maxLength={250}
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">Image URL must be between 10 and 250 characters.</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows="3"
                            minLength={20}
                            maxLength={500}
                            required
                        ></textarea>
                        <div className="flex justify-end mt-1">
                            <p className="text-sm text-gray-500">
                                {formData.description.length}/500
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <button
                        type="submit"
                        className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {editingId ? 'Update Product' : 'Add Product'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                setEditingId(null);
                            }}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            {/* Products List */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                <h3 className="text-xl font-bold mb-4">Products List</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Stock</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="border-b">
                                    <td className="px-4 py-2">{product.name}</td>
                                    <td className="px-4 py-2">${product.price}</td>
                                    <td className="px-4 py-2">{product.category}</td>
                                    <td className="px-4 py-2">{product.stock}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ProductManagement; 