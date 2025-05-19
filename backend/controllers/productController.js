import Product from '../models/productModel.js';

class ProductController {
    constructor() {
        // Bind methods to ensure 'this' context is preserved
        this.getAllProducts = this.getAllProducts.bind(this);
        this.getProductById = this.getProductById.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.countProductsInCategory = this.countProductsInCategory.bind(this);
    }

    // Helper method to count products in a category
    async countProductsInCategory(category) {
        const count = await Product.count({ where: { category } });
        return count;
    }

    // Get all products
    async getAllProducts(req, res) {
        try {
            const products = await Product.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching products', error: error.message });
        }
    }

    // Get single product by ID
    async getProductById(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching product', error: error.message });
        }
    }

    // Create new product
    async createProduct(req, res) {
        try {
            console.log("Received product data:", req.body);
            
            // Validate price and stock
            if (req.body.price < 0) {
                return res.status(400).json({ message: 'Price cannot be negative' });
            }
            
            // Validate price range
            if (req.body.price < 1.00) {
                return res.status(400).json({ message: 'Price must be at least 1.00€' });
            }
            
            if (req.body.price > 999.99) {
                return res.status(400).json({ message: 'Price cannot exceed 999.99€' });
            }
            
            if (req.body.stock < 0) {
                return res.status(400).json({ message: 'Stock cannot be negative' });
            }
            
            if (req.body.stock > 100) {
                return res.status(400).json({ message: 'Stock cannot exceed 100 items (maximum warehouse capacity)' });
            }
            
            // Validate description length
            if (req.body.description.length < 20) {
                return res.status(400).json({ message: 'Description must be at least 20 characters' });
            }
            
            if (req.body.description.length > 500) {
                return res.status(400).json({ message: 'Description cannot exceed 500 characters' });
            }
            
            // Validate imageUrl length
            if (req.body.imageUrl.length < 10) {
                return res.status(400).json({ message: 'Image URL must be at least 10 characters' });
            }
            
            if (req.body.imageUrl.length > 250) {
                return res.status(400).json({ message: 'Image URL cannot exceed 250 characters' });
            }
            
            // Check if category has reached the product limit
            const productsInCategory = await this.countProductsInCategory(req.body.category);
            console.log(`Category ${req.body.category} has ${productsInCategory} products`);
            
            if (productsInCategory >= 50) {
                return res.status(400).json({ 
                    message: 'This category already has 50 products, which is the maximum allowed. Please use a different category.'
                });
            }
            
            console.log("All validations passed, attempting to create product");
            try {
                const product = await Product.create(req.body);
                console.log("Product created successfully with ID:", product.id);
                res.status(201).json({ 
                    message: 'Product created successfully', 
                    id: product.id 
                });
            } catch (dbError) {
                console.error("Database error creating product:", dbError);
                console.error("Validation errors:", dbError.errors);
                return res.status(500).json({ 
                    message: 'Error creating product in database', 
                    error: dbError.message,
                    validationErrors: dbError.errors 
                });
            }
        } catch (error) {
            console.error("Unexpected error in createProduct:", error);
            res.status(500).json({ message: 'Error creating product', error: error.message });
        }
    }

    // Update product
    async updateProduct(req, res) {
        try {
            // Validate price and stock
            if (req.body.price < 0) {
                return res.status(400).json({ message: 'Price cannot be negative' });
            }
            
            // Validate price range
            if (req.body.price < 1.00) {
                return res.status(400).json({ message: 'Price must be at least 1.00€' });
            }
            
            if (req.body.price > 999.99) {
                return res.status(400).json({ message: 'Price cannot exceed 999.99€' });
            }
            
            if (req.body.stock < 0) {
                return res.status(400).json({ message: 'Stock cannot be negative' });
            }
            
            if (req.body.stock > 100) {
                return res.status(400).json({ message: 'Stock cannot exceed 100 items (maximum warehouse capacity)' });
            }
            
            // Validate description length
            if (req.body.description.length < 20) {
                return res.status(400).json({ message: 'Description must be at least 20 characters' });
            }
            
            if (req.body.description.length > 500) {
                return res.status(400).json({ message: 'Description cannot exceed 500 characters' });
            }
            
            // Validate imageUrl length
            if (req.body.imageUrl.length < 10) {
                return res.status(400).json({ message: 'Image URL must be at least 10 characters' });
            }
            
            if (req.body.imageUrl.length > 250) {
                return res.status(400).json({ message: 'Image URL cannot exceed 250 characters' });
            }
            
            // If category is being changed, check the new category's product count
            const currentProduct = await Product.findByPk(req.params.id);
            if (currentProduct && currentProduct.category !== req.body.category) {
                const productsInCategory = await this.countProductsInCategory(req.body.category);
                if (productsInCategory >= 50) {
                    return res.status(400).json({ 
                        message: 'The selected category already has 50 products, which is the maximum allowed. Please choose a different category.'
                    });
                }
            }
            
            const [updated] = await Product.update(req.body, {
                where: { id: req.params.id }
            });
            
            if (updated) {
                const updatedProduct = await Product.findByPk(req.params.id);
                return res.json({ message: 'Product updated successfully', product: updatedProduct });
            }
            return res.status(404).json({ message: 'Product not found' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating product', error: error.message });
        }
    }

    // Delete product
    async deleteProduct(req, res) {
        try {
            const deleted = await Product.destroy({
                where: { id: req.params.id }
            });
            
            if (deleted) {
                return res.json({ message: 'Product deleted successfully' });
            }
            return res.status(404).json({ message: 'Product not found' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting product', error: error.message });
        }
    }
}

export default new ProductController(); 