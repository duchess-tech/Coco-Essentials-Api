const express = require("express");
const { getWishlist, addWishlist, removeWishlist, clearWishlist } = require("../controllers/wishlist");
const router = express.Router();

router.get("/wishlistsItems",getWishlist);
router.post("/addwishlist",addWishlist)
router.post('/removewishlist', removeWishlist)
router.delete('/clear',clearWishlist)
module.exports = router;