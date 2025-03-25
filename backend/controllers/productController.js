import Product from '../models/productModel.js';

class ProductController {
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
            const product = await Product.create(req.body);
            res.status(201).json({ 
                message: 'Product created successfully', 
                id: product.id 
            });
        } catch (error) {
            res.status(500).json({ message: 'Error creating product', error: error.message });
        }
    }

    // Update product
    async updateProduct(req, res) {
        try {
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