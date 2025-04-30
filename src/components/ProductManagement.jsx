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
        if (newCategory.trim() === '') {
            return;
        }
        
        if (categories.includes(newCategory.trim())) {
            setError('This category already exists');
            return;
        }
        
        setCategories([...categories, newCategory.trim()]);
        setFormData({
            ...formData,
            category: newCategory.trim()
        });
        setNewCategory('');
        setShowAddCategory(false);
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
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in as an admin to perform this action');
                return;
            }

            const url = editingId 
                ? `http://localhost:5000/api/products/${editingId}`
                : 'http://localhost:5000/api/products';
            
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchProducts();
                resetForm();
                setEditingId(null);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to save product');
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
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Current Categories</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {categories.map(category => (
                                    <div key={category} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                        <span>{category}</span>
                                        <button
                                            onClick={() => handleDeleteCategory(category)}
                                            className="ml-2 bg-red-500 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
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
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Category
                        </label>
                        {showAddCategory ? (
                            <div className="flex">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="New category name"
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
                                        <option key={category} value={category}>
                                            {category}
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
                            required
                        />
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
                            required
                        />
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
                            required
                        ></textarea>
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