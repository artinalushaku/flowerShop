import Cart from '..models/cart.js';


//merr te gjitha produktet ne cart

export const getAllProducts = async (req,res)=>{
    try {
        const products = await Cart.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
}

//vendos nje produkt ne cart
export const addProductToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        const newProduct = await Cart.create({ productId, quantity });
        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product to cart', error: error.message });
    }
}