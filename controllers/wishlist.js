const wishlistModel = require("../models/wishlistModel");




const getWishlist=async (req, res) => {
    const { userId, sessionId } = req.query;
    const filter = userId ? { userId } : { sessionId }
    try {
      const wishlists = await wishlistModel.findOne(filter).populate({
        path: 'items.productId',
        model: 'Product' 
      });;
      res.json({ message: 'Wishlists retrieved successfully', wishlists });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const addWishlist = async (req, res) => {
    const { productId, userId, sessionId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'ProductId is required' });
    }
    if (!userId && !sessionId) {
      return res.status(400).json({ message: 'UserId or SessionId is required' });
    }
  
    try {
      const filter = userId ? { userId } : { sessionId };
  
      let wishlist = await wishlistModel.findOne(filter);
  
      if (!wishlist) {
        const newWishlistData = userId ? { userId, items: [] } : { sessionId, items: [] };
        wishlist = new wishlistModel(newWishlistData);
      }
  
      const isProductInWishlist = wishlist.items.some(item => item.productId.toString() === productId);
  
      if (!isProductInWishlist) {
        wishlist.items.push({ productId });
  
        const savedWishlist = await wishlist.save();
  
        const populatedWishlist = await wishlistModel.findById(savedWishlist._id).populate({
          path: 'items.productId',
          model: 'Product'
        });
  
        return res.json({ message: 'Item added to wishlist successfully', wishlists: populatedWishlist, added: true });
      } else {
        return res.json({ message: 'Item already in wishlist', added: false });
      }
  
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  

  // const  addWishlist= async (req, res) => {
  //   const { productId, userId, sessionId } = req.body;

  //   try {
  //     const filter = userId ? { userId } : { sessionId };
      
  //     let wishlist = await wishlistModel.findOne(filter);
  //     if (!wishlist) {
  //       const newWishlistData = userId ? { userId, items: [] } : { sessionId, items: [] };
  //       wishlist = new wishlistModel(newWishlistData);
  //     }
  //     const isProductInWishlist = wishlist.items.some(item => item.productId.toString() === productId);
  //     if (!isProductInWishlist) {
  //       wishlist.items.push({ productId });
  //       const savedWishlist = await wishlist.save();
  //       const populatedWishlist = await wishlistModel.findById(savedWishlist._id).populate({
  //         path: 'items.productId',
  //         model: 'Product' 
  //       });
  //     }
  //     else {
  //       res.json({ message: 'Item already in wishlist', added: false });
  //     }
  //     res.json({ message: 'Item added to wishlist successfully', wishlists: populatedWishlist ,added:true });
  
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  
  // };
  

  



const removeWishlist  = async (req, res) => {
  const {productId,userId, sessionId} = req.body;
  console.log("removewhish:",req.body)
  try {
    let filter = userId ? { userId } : { sessionId };
    let wishlist = await wishlistModel.findOne(filter);
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);

    const savedWishlist = await wishlist.save();
    const populatedWishlist = await wishlistModel.findById(savedWishlist._id).populate('items.productId');
    res.json({ message: 'Item removed from wishlist successfully', wishlists: populatedWishlist });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



 const clearWishlist = async (req, res) => {
  const { userId, sessionId } = req.body;
  try {
    let filter = userId ? { userId } : { sessionId };
    let wishlist = await wishlistModel.findOne(filter).populate('items.productId');
    if (wishlist) {
      wishlist.items = [];
      const savedWishlist = await wishlist.save();
      res.json({ message: 'Wishlist cleared successfully', wishlist: savedWishlist });
    } else {
      res.status(404).json({ message: 'Wishlist not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}




module.exports = {
    getWishlist,
   addWishlist,
   removeWishlist,
   clearWishlist
  }
  