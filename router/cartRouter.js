const express = require("express");
const router = express.Router();
const { getCartById, increaceCart, decreaceCart, removeCart, ClearAllCart, addToCart } = require("../controllers/cart");


router.post("/cart/add", addToCart);
router.get("/cart/getCart", getCartById);
router.post('/cart/increase',increaceCart)
router.post('/cart/decrease',decreaceCart)
router.post('/cart/remove',removeCart)
router.post('/cart/clearAll',ClearAllCart)
module.exports =router