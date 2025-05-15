const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');
const Product = require('../models/productsModel')

const addToCart = async (req, res) => {
    const { userId, sessionId, productId, quantity } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'ProductId is required',error_type:1 });
    }
    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0', error_type: 1 });
    }
  

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found', error_type: 1 });
      }
  
      let cart;
  
      // Handle user-based cart
      if (userId) {
        cart = await Cart.findOne({ userId }).populate('products.productId');
      } else if (sessionId) {
        // Handle session-based cart
        cart = await Cart.findOne({ sessionId }).populate('products.productId');
      } else {
        return res.status(400).json({ message: 'UserId or sessionId is required', error_type: 1 });
      }
  
      // If a cart exists, check if the product is already in the cart
      if (cart) {
        const productIndex = cart.products.findIndex(p => p?.productId && p?.productId.equals(productId));
  
        // If product is already in cart, return message
        if (productIndex > -1) {
          return res.status(200).json({ message: 'Item already in cart', error_type: 2 });
        } else {
          // If product is not in the cart, add it
          cart.products.push({ productId, quantity });
        }
      } else {
        // If no cart exists, create a new one
        cart = new Cart({
          userId: userId || undefined,
          sessionId: sessionId || undefined,
          products: [{ productId, quantity }]
        });
      }
  
      // Recalculate totals and save cart
      await cart.calculateTotals();
      await cart.save();
      await cart.populate('products.productId');
  
      // Return success response
      res.status(200).json({ message: 'Item added to cart', cart, Added: true });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', error_type: 1 });
    }


  }



const increaceCart= async (req, res) => {
    const { userId, sessionId, productId, quantity } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'ProductId is required' });
    }
    if (userId) {
        // Handle logged-in user
        try {
          let cart = await Cart.findOne({ userId }).populate('products.productId');
          if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
          }
    
          const productIndex = cart.products.findIndex(p => p.productId &&  p.productId.equals(productId));
          if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
            await cart.calculateTotals();
            await cart.save();
            await cart.populate('products.productId');
            return res.json({ message: 'Product quantity increased', cart });
          } else {
            return res.status(404).json({ message: 'Product not in cart' });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
        }
      } else if (sessionId) {
        // Handle session-based user
        try {
          let cart = await Cart.findOne({ sessionId }).populate('products.productId');
          if (!cart) {
            return res.json({ message: 'Cart not found' });
          }
    
          const productIndex = cart.products.findIndex(p =>  p.productId && p.productId.equals(productId));
          if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
            await cart.calculateTotals();
            await cart.save();
            await cart.populate('products.productId');
            return res.json({ message: 'Product quantity increased', cart });
          } else {
            return res.status(404).json({ message: 'Product not in cart' });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
        }
      } else {
        return res.status(400).json({ message: 'UserId or sessionId is required' });
      }
   
   
  }
  

  
const decreaceCart= async (req, res) => {
        const { userId, sessionId, productId, quantity } = req.body;
        if (!productId) {
          return res.status(400).json({ message: 'ProductId is required' });
        }
        
     if (userId) {
    // Handle logged-in user
    try {
      let cart = await Cart.findOne({ userId }).populate('products.productId');
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const productIndex = cart.products.findIndex(p => p.productId &&  p.productId.equals(productId));
      if (productIndex !== -1) {
        const product = cart.products[productIndex];
        if (product.quantity > 1) {
          product.quantity -= 1;
        } else {
          // cart.products.splice(productIndex, 1);
          return res.status(400).json({ message: 'Product quantity cannot be less than 1' })
        }
        await cart.calculateTotals();
        await cart.save();
        await cart.populate('products.productId');
        return res.json({ message: 'Product quantity decreased', cart });
      } else {
        return res.status(404).json({ message: 'Product not in cart' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (sessionId) {
    // Handle session-based user
    try {
      let cart = await Cart.findOne({ sessionId }).populate('products.productId');
      if (!cart) {
        return res.json({ message: 'Cart not found' });
      }

      const productIndex = cart.products.findIndex(p => p.productId &&  p.productId.equals(productId));
      if (productIndex !== -1) {
        const product = cart.products[productIndex];
        if (product.quantity > 1) {
          product.quantity -= 1;
        } else {
          cart.products.splice(productIndex, 1);
        }
        await cart.calculateTotals();
        await cart.save();
        await cart.populate('products.productId');
        return res.json({ message: 'Product quantity decreased', cart });
      } else {
        return res.status(404).json({ message: 'Product not in cart' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(400).json({ message: 'UserId or sessionId is required' });
  }
      };
    
  


// Get cart
  const getCartById = async (req, res) => {
  const { userId, sessionId } = req.query;

    if (!userId && !sessionId) {
        return res.status(400).json({ message: 'UserId or sessionId is required' });
      }
    
      try {
        let cart;
    
        if (userId) {
          // Prioritize userId for logged-in users
          cart = await Cart.findOne({ userId }).populate('products.productId');
        } else {
          // Use sessionId for guest users
          cart = await Cart.findOne({ sessionId }).populate('products.productId');
        }
    
        if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
        }
    
        await cart.calculateTotals();
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
      };
      


  const removeCart= async (req, res) => {
    const { userId, sessionId, productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'ProductId is required' });
    }
    if (userId) {
        // Handle logged-in user
        try {
          let cart = await Cart.findOne({ userId }).populate('products.productId');
          if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
          }
    
          const productIndex = cart.products.findIndex(p =>p.productId &&  p.productId.equals(productId));
          if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
            await cart.calculateTotals();
            await cart.save();
            await cart.populate('products.productId');
            return res.json({ message: 'Product removed from cart', cart });
          } else {
            return res.status(404).json({ message: 'Product not in cart' });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
        }
      } else if (sessionId) {
        // Handle session-based user
        try {
          let cart = await Cart.findOne({ sessionId }).populate('products.productId');
          if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
          }
    
          const productIndex = cart.products.findIndex(p => p.productId.equals(productId));
          if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
            await cart.calculateTotals();
            await cart.save();
            await cart.populate('products.productId');
            return res.json({ message: 'Product removed from cart', cart });
          } else {
            return res.status(404).json({ message: 'Product not in cart' });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
        }
      } else {
        return res.status(400).json({ message: 'UserId or sessionId is required' });
      }

  }

  
  const ClearAllCart= async (req, res) => {
    const { userId, sessionId } = req.body;

    if (userId) {
        // Handle logged-in user
        try {
          let cart = await Cart.findOne({ userId });
          if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
          }
    
          cart.products = [];
          await cart.calculateTotals();
          await cart.save();
          return res.status(200).json({ message: 'Cart cleared', cart });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
        }
      } else if (sessionId) {
        // Handle session-based user
        try {
          let cart = await Cart.findOne({ sessionId });
          if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
          }
    
          cart.products = [];
          await cart.calculateTotals();
          await cart.save();
          return res.status(200).json({ message: 'Cart cleared', cart });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal server error' });
        }
      } else {
        return res.status(400).json({ message: 'UserId or sessionId is required' });
      }
}















  


module.exports = {
    getCartById,
    increaceCart,
    decreaceCart,
    removeCart,
    ClearAllCart,
    addToCart
}
